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
	var Xmlns;


	// Getting query xmlns
	if (Query.length > 0)
	{
		Xmlns = Query[0].getAttribute("xmlns");
	}

	switch (Type)
	{
		case "result":
			switch (ID)
			{
				// Receive user list
				case MainData.Const.IQ_ID_GetUserList:
					Buffer += CONTACT_HandleUserList(XML);
					break;

				// Receive Rating list
				case MainData.Const.IQ_ID_GetRating:
					Buffer += CONTACT_HandleRating(XML);
					break;
			}

		case "set":
			// Challenge offer
			if (Xmlns.match(/.*\/chessd#match#offer/))
			{
				Buffer += GAME_HandleChallenge(XML);
			}

		    
		default: break;
	}

	return Buffer;
}
