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
* Control group chat messages 
*/


/**
* Handle group chat messages
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
	INTERFACE_ShowMessage(RoomName, From, Message, Stamp);
	
	return "";
}

/**
* Handle room list
*/
function ROOM_HandleRoomList(XML)
{
	var Items, Rooms, RoomName, i;

	Rooms = new Array();

	// Get items in XML
	Items = XML.getElementsByTagName("item");

	// Find room names
	for (i=0; i < Items.length; i++)
	{
		Rooms[i] = Items[i].getAttribute("name").replace(/ (.*)/, "");
	}
	INTERFACE_ShowRoomList(Rooms);

	return "";
}


/**
* Handle group chat messages
*/
function ROOM_SendMessage(RoomName, Message)
{
	var To, i;

	// Search room in sctructure
	i = MainData.FindRoom(RoomName);

	// If room doesnt exists
	if (i == null)
	{
		return false;
	}

	// Send message to room
	To = MainData.RoomList[i].MsgTo;
	CONNECTION_SendJabber(MESSAGE_GroupChat(To, Message));
	return true;
}

/**
* Get Room list from server and show in pop down menu
*/
function ROOM_ShowRoomList()
{
	var XML = MESSAGE_RoomList();

	// Ask room list for jabber
	CONNECTION_SendJabber(XML);

	// Show menu on interface
	INTERFACE_ShowRoomMenu();
}

/**
* Send presence to a room (enter room)
*/
function ROOM_EnterRoom(RoomName)
{
	var XML, To;

	To = RoomName+"@conference."+MainData.Host+"/"+MainData.Username;

	XML = MESSAGE_Presence(To);

	CONNECTION_SendJabber(XML);

	return true;
}
