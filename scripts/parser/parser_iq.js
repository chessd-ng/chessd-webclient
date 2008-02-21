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
*/


/**
* Parse Iq's received from jabber
*
* @return string
*/
function PARSER_ParseIq(XML)
{
	var Type = XML.getAttribute("type");
	var ID = XML.getAttribute("id");
	var Query = XML.getElementsByTagName("query");
	var Buffer = "";
	var Xmlns = "";

	// Getting query xmlns
	if (Query.length > 0)
	{
		Xmlns = Query[0].getAttribute("xmlns");
	}

	switch (Type)
	{
		case "result":
			// Receive user list
			if (Xmlns.match(/jabber:iq:roster/))
			{
				Buffer += CONTACT_HandleUserList(XML);
			}

			// Receive room list
			else if (Xmlns.match(/disco#items/))
			{
				Buffer += ROOM_HandleRoomList(XML);
			}

			// Receive information of user list
			else if (Xmlns.match(/\/chessd#info/))
			{
				Buffer += CONTACT_HandleInfo(XML);
			}

			// Challenge accept confirmation
			else if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += GAME_HandleChallenge(XML);
			}
			// Search user request
			else if (Xmlns.match(/jabber:iq:search/))
			{
				Buffer += CONTACT_HandleSearchUser(XML);
			}
			break;

		case "set":
			// Challenge messages
			if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += GAME_HandleChallenge(XML);
			}

			// Game messages
			else if (Xmlns.match(/\/chessd#game/))
			{
				Buffer += GAME_HandleGame(XML);
			}
			break;

		case "error": 
			// Challenge messages
			if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += GAME_HandleChallenge(XML);
			}
			// Game messages
			else if (Xmlns.match(/\/chessd#game/))
			{
				Buffer += GAME_HandleGameError(XML);
			}
			break;
		    
		default: break;
	}

	return Buffer;
}
