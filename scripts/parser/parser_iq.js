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
	//XML = iq tag
	var Type = XML.getAttribute("type");
	var ID = XML.getAttribute("id");
	var FirstNode = XML.firstChild;
	var Buffer = "";
	var Xmlns = "";

	if(FirstNode != undefined)
	{
		Xmlns = FirstNode.getAttribute("xmlns");
	}
	else
	{	
		// This case should happen when user receive result from server.
		// Some messages come without iq child node in chess server
		// protocol.
		return "";
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

			// Receive room info -> used to running games
			else if (Xmlns.match(/disco#info/))
			{
				Buffer += ROOM_HandleGameRoomInfoList(XML);
			}


			// Receive information of user list
			else if (Xmlns.match(/\/chessd#info/))
			{
				// contact/info.js
				Buffer += CONTACT_HandleInfo(XML);
				Buffer += ROOM_HandleInfo(XML);
			}

			// Receive profile information of user
			else if (Xmlns.match(/\/chessd#profile/))
			{
				Buffer += PROFILE_HandleInfoProfile(XML);
			}

			// Challenge accept confirmation
			else if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += CHALLENGE_HandleChallenge(XML);
			}
			// Search user request
			else if (Xmlns.match(/jabber:iq:search/))
			{
				Buffer += CONTACT_HandleSearchUser(XML);
			}
			// Search Old Game
			else if (Xmlns.match(/\/chessd#search_game/))
			{
				Buffer += OLDGAME_HandleSearchOldGame(XML);
			}
			else if (Xmlns.match(/\/chessd#fetch_game/))
			{
				Buffer += OLDGAME_FetchOldGame(XML);
			}
			else if (Xmlns.match(/vcard-temp/))
			{
				if (ID == MainData.Const.IQ_ID_GamePhoto)
				{
					Buffer += GAME_HandleVCardPhoto(XML);
				}
				else if (ID == MainData.Const.IQ_ID_OldGamePhoto)				{
					Buffer += OLDGAME_HandleVCardPhoto(XML);
				}
				else
				{
					Buffer += PROFILE_HandleVCardProfile(XML);
				}
			}
			/* // this is used to show a feedback to admin
			else if (Xmlns.match(/\/chessd#admin/))
			{
				Buffer += ADMIN_HandleAdminNotification(XML);
			}
			*/
			else if (Xmlns == "")
			{
				Buffer += PARSER_ParseIqById(XML);
			}
			break;

		case "set":
			// Challenge messages
			if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += CHALLENGE_HandleChallenge(XML);
			}

			// Game messages
			else if (Xmlns.match(/\/chessd#game/))
			{
				Buffer += GAME_HandleGame(XML);
			}

			// Admin messages
			else if (Xmlns.match(/\/muc#admin/))
			{
				Buffer += ADMIN_HandleRoomAdmin(XML);
			}

			// Admin notification
			else if (Xmlns.match(/\/chessd#admin/))
			{
				Buffer += ADMIN_HandleUserNotification(XML);
			}
			break;

		case "error": 
			// Challenge messages
			if (Xmlns.match(/\/chessd#match/))
			{
				Buffer += CHALLENGE_HandleChallenge(XML);
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

/**
* Parse Iq's received from jabber by iq id
*
* @return string
*/
function PARSER_ParseIqById(XML)
{
	var Type = XML.getAttribute("type");
	var ID = XML.getAttribute("id");
	var Buffer = "";

	// Received an empty vcard. Need to create a basic profile
	if (ID == MainData.Const.IQ_ID_GetMyProfile)
	{
		Buffer += PROFILE_CreateProfile();
	}
	return Buffer;
}
