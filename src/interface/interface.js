import { INTERFACE_CreateTop } from 'interface/top.js';
import { INTERFACE_CreateChatList } from 'interface/chat.js';
import {
	UTILS_CreateElement,
	UTILS_GetParentDiv,
	UTILS_GetOffset,
} from 'utils/utils.js';
import {
  LOGIN_LeavePage
} from 'login/login.js';
import { INTERFACE_CreateLeft } from 'interface/left.js';

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
* @file		interface/interface.js
* @brief	Control interface DOM objects
*/


/**
* @brief	Create all object needed to start game enviroment
* 
* @return	Start main Div
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function INTERFACE_CreateInterface()
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
	Page.appendChild(Chat);
	Page.appendChild(Main);

	// Logout from jabber when close or reload page;
	document.body.setAttribute("onbeforeunload",LOGIN_LeavePage);

	return Page;
}

/**
* @brief	Show interface in the user screen
*
* @param	Tree	HTML DOM element
* @return	none
* @author	Pedro Rocha
*/
export function INTERFACE_ShowInterface(Tree)
{
	document.body.appendChild(Tree);
}


/**
* @brief	Remove start enviroment page
*
* @return	none
* @author	Pedro Rocha
*/
export function INTERFACE_StopInterface()
{
	var Page = document.getElementById("Page");
	var Windows = document.getElementsByTagName("div");
	var i;

	// Remove the interface div
	if (Page)
	{
		Page.parentNode.removeChild(Page);
	}

	for(i=Windows.length-1; i>=0; i--)
	{
		Windows[i].parentNode.removeChild(Windows[i]);
	}
}

/*
* @brief	Create a generic loading box
* 
* @param	Id	Box identification name
* @param	Text	Text string to show
*/
export function INTERFACE_CreateLoadingBox(Id, Text)
{
	var Div = UTILS_CreateElement("div",Id,"loading_box");
	var Span = UTILS_CreateElement("Span",null,null,Text);

	Div.appendChild(Span);

	return Div;
}

/**
 * @brief	Disable element selection
 *
 * @return	False
 * @author 	Danilo Yorinori
 */
export function INTERFACE_DisableSelect()
{
	return false;
}

/**
 * @brief	Enabla element selection
 *
 * @return	True
 * @author 	Danilo Yorinori
 */
export function INTERFACE_ReEnableSelect()
{
	return true;
}

/**
* @brief	Create a hint to show full name
* 
* @param	Obj		Obj that have name shorted
* @param	FullName	String to be displayed
* @return	none
* @author	Danilo Yorinori
*/
export function INTERFACE_ShowFullName(Obj,FullName)
{
	var Hint, Name, ParentNode, Pos;

	Hint = UTILS_CreateElement("div", "FullNameDiv");

	Name = UTILS_CreateElement("p", null, null, FullName);

	Hint.appendChild(Name);
	
	// Get parent scrolling
	ParentNode = UTILS_GetParentDiv(Obj);

	// Get position of user list item
	Pos = UTILS_GetOffset(Obj);
	Hint.style.top = (Pos.Y+16-ParentNode.scrollTop)+"px";
	Hint.style.left = Pos.X+"px";
	Hint.style.width = FullName.length*6+'px';

	document.body.appendChild(Hint);
}

/**
* @brief	Close hint box created by INTERFACE_ShowFullName function
* 
* @return	none
* @author	Danilo Yorinori
*/
export function INTERFACE_CloseFullName()
{
	var Hint = document.getElementById("FullNameDiv");
	if (Hint)
	{
		document.body.removeChild(Hint);
	}
}
