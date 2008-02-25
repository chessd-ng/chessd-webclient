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
* Interface function for chat
*/ 


/**
* Show a message in a open chat
*/
function INTERFACE_ShowChatMessage(Username, Message)
{
	var Node = document.getElementById("ChatMessages_"+Username);
	var Item;

	if (!Node)
	{
		return false;
	}

	Item = UTILS_CreateElement("li", null, null, Message);
	Node.appendChild(Item);

	return true;
}


/**
* Create chat elements
*/
function INTERFACE_OpenChat(Username)
{
	var Chat;
	var Node;

	Node = document.getElementById("ChatList");

	if (!Node)
	{
		return false;
	}

	// Create chat elements
	Chat = INTERFACE_CreateChat(Username);
	Node.appendChild(Chat);
}

/**
* Create chat elements
*/
function INTERFACE_ChangeChatVisibility(Item)
{
	var Top = Item.style.top;

	if (parseInt(Top) < 0)
	{
		Item.style.top = "0mm";
	}
	else
	{
		Item.style.top = "-40mm";
	}
}

/**
* Close a chat
*/
function INTERFACE_CloseChat(Username)
{
	var Node = document.getElementById("Chat_"+Username);

	if (!Node)
	{
		return false;
	}
	Node.parentNode.removeChild(Node);
	return true;
}

/**
* Create chat elements
*/
function INTERFACE_CreateChat(Username)
{
	var ChatItem, ChatInside, ChatInner, ChatTitle, ChatMessages;
	var Close, Input;

	ChatItem = UTILS_CreateElement("li", "Chat_"+Username, "chat");
	ChatInside = UTILS_CreateElement("div", null, "ChatInside");
	ChatInner = UTILS_CreateElement("div", "ChatInner");
	ChatTitle = UTILS_CreateElement("h3", null, "title", Username);
	ChatMessages = UTILS_CreateElement("ul", "ChatMessages_"+Username);
	Close = UTILS_CreateElement("img");
	Close.src = "./images/close_chat.png";

	// Show/hide chat
	ChatTitle.onclick = function () {
		INTERFACE_ChangeChatVisibility(ChatItem);
	}

	// Close chat
	Close.onclick = function () {
		CHAT_CloseChat(Username);
	}

	Input = UTILS_CreateElement("input");
	Input.type = "text";
	
	// Send message
	Input.onkeypress = function (event) {
		if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
		{
			// Send chat message
			CHAT_SendMessage(Username, Input.value);
			Input.value = "";
		}
	}

	ChatTitle.appendChild(Close);

	ChatInner.appendChild(ChatMessages);
	ChatInner.appendChild(Input);

	ChatInside.appendChild(ChatTitle);
	ChatInside.appendChild(ChatInner);

	ChatItem.appendChild(ChatInside);

	return ChatItem;
}

/**
* Create chat list elements
*/
function INTERFACE_CreateChatList()
{
	var ChatDiv, ChatList;
	var ScreenHeight = document.documentElement.clientHeight;

	ChatDiv = UTILS_CreateElement("div", "Chat");
	ChatList = UTILS_CreateElement("ul", "ChatList");

	ChatDiv.style.top = (ScreenHeight-20)+"px";
	ChatDiv.appendChild(ChatList);

	return ChatDiv;
}
