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
	Height = null; //auto

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

function WINDOW_Alert(Title,Text)
{
	// Return Div and Buttons;
	var Div = WINDOW_CreateAlert(Text);

	// Create New Window
	var WindowObj = WINDOW_NewWindow(300, Div.Div, Div.Buttons, Title);

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Confirm(Title, Text, Button1, Button2)
{
	// Return Div and Buttons;
	var Div = WINDOW_CreateConfirm(Text, Button1, Button2);

	// Create New Window
	var WindowObj = WINDOW_NewWindow(300, Div.Div, Div.Buttons, Title);

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Challenge(User, Rating, GameParameters, MatchId)
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowChallengeWindow(User, Rating, GameParameters, MatchId);
	var Title;

	if (GameParameters)
	{
		Title = UTILS_GetText('challenge_title_offer');
	}
	else
	{
		Title = UTILS_GetText('challenge_title_invite');
	}

	// Create New Window
	var WindowObj = WINDOW_NewWindow(350, Div.Div, Div.Buttons, Title);

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
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('room_create_room'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Create Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_CancelRoom()
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowCancelRoomWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(300, Div.Div, Div.Buttons, UTILS_GetText('room_cancel_room'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Yes Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// No Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Invite(User)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowInviteWindow(User);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(310, Div.Div, Div.Buttons, UTILS_GetText('contact_invite'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Auth Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Decline Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_SearchUser()
{
	// If another search user window is opened, return
	if (document.getElementById("SearchUserDiv"))
		return;

	//Return Div and Buttons;
	var Div = INTERFACE_ShowSearchUserWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('contact_search_user'));

	// Focus search input
	document.getElementById('SearchUserInput').focus();

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Search Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_SearchUserResult(UserList)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowSearchUserResultWindow(UserList);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('contact_search_user'));

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Add Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_Profile(Profile)
{
	//Return Div, Buttons and Elements;
	var Div = INTERFACE_ShowProfileWindow(Profile);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(380, Div.Div, Div.Buttons, UTILS_GetText('profile_window'));
	var Elements = Div.Elements;

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); PROFILE_RemoveProfile(Profile.User)}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj); PROFILE_RemoveProfile(Profile.User)}, false);

	if (Div.Buttons.length > 1)
	{
		// Save Profile Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj); PROFILE_RemoveProfile(Profile.User)}, false);
	}

	return Elements;
}

function WINDOW_ProfileConfirm(Profile)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowProfileConfirmWindow(Profile);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(380, Div.Div, Div.Buttons, UTILS_GetText('profile_confirm_close'));

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Discard Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Save Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[3],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_ProfileImage()
{
	//Return Div and Buttons;
	var Div = WINDOW_CreateImageSend();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(380, Div.Div, Div.Buttons, UTILS_GetText('profile_change_image_title'));

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_OldGame(Id)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowOldGameWindow(Id);

	if (document.getElementById("OldGamesDiv"))
		return;

	//Create New Window
	var WindowObj = WINDOW_NewWindow(520, Div.Div, Div.Buttons, UTILS_GetText('oldgame_title'));
	var Elements = Div.Elements;

	// Focus input player 1
//	document.getElementById('OldGameInput1').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); OLDGAME_CloseWindow(Id); }, false);
	// Search Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){}, false);
	// NewSearch Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){}, false);

	return Elements;
}

function WINDOW_OldGameSearch()
{
	if(document.getElementById("OldGameSearchDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_ShowOldGameSearchWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(250, Div.Div, Div.Buttons, UTILS_GetText('oldgame_title'));

	// Focus input player 1
	document.getElementById('OldGameInput1').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Ok Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

function WINDOW_OldGameResult(GameList)
{
	//Return Div and Buttons;
	var Div = INTERFACE_ShowOldGameResultWindow(GameList);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(380, Div.Div, Div.Buttons, UTILS_GetText('oldgame_title'));
	
	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}
