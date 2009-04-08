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
* @file		parser/parser_chat.js
* @brief	Parse chat messages received from jabber
*/

/*
* @brief	Parse a chat XMPP message
*
* @param	XML	XMPP with chat message
* @return	XMPP message to send
* @author	Ulysses Bomfim
*/
function PARSER_ParseChat(XML)
{
	var Type = XML.getAttribute("type");

	// Chat message
	if (Type == "chat")
	{
		return CHAT_HandleMessage(XML);
	}
	// Groupchat message
	else if (Type == "groupchat")
	{
		return ROOM_HandleMessage(XML);
	}
	// Other type
	else if (Type == "normal")
	{
		return CHAT_HandleAnnounceMessage(XML);
	}
	else
	{
		return "";
	}
}
