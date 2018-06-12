import {
	RoomObj,
	INTERFACE_RemoveRoomFromList,
	INTERFACE_CloseRoom,
	INTERFACE_ShowRoomList,
	INTERFACE_CreateRoomInBar,
	INTERFACE_RefreshOccupantsNumber,
	INTERFACE_FocusRoom,
} from 'interface/room.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import {
	UTILS_GetText,
	UTILS_BannedWords,
	UTILS_ConvertChatString,
	UTILS_GetNodeText,
} from 'utils/utils.js';
import { INTERFACE_RemoveLoadBox, INTERFACE_ShowRoomMenu } from 'interface/top.js';
import {
	MESSAGE_RoomList,
	MESSAGE_Presence,
	MESSAGE_Unavailable,
	MESSAGE_GroupChat,
} from 'xmpp_messages/message.js';
import { WINDOW_Alert } from 'window/window.js';

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
* @file		room/room.js
* @brief	Room controller
*/


//////////////////////////////////
// FUNCTIONS - PARSERS
///////////////////////////////////

/**
* @brief	Handle all presence from a room
*
* @param 	XML 	XML message from server with tag presence
* @return 	XMPP to send
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
export function ROOM_HandleRoomPresence(XML)
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
* @brief	Handle group chat messages
*
* @param 	XML	XML message from server with tag message
* @return 	Empty string
* @author 	Ulysses Bomfim
*/
export function ROOM_HandleMessage(XML)
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
* @brief	Handle room list in top menu
*
* @param 	XML 	XML message with opened rooms
* @return 	XMPP to send
* @author 	Ulysses Bomfim
*/
export function ROOM_HandleRoomList(XML)
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

/*
* @brief	Handle rooms informations and show in room list
*
* @param	XML	XML message with rooms informations
* @return	Empty string
* @author	Ulysses Bomfim and Rubens Suguimoto
*/
export function ROOM_HandleInfo(XML)
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
* @brief	Send a chat message to room
*
* @param 	RoomName 	Room's name
* @param	Message		Chat message text that will be send
* @return 	True if sucess or false if room not founded
* @author 	Rubens
*/
export function ROOM_SendMessage(RoomName, Message)
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

///////////////////////////////
// FUNCTIONS - TOP MENU
////////////////////////////////

/**
* @brief	Get Room list from server and show in pop down in top menu
*
* @param 	OffsetLeft	Offset left position in pixels
* @return 	none
* @author 	Rubens Suguimoto
*/

export function ROOM_ShowRoomList(OffsetLeft)
{
	var XML = MESSAGE_RoomList();

	// Ask room list for jabber
	CONNECTION_SendJabber(XML);

	// Show menu on interface
	INTERFACE_ShowRoomMenu(OffsetLeft);
}

/**
* @brief	Send presence to a room (enter in some room)
*
* @param 	RoomName	Room's nama
* @return 	Empty string
* @author 	Ulysses Bomfim and Danilo Yorinori
*/
export function ROOM_EnterRoom(RoomName)
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
* @brief	Exit a room.
*
* @param	RoomName	Room's name
* @return	XMPP with presence unavailable to a room
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function ROOM_ExitRoom(RoomName)
{
	// This function send a message to leave a room;
	// ROOM_RemoveRoom function remove room from data struct and interface,
	// and ROOM_RemoveRoom function is called when receive a presence
	// type "unavailable"

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
* @brief	Send presence to a room game(enter room game)
*
* @param	RoomName	Room's name
* @return	True
* @author	Rubens Suguimoto
*/
export function ROOM_EnterRoomGame(RoomName)
{
	//TODO -> MOVE THIS FUNCTION TO CURRENT GAME FILE
	var XML, To;
	var MyUsername = MainData.GetUsername();

	To = RoomName+"@"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MyUsername;

	XML = MESSAGE_Presence(To);

	CONNECTION_SendJabber(XML);

	return true;
}

/*
* @brief	Show message in room
* 
* @param	RoomName	Room's name
* @param	From		User who send message
* @param	Message		Message text
* @param	Stamp		Message time stamp
*/
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

/*
* @brief	Show error length message
*
* This function is used, when you try to send a message with length greate than length defined in configuration file
*
* @param	RoomName	Room's name
* @return	Empty string
* @author	Rubens Suguimoto
*/
export function ROOM_ErrorMessageLength(RoomName)
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
* @brief	Insert user in room list 
*
* @param	RoomName	Room's name
* @param	Jid		User's name
* @param	Status		User's status
* @param	Role		User's room role status
* @param	Affiliation	User's room affilitation status
* @return	Empty string
* @author	Pedro Rocha and Rubens Suguimoto
*/ 
function ROOM_AddUser(RoomName, Jid, Status, Role, Affiliation) 
{
	//TODO -> REMOVE VARIABLE "Buffer"
	var Type = "user", Rating; 
	var UserObj = MainData.GetUser(Jid);
	var Buffer = "";
	var Room;

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

/*
* @brief	Remove user from room's user list
*
* @param	RoomName	Room's name
* @param	UserName	User's name
* @return	Empty string
* @author	Pedro Rocha and Rubens Suguimoto
*/
function ROOM_RemoveUser(RoomName, UserName)
{
	var Room = MainData.GetRoom(RoomName);
	
	Room.RemoveUser(UserName)
	
	// Remove user from interface
	Room.Room.userList.removeUser(UserName);

	return "";
}

/*
* @brief	Create room
*
* @param	RoomName	Room's name
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
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

/*
* @brief	Set focus to some room
*
* @param	RoomName	Room's name
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function ROOM_FocusRoom(RoomName)
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

/*
* @brief	Remove room
*
* @param	RoomName	Room's name
* @return	none
* @autho	Pedro Rocha and Rubens Suguimoto
*/
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

/*
* @brief	Sort all user in all rooms by nick name
*
* @return	True if sucess or false if some room was not founded
* @author	Rubens Suguimoto
*/
export function ROOM_SortUsersByNick()
{
// TODO -> Change this function to get room parameter
	var Room, RoomName;
	var i, j;
	var UserName, Status, Rating, Type;
	var User;
	var RoomList = MainData.GetRoomList();

	// Get all rooms
	for(j=0; j<RoomList.length; j++)
	{
		Room = RoomList[j];
		//TODO -> REMOVE THE ABOVE IF - this case should'n happen
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

/*
* @brief	Sort all user in all rooms by rating
*
* @param	Category	User's rating category
* @return	True if sucess or false if some room was not founded
* @author	Rubens Suguimoto
*/
export function ROOM_SortUsersByRating(Category)
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

/*
* @brief	Hide user list of some room
* 
* @param	RoomName	Room's name
* @return	True if sucess or false if room was not founded
* @author	Rubens Suguimoto
*/
export function ROOM_ShowHideUserList(RoomName)
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
