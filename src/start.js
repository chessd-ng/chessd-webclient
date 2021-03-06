import {
	UTILS_CreateCookie,
	UTILS_OpenXMLFile,
} from 'utils/utils.js';
import {
	MESSAGE_Presence,
	MESSAGE_GetProfile,
	MESSAGE_UserList,
} from 'xmpp_messages/message.js';
import { CONTACT_StartAwayCounter } from 'contact/status.js';
import { INTERFACE_EndLogin, INTERFACE_StartLogin } from 'interface/login.js';
import {
	INTERFACE_CreateInterface,
	INTERFACE_ShowInterface,
} from 'interface/interface.js';
import {
	USER_StartUpdateUserList,
	USER_StartUpdateUserProfile,
	USER_AddUser,
} from 'contact/user.js';
import { CONTACT_StartContactList, CONTACT_LoadUserContactList } from 'contact/contact.js';
import { GAME_SearchCurrentGame } from 'game/game.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { ADMINCENTER_StartAdminCenter } from 'admin/admin.js';
import { ONLINE_StartOnlineList } from 'contact/online.js';
import { GAMECENTER_StartGameCenter } from 'gamecenter/gamecenter.js';
import { MainData, START_MainData } from 'main_data.js';

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

/*
* @file		start.js
* @brief	Start MainData and show login page
*/

import 'css/Main.css';
import 'css/Login.css';
import 'css/Load.css';
import { NoCache } from 'initial_files.js';

//Global object that stores all data needed by interface
// var TranslationLog = new Array();

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
  START_MainData();
	
	INTERFACE_StartLogin(MainData.GetLang());
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
	MainData.SetText(UTILS_OpenXMLFile("lang/"+Lang+".xml?"+NoCache.TimeStamp));

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
	XMPP += MESSAGE_Presence(MainData.GetServer());
	XMPP += MESSAGE_GetProfile(MyUsername, Consts.IQ_ID_GetMyProfile);
	XMPP += MESSAGE_Presence();
	XMPP += MESSAGE_Presence("general@"+MainData.GetConferenceComponent()+"."+MainData.GetHost()+"/"+MyUsername);

	CONNECTION_SendJabber(XMPP);

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
  location.reload();
}
