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
function INTERFACE_ShowChatMessage(Username, Message, YourMessage)
{
	var Node = document.getElementById("ChatMessages_"+Username);
	var Item, Time, NewMessage;

	if (!Node)
	{
		return false;
	}

	// Get current time
	Time = UTILS_GetTime();

	if (YourMessage)
	{
		NewMessage = "<strong>"+Time+" "+MainData.Username+"</strong>: "+Message;
	}
	else
	{
		NewMessage = "<strong>"+Time+" "+Username+"</strong>: "+Message;
	}

	Item = UTILS_CreateElement("li", null, null, NewMessage);
	Node.appendChild(Item);
	Node.scrollTop = Node.scrollHeight + Node.clientHeight;

	return true;
}


/**
* Create chat elements
*/
function INTERFACE_OpenChat(Username, Status)
{
	var Chat;
	var Node;

	Node = document.getElementById("ChatList");

	if (!Node)
	{
		return false;
	}

	// Create chat elements
	Chat = INTERFACE_CreateChat(Username, Status);
	Node.appendChild(Chat.ChatItem);
	Chat.Elements.InputFocus();
}

/**
* Show chat window
*/
function INTERFACE_ShowChat(Item, Hide)
{
	/*
	if(MainData.Browser == 0)
	{
		Item.style.top = "-60mm";
	}
	else
	{
		Item.style.top = "-40mm";
	}
	*/
	Item.style.top = "-155px";
	Hide.style.display = "block";
}

/**
* Hide chat window
*/
function INTERFACE_HideChat(Item, Hide)
{
	Item.style.top = "0mm";
	Hide.style.display = "none";
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
* Giving focus to a chat window
*/
function INTERFACE_FocusChat(Username)
{
	var Node = document.getElementById("Chat_"+Username);
	var Title;

	if (!Node)
	{
		return null;
	}

	Title = Node.getElementsByTagName("h3");

	if (Title.length <= 0)
	{
		return null;
	}

	Title[0].className = "title_selec";
	return true;
}

/**
* Remove focus of a chat window
*/
function INTERFACE_UnfocusChat(Username)
{
	var Node = document.getElementById("Chat_"+Username);
	var Title;

	if (!Node)
	{
		return null;
	}

	Title = Node.getElementsByTagName("h3");

	if (Title.length <= 0)
	{
		return null;
	}

	Title[0].className = "title";
	return true;
}

/**
* Positioning chat list
*/
function INTERFACE_ChatListPositioning()
{
	var Node = document.getElementById("Chat");
	var ScreenHeight, ScreenScroll;
	
	if (!Node)
	{
		return false;
	}
	ScreenHeight = document.documentElement.clientHeight;
	ScreenScroll = document.documentElement.scrollTop;
	Node.style.top = (ScreenHeight+ScreenScroll-20)+"px";
}

/**
* Create chat elements
*/
function INTERFACE_CreateChat(Username, Status)
{
	var ChatItem, ChatInside, ChatInner, ChatTitle, ChatMessages;
	var Close, Input, State;

	var Elements = new Object();

	ChatItem = UTILS_CreateElement("li", "Chat_"+Username, "chat");
	ChatInside = UTILS_CreateElement("div", null, "ChatInside");

	if (Status == "offline")
	{
		ChatTitle = UTILS_CreateElement("h3", null, "title", Username+" (offline)");
	}
	else
	{
		ChatTitle = UTILS_CreateElement("h3", null, "title", Username);
	}

	ChatMessages = UTILS_CreateElement("ul", "ChatMessages_"+Username);
	ChatInner = UTILS_CreateElement("div", "ChatInner");
	ChatInner.style.display = "none";
	State = UTILS_CreateElement("img",null,"minimize");
	State.src = "./images/minimize_chat.png";
	Close = UTILS_CreateElement("img",null,"close");
	Close.src = "./images/close_chat.png";

	// Show chat
	INTERFACE_ShowChat(ChatItem, ChatInner);

	// Show/hide chat
	State.onclick = function () {
		CHAT_ChangeChatState(Username, ChatItem, ChatInner, State);
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

	ChatTitle.appendChild(State);
	ChatTitle.appendChild(Close);

	ChatInner.appendChild(ChatMessages);
	ChatInner.appendChild(Input);

	ChatInside.appendChild(ChatTitle);
	ChatInside.appendChild(ChatInner);

	ChatItem.appendChild(ChatInside);

	Elements.Input = Input;

	Elements.InputFocus = INTERFACE_InputChatFocus;

	return {ChatItem:ChatItem, Elements:Elements};
}

/*
* Set focus in input element 
*
* @author Danilo
*/
function INTERFACE_InputChatFocus()
{
	this.Input.focus();
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

	window.onresize = function() { INTERFACE_ChatListPositioning(); };
	window.onscroll = function() { INTERFACE_ChatListPositioning(); };

	return ChatDiv;
}
