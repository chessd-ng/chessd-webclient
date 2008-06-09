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
* @file admin.js
* @brief Create window content to show admin options
*
* Create window contents to admins for ban, kick, unban, etc.
*/

/**
 * @brief Create temporary unban window content
 *
 * Create temporary unban window content with a input user name who will be unbaned.
 *
 * @author 	Rubens Suguimoto
 * @see 	WINDOW_UnbanUser
 */
function INTERFACE_UnbanUserWindow()
{
	var Div;
	var Buttons = new Array();
	var Elements = new Object();

	var Input;

	var ButtonsDiv;
	var UnbanButton, CancelButton;


	Div = UTILS_CreateElement("div","UnbanDiv");

	ButtonsDiv = UTILS_CreateElement("div","ButtonsDiv");

	Input = UTILS_CreateElement("input","UnbanInput");

	UnbanButton = UTILS_CreateElement("input",null,"button");
	UnbanButton.type = "button";
	UnbanButton.value= "Unban";
	UTILS_AddListener(UnbanButton,"click", function(){
		ADMIN_UnbanUser(Input.value);
	}, false);

	CancelButton = UTILS_CreateElement("input",null,"button");
	CancelButton.type = "button";
	CancelButton.value = "Cancel";

	Buttons.push(UnbanButton);
	Buttons.push(CancelButton);

	ButtonsDiv.appendChild(UnbanButton);
	ButtonsDiv.appendChild(CancelButton);

	Div.appendChild(Input);
	Div.appendChild(ButtonsDiv);

	Elements.Input = Input;
	Elements.UnbanButton = UnbanButton;
	Elements.CancelButton = CancelButton;

	return{Div:Div, Buttons:Buttons, Elements:Elements}
}
