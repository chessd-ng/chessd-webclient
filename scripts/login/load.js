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
function LOGIN_Load()
{
	// Remove login screen
	LOGIN_EndLogin();
	
	// Show load screen to user
	INTERFACE_StartLoad();

	// Loading css files
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_css"), 2);
	LOGIN_LoadCss();
}

/**
* Start to load css files
*/
function LOGIN_Load2()
{
	// Loading scripts
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_scripts"), 3);
	LOGIN_LoadScripts();
}

/**
* Start to load images
*/
function LOGIN_Load3()
{
	// Loading Images
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_images"), 4);
	LOGIN_LoadImages();
}

/**
* Finish load process
*/
function LOGIN_Load4()
{
	// Ending connection steps
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_user_list"), 5);
	MainData.ConnectionStatus++;
	MainData.Load = 1;
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
	var Scripts = new Array();
	var Load;

	// Files to be loaded
	Scripts[0] = "scripts/parser/parser.js";
	Scripts[1] = "scripts/parser/parser_iq.js";
	Scripts[2] = "scripts/parser/parser_presence.js";
	Scripts[3] = "scripts/parser/parser_chat.js";
	Scripts[4] = "scripts/contact/contact.js";
	Scripts[5] = "scripts/chat/chat.js";
	Scripts[6] = "scripts/interface/interface.js";
	Scripts[7] = "scripts/interface/top.js";
	Scripts[8] = "scripts/interface/left.js";
	Scripts[9] = "scripts/interface/room.js";
	Scripts[10] = "scripts/interface/contact.js";
	Scripts[11] = "scripts/room/room.js";
	Scripts[12] = "scripts/contact/status.js";
	Scripts[13] = "scripts/contact/invite.js";
	Scripts[14] = "scripts/window/window.js";
	Scripts[15] = "scripts/interface/window.js";
	Scripts[16] = "scripts/interface/challenge.js";
	Scripts[17] = "scripts/interface/game.js";
	Scripts[18] = "scripts/game/game.js";
	Scripts[19] = "scripts/utils/dragpiece.js";
	Scripts[20] = "scripts/utils/dragwindow.js";
	Scripts[21] = "scripts/contact/info.js";
	Scripts[22] = "scripts/contact/search.js";
	Scripts[23] = "scripts/game/oldgame.js";
	Scripts[24] = "scripts/interface/chat.js";
	Scripts[25] = "scripts/profile/profile.js";
	Scripts[26] = "scripts/interface/profile.js";
	Scripts[27] = "scripts/utils/images.js";
	Scripts[28] = "scripts/interface/oldgame.js";
	Scripts[29] = "scripts/interface/welcome.js";
	Scripts[30] = "scripts/interface/user.js";
	Scripts[31] = "scripts/admin/admin.js";
	Scripts[32] = "scripts/interface/admin.js";
	Scripts[33] = "scripts/challenge/challenge.js";
	Scripts[34] = "scripts/interface/challengemenu.js";
	Scripts[35] = "scripts/challenge/adjourn.js";
	Scripts[36] = "scripts/challenge/announce.js";
	Scripts[37] = "scripts/interface/announce.js";

	Load = new Preloader(Scripts, "script", LOGIN_Load3);
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
	Files[5] = "css/TopMenus.css";
	Files[6] = "css/Challenge.css";
	Files[7] = "css/Board.css";
	Files[8] = "css/Game.css";
	Files[9] = "css/Chat.css";
	Files[10] = "css/Profile.css";
	Files[11] = "css/Oldgame.css";
	Files[12] = "css/Welcome.css";
	Files[13] = "css/User.css";
	Files[14] = "css/Admin.css";
	Files[15] = "css/ChallengeMenu.css";
	Files[16] = "css/Announce.css";

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
	LOGIN_Load2();

	return true;
}

/**
* Load images used in interface
*/
function LOGIN_LoadImages()
{
	var Images = new Array();
	var Load;

	// Images to be loaded
	Images[0] = "images/logochessd.png";
	Images[1] = "images/search_game.png";
	Images[2] = "images/search_user.png";
	Images[3] = "images/news.png";
	Images[4] = "images/preferences.png";
	Images[5] = "images/help.png";
	/*
	Images[6] = "images/exit.png";
	Images[7] = "images/exit_selec.png";
	
	Images[8] = "images/available.png";
	Images[9] = "images/unavailable.png";
	Images[10] = "images/away.png";
	Images[11] = "images/busy.png";
	Images[12] = "images/close.png";
	Images[13] = "images/invite_black_pawn.png";
	Images[14] = "images/invite_white_pawn.png";
	*/
	Load = new Preloader(Images, "image", LOGIN_Load4);
}
