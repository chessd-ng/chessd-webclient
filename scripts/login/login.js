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
		alert ("Invalid username");
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
	// Setting structure as disconnected
	MainData.ConnectionStatus = -1;

	// Logout from jabber
	CONNECTION_SendJabber(MESSAGE_EndConnection());

	//Stop game count timer of current game 
	if(MainData.CurrentGame != null)
	{
		MainData.CurrentGame.Game.StopTimer();
	}

	INTERFACE_StopInterface();

	// Show Login interface
	INTERFACE_StartLogin();
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

	LOGIN_EndLoad();
	INTERFACE_ShowInterface(All);
}


/**
* Show a error message on login
*
* @return none
* @public
*/
function LOGIN_LoginFailed(Code)
{
	var ErroLabel = document.getElementById("ErrorLabel");

	// if login window is closed, then do nothing
	if(ErroLabel == null)
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
	}
}
