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
* Control chat messages
*/


/**
* Show ordinary users messages
*/
function CHAT_HandleMessage(XML)
{
	var From, Message, Body;

	// Get the sender name
	From = XML.getAttribute('from').replace(/@.*/,"");

	Body = XML.getElementsByTagName("body");

	// If there is a body
	if (Body.length > 0)
	{
		// Get the message
		Message = UTILS_GetNodeText(Body[0]);
	}

	// Show the message on interface
	CHAT_ReceiveMessage(From, Message);

	return "";
}

/**
* Open a chat
*/
function CHAT_OpenChat(Username)
{
	if (!MainData.AddChat(Username))
	{
		return false;
	}
	INTERFACE_OpenChat(Username);
	return true;
}

/**
* Close a chat
*/
function CHAT_CloseChat(Username)
{
	if (!MainData.RemoveChat(Username))
	{
		return false;
	}
	INTERFACE_CloseChat(Username);
	return true;
}

/**
* Send a chat message
* 5C
*/
function CHAT_SendMessage(Username, Message)
{
	var XML = MESSAGE_Chat(Username, Message);

	CONNECTION_SendJabber(XML);

	// Show message in chat list
	INTERFACE_ShowChatMessage(Username, Message);
}

/**
* Show a message received on interface
*/
function CHAT_ReceiveMessage(Username, Message)
{
	// Do not exists a opened chat session
	if (MainData.FindChat(Username) == null)
	{
		if (MainData.AddChat(Username))
		{
			INTERFACE_OpenChat(Username);
		}
		else
			return false;
	}

	// Show message in chat list
	INTERFACE_ShowChatMessage(Username, Message);

	return true;
}
