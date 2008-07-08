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
* Login Controller
* This file has all functions that is used on Login
*/


/**
* Make login on Jabber Server
*
* @return none
* @public
*/
function LOGIN_Login(Username, Passwd, RememberPass)
{
	// Pre-validation
	if (!UTILS_ValidateUsername(Username))
	{
		alert (UTILS_GetText("login_validate_user"));
		return;
	}

	// Store user infomations 
	MainData.Username = Username;
	MainData.Password = Passwd;

	// Login on Jabber Server
	CONNECTION_ConnectJabber();

	// Create Cookies
	UTILS_CreateCookie("Username", Username, MainData.CookieValidity);
	UTILS_CreateCookie("RememberPass", RememberPass, MainData.CookieValidity);

	if (RememberPass)
		UTILS_CreateCookie("Passwd", Passwd, MainData.CookieValidity);
	else
		UTILS_DeleteCookie("Passwd");
}


/**
* Make logout 
*
* @return none
* @public
*/
function LOGIN_Logout()
{
	var XMPP = "";
	// Setting structure as disconnected
	MainData.ConnectionStatus = -1;

	// Logout from jabber
	XMPP += MESSAGE_Unavailable();
	XMPP += MESSAGE_EndConnection();
	CONNECTION_SendJabber(XMPP);

	//Stop game count timer of current game 
	if(MainData.CurrentGame != null)
	{
		MainData.CurrentGame.Game.StopTimer();
	}

	INTERFACE_StopInterface();

	delete MainData;

	// Show Login interface
	//INTERFACE_StartLogin(Lang);
	START_StartPage();
}


function LOGIN_LeavePage()
{
	var XMPP = "";
	XMPP += MESSAGE_Unavailable();
	XMPP += MESSAGE_EndConnection();
	CONNECTION_SendJabber(XMPP);
}

/**
* Make logout 
*
* @return none
* @public
*/
function LOGIN_Disconnected()
{
	// Setting structure as disconnected
	MainData.ConnectionStatus = -1;

	INTERFACE_StopInterface();
}

/**
* Clear Login window and start interface 
*
* @return none
* @public
*/
function LOGIN_EndLogin()
{
	INTERFACE_EndLogin();

	// Remove auto vertical align middle to login
	document.body.removeAttribute("onresize");
}


/**
* Clear Login window and start interface 
*
* @return none
* @public
*/
function LOGIN_Interface()
{
	var All = INTERFACE_CreateInterface();

	// Close load image
	LOGIN_EndLoad();

	// Open XadrezLivre game environment
	INTERFACE_ShowInterface(All);
	
	// Create contact object and set values
	CONTACT_StartContact();
	CONTACT_LoadUserContactList();	

	// Create challenge menu object
	CHALLENGE_StartChallenge();
}


/**
* Show a error message on login
*
* @return none
* @public
*/
function LOGIN_LoginFailed(Code)
{
	var ErrorLabel = document.getElementById("ErrorLabel");

	// if login window is closed, then do nothing
	if(ErrorLabel == null)
	{
		return;
	}

	switch (Code)
	{
		case (MainData.Const.LOGIN_ServerDown):
			ErrorLabel.innerHTML = UTILS_GetText("login_server_down");
			break;

		case (MainData.Const.LOGIN_ConnectionRefused):
			ErrorLabel.innerHTML = UTILS_GetText("login_connection_refused");
			break;

		case (MainData.Const.LOGIN_InvalidUser):
			ErrorLabel.innerHTML = UTILS_GetText("login_invalid_user");
			break;
		case (MainData.Const.LOGIN_BannedUser):
			ErrorLabel.innerHTML = UTILS_GetText("login_banned_user");
			break;
	}
}
