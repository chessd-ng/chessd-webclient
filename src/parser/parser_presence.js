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
* @file		parser/parser_presence.js
* @brief	Parse presence messages received from jabber
*/

/*
* @brief	Parse presence XMPP message
*
* @param	XML	XMPP message with presence
* @return	XMPP to send
* @author	Ulysses Bomfim
*/
function PARSER_ParsePresence(XML)
{
	var Jid, Show, NewStatus;
	var Buffer = "";
	var Type;
	var Pattern;

	// Get Jid
	try 
	{
		Jid = XML.getAttribute('from');
	}
	catch(e)
	{
		return Buffer;
	}

	Pattern = new RegExp("^"+MainData.GetServer()+"."+MainData.GetHost()+"$");
	if (Jid.match(Pattern) != null) {
		Type = XML.getAttribute('type');
		if (Type == "unavailable") {
			WINDOW_Alert(UTILS_GetText("server_offline_title"),UTILS_GetText("server_offline"));
		}
		return Buffer;
	}
	// Room presence
	else if (Jid.match(MainData.GetConferenceComponent()) || (Jid.match(MainData.GetServer())))
	{
		// This try is used when user has connection replaced.
		// When finish connection steps, jabber send a replaced
		// connection message, but parsers presence has not
		// already loaded, and a error with undefined function
		// is show
		try
		{
			Buffer += ROOM_HandleRoomPresence(XML);

			// Presence from general room
			if(Jid.split("@")[0] == MainData.GetRoomDefault())
			{
				// Add user to UserList
				Buffer += USER_HandleRoomPresence(XML)

				Buffer += ONLINE_HandleOnlinePresence(XML);
				Buffer += CHALLENGE_HandlePresence(XML);
				Buffer += CHAT_HandlePresence(XML);
			}
			else if(Jid.match(MainData.GetServer()))
			{
				// Add user to UserList
				Buffer += USER_HandlePresence(XML)

				Buffer += GAME_HandlePresence(XML);
			}
		}
		catch(e)
		{
			Buffer = "";
		}

		return Buffer;
	}
	// User presence
	else
	{
		return CONTACT_HandleUserPresence(XML);
	}
}
