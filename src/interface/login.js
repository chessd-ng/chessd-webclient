import {
	UTILS_GetText,
	UTILS_Capitalize,
	UTILS_CreateElement,
	UTILS_OpenXMLFile,
	UTILS_GetNodeText,
	UTILS_ReturnEvent,
	UTILS_AddListener,
	UTILS_ReadCookie,
} from 'utils/utils.js';
import { START_ChangeLanguage } from 'index.js';
import { LOGIN_Login } from 'login/login.js';

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
* @file		interface/login.js
* @brief	Shows login screen to user
*/

import { MainData } from 'index.js';
import { LanguageNames } from 'langs';

import banner_login_gif from "images/login/banner_login.gif";

/**
* @brief	Create login page elements and show to user
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function INTERFACE_StartLogin(Lang)
{
	var LoginBoxDiv, LoginTextBoxDiv, LoginFormBoxDiv;
	var Title, TitleEnd, Text, Link, Text2, Text3, Banner, Version;
	var LoginLabel, PasswdLabel, InputLogin, InputPasswd, InputSubmit, CheckBox, CheckBoxLabel, ErrorLabel, SignIn;
	var LoginMessage;
	var ConfTmp;

	var ev; //Temp event

	var Table = document.createElement('table');
	var Tr = document.createElement('tr');
	var Td = document.createElement('td');
	var Br = document.createElement('br');
	
	var MainDiv;
	
	MainDiv = document.getElementById("MainDiv");
	
	if(MainDiv != null)
	{
		MainDiv.parentNode.removeChild(MainDiv);
	}
	else
	{
		MainDiv = UTILS_CreateElement('div','MainDiv');
	}

	//Internet Explorer Table
	var TBody = document.createElement('tbody');

	// Creating elements
	LoginBoxDiv = UTILS_CreateElement("div", "LoginDiv");
	LoginTextBoxDiv = UTILS_CreateElement("div", "TextDiv");
	LoginFormBoxDiv = UTILS_CreateElement("div", "FormDiv");
	Title = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_title"));
	TitleEnd = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_footer"));
	Text = UTILS_CreateElement("p", null, null, UTILS_GetText("login_text1"));
	Text2 = UTILS_CreateElement("p", null, null, UTILS_GetText("login_text2"));
	Text3 = UTILS_CreateElement("p", null, null, UTILS_GetText("login_text3"));
	Link = UTILS_CreateElement("a", null, "link", "http://xadrezlivre.c3sl.ufpr.br/projeto");
	Link.href = "http://xadrezlivre.c3sl.ufpr.br/projeto";

	Version = UTILS_CreateElement("p", "version", null, MainData.GetVersion());
	
	LoginLabel = UTILS_CreateElement("span", null, "Label", UTILS_GetText("login_user")+":");
	PasswdLabel = UTILS_CreateElement("span", null, "Label", UTILS_GetText("login_passwd")+":");
	LoginMessage = UTILS_CreateElement("span","LoginMessage");
	LoginMessage.style.display = "none";
	InputLogin = UTILS_CreateElement("input", "login");
	InputPasswd = UTILS_CreateElement("input", "password");
	InputSubmit = UTILS_CreateElement("input", "login_button", "entrar");
	CheckBox = UTILS_CreateElement("input", "checkbox", "checkbox");

	//Setting elements attributes
	InputLogin.type = "text";
	InputPasswd.type = "password";

	InputLogin.value = UTILS_ReadCookie("Username");
	InputPasswd.value = UTILS_ReadCookie("Passwd");

	InputSubmit.type = "submit";
	InputSubmit.value = "";

	CheckBox.type = "checkbox";
	CheckBoxLabel = UTILS_CreateElement("label", null, null, UTILS_GetText("login_remember_pass"));
	ErrorLabel = UTILS_CreateElement("span", "ErrorLabel", "error_label");
	SignIn = UTILS_CreateElement("a", null, null, UTILS_GetText("login_signin"));
	Banner = UTILS_CreateElement("img", "BannerLogin");
	Banner.src = banner_login_gif;

	// Check for cookies of username and password
	if (UTILS_ReadCookie("RememberPass") == "true")
	{
		CheckBox.checked = true;
	}

	// Key events to start authentication
	UTILS_AddListener(InputSubmit, "click", function() { LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); } , false);

	UTILS_AddListener(InputLogin, "keypress", function(event) { ev = UTILS_ReturnEvent(event); if (ev.keyCode == 13) LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); }, false);

	UTILS_AddListener(InputPasswd, "keypress", function(event) { ev = UTILS_ReturnEvent(event); if (ev.keyCode == 13) LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); }, false);

	UTILS_AddListener(SignIn, "click", function() { window.location.href="register.html?lang="+Lang+".xml"})
	
	// Creating tree
	LoginTextBoxDiv.appendChild(Title);
	LoginTextBoxDiv.appendChild(Text);
	Text2.appendChild(Link);
	LoginTextBoxDiv.appendChild(Text2);
	LoginTextBoxDiv.appendChild(Text3);
	LoginTextBoxDiv.appendChild(TitleEnd);

	// Creating tree
	Td.appendChild(LoginLabel);
	Tr.appendChild(Td);
	Td = document.createElement('td');
	Td.appendChild(InputLogin);
	Tr.appendChild(Td);
	TBody.appendChild(Tr);

	Tr = document.createElement('tr');
	Td = document.createElement('td');
	Td.appendChild(PasswdLabel);
	Tr.appendChild(Td);
	Td = document.createElement('td');
	Td.appendChild(InputPasswd);
	Td.appendChild(Br);
	Td.appendChild(CheckBox);
	Td.appendChild(CheckBoxLabel);
	Tr.appendChild(Td);
	TBody.appendChild(Tr);

	Table.appendChild(TBody);

	Br = document.createElement('br');
	LoginFormBoxDiv.appendChild(Table);
	LoginFormBoxDiv.appendChild(InputSubmit);
	LoginFormBoxDiv.appendChild(Br);
	LoginFormBoxDiv.appendChild(LoginMessage);
	LoginFormBoxDiv.appendChild(ErrorLabel);
	LoginFormBoxDiv.appendChild(SignIn);

	LoginBoxDiv.appendChild(LoginTextBoxDiv);
	LoginBoxDiv.appendChild(LoginFormBoxDiv);

	MainDiv.appendChild(INTERFACE_CreateLanguage());
	MainDiv.appendChild(LoginBoxDiv);
	MainDiv.appendChild(Banner);

	document.body.appendChild(MainDiv);

	// Show webclient version
	document.body.appendChild(Version);

	document.title = UTILS_GetText("general_title");

	// Block context menu
	document.oncontextmenu = function() { return false; };

	// Set vertical align middle to MainDiv when resize window
	document.body.setAttribute("onresize", "INTERFACE_LoginVerticalAlignMiddle()");
	// Align main div in the center
	INTERFACE_LoginVerticalAlignMiddle();
	
	// Focus to login input
	InputLogin.focus()
}

/**
* @brief	Remove login screen
*
* @return	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function INTERFACE_EndLogin()
{
	var Div = document.getElementById("LoginDiv");
	var Banner = document.getElementById("BannerLogin");
	var Lang = document.getElementById("LangDiv");
	var Version = document.getElementById("version");

	// If login div is on screen
	if (Div)
	{
		Div.parentNode.removeChild(Div);
	}

	if (Banner)
	{
		Banner.parentNode.removeChild(Banner);
	}

	if (Lang)
	{
		Lang.parentNode.removeChild(Lang);
	}

	if (Version)
	{
		Version.parentNode.removeChild(Version);
	}
}

/**
* @brief	Remove login screen
*
* @return	Language HTML DOM Div element with languages tag
*/
function INTERFACE_CreateLanguage()
{
	var DivLang = UTILS_CreateElement("div","LangDiv");
	var Ul = UTILS_CreateElement("ul","LangUl");
	var i;

	var Languages = UTILS_OpenXMLFile(LanguageNames);
	var Langs = Languages.getElementsByTagName("lang");

	for(i=0; i<Langs.length; i++)
	{
		Ul.appendChild(INTERFACE_CreateLangItem(UTILS_GetNodeText(Langs[i]), Langs[i].getAttribute("name")));
	}

	DivLang.appendChild(Ul);

	return DivLang;
}

/**
* @brief	Create language links
*
* @param	Lang	Language (i.e.: en_US, pt_BR, zh_CN,...)
* @param	Name	Language word
* @return	HTML DOM List element with languages
*/
function INTERFACE_CreateLangItem(Lang, Name)
{
	var Li = UTILS_CreateElement("li");
	var Item = UTILS_CreateElement("span");

	Item.innerHTML = UTILS_Capitalize(Name);
	Li.appendChild(Item);
	
	Li.onclick = function(){
		START_ChangeLanguage(Lang);
	}

	return Li;
}


/**
* @brief	Align login main div in vertical middle
*
* @return	none
* @author	Rubens Suguimoto
*/

function INTERFACE_LoginVerticalAlignMiddle()
{
        var MainDiv = document.getElementById("MainDiv");

        var WindowHeight = window.innerHeight;

	MainDiv.style.position = "relative";
        if(WindowHeight > 600)
        {
                MainDiv.style.top = ((WindowHeight / 2) - 300) + "px";
        }
}

/**
* @brief	Disable input fields
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_LoginDisableInput()
{
	var UsernameBox = document.getElementById("login");
	var PassWBox = document.getElementById("password");
	var CheckBox = document.getElementById("checkbox");
	var OkButton = document.getElementById("login_button");

	UsernameBox.disabled = true;
	PassWBox.disabled = true;
	CheckBox.disabled = true;
	OkButton.disabled = true;
}

/**
* @brief	Enable input fields
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_LoginEnableInput()
{
	var UsernameBox = document.getElementById("login");
	var PassWBox = document.getElementById("password");
	var CheckBox = document.getElementById("checkbox");
	var OkButton = document.getElementById("login_button");

	UsernameBox.disabled = false;
	PassWBox.disabled = false;
	CheckBox.disabled = false;
	OkButton.disabled = false;
}

/**
* @brief	Remove error messages text
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_ClearError()
{	
	var ErrorLabel = document.getElementById("ErrorLabel");
	ErrorLabel.innerHTML = "";
}

/**
* @brief	Show authentication login status message
*
* @param	Msg	Login status message to show
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_ShowLoginMessage(Msg)
{
	var LoginMsg = document.getElementById("LoginMessage");
	if(Msg != null)
	{
		LoginMsg.innerHTML = Msg;
	}
	else
	{
		LoginMsg.innerHTML = "";
	}
	LoginMsg.style.display = "block";
}

/**
* @brief	Hide authentication login status message
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_HideLoginMessage()
{
	var LoginMsg = document.getElementById("LoginMessage");
	LoginMsg.style.display = "none";
}

/**
* @brief	Show error messages
*
* @return	Msg	Login error message to show
* @author	Rubens Suguimoto
*/
export function INTERFACE_ShowErrorMessage(Msg)
{
	var ErrorMsg = document.getElementById("ErrorLabel");

	if(ErrorMsg == null)
	{
		return false;
	}

	if(Msg != null)
	{
		ErrorMsg.innerHTML = Msg;
	}
	else
	{
		ErrorMsg.innerHTML = "";
	}

	ErrorMsg.style.display = "block";

	return true;
}

/**
* @brief	Hide error message
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideErrorMessage()
{
	var ErrorMsg = document.getElementById("ErrorLabel");

	ErrorMsg.style.display = "none";
}
