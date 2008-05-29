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
* Control rooms interface
*/



/*********************************************
 * FUNCTIONS - ROOM INTERFACE OBJECT
 *********************************************/
/*
* Room Object
*
* @public
* @params       
* @return       void
* @author       Rubens
*/

function RoomObj(Roomname)
{
	var Room = INTERFACE_CreateRoom(Roomname);
	
	//Attributes
	this.roomName = Roomname;
	this.room = Room.RoomDiv;
	this.userList = Room.UserList;
	this.users = new Array();
	this.msgList = Room.MsgList;
	
	//Methods Public
	this.show = INTERFACE_ShowRoom;
	this.hide = INTERFACE_HideRoom;
	this.remove = INTERFACE_RemoveRoom;
	this.addUser = INTERFACE_AddUserInRoom;
	this.addMsg = INTERFACE_AddMsgInRoom;
	this.removeUser = INTERFACE_RemoveUserInRoom;
	this.updateUser = INTERFACE_ChangeUserStatusInRoom;

	//Methods Private
	this.findUser = INTERFACE_FindUserInRoom;
}


/**
* Create a room
* 
* @private
* @params	Room name;
* @return 	RoomDiv, User list and Message list in this room
* @authos	Pedro and Rubens
*/
function INTERFACE_CreateRoom(RoomName)
{
        var RoomDiv, RoomName, RoomInside, RoomUsers, RoomTable, RoomTbody;
        var MessageList;
        var OrderNick, OrderRating, OrderRatingOpt, Input, Emoticon;

        // General room
        RoomDiv = UTILS_CreateElement("div", "Room_"+RoomName, "Room");
        RoomDiv.style.display = "none";
        RoomInside = UTILS_CreateElement("div", "RoomInside_"+RoomName, "RoomInside");

        // Order
        OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("room_order_nick"));
        OrderNick.onclick = function() { ROOM_SortUsersByNick(); };
        OrderRating = UTILS_CreateElement("select", "order_rating_"+RoomName, "order_rating", UTILS_GetText("room_order_rating"));
        OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Lightning)");
        OrderRatingOpt.value = "lightning";
        OrderRating.appendChild(OrderRatingOpt);
        OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Blitz)");
        OrderRatingOpt.selected = true;
        OrderRatingOpt.value = "blitz";
        OrderRating.appendChild(OrderRatingOpt);
        OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Standard)");
        OrderRatingOpt.value = "standard";
        OrderRating.appendChild(OrderRatingOpt);
        OrderRating.onchange = function () {
		ROOM_SortUsersByRating(this.value);
        }

        // Room user list
        RoomUsers = UTILS_CreateElement("div", "RoomUsers");
        RoomTable = UTILS_CreateElement("table");
        RoomTbody = UTILS_CreateElement("tbody", RoomName+"UserList");

        // MessageList
        MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
        Input = UTILS_CreateElement("input", "Input_"+RoomName);
        Input.type = "text";
        Input.onkeypress = function(event) {
                if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
                {
                        // Send message to room
                        ROOM_SendMessage(RoomName, Input.value);
                        Input.value = "";
                }
        }

        Emoticon = UTILS_CreateElement("img", null, "emoticon");
        Emoticon.src = "./images/emoticons/default.png";
        Emoticon.onclick = function () {
                INTERFACE_ShowEmoticonList(RoomName);
        }

        // Room user list
        RoomUsers = UTILS_CreateElement("div", "RoomUsers");
        RoomTable = UTILS_CreateElement("table");
        RoomTbody = UTILS_CreateElement("tbody", RoomName+"UserList");

        // MessageList
        MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
        Input = UTILS_CreateElement("input", "Input_"+RoomName);
        Input.type = "text";
        Input.onkeypress = function(event) {
                if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
                {
                        // Send message to room
                        ROOM_SendMessage(RoomName, Input.value);
                        Input.value = "";
                }
        }

        Emoticon = UTILS_CreateElement("img", null, "emoticon");
        Emoticon.src = "./images/emoticons/default.png";
        Emoticon.onclick = function () {
                INTERFACE_ShowEmoticonList(RoomName);
        }

        RoomTable.appendChild(RoomTbody);
        RoomUsers.appendChild(RoomTable);

        RoomInside.appendChild(OrderNick);
        RoomInside.appendChild(OrderRating);
        RoomInside.appendChild(RoomUsers);
        RoomInside.appendChild(MessageList);
        RoomInside.appendChild(Input);
        RoomInside.appendChild(Emoticon);

        RoomDiv.appendChild(RoomInside);

        return {RoomDiv:RoomDiv, UserList:RoomTbody, MsgList:MessageList};
}

function INTERFACE_ShowRoom()
{
	var RoomMain;
	// The code above is used in specific case of this interface.
	// All rooms should be in "Rooms" div.
	if(this.room.parentNode == null)
	{
		RoomMain = document.getElementById("Rooms");
		RoomMain.appendChild(this.room);
	}
	
	this.room.style.display = "table";
}

function INTERFACE_HideRoom()
{
	this.room.style.display = "none";
}

function INTERFACE_RemoveRoom()
{
	var RoomParent = this.room.parentNode;
	RoomParent.removeChild(this.room);
}



function INTERFACE_AddUserInRoom(Username, Status, Rating, Type)
{
	var User;
	var UserObj = new Object();

	// Create Tr
	User = INTERFACE_CreateContact(Username, Status, Rating, Type, this.roomName);

	// Add user in room users
	UserObj.Id = Username;
	UserObj.User = User;
	this.users.push(UserObj);

	//this.userList.insertBefore(User,null);
	this.userList.appendChild(User);
}

function INTERFACE_AddMsgInRoom(Username, Msg, Timestamp)
{
	var Item;
	var Message, Time, EmoticonNum;

	// Show emoticons
	while (Msg.match(/\[img{\d*}\]/) != null)
	{
		EmoticonNum = Msg.match(/\[img{\d*}\]/)[0];
		EmoticonNum = EmoticonNum.match(/\d+/);
		
		Msg = Msg.replace(/\[img{\d*}\]/, "<img src='./images/emoticons/"+EmoticonNum+".png' />");
	}

	// Get time from a given timestamp
	Time = UTILS_GetTime(Timestamp);

	Message = "<strong>"+Time+" "+Username+"</strong>: "+Msg;
	Item = UTILS_CreateElement("li", null, null, Message);

	this.msgList.appendChild(Item);
	this.msgList.scrollTop += Item.clientHeight + 1000;

	return true;
}



function INTERFACE_RemoveUserInRoom(Username)
{
	var UserItem = this.findUser(Username);
	var i=0;

	
	if(UserItem == null)
	{
		return false;
	}

	this.userList.removeChild(UserItem);


	// Find user in "users" list and remove from it
	while((Username != this.users[i].Id) && (i<this.users.length))
	{
		i++;
	}

	if(i< this.users.length)
	{
		this.users.splice(i,1);
	}

	return true;
}

function INTERFACE_ChangeUserStatusInRoom(Username, NewStatus, NewType)
{
	var Node = this.findUser(Username);
	var User;

	if(Node == null)
	{
		return false;
	}
	
	// Get user and status icon element
	User = Node.getElementsByTagName("td")[0];

	// If 'NewType' is not passed, set normal user status
	if (NewType == null)
	{
		User.className = User.className.replace(/_.*/, "_"+NewStatus);
	}
	else
	{
		User.className = NewType+"_"+NewStatus;
	}
	return true;
}


function INTERFACE_FindUserInRoom(Username)
{
	var i=0;

	while((i<this.users.length) && (Username != this.users[i].Id))
	{
		i++;
	}
	
	if(i>= this.users.length)
	{
		return null;	
	}
	else
	{
		return this.users[i].User;
	}
}

/**
* Refresh room's occupants number
*
* @param	RoomName
* 		Room's name
* @return void
* @author Danilo 
*/
function INTERFACE_RefreshOccupantsNumber(RoomName)
{
	// Get number of occupants in room data struct
	var N_Occupants = MainData.RoomList[MainData.FindRoom(RoomName)].UserList.length;
	// Get element in interface that will be refreshed
	var Node = document.getElementById(RoomName+"_occupants");

	// If Room is showed at interface, refresh the number of occupants
	if(Node)
	{
		Node.innerHTML= " ("+N_Occupants+")";
	}
}

/*********************************************
 * FUNCTIONS - ROOM TOP MENU LIST 
 *********************************************/
/**
* Show room list in the room menu, if it exists
*
* @public
* @params       Array of room names
* @return       void
* @author       Pedro
*/
function INTERFACE_ShowRoomList(Rooms)
{
        var Node = document.getElementById("RoomMenuList");
        var Room, i;

        // If menu is not on screen
        if (!Node)
        {
                return null;
        }
        // If rooms was already been inserted
        else if (Node.childNodes.length > 0)
        {
                return null;
        }

        // Create elements and insert rooms
        for (i=0; i < Rooms.length; i++)
        {
                Room = UTILS_CreateElement("li", null, null, Rooms[i]);
                Room.onclick = function () {
                        ROOM_EnterRoom(this.innerHTML);
                }
                Node.appendChild(Room);
        }
        return true;
}
/**
* Hide room list menu
*
* @public
* @params       void
* @return       void
* @author       Pedro
*/
function INTERFACE_HideRoomList()
{
        var Node = document.getElementById("RoomMenuDiv");

        if (!Node)
        {
                return false;
        }
        Node.parentNode.removeChild(Node);
}

/*********************************************
 * FUNCTIONS - ROOM GAME TOP MENU LIST 
 *********************************************/
/**
* Hide game room list menu
*
* @public
* @return       bool
* @author       Ulysses
*/
function INTERFACE_HideGameRoomList()
{
	var Node = document.getElementById("GameRoomMenuDiv");

	if (!Node)
	{
		return false;
	}
	Node.parentNode.removeChild(Node);

	return true;
}

/**
* Show game room list in the room menu
*
* @param 	Rooms An Array with game rooms
* @return 	bool
* @author 	Ulysses
*/
function INTERFACE_ShowGameRoomList(GameId, GameName, P1, P2, GameType)
{
	// Get game menu
	var Node = document.getElementById("GameRoomMenuDiv");
	var List;
	var Room, i;

	if (Node == null)
	{
		return false;
	}
	else
	{
		// Get default list
		List = document.getElementById("GameRoomMenuList"+UTILS_Capitalize(GameType));
		// If list doesn't exists, create one
		if(List == null)
		{
			List = UTILS_CreateElement("ul","GameRoomMenuList"+UTILS_Capitalize(GameType),null, UTILS_Capitalize(GameType));
			Node.appendChild(List);
		}
	}

	// Create elements and insert rooms
	Room = UTILS_CreateElement("li", null, null, GameName);

	Room.onclick = function(){
		var Buffer="";
		var To;

		//if user is not playing or observe a game
		if(MainData.CurrentGame == null)
		{
			if((P1.Name!= MainData.Username) &&(P2.Name != MainData.Username))
			{
				Buffer += GAME_StartObserverGame(GameId, P1, P2);				
			}
			else
			{
				//Open game board and enter game in room
				Buffer += GAME_StartGame(GameId, P1, P2);
				To = GameId+"@"+MainData.GameComponent+"."+MainData.Host+"/"+MainData.Username;
				Buffer += MESSAGE_Presence(To)
			}
		}
		else
		{
			WINDOW_Alert(UTILS_GetText("game_observer_alert_title"), UTILS_GetText("game_observer_alert"));
		}
		CONNECTION_SendJabber(Buffer);
	}

	// Insert item in current game list
	List.appendChild(Room);
	//List.style.visibility = "visible";
	return true;
}

/*********************************************
 * FUNCTIONS - ROOM LIST (Right of rooms div)
 *********************************************/
/** 
* Show or hide list of user's rooms 
* 
* @public 
*/ 
function INTERFACE_ChangeRoomListVisibility() 
{ 
	var Div, List, Node, Item, i; 
	var Menu = document.getElementById('RoomListMenu'); 
	var Node = document.getElementById('RoomList'); 

	// If already exists room list menu, hide it 
	if (Menu != null) 
	{ 
		Menu.parentNode.removeChild(Menu); 
		return true; 
	} 
	//else show (create) menu 
	Div = UTILS_CreateElement("div", "RoomListMenu"); 
	List = UTILS_CreateElement('ul'); 

	Div.style.position = "absolute"; 
	 
	// Population list with user's rooms 
	for (i=0; i < MainData.RoomList.length; i++) 
	{ 
		Item = UTILS_CreateElement('li'); 
		if (MainData.RoomList[i].Name == MainData.RoomDefault)
		{
			Item.innerHTML = UTILS_GetText("room_default"); 
		}
		else
		{
			Item.innerHTML = MainData.RoomList[i].Name; 
		}
		Item.onclick = function () { 
			if (this.innerHTML == UTILS_GetText("room_default"))
			{
				ROOM_FocusRoom(MainData.RoomDefault); 
			}
			else
			{
				ROOM_FocusRoom(this.innerHTML); 
			}
			INTERFACE_ChangeRoomListVisibility(); 
		} 
		List.appendChild(Item); 
	} 

	Div.appendChild(List); 

	try 
	{ 
		document.getElementById('Rooms').insertBefore(Div, Node); 
	} 
	catch(e) 
	{ 
		return false; 
	} 
	return true; 
}




/**
* Remove a room from room list if RoomListMenu is opened
*
* @param        Room name that will be removed from list
* @return       void
* @author       Rubens
*/
function INTERFACE_RemoveRoomFromList(Room)
{
	var Menu = document.getElementById("RoomListMenu");
	var ListItens;
	var i=0;

	// if list is not opened, then do nothing;
	if(Menu == null)
	{
		return;
	}

	ListItens = Menu.getElementsByTagName("li");

	while( (ListItens[i].innerHTML != Room) && (i<ListItens.length) )
	{
		i++;
	}

	// If room founded in list, then remove it from;
	if(i != ListItens.length)
	{
		ListItens[i].parentNode.removeChild(ListItens[i]);
	}
}





/**********************************
 * FUNCTIONS - EMOTICONS LIST
 ***********************************/
/**
* Show emoticon list
*
* @public
*/
function INTERFACE_ShowEmoticonList(RName)
{
	var Div, List, Item, Img, i;
	var Func, Hide = 0;
	var RoomName = RName;

	Func = function () {
		Hide += 1;

		if (Hide == 2)
		{
			UTILS_RemoveListener(document, "click", Func, false);

/*
* Show or hide list of user's rooms 
* 
* @public 
*/ 
function INTERFACE_ChangeRoomListVisibility() 
{ 
        var Div, List, Node, Item, i; 
        var Menu = document.getElementById('RoomListMenu'); 
        var Node = document.getElementById('RoomList'); 
 
        // If already exists room list menu, hide it 
        if (Menu) 
        { 
                Menu.parentNode.removeChild(Menu); 
                return; 
        } 
 
        // Creating menu 
        Div = UTILS_CreateElement("div", "RoomListMenu"); 
        List = UTILS_CreateElement('ul'); 
 
        Div.style.position = "absolute"; 
         
        // Population list with user's rooms 
        for (i=0; i < MainData.RoomList.length; i++) 
        { 
                Item = UTILS_CreateElement('li'); 
                Item.innerHTML = MainData.RoomList[i].Name; 
                Item.onclick = function () { 
                        INTERFACE_FocusRoom(this.innerHTML); 
                        INTERFACE_ChangeRoomListVisibility(); 
                } 
                List.appendChild(Item); 
        } 
 
        Div.appendChild(List); 
 
        try 
        { 
                document.getElementById('Rooms').insertBefore(Div, Node); 
        } 
        catch(e) 
        { 
                return false; 
        } 
        return true; 
}

			INTERFACE_HideEmoticonList();
		}
	};

	Div = UTILS_CreateElement("div", "EmoticonDiv");
	List = UTILS_CreateElement("ul", "EmoticonList");

	for (i=0; i<MainData.EmoticonNum; i++)
	{
		Item = UTILS_CreateElement("li");
		Img = UTILS_CreateElement("img", null, i);
		Img.src = "./images/emoticons/"+i+".png";
		Img.onclick = function () {
			var Node = document.getElementById("Input_"+RoomName);
			var Num = i;

			if (!Node)
				return null;
			Node.value += "[img{"+this.className+"}] ";
			Node.focus();
		}

		Item.appendChild(Img);
		List.appendChild(Item);
	}
	Div.appendChild(List);

	document.getElementById("RoomInside_"+RoomName).appendChild(Div);

	UTILS_AddListener(document, "click", Func, false);
}

/**
* Hide emoticon list
*
* @public
*/
function INTERFACE_HideEmoticonList()
{
	var Node = document.getElementById("EmoticonDiv");

	if (!Node)
	{
		return null;
	}

	Node.parentNode.removeChild(Node);
	return true;
}



/**********************************
 * FUNCTIONS - CHANGE ROOM BAR
 ***********************************/

/**
* Give focus to a room in change room bar
*
* @public
*/
function INTERFACE_FocusRoom(RoomName)
{
	var RoomList = document.getElementById("RoomList");
	var RoomItem, RoomClose, Current, NewRoom, Node;

	if (RoomList == null)
	{
		return null;
	}
	
	// Focus to default room
	if (RoomName == MainData.RoomDefault)
	{
		RoomList.childNodes[0].className = "room_selec";

		// If exists other rooms, remove focus
		if (RoomList.childNodes.length > 2)
		{
			RoomList.childNodes[1].className = "";
		}
	}
	// Already have 2 opened rooms
	else if (RoomList.childNodes.length > 2)
	{
		Node = document.getElementById("RoomSecName");
		if (!Node)
		{
			return null;
		}

		Node.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}
	
		Node.innerHTML = RoomName;
		RoomList.childNodes[1].className = "room_selec";
		RoomList.childNodes[0].className = "";
	}

	return true;
}

/* Rubens
 */
function INTERFACE_CreateRoomInBar(RoomName)
{
	var RoomList = document.getElementById("RoomList");
	var RoomItem, RoomClose;
	var RoomItemTitle, RoomOccupants;

	//Create Room default
	if(RoomList.childNodes.length == 1)
	{
		RoomItemTitle = UTILS_CreateElement("span",null,null,UTILS_GetText("room_default"));
		RoomItem = UTILS_CreateElement("li","RoomPrimary");
		RoomItem.appendChild(RoomItemTitle);
		RoomOccupants = UTILS_CreateElement("span",MainData.RoomDefault+"_occupants",null," (0)");
		RoomItem.appendChild(RoomOccupants);

		RoomItem.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}

		RoomList.insertBefore(RoomItem, RoomList.childNodes[0]);
	}
	else if(RoomList.childNodes.length == 2)
	{
		// Create a item and set focus to it
		RoomItemTitle = UTILS_CreateElement("span","RoomSecName",null,RoomName);
		RoomItem = UTILS_CreateElement("li", "RoomSecondary");
		RoomItem.appendChild(RoomItemTitle);
		RoomOcupants = UTILS_CreateElement('span',RoomName+"_occupants",null," (0)");
		RoomItem.appendChild(RoomOcupants);

		RoomItem.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}

		RoomClose = UTILS_CreateElement("img", null, "close");
		RoomClose.src = "./images/close.png";
		RoomClose.onclick = function() { ROOM_ExitRoom(RoomName); };
		RoomItem.appendChild(RoomClose);

		RoomList.insertBefore(RoomItem, RoomList.childNodes[1]);
	}
}

/**
* Close the room that are displayed
* as a secondary room 
*
* @public
*/
function INTERFACE_CloseRoom()
{
	var RoomName;
	var NodeParent, Node;

	// Find element
	Node = document.getElementById("RoomSecondary");

	if (Node == null)
	{
		return null;
	}

	// Getting room name
	RoomName = Node.innerHTML;

	// Remove from change room bar
	NodeParent = Node.parentNode;
	NodeParent.removeChild(Node);
	
	return RoomName;
}



/**********************************
 * FUNCTIONS - START INTERFACE
 ***********************************/
/**
* Create rooms div
*
* @private
*/
function INTERFACE_CreateRooms()
{
	var RoomDiv, RoomsDiv, RoomsList, RoomName, RoomsListGeneral, RoomsListArrow, Arrow;


	// Room list
	RoomsDiv = UTILS_CreateElement("div", "Rooms");
	RoomsList = UTILS_CreateElement("ul", "RoomList");
	RoomsListGeneral = UTILS_CreateElement("li", null, "room_selec", UTILS_GetText("room_default"));

	RoomsListArrow = UTILS_CreateElement("li", null, "room_arrow");
	RoomsListArrow.onclick = function () { INTERFACE_ChangeRoomListVisibility(); };
	Arrow = UTILS_CreateElement("img");
	Arrow.src = "images/room_arrow.png";

	// Creating DOM tree
	RoomsListArrow.appendChild(Arrow);
	
	RoomsList.appendChild(RoomsListArrow);
	RoomsDiv.appendChild(RoomsList);
	//RoomsDiv.appendChild(RoomDiv.RoomDiv);

	return RoomsDiv;
}

/**********************************
 * FUNCTIONS - ROOMS WINDOWS
 ***********************************/


/**
 * Create elements to create room window and return divs and array of buttons
 *
 * @ return     Div, Array 
 * @ see                WINDOW_CreateRoom();
 * @ author     Danilo Kiyoshi Simizu Yorinori
 */

function INTERFACE_ShowCreateRoomWindow()
{
	var Div;

	var OptionsDiv;
	var Label, Input, Br;
	var Description, Textarea;

	var ButtonsDiv;
	var Create, Cancel;

	var RoomName;
	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CreateRoomDiv');

	OptionsDiv = UTILS_CreateElement('div', 'OptionsDiv');
	Label = UTILS_CreateElement('p', null, null, UTILS_GetText('room_name'));
	Input = UTILS_CreateElement('input','CreateRoomInputName');
	Br = UTILS_CreateElement('br');

	Input.type = "text";
	Input.size = "22";
	Input.onkeypress = function(event) {

		if (event.keyCode == 13)
		{
			if (Input.value == '' || Input.value == null)
			{
				return;
			}

			RoomName = Input.value.replace(/ /g,"_");
			if (RoomName.match(/^\d{6}_\w+_\w+$/g) != null)
			{
				WINDOW_Alert(UTILS_GetText('room_invalid_name'));
				return;
			}
			else if (RoomName == UTILS_GetText("room_default"))
			{
				WINDOW_Alert(UTILS_GetText('room_invalid_name'));
				return;
			}
			if (RoomName.length > 20)
			{
				WINDOW_Alert(UTILS_GetText('room_invalid_length'));
				Input.value = "";
				return;
			}

			// TODO
			// message to create room

		}
	};

	Description = UTILS_CreateElement('p',null,null,UTILS_GetText('room_description'));
	Textarea = UTILS_CreateElement('textarea','CreateRoomTextarea');
	Textarea.rows = "3";
	Textarea.cols = "20";

	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	Create = UTILS_CreateElement('input',null,'button');
	Create.type = "button";
	Create.value = UTILS_GetText('room_create');

	Create.onclick = function() {
		if (Input.value == '' || Input.value == null)
		{
			return;
		}

		RoomName = Input.value.replace(/ /g,"_");
		if (RoomName.match(/^\d{6}_\w+_\w+$/g) != null)
		{
			WINDOW_Alert(UTILS_GetText('room_invalid_name'));
			return;
		}
		else if (RoomName == UTILS_GetText("room_default"))
		{
			WINDOW_Alert(UTILS_GetText('room_invalid_name'));
			return;
		}
		else if (RoomName.length > 20)
		{
			WINDOW_Alert(UTILS_GetText('room_invalid_length'));
			Create.value = "";
			return;
		}
		// Send a message to create room
		else
		{
			CONNECTION_SendJabber(MESSAGE_Presence(RoomName+"@conference."+MainData.Host+"/"+MainData.Username));
		}
	};

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.type = "button";
	Cancel.value = UTILS_GetText('room_cancel');

	// Mount elements tree
	OptionsDiv.appendChild(Label);
	OptionsDiv.appendChild(Input);
	OptionsDiv.appendChild(Br);
	OptionsDiv.appendChild(Description);
	OptionsDiv.appendChild(Textarea);

	ButtonsDiv.appendChild(Create);
	ButtonsDiv.appendChild(Cancel);

	Div.appendChild(OptionsDiv);
	Div.appendChild(ButtonsDiv);

	Buttons.push(Create);
	Buttons.push(Cancel);

	// Set focus on input
	Input.focus();

	return {Div:Div, Buttons:Buttons};
}

/**
 * Create elements to cancel room creation window and return divs and array of buttons
*
* @return     Div, Array 
* @see        WINDOW_CancelRoom();
* @author     Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCancelRoomWindow()
{
	var Div;

	var TextDiv;
	var Label;

	var ButtonsDiv;
	var Yes, No;

	var RoomName;
	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CancelRoomDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');
	Label = UTILS_CreateElement('p', null, null, UTILS_GetText('room_cancel_text'));

	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	Yes = UTILS_CreateElement('input',null,'button');
	Yes.type = "button";
	Yes.value = UTILS_GetText('room_yes');

	No = UTILS_CreateElement('input',null,'button');
	No.type = "button";
	No.value = UTILS_GetText('room_no');

	// Mount elements tree
	TextDiv.appendChild(Label);

	ButtonsDiv.appendChild(Yes);
	ButtonsDiv.appendChild(No);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	Buttons.push(Yes);
	Buttons.push(No);

	return {Div:Div, Buttons:Buttons};
}

