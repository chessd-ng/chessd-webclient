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
		return CONTACT_HandleRoomPresence(XML);
	}
	// User presence
	else
	{
		return CONTACT_HandleUserPresence(XML);
	}
}
