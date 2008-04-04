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
* Control interface DOM objects
*/


/**
* Create all object needed to start interface
*/
function INTERFACE_CreateInterface()
{
	var Page, Main, Chat, Top, Left, Center;
	
	Page = UTILS_CreateElement("div", "Page");
	Main = UTILS_CreateElement("div", "Main");
	Center = UTILS_CreateElement("div", "Center");
	Top = INTERFACE_CreateTop();
	Left = INTERFACE_CreateLeft();
	Chat = INTERFACE_CreateChatList();

	Main.appendChild(Left);
	Main.appendChild(Center);
	Page.appendChild(Top);
	Page.appendChild(Main);
	Page.appendChild(Chat);

	return Page;
}

/**
* Show interface in the user screen
*/
function INTERFACE_ShowInterface(Tree)
{
	document.body.appendChild(Tree);
}


/**
* Remove interface in the user screen
*/
function INTERFACE_StopInterface()
{
	var Page = document.getElementById("Page");

	// Remove the interface div
	if (Page)
	{
		Page.parentNode.removeChild(Page);
	}
}
