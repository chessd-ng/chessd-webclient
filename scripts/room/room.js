	/**
* CHESSD - WebClient
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* C3SL - Center for Scientific Computing and Free Software
*/


/**
* Room controller
*/


/*********************************
 * FUNCTIONS - PARSERS
 *********************************/
/**
* Handle all presence from a room;
*
* @param 	XML The xml come from server with tag presence
* @return 	void
* @author 	Ulysses
*/
function ROOM_HandleRoomPresence(XML)
{
	var From, RoomName, Jid, Type, Item, Role, Affiliation, Show, Status, MsgTo, NewRoom = false;
	var Room;
	var Buffer = "";

	var Component;
	
	var LoadingBox;

	var RoomNotFound;

	var MyUsername = MainData.GetUsername();

	// Get Attributes from XML
	Item = XML.getElementsByTagName("item");
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	RoomName = From.replace(/@.*/, "");
	Jid = From.replace(/.*\//, "");
	MsgTo = From.replace(/\/.*/, "");

	Component = From.split("@")[1].split("/")[0].split(".")[0];


	// Check if the type is an error
	if (Type == "error")
	{
		// Check if error is a inexist room; -> QuickFix to close room
		RoomNotFound = XML.getElementsByTagName("item-not-found")[0];

		if(RoomNotFound != null)
		{
			ROOM_RemoveRoom(RoomName);
		}

		return Buffer;
	}

	if(Item.length > 0)
	{
		Role = Item[0].getAttribute("role");
		Affiliation = Item[0].getAttribute("affiliation");
	}
	else
	{
		Role = "participant";
		Affiliation = "none";
	}

	// Remove loading box if user enter in general room;
	if(RoomName == MainData.GetRoomDefault())
	{
		LoadingBox = document.getElementById("room_loading");
		if(LoadingBox != null)
		{
			LoadingBox.parentNode.removeChild(LoadingBox);
		}
	}


	// Status of user
	if (Show.length > 0)
	{
		// Get status name
		Status = UTILS_GetNodeText(Show[0]);

		// Any different status, status = away
		if ((Status != "busy") && (Status != "away") && (Status != "unavailable") && (Status != "playing"))
		{
			Status = "away";
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		Status = "available";
	}

	// If 'RoomName' doesnt exists, insert it in strucutre
	// and show on the interface
	if (MainData.FindRoom(RoomName) == null)
	{
		ROOM_CreateRoom(RoomName);

		// Show room user list if room is a room game
		if(Component == MainData.GetServer())
		{
			Room = MainData.GetRoom(RoomName);
			Room.Room.showUserList();
		}
	}

	// If its your presence
	if (Jid == MyUsername)
	{
		if (Type == "unavailable")
		{
			ROOM_RemoveRoom(RoomName);
		}
		else
		{
			// Insert you in room user list
			Buffer += ROOM_AddUser(RoomName, Jid, Status, Role, Affiliation);
			// Set your role and affiliation in data struct
			MainData.SetRoomInformation(RoomName, MsgTo, Role, Affiliation);
			INTERFACE_RefreshOccupantsNumber(RoomName);
		}
	}
	// Presence of others users
	else
	{
		if (Type == "unavailable")
		{
			ROOM_RemoveUser(RoomName, Jid);
			INTERFACE_RefreshOccupantsNumber(RoomName);
		}
		else
		{
			Buffer += ROOM_AddUser(RoomName, Jid, Status, Role, Affiliation);
			INTERFACE_RefreshOccupantsNumber(RoomName);
		}
	}
	return Buffer;
}



/**
* Handle group chat messages
*
* @param 	XML The xml come from server with tag message
* @return 	void
* @author 	Ulysses
*/
function ROOM_HandleMessage(XML)
{
	var From, RoomName, Message, Body, X, Stamp = null;


	// Get the Chat Room name
	RoomName = XML.getAttribute('from').replace(/@.*/,"");

	// Get the message sender
	From = XML.getAttribute('from').replace(/.*\//,"");

	// Get stamp (old messages)
	X = XML.getElementsByTagName('x');

	if (X.length > 0)
	{
		Stamp = X[0].getAttribute('stamp');
	}

	Body = XML.getElementsByTagName("body");

	// If there is a body
	if (Body.length > 0)
	{
		// Get the message
		Message = UTILS_GetNodeText(Body[0]);
	}

	// Show message on interface
	ROOM_ShowMessage(RoomName, From, Message, Stamp);
	
	return "";
}

/**
* Handle room list in top menu.
*
* @param 	XML The xml that the server send's
* @return 	void
* @author 	Ulysses
*/
function ROOM_HandleRoomList(XML)
{
	var Items, Rooms, Room, RoomName, ID, i;
	var Buffer = "";
	var Exp = new RegExp("^"+MainData.GetRoomDefault()+"$");
	var Consts = MainData.GetConst();

	Rooms = new Array();

	// Get the ID 
	ID = XML.getAttribute("id");
	
	// XML with all games rooms
	if (ID == Consts.IQ_ID_GetGamesList)
	{
		return Buffer;
	}
	// Chat Room List
	else
	{
		// Get items in XML
		Items = XML.getElementsByTagName("item");
		
		// Find room names
		for (i=0; i < Items.length; i++)
		{
			Room = new Object();

			Room.Id = Items[i].getAttribute("jid").split("@")[0];
			Room.Name = Items[i].getAttribute("name").replace(/ /,"");;

			Rooms[i] = Room;

			// Change name for general room
			if (Rooms[i].Id.match(Exp))
			{
				Rooms[i].Name = UTILS_GetText("room_default") + "(" + Rooms[i].Name.split("(")[1];
			}
		}
		INTERFACE_ShowRoomList(Rooms);
	}

	INTERFACE_RemoveLoadBox();

	return Buffer;
}

function ROOM_HandleInfo(XML)
{
	var RatingNodes, TypeNode;

        var Username, Rating, Category
	var i,j;
	var Room;
	var Status, Rating;
	var User;
	var NewType, Type;

	var RoomList = MainData.GetRoomList();
	var Room;
	var ProfileNode;

	RatingNodes = XML.getElementsByTagName('rating');
	TypeNode = XML.getElementsByTagName('type')[0];
	ProfileNode = XML.getElementsByTagName("profile")[0];

	// Get user name
	Username = ProfileNode.getAttribute('jid').split("@")[0];
	// Get user type nodes
	NewType = TypeNode.getAttribute('type');

	// Getting ratings nodes
	for (i=0 ; i<RatingNodes.length ; i++)
	{
		Category = RatingNodes[i].getAttribute('category');
		Rating = RatingNodes[i].getAttribute('rating');

		// Updating ratings in room lists
		for (j=0; j<RoomList.length; j++)
		{
			Room = RoomList[j];

			// Search user node in room user list
			User = Room.GetUser(Username);
			if (User != null)
			{
				// Update in data struct
				if (User.Rating.FindRating(Category) == null)
				{
					User.Rating.AddRating(Category, Rating);
				}
				else
				{
					User.Rating.SetRatingValue(Category, Rating);
				}

				Status = User.GetStatus();
				Type = User.GetType();

				// Update in interface 
				if (Category == Room.GetRoomCurrentRating())
				{
					Room.Room.userList.updateUser(Username, Status, Rating, Type);
				}
			}
		}

	}


	// Updating type in room lists
	for (j=0; j<RoomList.length; j++)
	{
		Room = RoomList[j];

		// Search user node in room user list
		User = Room.GetUser(Username);
		if (User != null)
		{
			// Update in data struct
			User.SetType(NewType);

			Status = User.GetStatus();
			Rating = User.Rating.GetRatingValue(Room.GetRoomCurrentRating());

			// Update in interface
			if(NewType != "user")
			{
				// Search user node in room user list
				Room.Room.userList.updateUser(Username, Status, Rating, NewType);	
			}
		}
	}

	return "";
}

/**
* Send a message to room;
*
* @param 	RoomName is the room name string
* @param	Message is the message that will be send
* @return 	void
* @author 	Rubens
*/
function ROOM_SendMessage(RoomName, Message)
{
	var To, Room;

	// Search room in sctructure
	Room = MainData.GetRoom(RoomName);

	// If room doesnt exists
	if (Room == null)
	{
		return false;
	}

	// Send message to room
	To = Room.MsgTo;
	CONNECTION_SendJabber(MESSAGE_GroupChat(To, UTILS_ConvertChatString(Message)));
	return true;
}

/******************************
 * FUNCTIONS - TOP MENU
 ******************************/

/**
* Get Room list from server and show in pop down in top menu
*
* @param 	OffsetLeft is the position where room menu will be show
* @return 	void
* @author 	Rubens
*/

function ROOM_ShowRoomList(OffsetLeft)
{
	var XML = MESSAGE_RoomList();

	// Ask room list for jabber
	CONNECTION_SendJabber(XML);

	// Show menu on interface
	INTERFACE_ShowRoomMenu(OffsetLeft);
}

/**
* Get Game Room list from server and show in pop down top menu
*
* @param 	offsetleft is the position where room menu will be show
* @return 	void
* @author 	ulysses
*/
/*
function ROOM_ShowGameRoomList(OffsetLeft)
{
	var XML = MESSAGE_GameRoomList();

	// Ask room list for jabber
	CONNECTION_SendJabber(XML);

	// Show menu on interface
	INTERFACE_ShowGameRoomMenu(OffsetLeft)
}
*/

/**
* Send presence to a room (enter room)
*
* @param 	Room name is the name of room
* @return 	string ""
* @author 	Ulysses and Danilo
*/
function ROOM_EnterRoom(RoomName)
{
	var XML, To;

	var Room;

	var MyUsername = MainData.GetUsername();

	// Send Message to general room - must be change to Focus Room
	Room = MainData.GetRoom(RoomName);

	if (Room != null)
	{
		ROOM_FocusRoom(RoomName);
	}
	else
	{
		To = RoomName+"@conference."+MainData.GetHost()+"/"+MyUsername;

		XML = MESSAGE_Presence(To);

		CONNECTION_SendJabber(XML);
	}

	return "";
}

/**
* Exit a room.
* @param 	ReturnMsg is a flag to return XML or send Jabber(if ReturnMsg is null)
* @return	XMPP with presence unavailable to a room
* @author	Pedro and Rubens
*/
function ROOM_ExitRoom(RoomName)
{
	// This function send a message to leave from room;
	// ROOM_RemoveRoom function remove room from data struct and interface,
	// and ROOM_RemoveRoom function is called when parse presence
	// type = unavailable

	var XML;
	var Room = MainData.GetRoom(RoomName)
	var CurrentGame = MainData.GetCurrentGame();
	
	// If RoomName isn't in sctructure
	if (Room == null)
	{
		return "";
	}

	// if user is playing, show a message and don't close room
	if(CurrentGame != null)
	{
		if(RoomName == CurrentGame.Id)
		{
			if(CurrentGame.Finished == false)
			{
				WINDOW_Alert(UTILS_GetText("game_remove_game_title"), UTILS_GetText("game_remove_room"));
				return "";
			}
		}
	}

	XML = MESSAGE_Unavailable(Room.MsgTo);
	CONNECTION_SendJabber(XML);
	
	return XML;
}

/**
* Send presence to a room game(enter room game)
*/
function ROOM_EnterRoomGame(RoomName)
{
	var XML, To;
	var MyUsername = MainData.GetUsername();

	To = RoomName+"@"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MyUsername;

	XML = MESSAGE_Presence(To);

	CONNECTION_SendJabber(XML);

	return true;
}



function ROOM_ShowMessage(RoomName, From, Message, Stamp)
{
	var Room = MainData.GetRoom(RoomName);
	var ReplacedMessage = UTILS_BannedWords(Message);

	if(Room == null)
	{
		return "";
	}
	
	Room.Room.addMsg(From, ReplacedMessage, Stamp);

	return "";
}

function ROOM_ErrorMessageLength(RoomName)
{
	var Room = MainData.GetRoom(RoomName);
	var Message;
	var Limit = MainData.GetMaxRoomChar();

	if(Room == null)
	{
		return "";
	}
	
	Message = UTILS_GetText("room_error_message_length");
	if (Message != null)
	{
		Message = Message.replace("%s",Limit);
	}
	Room.Room.addMsgError(Message);

	return "";

}

/** 
* Insert user in room list 
*/ 
function ROOM_AddUser(RoomName, Jid, Status, Role, Affiliation) 
{ 
	var Type = "user", Rating; 
	var UserObj = MainData.GetUser(Jid);
	var Buffer = "";
	var Room;

	/*
	if(UserObj == null)
	{
		return null;
	}
	*/

	Room = MainData.GetRoom(RoomName);
	if(Room == null)
	{
		return null;
	}

	if(UserObj != null)
	{
		Rating = UserObj.Rating.GetRatingValue(Room.GetRoomCurrentRating());
	}
	else
	{
		Rating = "";
	}

	// Check if user has already inserted. 
	// If not inserted, add user, else update information
	if(Room.FindUser(Jid) == null)
	{

		// Get user rating and type information
		//Buffer += MESSAGE_Info(Jid); 

		//Add user in data struct
		Room.AddUser(Jid, Status, Type, Role, Affiliation); 
		Room.SortUserListNick(); 
	
		//Add user in interface
		Room.Room.userList.addUser(Jid, Status, Rating, Type); 
	} 
	else
	{
		//Update user information in data struct
		Room.SetUserInformation(Jid, Status, Role, Affiliation) 
		//Update user information in interface
		Room.Room.userList.updateUser(Jid, Status); 
	} 
	return Buffer; 
}

function ROOM_RemoveUser(RoomName, UserName)
{
	var Room = MainData.GetRoom(RoomName);
	
	Room.RemoveUser(UserName)
	
	// Remove user from interface
	Room.Room.userList.removeUser(UserName);

	return "";
}

function ROOM_CreateRoom(RoomName)
{
	var Room;

	// Create a room object
	Room = new RoomObj(RoomName);

	// Add a room in data struct
	MainData.AddRoom(RoomName, null, null, null, Room);

	// Show new room in interface
	INTERFACE_CreateRoomInBar(RoomName);
	// Set focus and current room
	ROOM_FocusRoom(RoomName);
}

function ROOM_FocusRoom(RoomName)
{
	var Room = MainData.GetRoom(RoomName);
	var Login = false;
	var CurrentRoom = MainData.GetCurrentRoom();

	if((Room != CurrentRoom)&&(CurrentRoom != null))
	{
		// Hide current room div;
		CurrentRoom.Room.hide();
	}
	// If null, user just logged in interface
	else if (MainData.CurrentRoom == null)
	{
		Login = true;
	}

	// Show new room and set it to current
	INTERFACE_FocusRoom(RoomName);
	Room.Room.show();
	INTERFACE_RefreshOccupantsNumber(RoomName);

	MainData.SetCurrentRoom(Room);
	// Don't focus input room if user just logged in interface
	if (!Login)
	{
		Room.Room.focus();
	}
}

function ROOM_RemoveRoom(RoomName)
{
	var Room = MainData.GetRoom(RoomName);
	var NextRoom, NextRoomPos;
	var RoomList = MainData.GetRoomList();

	if(Room == null)
	{
		return "";
	}
	
	//Remove room from interface
	INTERFACE_RemoveRoomFromList(RoomName);
	ROOM_FocusRoom(RoomName);
	INTERFACE_CloseRoom(RoomName);
	Room.Room.hide();

	//Remove from data struct
	MainData.RemoveRoom(RoomName);


	if(RoomList.length > 1)
	{
		//Get next room from data struct
		//RoomList[0] == General Room
		NextRoomPos = RoomList.length - 1;
		NextRoom = RoomList[NextRoomPos];
	
		//Show next room in interface
		INTERFACE_CreateRoomInBar(NextRoom.Name);
		INTERFACE_RefreshOccupantsNumber(NextRoom.Name);
		ROOM_FocusRoom(NextRoom.Name)
	}
	else
	{
		//Set focus to general room
		ROOM_FocusRoom(MainData.GetRoomDefault());
	}

	return RoomName;
}

//Sort all user in all rooms by nick name
// TODO -> Change this function to get room parameter
function ROOM_SortUsersByNick()
{
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var User;
	var RoomList = MainData.GetRoomList();

	// Get all rooms
	for(j=0; j<RoomList.length; j++)
	{
		Room = RoomList[j];
		if(Room == null)
		{
			return false;
		}
		
		// Test the current order mode (order == sort)
		// If ordered into ascending order, change to descending order
		// other modes, change to ascending order
		Room.SetOrderBy((Room.GetOrderBy() + 1) % 2);

		RoomName = Room.Name;

		// Sort user list by nick name in data struct
		Room.SortUserListNick();

		// Show new user list sorted
		for(i=0; i<Room.UserList.length; i++)
		{
			User = Room.UserList[i];

			UserName = User.Username;
			Status = User.Status;
			Type = User.Type;
			Rating = User.Rating.GetRatingValue(Room.GetRoomCurrentRating());
/*
			// Get rating
			switch(Room.GetRoomCurrentRating())
			{
				case "blitz":
					Rating = Room.UserList[i].Rating.Blitz;
					break;
				case "lightning":
					Rating = Room.UserList[i].Rating.Lightning;
					break;
				case "standard":
					Rating = Room.UserList[i].Rating.Standard;
					break;
				case "untimed":
					Rating = Room.UserList[i].Rating.Untimed;
					break;
			}
*/
			Room.Room.userList.removeUser(UserName);
			Room.Room.userList.addUser(UserName, Status, Rating, Type);
		}
		// TODO - Fix user menu position in FF3
		// Proposital hide
		if (MainData.GetBrowser() == 2)
		{
			Room.Room.hideUserList();
		}
	}

	return true;
}

//Sort all user in all rooms by rating name
function ROOM_SortUsersByRating(Category)
{
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var User;

	var RoomList = MainData.GetRoomList();


	// Get all rooms
	for(i=0; i<RoomList.length; i++)
	{
		Room = RoomList[i];

		if(Room == null)
		{
			return false;
		}
		
		// If ordered into ascending order, change to descending order
		Room.SetOrderBy((Room.GetOrderBy() + 1) % 2);
		
		Room.SetRoomCurrentRating(Category);

		RoomName = Room.Name;
		// Sort user list by nick name in data struct
		Room.SortUserListRating();

		// Show new user list sorted
		for(j=0; j<Room.UserList.length; j++)
		{
			User = Room.UserList[j]
			UserName = User.Username;
			Status = User.Status;
			Type = User.Type;
			Rating = User.Rating.GetRatingValue(Room.GetRoomCurrentRating());
/*
			// Get rating
			switch(Room.GetRoomCurrentRating())
			{
				case "blitz":
					Rating = User.Rating.Blitz;
					break;
				case "lightning":
					Rating = User.Rating.Lightning;
					break;
				case "standard":
					Rating = User.Rating.Standard;
					break;
				case "untimed":
					Rating = User.Rating.Untimed;
					break;
			}
*/

			Room.Room.userList.removeUser(UserName);
			Room.Room.userList.addUser(UserName, Status, Rating, Type);
		}
		// TODO - Fix user menu position in FF3
		// Proposital hide
		if (MainData.GetBrowser() == 2)
		{
			Room.Room.hideUserList();
		}
	}

	return true;
}

function ROOM_ShowHideUserList(RoomName)
{
	var Room = MainData.GetRoom(RoomName);

	if(Room == null)
	{
		return false;
	}

	if(Room.Room.userListVisibility == false)
	{
		Room.Room.showUserList();
	}
	else
	{
		Room.Room.hideUserList();
	}
	return true;
}
