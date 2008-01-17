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
	PARSER_Logout(MainData.Username);

	INTERFACE_StopInterface();

	// TODO recolocar a msg bonitinha =)
	//alert("Obrigado por usar o ChessD!!!");

	// Show Login interface
	INTERFACE_StartLogin();
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
	INTERFACE_StartInterface();
}


/**
* Show a error message on login
*
* @return none
* @public
*/
function LOGIN_LoginFailed(num)
{
	switch(num)
	{
		case(1):
			document.getElementById("ErrorLabel").innerHTML = "Usuário ou Senha inválidos";
			break;
		case(2):
			document.getElementById("ErrorLabel").innerHTML = "Servidor fora do ar";
			break;
	}
}
