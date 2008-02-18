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
* Control Windows
*/

//Window Object is defined in interface/windows.js

/**
* 
*/
function WINDOW_NewWindow(WinSize, Div, DivButtons, Title)
{
	var Height, Width;
	var Win;

	var zIndex = MainData.Windows.WindowList.length;

	Width = WinSize;
	Height = ""; //auto

	// Create Window Object
	Win = new WindowObj(Height, Width, Div, Title);

	// Window Focus Event
	UTILS_AddListener(Win.window ,"mousedown", function(){ WINDOW_ChangeFocus(Win)},false);

	//Show Windows on browser
	Win.show();

	if(MainData.Windows.Focus != null)
	{
		MainData.Windows.Focus.blur();
	}

	// Set focus on Browser
	Win.focus();
	Win.setZIndex(zIndex);

	Win.pushEventButtons(DivButtons);

	// Add Window on WindowList 
	MainData.AddWindow(Win);

	return Win; // WindowObj
}

function WINDOW_ChangeFocus(WindowObj)
{
	var zIndex = WindowObj.getZIndex();
	var i;
	var WindowTmp;

	MainData.Windows.Focus.blur();

	MainData.ChangeWindowFocus(WindowObj);
	WindowObj.focus();

	for(i=0; i<MainData.Windows.WindowList.length; i++)
	{
		WindowTmp = MainData.Windows.WindowList[i];
		if(WindowTmp.getZIndex() > zIndex)
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	WindowObj.setZIndex(i-1);

}

function WINDOW_RemoveWindow(WindowObj)
{
	var i;
	var WindowTmp;

	MainData.RemoveWindow(WindowObj);

	// Reset zIndex of others windows
	for(i=0; i<MainData.Windows.WindowList.length; i++)
	{
		WindowTmp = MainData.Windows.WindowList[i]
		if(WindowTmp.getZIndex() > WindowObj.getZIndex())
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	WindowObj.close();
}

/*************************************************
**************************************************
**************************************************
*************************************************/

function WINDOW_Alert(str)
{
	// Return Div and Buttons;
	var Div = WINDOW_CreateAlert(str);

	// Create New Window
	var WindowObj = WINDOW_NewWindow(300, Div.Div, Div.Buttons, "Alert");

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Confirm(str)
{
	// Return Div and Buttons;
	var Div = WINDOW_CreateConfirm(str);

	// Create New Window
	var WindowObj = WINDOW_NewWindow(300, Div.Div, Div.Buttons, "Confirm");

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Challenge(User,GameParameters, MatchId)
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowChallengeWindow(User, GameParameters, MatchId);
	var Title;

	if (GameParameters)
	{
		Title = UTILS_GetText('challenge_title_invite');
	}
	else
	{
		Title = UTILS_GetText('challenge_title_offer');
	}

	// Create New Window
	var WindowObj = WINDOW_NewWindow(330, Div.Div, Div.Buttons, Title);

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

	// If you receive a challenge
	if (GameParameters != null)
	{
		// Accept Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// NewParameters Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// Chat Button
		UTILS_AddListener(WindowObj.eventButtons[3],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// Decline Button
		UTILS_AddListener(WindowObj.eventButtons[4],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	}
	// If you are the challenger
	else
	{
		// Invite Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

		// Cancel Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	}
}

function WINDOW_CreateRoom()
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowCreateRoomWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('room_create'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Create Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Invite(User)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowInviteWindow(User);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('contact_invite'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Auth Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Decline Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}
