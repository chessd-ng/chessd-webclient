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
* Load images, scripts and css used in the interface
* from server
*/

/**
* Show load screen to user, and load scripts, css and images
*/
function LOGIN_Load()
{
	// Remove login screen
	LOGIN_EndLogin();
	
	// Show load screen to user
	INTERFACE_StartLoad();

	// Loading scripts
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_scripts"), 2);
	LOGIN_LoadScripts();

	// Loading css files
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_css"), 3);
	LOGIN_LoadCss();

	// Loading Images
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_images"), 4);
	LOGIN_LoadImages();

	// Ending connection steps
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_user_list"), 5);
	CONNECTION_ConnectJabber();
}

/**
* Remove load box from screen
*/
function LOGIN_EndLoad()
{
	INTERFACE_EndLoad();
}

/**
* Load scripts files while interface is loading
*/
function LOGIN_LoadScripts()
{
	var Tag, i, Head;
	var Scripts = new Array();

	// Searching head of document
	Head = document.getElementsByTagName("head");
	if (Head)
	{
		Head = Head[0];
	}
	else
	{
		return null;
	}

	// Files to be loaded
	Scripts[0] = "scripts/parser/parser.js";
	Scripts[1] = "scripts/parser/parser_iq.js";
	Scripts[2] = "scripts/parser/parser_presence.js";
	Scripts[3] = "scripts/parser/parser_chat.js";
	Scripts[4] = "scripts/contact/contact.js";
	Scripts[5] = "scripts/chat/chat.js";
	Scripts[6] = "scripts/game/challenge.js";
	Scripts[7] = "scripts/interface/interface.js";
	Scripts[8] = "scripts/interface/top.js";
	Scripts[9] = "scripts/interface/left.js";
	Scripts[10] = "scripts/interface/room.js";
	Scripts[11] = "scripts/interface/contact.js";
	Scripts[12] = "scripts/room/room.js";

	Scripts[13] = "scripts/window/window.js";
	Scripts[14] = "scripts/interface/window.js";

	Scripts[15] = "scripts/contact/status.js";

	// Carregando arquivos
	for (i=0; i<Scripts.length; i++)
	{
		Tag = document.createElement("script");
		Tag.src = Scripts[i];

		Head.appendChild(Tag);
	}
}

/**
* Load css files while interface is loading
*/
function LOGIN_LoadCss()
{
	var Tag, i, Head;
	var Files = new Array();

	// Searching head of document
	Head = document.getElementsByTagName("head");
	if (Head)
	{
		Head = Head[0];
	}
	else
	{
		return null;
	}

	// Files to be loaded
	Files[0] = "css/Top.css";
	Files[1] = "css/Left.css";
	Files[2] = "css/Contacts.css";
	Files[3] = "css/Rooms.css";
	Files[4] = "css/Window.css";

	for (i=0; i<Files.length; i++)
	{
		Tag = document.createElement("link");
		Tag.href = Files[i];
		Tag.type = "text/css";
		Tag.rel = "stylesheet";

		// Appending to head of document
		Head.appendChild(Tag);
	}
}

/**
* Load images used in interface
*/
function LOGIN_LoadImages()
{
	var Img, i;
	var Images = new Array();

	// Images to be loaded
	Images[0] = "images/logochessd.png";
	Images[1] = "images/search_game.png";
	Images[2] = "images/search_user.png";
	Images[3] = "images/news.png";
	Images[4] = "images/preferences.png";
	Images[5] = "images/help.png";
	Images[6] = "images/exit.png";
	Images[7] = "images/exit_selec.png";
	Images[8] = "images/available.png";
	Images[9] = "images/unavailable.png";
	Images[10] = "images/away.png";
	Images[11] = "images/busy.png";

	for (i=0; i<Images.length; i++)
	{
		Img = new Image();
		Img.src = Images[i];
	}
}
