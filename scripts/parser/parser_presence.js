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
* Parse presence messages received from jabber
*/


function PARSER_ParsePresence(XML)
{
	var Jid, Type, Show, NewStatus;


	// Get Jid
	try 
	{
		Jid = XML.getAttribute('from');
	}
	catch(e)
	{
		return;
	}

	// Room presence
	if (Jid.match(/.*conference.*/))
	{
		return PARSER_ParseRoomPresence(XML);
	}
	// User presence
	else
	{
		return PARSER_ParseUserPresence(XML);
	}
}


/**
* Parse user presence (user status)
*/
function PARSER_ParseUserPresence(XML)
{
	var Jid, Type, Show, NewStatus;


	// Get Jid
	Jid = XML.getAttribute('from').replace(/@.*/,"");

	// User is offline
	Type = XML.getAttribute('type');
	if (Type == "unavailable")
	{
		MainData.SetUserStatus(Jid, UTILS_GetText("status_offline"));
		return "";
	}

	// Searching for the user status
	Show = XML.getElementsByTagName('show');
	if (Show.length > 0)
	{
		// Get status name
		NewStatus = UTILS_GetNodeText(Show[0]);

		// Wich status
		switch (NewStatus)
		{
			// Default: away
			default:

			// Away
			case (UTILS_GetText("status_away")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_away"));
				break;

			// Busy
			case (UTILS_GetText("status_busy")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_busy"));
				break;

			// Playing
			case (UTILS_GetText("status_playing")):
				MainData.SetUserStatus(Jid, UTILS_GetText("status_playing"));
				break;
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		MainData.SetUserStatus(Jid, UTILS_GetText("status_available"));
	}
	
	return "";
}


/**
* Parse user presence (user status)
*/
function PARSER_ParseRoomPresence(XML)
{
	var From, RoomName, Jid, Type, Item, Role, Affiliation, Show, NewStatus;


	// Get Attributes
	Item = XML.getElementsByTagName("item");
	Show = XML.getElementsByTagName("show");
	From = XML.getAttribute('from');
	Type = XML.getAttribute('type');
	RoomName = From.replace(/@.*/,"");
	Jid = From.replace(/.*\//,"");

	Role = Item[0].getAttribute("role");
	Affiliation = Item[0].getAttribute("affiliation");
	

	// Status of user
	if (Show.length > 0)
	{
		// Get status name
		NewStatus = UTILS_GetNodeText(Show[0]);

		// Wich status
		switch (NewStatus)
		{
			// Default: away
			default:

			// Away
			case (UTILS_GetText("status_away")):
				NewStatus = UTILS_GetText("status_away");
				break;

			// Busy
			case (UTILS_GetText("status_busy")):
				NewStatus = UTILS_GetText("status_busy");
				break;

			// Playing
			case (UTILS_GetText("status_playing")):
				NewStatus = UTILS_GetText("status_playing");
				break;
		}
	}
	// If tag 'show' doesnt exists, status online
	else
	{
		NewStatus = UTILS_GetText("status_available");
	}

	// If its your presence
	if (Jid == MainData.Username)
	{
		if (Type == "unavailable")
		{
			MainData.DelRoom(RoomName);
		}
		else
		{
			MainData.AddRoom(RoomName, From, Role, Affiliation);
		}
	}
	// Presence of others users
	else
	{
		if (Type == "unavailable")
		{
			// 666 the number of the beast!
			MainData.DelUserInRoom(RoomName, Jid);
		}
		else
		{
			MainData.AddUserInRoom(RoomName, Jid, NewStatus, Role, Affiliation);
		}
	}
	return "";
}
