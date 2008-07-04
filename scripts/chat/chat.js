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
	// UTILS_ConvertChatString -> Replace < and >
	CHAT_ReceiveMessage(From, UTILS_ConvertChatString(Message));

	return "";
}

function CHAT_HandlePresence(XML)
{
	var From;
	var Status;
	var Username;
	var Type = XML.getAttribute("type");

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
}

/**
* Show announcement users messages
*/
function CHAT_HandleAnnounceMessage(XML)
{
	var From, Subject, Message, Body;

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

	return "";
}

/**
* Open a chat
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
* Change  visibility of chat window
*/
function CHAT_ChangeChatState(Username, Obj1, Obj2, State)
{
	var i = MainData.FindChat(Username);

	if (i == null)
	{
		return null;
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
}


/**
* Send a chat message
*/
function CHAT_SendMessage(Username, Message)
{
	//Replace < and  >
	var Msg = UTILS_ConvertChatString(Message)
	var XML = MESSAGE_Chat(Username, Msg);

	CONNECTION_SendJabber(XML);

	// Show message in chat list
	INTERFACE_ShowChatMessage(Username, Msg, true);
}

/**
* Show a message received on interface
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

	return true;
}
