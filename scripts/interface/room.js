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


/**
* Create a new room and set it as 'CurrentRoom'
*
* @public
*/
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
* Add user in contact list of 'RoomName'
*
* @public
*/
function INTERFACE_AddContact(Username, Status, RoomName)
{
	var User = UTILS_CreateElement("li", null, Status, Username);
	var Node = document.getElementById(RoomName+"_Contacts");

	if (!Node)
	{
		return false;
	}

	Node.appendChild(User);
	return true;
}



/**
* Bring 'RoomName' to front
*
* @public
*/
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
*/
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

	RoomInside.appendChild(OrderNick);
	RoomInside.appendChild(OrderRating);
	RoomInside.appendChild(RoomUsers);
	RoomInside.appendChild(Search);
	RoomInside.appendChild(MessageList);
	RoomInside.appendChild(Input);

	RoomDiv.appendChild(RoomTitle);
	RoomDiv.appendChild(RoomInside);

	document.getElementById("Rooms").appendChild(RoomDiv);
}
