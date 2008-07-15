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
 * @file	chat.js
 * @brief	Functions to parse chat messages.
 *
 * See interface chat (scripts/interface/chat.js).
*/


/**
 * @brief 	Parse and show ordinary users messages
 *
 * @param	XML	XML with message
 * @return	Buffer with other XMPP to send
 * @author	Pedro Rocha
*/
function CHAT_HandleMessage(XML)
{
	var From, Message, Body;
	var Buffer = "";

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
	// UTILS_ConvertChatString -> Replace < and >
	CHAT_ReceiveMessage(From, UTILS_ConvertChatString(Message));

	return Buffer;
}

/**
 * @brief 	Parse and show user chat presence
 *
 * @param	XML	XML with presence
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
*/
function CHAT_HandlePresence(XML)
{
	var From;
	var Status;
	var Username;
	var Type = XML.getAttribute("type");
	var Buffer = "";

	if(Type == "error")
	{
		return "";
	}

	
	From = XML.getAttribute("from");
	Username = From.split("/")[1];
	
	if(Type == "unavailable")
	{
		Status = "offline";
	}
	else
	{
		Status = "online";
	}

	INTERFACE_ChatChangeStatus(Username, Status);

	return Buffer;
}

/**
 * @brief 	Show announcement users messages
 *
 * @param	XML	XML with announce message
 * @return	Buffer with other XMPP to send
 * @author	Pedro Rocha
*/
function CHAT_HandleAnnounceMessage(XML)
{
	var From, Subject, Message, Body;
	var Buffer = "";

	// Get the sender name
	From = XML.getAttribute('from').replace(/@.*/,"");

	// Show Annouce message only if sender is host server
	if (From != MainData.Host)
		return "";

	// Announce's subject
	Subject = UTILS_GetNodeText(XML.getElementsByTagName("subject")[0]);

	Body = XML.getElementsByTagName("body");

	// If there is a body
	if (Body.length > 0)
	{
		// Get the message
		Message = UTILS_GetNodeText(Body[0]);
	}

	// Show the message on interface
	WINDOW_Alert(Subject,Message);

	return Buffer;
}

/**
 * @brief 	Open a chat with some user
 *
 * @param	Username	Name used by user
 * @return	Empty string
 * @author	Pedro Rocha
*/

function CHAT_OpenChat(Username)
{
	var Title, Msg, Status = null;

	if (MainData.FindUserInRoom(MainData.RoomDefault, Username) == null)
	{
		Status = "offline";
	}

	// Try add in sctructure
	if (MainData.AddChat(Username) == true)
	{
		// Show on interface
		INTERFACE_OpenChat(Username, Status);
	}
	else
	{
		// Show error message to user
		Title = UTILS_GetText("chat_warning");
		Msg = UTILS_GetText("chat_max_exceeded");
		Msg = Msg.replace(/%i/, MainData.MaxChats);
		WINDOW_Alert(Title, Msg);
	}

	return "";
}

/**
 * @brief 	Close a chat with user
 *
 * @param	Username	Name used by user
 * @return	Empty string
 * @author	Pedro Rocha
*/
function CHAT_CloseChat(Username)
{
	if (MainData.RemoveChat(Username) == true)
	{
		INTERFACE_CloseChat(Username);
	}
	return "";
}


/**
 * @brief 	Change  visibility of chat window
 *
 * @param	Username	Name used by user
 * @param	Obj1		Chat item
 * @param	Obj2		Chat item inner content
 * @param	State		Chat status (show/hidden)
 * @return	Empty string
 * @author	Pedro Rocha
*/
function CHAT_ChangeChatState(Username, Obj1, Obj2, State)
{
	var i = MainData.FindChat(Username);

	if (i == null)
	{
		return "";
	}

	// Changing the visibility of chat window
	if (MainData.ChatList[i].State == "hidden")
	{
		INTERFACE_ShowChat(Obj1, Obj2);
		MainData.ChatList[i].State = "show";
		State.className = "minimize";
		State.src = "./images/minimize_chat.png";
	}
	else
	{
		INTERFACE_HideChat(Obj1, Obj2);
		MainData.ChatList[i].State = "hidden";
		State.className = "maximize";
		State.src = "./images/maximize_chat.png";
	}
	
	return "";
}


/**
 * @brief 	Send a chat message
 *
 * @param	Username	Name used by user
 * @param	Message		Message to send
 * @return	Empty string
 * @author	Pedro Rocha
*/
function CHAT_SendMessage(Username, Message)
{
	//Replace < and  >
	var Msg = UTILS_ConvertChatString(Message)
	var XML = MESSAGE_Chat(Username, Msg);

	CONNECTION_SendJabber(XML);

	// Show message in chat list
	INTERFACE_ShowChatMessage(Username, Msg, true);

	return "";
}

/**
 * @brief 	Show a message received from another user
 *
 * @param	Username	Name used by user
 * @param	Message		Message received
 * @return	Empty string
 * @author	Pedro Rocha
*/
function CHAT_ReceiveMessage(Username, Message)
{
	var ChatPos = MainData.FindChat(Username);

	// Do not exists a opened chat session
	if (ChatPos == null)
	{
		CHAT_OpenChat(Username);

		INTERFACE_FocusChat(Username);
	}
	else
	{
		// Set chat with focus
		if (MainData.ChatList[ChatPos].State == "hidden")
		{
			INTERFACE_FocusChat(Username);
		}
	}

	// Show message in chat list
	INTERFACE_ShowChatMessage(Username, Message);

	return "";
}
