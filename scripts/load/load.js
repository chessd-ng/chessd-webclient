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
* Show load screen to user, and begin to load scripts
*/
function LOAD_StartLoad()
{
	// Remove login screen
	LOGIN_EndLogin();
	
	// Show load screen to user
	INTERFACE_StartLoad();

	// Loading css files
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_css"), 2);
	LOAD_LoadCss();
}

/**
* Start to load css files
*/
function LOAD_Load2()
{
	// Loading scripts
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_scripts"), 3);
	LOAD_LoadScripts();
}

/**
* Start to load images
*/
function LOAD_Load3()
{
	// Loading Images
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_images"), 4);
	LOAD_LoadImages();
}

/**
* Finish load process
*/
function LOAD_Load4()
{
	// Ending connection steps
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_user_list"), 5);
	//MainData.ConnectionStatus++;
	MainData.Load = 1;
	START_Webclient();
}

/**
* Remove load box from screen
*/
function LOAD_EndLoad()
{
	INTERFACE_EndLoad();
}

/**
* Load scripts files while interface is loading
*/
function LOAD_LoadScripts()
{
	var Scripts = new Array();
	var Load;

	// Files to be loaded
	Scripts.push("scripts/parser/parser.js");
	Scripts.push("scripts/parser/parser_iq.js");
	Scripts.push("scripts/parser/parser_presence.js");
	Scripts.push("scripts/parser/parser_chat.js");
	Scripts.push("scripts/contact/contact.js");
	Scripts.push("scripts/chat/chat.js");
	Scripts.push("scripts/interface/interface.js");
	Scripts.push("scripts/interface/top.js");
	Scripts.push("scripts/interface/left.js");
	Scripts.push("scripts/interface/room.js");
	Scripts.push("scripts/interface/contact.js");
	Scripts.push("scripts/room/room.js");
	Scripts.push("scripts/contact/status.js");
	Scripts.push("scripts/contact/invite.js");
	Scripts.push("scripts/window/window.js");
	Scripts.push("scripts/interface/window.js");
	Scripts.push("scripts/interface/challenge.js");
	Scripts.push("scripts/interface/game.js");
	Scripts.push("scripts/game/game.js");
	Scripts.push("scripts/utils/dragpiece.js");
	Scripts.push("scripts/utils/dragwindow.js");
	Scripts.push("scripts/contact/info.js");
	Scripts.push("scripts/contact/search.js");
	Scripts.push("scripts/game/oldgame.js");
	Scripts.push("scripts/interface/chat.js");
	Scripts.push("scripts/profile/profile.js");
	Scripts.push("scripts/interface/profile.js");
	Scripts.push("scripts/utils/images.js");
	Scripts.push("scripts/interface/oldgame.js");
	Scripts.push("scripts/interface/welcome.js");
	Scripts.push("scripts/interface/user.js");
	Scripts.push("scripts/admin/admin.js");
	Scripts.push("scripts/interface/admin.js");
	Scripts.push("scripts/challenge/challenge.js");
	Scripts.push("scripts/interface/challengemenu.js");
	Scripts.push("scripts/challenge/adjourn.js");
	Scripts.push("scripts/challenge/announce.js");
	Scripts.push("scripts/interface/announce.js");

	Load = new Preloader(Scripts, "script", LOAD_Load3);
}

/**
* Load css files while interface is loading
*/
function LOAD_LoadCss()
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
	Files.push("css/Top.css");
	Files.push("css/Left.css");
	Files.push("css/Contacts.css");
	Files.push("css/Rooms.css");
	Files.push("css/Window.css");
	Files.push("css/TopMenus.css");
	Files.push("css/Challenge.css");
	Files.push("css/Board.css");
	Files.push("css/Game.css");
	Files.push("css/Chat.css");
	Files.push("css/Profile.css");
	Files.push("css/Oldgame.css");
	Files.push("css/Welcome.css");
	Files.push("css/User.css");
	Files.push("css/Admin.css");
	Files.push("css/ChallengeMenu.css");
	Files.push("css/Announce.css");

	if(MainData.Browser == 0) //IE
	{
		Files.push("css/IEFix.css");
	}

	for (i=0; i<Files.length; i++)
	{
		Tag = document.createElement("link");
		Tag.href = Files[i]+"?"+NoCache;
		Tag.type = "text/css";
		Tag.rel = "stylesheet";

		// Appending to head of document
		Head.appendChild(Tag);
	}
	LOAD_Load2();

	return true;
}

/**
* Load images used in interface
*/
function LOAD_LoadImages()
{
	var Images = new Array();
	var Load;

	// Images to be loaded
	Images.push("images/logochessd.png");
	Images.push("images/search_game.png");
	Images.push("images/search_user.png");
	Images.push("images/news.png");
	Images.push("images/preferences.png");
	Images.push("images/help.png");
	/*
	Images.push("images/exit.png");
	Images.push("images/exit_selec.png");
	
	Images.push("images/available.png");
	Images.push("images/unavailable.png");
	Images.push("images/away.png");
	Images.push("images/busy.png");
	Images.push("images/close.png");
	Images.push("images/invite_black_pawn.png");
	Images.push("images/invite_white_pawn.png");
	*/
	Load = new Preloader(Images, "image", LOAD_Load4);
}
