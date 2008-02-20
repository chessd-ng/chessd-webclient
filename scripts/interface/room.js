
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
* Control interface of rooms
*/



/**********************************
 * FUNCTIONS - USERS IN ROOMS
 *************************************/

/**
* Add user in contact list of 'RoomName'
*
* @public
*/
function INTERFACE_AddUserInRoom(RoomName, Username, Status, Type, Rating)
{
	var User, Node = document.getElementById(RoomName+"UserList");

	if (!Node)
	{
		return false;
	}

	User = INTERFACE_CreateContact(Username, Status, Rating, Type, RoomName);
	Node.appendChild(User);
	return true;
}

/**
* Del user from a Room
*
* @public
*/
function INTERFACE_DelUserInRoom(RoomName, Username)
{
	var Node = document.getElementById(RoomName+"_"+Username);

	if (!Node)
	{
		return false;
	}

	Node = Node.parentNode;
	Node.parentNode.removeChild(Node);
	return true;
}


/**
* Update status of 'Username' in 'RoomName'
*
* @public
*/
function INTERFACE_UpdateUserInRoom(RoomName, Username, NewStatus, NewType)
{
	var Node = document.getElementById(RoomName+"_"+Username);

	if (!Node)
	{
		return false;
	}

	Node.className = NewType+"_"+NewStatus;
	return true;
}


/**********************************
 * FUNCTIONS - MESSAGE IN ROOMS
 *************************************/

/**
* Show message in 'RoomName' message list
*
* @public
*/
function INTERFACE_ShowMessage(RoomName, Username, Msg, Timestamp)
{
	var Item, Node = document.getElementById(RoomName+"_Messages");
	var Message, Time;

	if (!Node)
	{
		return false;
	}
	
	// Get time from a fiven timestamp
	Time = UTILS_GetTime(Timestamp);

	Message = "<strong>"+Time+" "+Username+"</strong>: "+Msg;
	Item = UTILS_CreateElement("li", null, null, Message);
	Node.appendChild(Item);
	return true;
}

/**********************************
 * FUNCTIONS - ROOM LIST MENU
 *************************************/

/**
* Show room list in the room menu, if it exists
*
* @public
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

/**
* Show game room list in the room menu
*
* @param 	Rooms An Array with game rooms
* @return 	bool
* @author 	Ulysses
*/
function INTERFACE_ShowGameRoomList(Rooms)
{
	var Node = document.getElementById("GameRoomMenuList");
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
		Node.appendChild(Room);
	}
	return true;
}

/**
* Hide game room list menu
*
* @public
* @return 	bool
* @author 	Ulysses
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

/**********************************
 * FUNCTIONS - ROOMS
 *************************************/

/**
* Create a new room in interface
*
* @public
*/
function INTERFACE_AddRoom(RoomName)
{
	var NewRoom, Node = document.getElementById("Rooms");

	if (!Node)
	{
		return null;
	}

	// Create a new room
	NewRoom = INTERFACE_CreateRoom(RoomName);

	// Insert it on document
	Node.appendChild(NewRoom);

	// Give focus
	INTERFACE_FocusRoom(RoomName);
}


/**
* Close the room that are displayed
* as a secondary room 
*
* @public
*/
function INTERFACE_CloseRoom()
{
	var RoomName, Room, NextRoom = null, Node, i;
	
	Node = document.getElementById("RoomSecondary");

	if (!Node)
	{
		return null;
	}

	// Getting room name
	RoomName = Node.innerHTML;
	Room = document.getElementById("Room_"+RoomName);

	if (!Room)
	{
		return null;
	}

	// Removing room of screen
	Room.parentNode.removeChild(Room);

	// Search for the next room to replace
	for (i=0; i < MainData.RoomList.length; i++)
	{
		if ((MainData.RoomList[i].Name != RoomName) && (MainData.RoomList[i].Name != UTILS_GetText("room_default")))
		{
			NextRoom = MainData.RoomList[i].Name;
			break;
		}
	}

	// Show next room in place of it
	if (NextRoom)
	{
		INTERFACE_FocusRoom(NextRoom);
	}
	else
	{
		Node = Node.parentNode;
		Node.parentNode.removeChild(Node);
		INTERFACE_FocusRoom(UTILS_GetText("room_default"));
	}
	
	return RoomName;
}

/**
* Give focus to a room
*
* @public
*/
function INTERFACE_FocusRoom(RoomName)
{
	var RoomList = document.getElementById("RoomList");
	var RoomItem, RoomClose, Current, NewRoom, Node;

	if (!RoomList)
		return null;

	// Hide current room from screen
	Current = document.getElementById("Room_"+MainData.CurrentRoom);

	if (Current)
	{
		Current.style.display = "none";
	}

	// Update current room
	MainData.CurrentRoom = RoomName;

	// Focus to default room
	if (RoomName == UTILS_GetText("room_default"))
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
		Node = document.getElementById("RoomSecondary");
		if (!Node)
			return null;

		RoomList.childNodes[1].onclick = function () {
			INTERFACE_FocusRoom(RoomName);
		}
		Node.innerHTML = RoomName;
		RoomList.childNodes[1].className = "room_selec";
		RoomList.childNodes[0].className = "";
	}
	else
	{
		// Create a item and set focus to it
		RoomItem = UTILS_CreateElement("li", null, "room_selec", "<span id='RoomSecondary'>"+RoomName+"</span>");
		RoomItem.onclick = function () {
			INTERFACE_FocusRoom(RoomName);
		}
		RoomClose = UTILS_CreateElement("img", null, "close");
		RoomClose.src = "./images/close.png";
		RoomClose.onclick = ROOM_ExitRoom;
		RoomItem.appendChild(RoomClose);

		RoomList.childNodes[0].className = "";
		RoomList.insertBefore(RoomItem, RoomList.childNodes[1]);
	}

	// Show new room on interface
	NewRoom = document.getElementById("Room_"+RoomName);
	if (NewRoom)
	{
		NewRoom.style.display = "block";
	}
	return true;
}


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

/**
* Create a room
*
* @private
*/
function INTERFACE_CreateRoom(RoomName)
{
	var RoomDiv, RoomName, RoomInside, RoomUsers, RoomTable, RoomTbody;
	var Hr, MessageList;
	var OrderNick, OrderRating, Input;

	// General room
	RoomDiv = UTILS_CreateElement("div", "Room_"+RoomName, "Room");
	RoomDiv.style.display = "none";
	RoomInside = UTILS_CreateElement("div", "RoomInside_"+RoomName, "RoomInside");
	
	// Order
	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("room_order_nick"));
	OrderRating = UTILS_CreateElement("span", "order_rating", null, UTILS_GetText("room_order_rating"));

	// Room user list
	RoomUsers = UTILS_CreateElement("div", "RoomUsers");
	RoomTable = UTILS_CreateElement("table");
	RoomTbody = UTILS_CreateElement("tbody", RoomName+"UserList");
	Hr = UTILS_CreateElement("hr");
	
	// MessageList
	MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
	Input = UTILS_CreateElement("input");
	Input.type = "text";
	Input.onkeypress = function(event) {
		if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
		{
			// Send message to room
			ROOM_SendMessage(RoomName, Input.value);
			Input.value = "";
		}
	}

	RoomTable.appendChild(RoomTbody);
	RoomUsers.appendChild(RoomTable);

	RoomInside.appendChild(OrderNick);
	RoomInside.appendChild(OrderRating);
	RoomInside.appendChild(RoomUsers);
	RoomInside.appendChild(Hr);
	RoomInside.appendChild(MessageList);
	RoomInside.appendChild(Input);

	RoomDiv.appendChild(RoomInside);

	return RoomDiv;
}

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
	RoomsListGeneral = UTILS_CreateElement("li", null, "room_selec", UTILS_Capitalize(UTILS_GetText("room_default")));
	RoomsListArrow = UTILS_CreateElement("li", null, "room_arrow");
	RoomsListArrow.onclick = function () { INTERFACE_ChangeRoomListVisibility(); };
	Arrow = UTILS_CreateElement("img");
	Arrow.src = "images/room_arrow.png";

	// General room
	RoomName = UTILS_GetText("room_default");
	RoomsListGeneral.onclick = function () {
		INTERFACE_FocusRoom(RoomName);
	}

	// Create general room
	RoomDiv = INTERFACE_CreateRoom(RoomName);
	RoomDiv.style.display = "block";
	MainData.CurrentRoom = RoomName;

	// Creating DOM tree
	RoomsListArrow.appendChild(Arrow);
	RoomsList.appendChild(RoomsListGeneral);
	RoomsList.appendChild(RoomsListArrow);

	RoomsDiv.appendChild(RoomsList);
	RoomsDiv.appendChild(RoomDiv);

	return RoomsDiv;
}

/**********************************
 * FUNCTIONS - WINDOWS
 *************************************/


/**
 * Create elements to create room window and return divs and array of buttons
 *
 * @ return	Div, Array 
 * @ see		WINDOW_CreateRoom();
 * @ author	Danilo Kiyoshi Simizu Yorinori
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
	Input = UTILS_CreateElement('input');
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
				WINDOW_Alert("Nome invalido para sala");
				return;
			}
			if (RoomName.length > 50)
			{
				WINDOW_Alert("Tamanho maximo de 50 caracteres");
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
			alert("Nome invalido para sala");
			return;
		}
		else if (RoomName.length > 50)
		{
			alert("Tamanho maximo de 50 caracteres");
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
 * @ return	Div, Array 
 * @ see		WINDOW_CancelRoom();
 * @ author	Danilo Kiyoshi Simizu Yorinori
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
