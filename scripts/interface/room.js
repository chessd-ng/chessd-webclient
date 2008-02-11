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
function INTERFACE_AddUserInRoom(RoomName, Username, Status)
{
	var User, Node = document.getElementById(RoomName+"UserList");

	if (!Node)
	{
		return false;
	}

	User = INTERFACE_CreateContact(Username, Status, null, RoomName);
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
function INTERFACE_UpdateUserInRoom(RoomName, Username, NewStatus)
{
	var Node = document.getElementById(RoomName+"_"+Username);

	if (!Node)
	{
		return false;
	}

	Node.className = NewStatus;
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
 * FUNCTIONS - ROOMS
 *************************************/
/*
/**
* Create a new room and set it as 'CurrentRoom'
*
* @public
*
function INTERFACE_AddRoom(RoomName)
{
	// Push back current room
	if (MainData.CurrentRoom != "")
	{
		document.getElementById("RoomInside_"+MainData.CurrentRoom).style.display = "none";
		document.getElementById("Room_"+MainData.CurrentRoom).className = "RoomInative";
	}

	INTERFACE_CreateRoom(RoomName);
	MainData.CurrentRoom = RoomName;
}

/**
* Bring 'RoomName' to front
*
* @public
*
function INTERFACE_FocusRoom(RoomName)
{
	var Node;
	
	// If its already current room
	if (MainData.CurrentRoom == RoomName || MainData.CurrentRoom == "")
	{
		return false;
	}

	// Hiding current room
	document.getElementById("RoomInside_"+MainData.CurrentRoom).style.display = "none";
	document.getElementById("Room_"+MainData.CurrentRoom).className = "RoomInative";

	// Bringing room to front
	Node = document.getElementById("Room_"+RoomName);
	Node.parentNode.removeChild(Node);
	Node.className = "Room";
	document.getElementById("Rooms").appendChild(Node);
	document.getElementById("RoomInside_"+RoomName).style.display = "block";

	// Updating current room
	MainData.CurrentRoom = RoomName;
	return true;	
}

/**
* Create a new room
*
* @private
*
function INTERFACE_CreateRoom(RoomName)
{
	var RoomDiv, RoomTitle, RoomInside, RoomUsers, UsersLabel, UsersList, MessageList;
	var OrderNick, OrderRating, Search, Input;

	RoomDiv = UTILS_CreateElement("div", "Room_"+RoomName, "Room");
	RoomTitle = UTILS_CreateElement("h3", null, "title", RoomName);
	RoomTitle.onclick = function() { INTERFACE_FocusRoom(RoomName) };

	// Order
	RoomInside = UTILS_CreateElement("div", "RoomInside_"+RoomName, "RoomInside");
	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("room_order_nick"));
	OrderRating = UTILS_CreateElement("span", "order_rating", null, UTILS_GetText("room_order_rating"));

	// Contacts
	RoomUsers = UTILS_CreateElement("div", "RoomUsers");
	UsersLabel = UTILS_CreateElement("label", null, null, UTILS_GetText("room_contacts"));
	UsersList = UTILS_CreateElement("ul", RoomName+"_Contacts");

	RoomUsers.appendChild(UsersLabel);
	RoomUsers.appendChild(UsersList);
	
	// Online Users
	UsersLabel = UTILS_CreateElement("label", null, null, UTILS_GetText("room_all"));
	UsersList = UTILS_CreateElement("ul", RoomName+"_All");

	RoomUsers.appendChild(UsersLabel);
	RoomUsers.appendChild(UsersList);

	// Search user
	Search = UTILS_CreateElement("a", null, null, UTILS_GetText("menu_search_user"));
	
	// Message
	MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
	
	// Input
	Input = UTILS_CreateElement("input");
	Input.type = "text";
	Input.onkeypress = function(event) {
		if ((event.keyCode == 13) && (Input.value != ""))
		{
			// Send message to room
			ROOM_SendMessage(RoomName, Input.value);
			Input.value = "";
		}
	}

	RoomInside.appendChild(OrderNick);
	RoomInside.appendChild(OrderRating);
	RoomInside.appendChild(RoomUsers);
	RoomInside.appendChild(Search);
	RoomInside.appendChild(MessageList);
	RoomInside.appendChild(Input);

	RoomDiv.appendChild(RoomTitle);
	RoomDiv.appendChild(RoomInside);

	document.getElementById("Rooms").appendChild(RoomDiv);
}*/


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
		Item = document.createElement('li');
		Item.innerHTML = MainData.RoomList[i].Name;
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
* Create rooms div
*
* @private
*/
function INTERFACE_CreateRooms()
{
	var RoomsDiv, RoomsList, RoomsListGeneral, RoomsListArrow, Arrow;
	var RoomDiv, RoomName, RoomInside, RoomUsers, RoomTable, RoomTbody;
	var Hr, MessageList;
	var OrderNick, OrderRating, Input;


	// Room list
	RoomsDiv = UTILS_CreateElement("div", "Rooms");
	RoomsList = UTILS_CreateElement("ul", "RoomList");
	RoomsListGeneral = UTILS_CreateElement("li", null, "room_selec", UTILS_GetText("room_default"));
	RoomsListArrow = UTILS_CreateElement("li", null, "room_arrow");
	RoomsListArrow.onclick = function () { INTERFACE_ChangeRoomListVisibility(); };
	Arrow = UTILS_CreateElement("img");
	Arrow.src = "images/room_arrow.png";

	// General room
	RoomName = UTILS_GetText("room_default");
	RoomDiv = UTILS_CreateElement("div", "Room_"+RoomName, "Room");
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
		if ((event.keyCode == 13) && (Input.value != ""))
		{
			// Send message to room
			ROOM_SendMessage(RoomName, Input.value);
			Input.value = "";
		}
	}


	RoomsListArrow.appendChild(Arrow);
	RoomsList.appendChild(RoomsListGeneral);
	RoomsList.appendChild(RoomsListArrow);

	RoomTable.appendChild(RoomTbody);
	RoomUsers.appendChild(RoomTable);

	RoomInside.appendChild(OrderNick);
	RoomInside.appendChild(OrderRating);
	RoomInside.appendChild(RoomUsers);
	RoomInside.appendChild(Hr);
	RoomInside.appendChild(MessageList);
	RoomInside.appendChild(Input);

	RoomDiv.appendChild(RoomInside);

	RoomsDiv.appendChild(RoomsList);
	RoomsDiv.appendChild(RoomDiv);

	return RoomsDiv;
}
