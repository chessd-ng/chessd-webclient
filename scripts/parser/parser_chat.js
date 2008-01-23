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
* Parse chat messages received from jabber
*/


function PARSER_ParseChat(XML)
{
	var Type = XML.getAttribute("type");

	// Chat message
	if (Type == "chat")
	{
		return CHAT_HandleChatMessage(XML);
	}
	// Groupchat message
	else if (Type == "groupchat")
	{
		return CHAT_HandleGroupChatMessage(XML);
	}
	// Other type
	else
	{
		return "";
	}
}
