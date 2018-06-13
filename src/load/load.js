import { LoadObj } from 'interface/load.js';
import { UTILS_CreateElement } from 'utils/utils.js';
import { START_Webclient } from 'start.js';
import { LOGIN_EndLogin } from 'login/login.js';
import { MainData } from 'main_data.js';
import { NoCache } from 'initial_files.js';

import "css/Top.css";
import "css/Left.css";
import "css/Contacts.css";
import "css/Rooms.css";
import "css/Window.css";
import "css/TopMenus.css";
import "css/Challenge.css";
import "css/Board.css";
import "css/Game.css";
import "css/Chat.css";
import "css/Profile.css";
import "css/Oldgame.css";
import "css/Welcome.css";
import "css/User.css";
import "css/Admin.css";
import "css/ChallengeMenu.css";
import "css/Announce.css";
import "css/Help.css";
import "css/GameCenter.css";
import "css/Tourney.css";
import "css/AdminCenter.css";

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
* @file		load/load.js
*
* @brief	Load scripts and css used in the interface from server
*/

/**
* @brief	Show load screen to user, and begin to load scripts
* 
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function LOAD_StartLoad()
{
	// Remove login screen
	LOGIN_EndLogin();

	// Show load screen to user
	MainData.SetLoadObj(new LoadObj());

	// Loading css files
	LOAD_LoadFiles();
}

/**
* @brief	Remove load box from screen
* 
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function LOAD_EndLoad()
{
	var LoadObj = MainData.GetLoadObj();

	LoadObj.remove();
  // delete(LoadObj);
}

/**
* @brief	Build scripts and css files array and start load 
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
function LOAD_LoadFiles()
{
	var Files = new Array();
	var NumFiles;
	
	NumFiles = Files.length;
	LOAD_AppendFiles(Files, NumFiles);
}

/*
* @brief 	Append script or css files in interface
*
* @param	Files		Array of files
* @param	NumFiles	Number of files to load
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
function LOAD_AppendFiles(Files, NumFiles)
{
	var FileType;
	var File;
	var Head = document.getElementsByTagName("head")[0];
	var LoadObj = MainData.GetLoadObj();

	if(Files.length > 0)
	{
		// Get File type to create correct tag
		FileType = Files[0].split("/")[0];
		
		//Show file to be load
		LoadObj.setLabel(Files[0])
			
		switch(FileType)
		{
			case "scripts":
				File = UTILS_CreateElement("script");
				File.src = Files[0]+"?"+NoCache.TimeStamp;
				File.type = "text/javascript";
				Head.appendChild(File);
				break;

			case "css":
				File = UTILS_CreateElement("link");
				File.href = Files[0]+"?"+NoCache.TimeStamp;
				File.type = "text/css";
				File.rel = "stylesheet";
				Head.appendChild(File);
				
				//Quick fix -> CSS doesn't trigger onload event
				//in FF2/FF3
				LOAD_NextFile(Files, NumFiles);
				break;

			case "images":
				File = UTILS_CreateElement("img");
				File.src = Files[0];
				break;
		}
	
		// http://cain.supersized.org/archives/2-Dynamic-loading-of-external-JavaScript-.js-files.html	
		// IE script onload doesn't work. To resolve this problem
		// we used onreadystatechange event to know when script
		// was loaded and ready to use.
		// This event work with CSS files too.
		if(MainData.GetBrowser() == 0) //IE
		{
			
			File.onreadystatechange = function(){
				if(File.readyState == "loaded" )
				{
					LOAD_NextFile(Files, NumFiles);
				}
			};
		}
		else // FF2 / FF3
		{
			File.onload = function(){LOAD_NextFile(Files, NumFiles)};
		}

		File.onerror = function(){LOAD_NextFile(Files, NumFiles)};
		File.onabort = function(){LOAD_NextFile(Files, NumFiles)};
	}
	// All files has been loaded
	else 
	{
		LOAD_EndFile(Files,NumFiles);
	}

}
/*
* @brief	Get next file in array of files to load
*
* This function update loading bar and loading text in load box
*
* @param	Files		Array of files
* @param	NumFiles	Number of files to load
* @return	none
* @author	Rubens Suguimoto
*/
function LOAD_NextFile(Files, NumFiles)
{
	var LoadObj = MainData.GetLoadObj();
	var Num = (1/ NumFiles)*300;
	// Fill the loading bar progress
	LoadObj.LoadBar.add(Num)

	// Remove first file from list and load next file
	Files.splice(0,1);
	LOAD_AppendFiles(Files, NumFiles);
}

/*
* @brief	Start game enviroment after load last file
*
* @param	Files		Array of files
* @param	NumFiles	Number of files to load
* @return	none
* @author	Rubens Suguimoto
*/
function LOAD_EndFile(Files, NumFiles)
{
	var LoadObj = MainData.GetLoadObj();
	var Num = (1/ NumFiles)*300;
	// Complete load bar
	LoadObj.LoadBar.add(Num)

	// Start Webclient chess environment
	setTimeout(START_Webclient, 1);
}

/*
* @brief	Reload script and css files 
*
* This function is used to reload scripts to avoid cache
*
* @return	none
* @author	Danilo Yorinori
*/
export function LOAD_ReloadFiles()
{
	var Head = document.getElementsByTagName("head")[0];

	var CssFiles = Head.getElementsByTagName("link");
	var ScriptFiles = Head.getElementsByTagName("script");

	var File;

	while (CssFiles.length > 0)
	{
		Head.removeChild(CssFiles[0]);
	}
	
	while (ScriptFiles.length > 0)
	{
		Head.removeChild(ScriptFiles[0]);
	}

	File = UTILS_CreateElement("script");
	File.src = "initial_files.js?"+NoCache.TimeStamp;
	File.type = "text/javascript";
	Head.appendChild(File);

	File = UTILS_CreateElement("link");
	File.rel = "stylesheet";
	File.type = "text/css";
	File.href = "css/Main.css";
	Head.appendChild(File);

	File = UTILS_CreateElement("link");
	File.rel = "stylesheet";
	File.type = "text/css";
	File.href = "css/Login.css";
	Head.appendChild(File);

	File = UTILS_CreateElement("link");
	File.rel = "stylesheet";
	File.type = "text/css";
	File.href = "css/Load.css";
	Head.appendChild(File);

}

/*
* @brief	Function used to load Internet Explorer CSS
*
* @return	none
* @author	Danilo Yorinori
*/
export function LOAD_IECssFile()
{
	var Head = document.getElementsByTagName("head")[0];
	var File;

	File = UTILS_CreateElement("link");
	File.href = "css/LoadIE.css?"+NoCache.TimeStamp;
	File.type = "text/css";
	File.rel = "stylesheet";
	Head.appendChild(File);
}
