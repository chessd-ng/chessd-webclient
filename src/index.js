import {
	UTILS_CreateCookie,
	UTILS_GetLanguage,
	UTILS_OpenXMLFile,
	UTILS_GetTag,
	UTILS_ReadCookie,
} from 'utils/utils.js';
import {
	MESSAGE_Presence,
	MESSAGE_GetProfile,
	MESSAGE_UserList,
} from 'xmpp_messages/message.js';
import { DATA } from 'data/data.js';
import { CONTACT_StopAwayStatus, CONTACT_StartAwayCounter } from 'contact/status.js';
import { INTERFACE_EndLogin, INTERFACE_StartLogin } from 'interface/login.js';
import {
	INTERFACE_StopInterface,
	INTERFACE_CreateInterface,
	INTERFACE_ShowInterface,
} from 'interface/interface.js';
import {
	USER_StopUpdateUserList,
	USER_StartUpdateUserList,
	USER_StartUpdateUserProfile,
	USER_StopUpdateUserProfile,
	USER_AddUser,
} from 'contact/user.js';
import { CONTACT_StartContactList, CONTACT_LoadUserContactList } from 'contact/contact.js';
import {
	LOAD_ReloadFiles,
	LOAD_EndLoad,
	LOAD_IECssFile,
} from 'load/load.js';
import { GAME_SearchCurrentGame } from 'game/game.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { ADMINCENTER_StartAdminCenter } from 'admin/admin.js';
import { INITIAL_LoadScripts } from 'initial_files.js';
import { ONLINE_StartOnlineList } from 'contact/online.js';
import { GAMECENTER_StartGameCenter } from 'gamecenter/gamecenter.js';

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

/*
* @file		start.js
* @brief	Start MainData and show login page
*/

import 'css/Main.css';
import 'css/Login.css';
import 'css/Load.css';
import { languages } from 'langs';
import conf from 'conf/conf.xml';
import { NoCache } from 'initial_files.js';

//Global object that stores all data needed by interface
export let MainData;
var TranslationLog = new Array();

/*
* @brief	Start main data and show login page
* 
* Start page, initialize MainData and show page
*
* @return	none
* @author 	Rubens Suguimoto
*/
export function START_StartPage()
{
	var Lang;
	var ConfTmp;

	// What language show?
	// Find lang in cookie
	Lang = UTILS_ReadCookie("lang");
	// if language is not found in cookie
	if (Lang == "")
	{
		// Get from browser language
		//Lang = UTILS_GetLanguage();
		
		// Get default lang from configuration file
		ConfTmp = UTILS_OpenXMLFile(conf+'?'+NoCache.TimeStamp);
		Lang = UTILS_GetTag(ConfTmp, "default-lang");
	}

	// Read xml config files and starting data structure
	MainData = new DATA(conf+'?'+NoCache.TimeStamp, languages[Lang]+'?'+NoCache.TimeStamp);
	MainData.SetLang(Lang);
	
	INTERFACE_StartLogin(Lang);
}

/*
* @brief	Set new language and re-show login page
*
* Set new language in main data and show login page with new language selected
*
* @param 	Lang	Language in ISO 639 and ISO 3166 format standard.
* @return	none
* @author 	Rubens Suguimoto
*/
export function START_ChangeLanguage(Lang)
{
	// Close login div
	INTERFACE_EndLogin();

	// Reload MainData with configurations and new language selected
	MainData.SetText(UTILS_OpenXMLFile("lang/"+Lang+".xml?"+NoCache.TimeStamp))

	// Create cookie for new language
	UTILS_CreateCookie("lang", Lang, MainData.GetCookieValidity());

	// Set language
	MainData.SetLang(Lang);
	
	// Show new login div with language selected
	INTERFACE_StartLogin(Lang);
}



/**
* @brief	Clear Login window and start interface 
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function START_Webclient()
{
	var All;
	var XMPP = "";

	var Consts = MainData.GetConst();
	
	var MyUsername = MainData.GetUsername();

	//MainData.ConnectionStatus = 0;
	MainData.SetConnectionStatus(0);

	// Add MyUsername in User list
	USER_AddUser(MyUsername, "available");

	// Create messages to get my user contact list,
	// get my profile and presence to chessd server, jabber and
	// general room
	XMPP += MESSAGE_UserList();
	XMPP += MESSAGE_Presence(MainData.GetServer()+"."+MainData.GetHost());
	XMPP += MESSAGE_GetProfile(MyUsername, Consts.IQ_ID_GetMyProfile);
	XMPP += MESSAGE_Presence();
	XMPP += MESSAGE_Presence("general@"+MainData.GetConferenceComponent()+"."+MainData.GetHost()+"/"+MyUsername);

	CONNECTION_SendJabber(XMPP);

	// Close load image
	LOAD_EndLoad();

	// Open XadrezLivre game environment
	All = INTERFACE_CreateInterface();
	INTERFACE_ShowInterface(All);
	
	// Create contact object and online list and set values
	ONLINE_StartOnlineList();
	CONTACT_StartContactList();
	CONTACT_LoadUserContactList();

	// Create gamecenter
	GAMECENTER_StartGameCenter();

	// Create admincenter object
	ADMINCENTER_StartAdminCenter();

	// Create challenge menu object
	//CHALLENGE_StartChallenge();

	// Search for some game that player is playing
	GAME_SearchCurrentGame();

	// Set away counter
	CONTACT_StartAwayCounter();

	// Set update user list timer 
	USER_StartUpdateUserList();

	// Set update user profile timer 
	USER_StartUpdateUserProfile();
}

/*
* @brief	Stop interface and reload files
*
* @return	none
* @author	Danilo Yorinori
*/
export function START_Restart()
{
        var CurrentGame = MainData.GetCurrentGame();
        var UpdateProfile = MainData.GetUpdateProfileTimer();
        var UpdateRating = MainData.GetUpdateTimer();

	INTERFACE_StopInterface();

	//Stop game count timer of current game 
	if(CurrentGame != null)
	{
		CurrentGame.Game.StopTimer();
	}

	//Stop profile update interval
	if(UpdateProfile != null)
	{
		USER_StopUpdateUserProfile();
	}

	//Stop rating update interval
	if(UpdateRating != null)
	{
		USER_StopUpdateUserList();
	}

	//Stop away counter interval
	CONTACT_StopAwayStatus();

	// Clear MainData
  MainData = undefined;

	// Get new timestamp
	NoCache.TimeStamp = "";
	NoCache.TimeStamp += NoCache.DateTime.getMonth();
	NoCache.TimeStamp += "/"+NoCache.DateTime.getDate();
	NoCache.TimeStamp += "/"+NoCache.DateTime.getFullYear();
	NoCache.TimeStamp += "-"+NoCache.DateTime.getHours();
	NoCache.TimeStamp += ":"+NoCache.DateTime.getMinutes();
	NoCache.TimeStamp += ":"+NoCache.DateTime.getSeconds();

	// Reload Scripts
	LOAD_ReloadFiles();

	//START_StartPage();
	INITIAL_LoadScripts();

	// Verify browser and if IE then append related css file
	if(MainData.GetBrowser() == 0)
	{
		LOAD_IECssFile();
	}
}

START_StartPage();
