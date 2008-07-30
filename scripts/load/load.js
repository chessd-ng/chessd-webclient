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
	//INTERFACE_StartLoad();
	MainData.Load = new LoadObj();

	// Loading css files
	//INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_css"), 2);
	LOAD_LoadFiles();
}

/**
* Start to load css files
*/
/*
function LOAD_Load2()
{
	// Loading scripts
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_scripts"), 3);
	LOAD_LoadScripts();
}
*/
/**
* Start to load images
*/
/*
function LOAD_Load3()
{
	// Loading Images
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_images"), 4);
	LOAD_LoadImages();
}
*/
/**
* Finish load process
*/
/*
function LOAD_Load4()
{
	// Ending connection steps
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_user_list"), 5);
	//MainData.ConnectionStatus++;
	MainData.Load = 1;
	START_Webclient();
}
*/
/**
* Remove load box from screen
*/
function LOAD_EndLoad()
{
	//INTERFACE_EndLoad();
	MainData.Load.remove();
	delete(MainData.Load);
}

/**
* Load scripts files while interface is loading
*/
/*
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
*/
/**
* Load css files while interface is loading
*/
/*
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
*/
/**
* Load images used in interface
*/
/*
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
	Images.push("images/exit.png");
	Images.push("images/exit_selec.png");
	
	Images.push("images/available.png");
	Images.push("images/unavailable.png");
	Images.push("images/away.png");
	Images.push("images/busy.png");
	Images.push("images/close.png");
	Images.push("images/invite_black_pawn.png");
	Images.push("images/invite_white_pawn.png");
	//Load = new Preloader(Images, "image", LOAD_Load4);
}
*/

/**
* Load scripts files while interface is loading
*/
function LOAD_LoadFiles()
{
	var Files = new Array();
	var NumFiles;
	
	// Images Files to be loaded
	/*
	Files.push("images/logochessd.png");
	Files.push("images/pieces/bbishop.png");
	Files.push("images/pieces/bknight.png");
	Files.push("images/pieces/bqueen.png");
	Files.push("images/pieces/bking.png");
	Files.push("images/pieces/bpawn.png");
	Files.push("images/pieces/bbrook.png");
	Files.push("images/pieces/wbishop.png");
	Files.push("images/pieces/wknight.png");
	Files.push("images/pieces/wqueen.png");
	Files.push("images/pieces/wking.png");
	Files.push("images/pieces/wpawn.png");
	Files.push("images/pieces/wbrook.png");
	Files.push("images/board/square_black.png");
	Files.push("images/board/square_white.png");
	Files.push("images/board/square_select.png");
	*/

	// CSS Files to be loaded
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

	// Scripts Files to be loaded
	Files.push("scripts/parser/parser_iq.js");
	Files.push("scripts/parser/parser_presence.js");
	Files.push("scripts/parser/parser_chat.js");
	Files.push("scripts/contact/contact.js");
	Files.push("scripts/chat/chat.js");
	Files.push("scripts/interface/interface.js");
	Files.push("scripts/interface/top.js");
	Files.push("scripts/interface/left.js");
	Files.push("scripts/interface/room.js");
	Files.push("scripts/interface/contact.js");
	Files.push("scripts/room/room.js");
	Files.push("scripts/contact/status.js");
	Files.push("scripts/contact/invite.js");
	Files.push("scripts/window/window.js");
	Files.push("scripts/interface/window.js");
	Files.push("scripts/interface/challenge.js");
	Files.push("scripts/interface/game.js");
	Files.push("scripts/game/game.js");
	Files.push("scripts/utils/dragpiece.js");
	Files.push("scripts/utils/dragwindow.js");
	Files.push("scripts/contact/info.js");
	Files.push("scripts/contact/search.js");
	Files.push("scripts/game/oldgame.js");
	Files.push("scripts/interface/chat.js");
	Files.push("scripts/profile/profile.js");
	Files.push("scripts/interface/profile.js");
	Files.push("scripts/utils/images.js");
	Files.push("scripts/interface/oldgame.js");
	Files.push("scripts/interface/welcome.js");
	Files.push("scripts/interface/user.js");
	Files.push("scripts/admin/admin.js");
	Files.push("scripts/interface/admin.js");
	Files.push("scripts/challenge/challenge.js");
	Files.push("scripts/interface/challengemenu.js");
	Files.push("scripts/challenge/adjourn.js");
	Files.push("scripts/challenge/announce.js");
	Files.push("scripts/interface/announce.js");


	if(MainData.Browser == 0) //IE
	{
		Files.push("css/IEFix.css");
	}


	NumFiles = Files.length;
	LOAD_AppendFiles(Files, NumFiles);
}

/*
 * Load all files when log in jabber
 */
function LOAD_AppendFiles(Files, NumFiles)
{
	var FileType;
	var File;
	var Head = document.getElementsByTagName("head")[0];

	if(Files.length > 0)
	{
		// Get File type to create correct tag
		FileType = Files[0].split("/")[0];
		
		//Show file to be load
		MainData.Load.setLabel(Files[0])
			
		switch(FileType)
		{
			case "scripts":
				File = UTILS_CreateElement("script");
				File.src = Files[0]+"?"+NoCache;
				File.type = "text/javascript";
				Head.appendChild(File);
				break;

			case "css":
				File = UTILS_CreateElement("link");
				File.href = Files[0]+"?"+NoCache;
				File.type = "text/css";
				File.rel = "stylesheet";
				Head.appendChild(File);
				
				//Quick fix -> CSS doesn't trigger onload event
				//in FF2/FF3
				if(MainData.Browser != 0 )
				{
					LOAD_NextFile(Files, NumFiles);
				}
				break;

			case "images":
				File = UTILS_CreateElement("img");
				File.src = Files[0]+"?"+NoCache;
				break;
		}
	
		
		
		// http://cain.supersized.org/archives/2-Dynamic-loading-of-external-JavaScript-.js-files.html	
		// IE script onload doesn't work. To resolve this problem
		// we used onreadystatechange event to know when script
		// was loaded and ready to use.
		// This event work with CSS files too.
		if(MainData.Browser == 0) //IE
		{
			File.onreadystatechange = function(){
				if(File.readyState == "loaded" || File.readyState == "complete")
				{
					LOAD_NextFile(Files, NumFiles);
				}
			};
		}
		else // FF2 / FF3
		{
			File.onload = function(){LOAD_NextFile(Files, NumFiles)};
		}

		/*
		File.onerror = function(){LOAD_NextFile(Files, NumFiles)};
		File.onabort = function(){LOAD_NextFile(Files, NumFiles)};
		*/
	}
	// All files has been loaded
	else 
	{
		LOAD_EndFile(Files,NumFiles);
	}

}

function LOAD_NextFile(Files, NumFiles)
{
	var Num = (1/ NumFiles)*300;
	// Fill the loading bar progress
	MainData.Load.LoadBar.add(Num)

	// Remove first file from list and load next file
	Files.splice(0,1);
	LOAD_AppendFiles(Files, NumFiles);
}

function LOAD_EndFile(Files, NumFiles)
{
	var Num = (1/ NumFiles)*300;
	// Complete load bar
	MainData.Load.LoadBar.add(Num)

	// Start Webclient chess environment
	setTimeout("START_Webclient()", 1500);
}
