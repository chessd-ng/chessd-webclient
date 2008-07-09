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
		return;
	}

	Pattern = new RegExp("^"+MainData.Server+"."+MainData.Host+"$");
	if (Jid.match(Pattern) != null) {
		Type = XML.getAttribute('type');
		if (Type == "unavailable") {
			//TODO || Put text in lang/pt_BR
			WINDOW_Alert("Servidor offline","O servidor foi desligado");
		}
		return Buffer;
	}
	// Room presence
	else if (Jid.match(MainData.ConferenceComponent) || (Jid.match(MainData.GameComponent)))
	//if (Jid.match(MainData.ConferenceComponent) || (Jid.match(MainData.GameComponent)))
	{
		Buffer += ROOM_HandleRoomPresence(XML);
		
		// Presence from general room
		if(Jid.split("@")[0] == MainData.RoomDefault)
		{
			Buffer += CONTACT_HandleOnlinePresence(XML);
			Buffer += CHALLENGE_HandlePresence(XML);
			Buffer += CHAT_HandlePresence(XML);
		}

		return Buffer;
	}
	// User presence
	else
	{
		return CONTACT_HandleUserPresence(XML);
	}
}
