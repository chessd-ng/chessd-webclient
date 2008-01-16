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
* Shows login screen to user
*/

INTERFACE_StartLogin();


/**
* Create elements and show login screen to user
*
* @return void
* @public
*/
function INTERFACE_StartLogin()
{
	var LoginBoxDiv, LoginTextBoxDiv, LoginFormBoxDiv;
	var Title, TitleEnd, Text, Banner, Version;
	var LoginLabel, PasswdLabel, InputLogin, InputPasswd, InputSubmit, CheckBox, CheckBoxLabel, ErrorLabel, SignIn;

	var Table = document.createElement('table');
	var Tr = document.createElement('tr');
	var Td = document.createElement('td');
	var Br = document.createElement('br');


	// Read xml config files
	DATA_ReadParams();

	// Creating elements and setting properties
	LoginBoxDiv = UTILS_CreateElement("div", "LoginDiv");
	LoginTextBoxDiv = UTILS_CreateElement("div", "TextDiv");
	LoginFormBoxDiv = UTILS_CreateElement("div", "FormDiv");
	Title = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_title"));
	TitleEnd = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_footer"));
	Text = UTILS_CreateElement("p", null, null, UTILS_GetText("login_text"));
	Version = UTILS_CreateElement("p", "version", null, MainData.Version);
	LoginLabel = UTILS_CreateElement("span", null, "Label", UTILS_GetText("login_user")+":");
	PasswdLabel = UTILS_CreateElement("span", null, "Label", UTILS_GetText("login_passwd")+":");
	InputLogin = UTILS_CreateElement("input", "login");
	InputPasswd = UTILS_CreateElement("input", "password");
	InputSubmit = UTILS_CreateElement("input", null, "entrar");
	CheckBox = UTILS_CreateElement("input", null, "checkbox");
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
	Banner.src = "images/banner_login.gif";

	if (UTILS_ReadCookie("RememberPass") == "true")
		CheckBox.checked = true;

	// Event listeners
	InputSubmit.onclick = function() { LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); };
	InputLogin.onkeypress = function(event) { if (event.keyCode == 13) LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); };
	InputPasswd.onkeypress = function(event) { if (event.keyCode == 13) LOGIN_Login(InputLogin.value,InputPasswd.value,CheckBox.checked); };
	SignIn.onclick = function() { window.open("cadastro.html","", "height=300,width=350,left=100,top=100,menubar=0,location=0,resizable=0,scrollbars=0"); };

	// Creating tree
	LoginTextBoxDiv.appendChild(Title);
	LoginTextBoxDiv.appendChild(Text);
	LoginTextBoxDiv.appendChild(TitleEnd);

	// Creating tree
	Td.appendChild(LoginLabel);
	Tr.appendChild(Td);
	Td = document.createElement('td');
	Td.appendChild(InputLogin);
	Tr.appendChild(Td);
	Table.appendChild(Tr);

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
	Table.appendChild(Tr);

	Br = document.createElement('br');
	LoginFormBoxDiv.appendChild(Table);
	LoginFormBoxDiv.appendChild(InputSubmit);
	LoginFormBoxDiv.appendChild(Br);
	LoginFormBoxDiv.appendChild(ErrorLabel);
	LoginFormBoxDiv.appendChild(SignIn);

	LoginBoxDiv.appendChild(LoginTextBoxDiv);
	LoginBoxDiv.appendChild(LoginFormBoxDiv);

	document.body.appendChild(LoginBoxDiv);
	document.body.appendChild(Banner);
	document.body.appendChild(Version);

	// Setting document title
	document.title = UTILS_GetText("general_title");

	// Focus to login input
	InputLogin.focus()

	// Block context menu
	document.oncontextmenu = function() { return false; };
}
