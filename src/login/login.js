import {
	UTILS_ValidateUsername,
	UTILS_CreateCookie,
	UTILS_DeleteCookie,
	UTILS_GetText,
} from 'utils/utils.js';
import { CONNECTION_SendJabber, CONNECTION_ConnectJabber } from 'connection/connection.js';
import {
	INTERFACE_ShowLoginMessage,
	INTERFACE_ShowErrorMessage,
	INTERFACE_EndLogin,
	INTERFACE_LoginDisableInput,
	INTERFACE_HideLoginMessage,
	INTERFACE_ClearError,
	INTERFACE_LoginEnableInput,
} from 'interface/login.js';
import { INTERFACE_StopInterface } from 'interface/interface.js';
import { START_Restart } from 'index.js';
import { MESSAGE_Unavailable, MESSAGE_EndConnection } from 'xmpp_messages/message.js';
import { MainData } from 'index.js';

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
* @file		login/login.js
* @brief	This file has all functions that is used on login
*/


/**
* @brief	Start login authentication on Jabber Server
*
* @return	none
* @author	Pedro Rocha, Ulyses Bomfim and Rubens Suguimoto
*/
export function LOGIN_Login(Username, Passwd, RememberPass)
{
	// Pre-validation
	if (!UTILS_ValidateUsername(Username))
	{
		alert (UTILS_GetText("login_validate_user"));
		return;
	}

	// Store user infomations
	MainData.SetUsername(Username);
	MainData.SetPassword(Passwd);

	// Set connection status to conneting
	MainData.SetConnectionStatus(1);

	// Set new RID and reset SID
	MainData.SetRID(Math.round( 100000.5 + ( ( (900000.49999) - (100000.5) ) * Math.random() ) ));
	MainData.SetSID(-1);

	// Login on Jabber Server
	CONNECTION_ConnectJabber();

	// Create Cookies
	UTILS_CreateCookie("Username", Username, MainData.GetCookieValidity());
	UTILS_CreateCookie("RememberPass", RememberPass, MainData.GetCookieValidity());

	//TODO -> Fix to IE
	if (RememberPass)
	{
		UTILS_CreateCookie("Passwd", Passwd, MainData.GetCookieValidity());
	}
	else
	{
		UTILS_DeleteCookie("Passwd");
	}
	// Disable inputs
	INTERFACE_LoginDisableInput();

	// Clear error message
	INTERFACE_ClearError();
}


/**
* @brief	Make logout 
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function LOGIN_Logout()
{
	var XMPP = "";

	NoCache.DateTime = new Date();

	// Setting structure as disconnected
	MainData.SetConnectionStatus(-1);

	// Logout from jabber
	// TODO -> USE LOGIN_LeavePage function here
	XMPP += MESSAGE_EndConnection(MESSAGE_Unavailable());
	CONNECTION_SendJabber(XMPP);

	START_Restart();
}


/**
* @brief	Send a message to terminate connection with jabber 
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function LOGIN_LeavePage()
{
	var XMPP = "";
	XMPP += MESSAGE_EndConnection(MESSAGE_Unavailable());
	CONNECTION_SendJabber(XMPP);
}

/**
* @brief	Make logout
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function LOGIN_Disconnected()
{
	// Setting structure as disconnected
	MainData.SetConnectionStatus(-1);

	INTERFACE_StopInterface();
}

/**
* Clear Login window and start interface 
*
* @return none
* @public
*/
export function LOGIN_EndLogin()
{
	INTERFACE_EndLogin();

	// Remove auto vertical align middle to login
	document.body.removeAttribute("onresize");
}

/**
* @brief	Show a error message on login steps
*
* @return	none
* @author	Rubens Suguimoto
*/
export function LOGIN_LoginFailed(Msg)
{
	//Show error message
	INTERFACE_ShowErrorMessage(Msg);

	//Enable inputs
	INTERFACE_LoginEnableInput();

	// Hide login message
	INTERFACE_HideLoginMessage();
}

/**
* @brief	Show connection status string when start login
*
* @param	Msg	Message string
* @return	none
* @author	Rubens Suguimoto
*/
export function LOGIN_LoginMsg(Msg)
{
	INTERFACE_ShowLoginMessage(Msg);
}
