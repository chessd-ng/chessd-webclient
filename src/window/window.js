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
* @file		window/window.js
* @brief	Control Windows
*/


/**
* @brief	Create new window element
*
* Window Object is defined in interface/windows.js
*
* @param	WinSize 	Window width
* @param	Div		Window content div
* @param	DivButtons	Window content buttons
* @param	Title		Window Title
* @param	Top		Window top position
* @param	Left		Window left position
* @return	Window object
* @author	Rubens Suguimoto
*/
function WINDOW_NewWindow(WinSize, Div, DivButtons, Title, Top, Left)
{
	var Height, Width;
	var Win;
	var CurrentWindow;
	
	var zIndex = MainData.GetWindowListLength();
	Width = WinSize;
	Height = null; //auto

	// Create Window Object
	Win = new WindowObj(Height, Width, Div, Title);

	// Window Focus Event
	UTILS_AddListener(Win.window ,"mousedown", function(){ WINDOW_Focus(Win)},false);

	// Show Windows on browser
	// param: Parent Node, Top in pixels, Left in pixels
	Win.show(null,Top,Left);

	// Remove focus from current window, if exists
	CurrentWindow = MainData.GetWindowFocus();
	if(CurrentWindow != null)
	{
		CurrentWindow.blur();
	}

	// Set focus on Browser
	Win.focus();
	Win.setZIndex(zIndex);

	// Add content buttons in event buttons list
	// This struct is used to access window content buttons
	Win.pushEventButtons(DivButtons);

	// Add Window on WindowList 
	MainData.AddWindow(Win);

	return Win; // WindowObj
}

/**
* @brief	Set focus to some window
*
* @param	WindowObj	Window object
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_Focus(WindowObj)
{
	var zIndex = WindowObj.getZIndex();
	var i;
	var WindowTmp;
	var CurrentWindow = MainData.GetWindowFocus();

	// Remove focus from current window
	if(CurrentWindow != null)
	{
		CurrentWindow.blur();
	}

	// Set focus to new window
	MainData.SetWindowFocus(WindowObj);
	WindowObj.focus();

	for(i=0; i<MainData.GetWindowListLength(); i++)
	{
		WindowTmp = MainData.GetWindow(i);
		if(WindowTmp.getZIndex() > zIndex)
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	
	// Change layer position
	WindowObj.setZIndex(i-1);
}

/**
* @brief	Remove window
*
* @param	WindowObj	Window Object
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_RemoveWindow(WindowObj)
{
	var i;
	var WindowTmp;

	MainData.RemoveWindow(WindowObj);

	// Reset zIndex of others windows
	for(i=0; i<MainData.GetWindowListLength(); i++)
	{
		WindowTmp = MainData.GetWindow(i);
		if(WindowTmp.getZIndex() > WindowObj.getZIndex())
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	WindowObj.close();
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

/**
* @brief	Open Alert window
*
* @param	Title		Window title
* @param	Text		Window text
* @return 	none
* @author	Danilo Yorinori
*/
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

/**
* @brief	Open Confirm Window
*
* @param	Title		Window title
* @param	Text		Window text
* @param	Button1		First button action
* @param	Button2		Second button action
* @return	none
* @author	Danilo Yorinori
*/
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

/**
* @brief	Open Challenge window
*
* @param	User		User's name
* @param	RatingObj	Rating object with all ratings
* @param	GameParameters	Challenge parameters
* @param	Rated		Rated game flag
* @param	MatchId		Challenge identification number
* @return	none
* @author	Danilo Yorinori
*/
function WINDOW_Challenge(User, RatingObj, GameParameters, Rated, MatchId)
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowChallengeWindow(User, RatingObj, GameParameters, Rated, MatchId);
	var Title;

	// Change window's title depend on GameParameters presence, which denotes making a invitation or be invited to play a game
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

	// Add Window Object in challenge's list
	MainData.AddChallengeWindow(MatchId, WindowObj);

	// Set button's actions
	// If you receive a challenge
	if (GameParameters != null)
	{
		// Close Button (X)
		UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ CHALLENGE_DeclineChallenge(MatchId); }, false);
		// Accept Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// NewParameters Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// Chat Button
		UTILS_AddListener(WindowObj.eventButtons[3],"click", function(){ CHAT_OpenChat(User); }, false);

		// Decline Button
		UTILS_AddListener(WindowObj.eventButtons[4],"click", function(){ CHALLENGE_DeclineChallenge(MatchId); WINDOW_RemoveWindow(WindowObj);}, false);
	}
	// If you are the challenger
	else
	{
		// Close Button (X)
		UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
		// Invite Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

		// Cancel Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	}
}

/**
* @brief	Open Create Room window
*
* @return	none
* @author	Danilo Yorinori
*/
function WINDOW_CreateRoom()
{
	// If another create room window is opened, exit function
	if (document.getElementById("CreateRoomDiv"))
		return;

	//Return Div and Buttons;
	var Div = INTERFACE_ShowCreateRoomWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(200, Div.Div, Div.Buttons, UTILS_GetText('room_create_room'));

	// Focus room name input
	var Input = document.getElementById('CreateRoomInputName');
	Input.focus();

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Create Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", 
		function() { 
				if (Input.value == '' || Input.value == null)
					return;
				else
					 WINDOW_RemoveWindow(WindowObj);
	}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Input - Close window if input value isn't a null or empty string
	UTILS_AddListener(WindowObj.eventButtons[3],"keypress", 
		function(event) { 
			if(event.keyCode == 13 ) {
				if (Input.value == '' || Input.value == null)
					return;
				else
					 WINDOW_RemoveWindow(WindowObj);
			} 
	}, false);
}

/**
* Open Cancel Room window
*
* @author Danilo
*/
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

/**
* @brief	Open Invite User window
*
* @param	User	User's name
* @return	none
* @author	Danilo Yorinori
*/
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

/**
* @brief	Open Search User window
*
* @return	none
* @author	Danilo Yorinori
*/
function WINDOW_SearchUser()
{
	// If another search user window is opened, do nothing
	if (document.getElementById("SearchUserDiv"))
	{
		return;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_ShowSearchUserWindow();
	var Elements = Div.Elements;

	//Create New Window
	var WindowObj = WINDOW_NewWindow(350, Div.Div, Div.Buttons, UTILS_GetText('contact_search_user'));

	// Focus search input
	document.getElementById('SearchUserInput').focus();

	//Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ MainData.RemoveSearchUserInfo(); WINDOW_RemoveWindow(WindowObj);}, false);

	// Search Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ MainData.AddSearchUserInfo(Elements); }, false);

	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ MainData.RemoveSearchUserInfo(); WINDOW_RemoveWindow(WindowObj);}, false);
}

/**
* @brief	Open Profile window
*
* @return	Elements	Profile's HTML DOM elements array
* @author	Danilo Yorinori
*/
function WINDOW_Profile(Profile)
{
	//Return Div, Buttons and Elements;
	var Div = INTERFACE_ShowProfileWindow(Profile);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(400, Div.Div, Div.Buttons, UTILS_GetText('profile_window'));
	var Elements = Div.Elements;

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); PROFILE_RemoveProfile(Profile.User)}, false);

	// If Profile window isn't User's profile
	if (Div.Buttons.length < 2)
	{
		// Close Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj); PROFILE_RemoveProfile(Profile.User)}, false);
	}
	// If Profile window is User's profile
	else
	{
		// Close Button
		UTILS_AddListener(WindowObj.eventButtons[1],"click", 
			function(){
		 		// If Close confirm window is closed	
				if (!Elements.GetClose())
				{
					if (Elements.Desc.value.length <= 200) 
					{
						// If any change occurs, open Close Confirm window
						if (PROFILE_ChangeVerification(Elements) == true) 
						{
							Elements.SetClose(true);
							Elements.SetButtonsUnavailable();
							WINDOW_ProfileConfirm(WindowObj, Profile, Elements);
						}
						else // Close profile window
						{
							WINDOW_RemoveWindow(WindowObj); 
							PROFILE_RemoveProfile(Profile.User)
						}
					}
				}
			}, false);

		// Save Profile Button
		UTILS_AddListener(WindowObj.eventButtons[2],"click", 
			function(){ 
		 		// If Close confirm window is closed	
				if (!Elements.GetClose())
				{
					// Save profile changes and close window
					if (Elements.Desc.value.length <= 200) {
						PROFILE_SaveMyProfile();
						WINDOW_RemoveWindow(WindowObj); 
						PROFILE_RemoveProfile(Profile.User);
					}
				}
			}, false);
	}

	return Elements;
}

/**
* @brief	Open Profile Close Confirmation window
*
* Open if any changes occurs in user's profile
* 
*
* @param	WinObj		Paraent window object
* @param	Profile		Profile window confirm content
* @param	Elements	HTML DOM elements array
* @return	none
* @author	Danilo Yorinori
*/
function WINDOW_ProfileConfirm(WinObj, Profile, Elements)
{
	// TODO -> EXPLAIN BETTER THIS PARAMETERS
	//Return Div and Buttons;
	var Div = INTERFACE_ShowProfileConfirmWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(380, Div.Div, Div.Buttons, UTILS_GetText('profile_confirm_close'));

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Discard Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ PROFILE_RemoveProfile(Profile.User); WINDOW_RemoveWindow(WinObj); WINDOW_RemoveWindow(WindowObj);}, false);

	// Save Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ PROFILE_RemoveProfile(Profile.User) ;WINDOW_RemoveWindow(WinObj); WINDOW_RemoveWindow(WindowObj);}, false);

	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[3],"click", function(){ Elements.SetButtonsAvailable(); Elements.SetClose(false); WINDOW_RemoveWindow(WindowObj);}, false);
}

/**
* @brief	Open change profile image
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Open Oldgame window
*
* @param	Id	Window's Id (in case of more than one oldgame windows are opened)
* @return	Elements	Oldgame window's HTML DOM elements
* @author	Danilo Yorinori
*/
function WINDOW_OldGame(Id)
{
	// Verify if exist old game window opened
	if (document.getElementById("OldGamesDiv"))
	{
		return false;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_ShowOldGameWindow(Id);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(520, Div.Div, Div.Buttons, UTILS_GetText('oldgame_title'),35);
	var Elements = Div.Elements;
	Elements.WindowObj = WindowObj;

	// Focus input player 1 - TODO expand this if more than one old game search window could be opened
	document.getElementById('OldGameInput1').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); OLDGAME_CloseWindow(Id); }, false);
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj); OLDGAME_CloseWindow(Id); }, false);

	return Elements;
}

/*
* @brief	Open unban user window
*
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_UnbanUser()
{
	if(document.getElementById("UnbanDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_UnbanUserWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(180, Div.Div, Div.Buttons, "Unban User");

	// Focus input player 1
	document.getElementById('UnbanInput').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Unban Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open ban user window
*
* @param	Username	User's name
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_BanUser(Username)
{
	if(document.getElementById("BanDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_BanUserWindow(Username);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(150, Div.Div, Div.Buttons, "Ban "+Username);

	// Focus input player 1
	document.getElementById('BanInput').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Unban Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open kick user window
*
* @param	Username	User's name
* @author	Rubens Suguimoto
*/
function WINDOW_KickUser(Username)
{
	if(document.getElementById("BanDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Buttons;
	var Div = INTERFACE_KickUserWindow(Username);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(150, Div.Div, Div.Buttons, "Kick "+Username);

	// Focus input player 1
	document.getElementById('KickInput').focus();

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Unban Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open admin window
*
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_AdminWindow()
{
	if(document.getElementById("AdminDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Button
	var Div = INTERFACE_CreateAdminWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(250, Div.Div, Div.Buttons, "Admin Tools");

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open a send announce window 
* 
* @param	Username	User's name
* @param	Rating		User's rating
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_AnnounceWindow(Username, Rating)
{
	if(document.getElementById("AnnounceDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Button
	var Div = INTERFACE_AnnounceWindow(Username, Rating);

	//Create New Window
	var WindowObj = WINDOW_NewWindow(320, Div.Div, Div.Buttons, UTILS_GetText("announce_title"));

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Announce Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open Help window
*
* @return 	none
* @author	Danilo Yorinori
*/
function WINDOW_Help()
{
	if(document.getElementById("HelpDiv")!=null)
	{
		// Do nothing
		return;
	}

	//Return Div and Button
	var Div = INTERFACE_HelpWindow();

	//Create New Window
	var WindowObj = WINDOW_NewWindow(500, Div.Div, Div.Buttons, UTILS_GetText("help_title"));

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open a continue postponed game 
*
* @param	User		User's name
* @param	RatingObj	User's rating object
* @param	GameParameters	Postponed game parameters
* @param	Rated		Game rated flag
* @param	MatchId		Postponed game identification number
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_Postpone(User, RatingObj, GameParameters, Rated, MatchId)
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowPostponeWindow(User, RatingObj, GameParameters, Rated, MatchId);
	var Title;

	Title = UTILS_GetText('postpone_title_offer');

	// Create New Window
	var WindowObj = WINDOW_NewWindow(350, Div.Div, Div.Buttons, Title);

	// Add Window Object in challenge's list
	MainData.AddChallengeWindow(MatchId, WindowObj);

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ CHALLENGE_DeclineChallenge(MatchId); }, false);
	// Accept Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
	// Chat Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ return false;}, false);
	// Decline Button
	UTILS_AddListener(WindowObj.eventButtons[3],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}

/*
* @brief	Open Create Tourney window
*
* @return	none
* @author	Danilo Yorinori
*/
function WINDOW_CreateTourney()
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowCreateTourneyWindow();
	var Title;
	var Elements;

	Title = UTILS_GetText('tourney_create');

	// Create New Window
	var WindowObj = WINDOW_NewWindow(400, Div.Div, Div.Buttons, Title);
	Elements = Div.Elements;

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); }, false);
	
	// Create Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ /*WINDOW_RemoveWindow(WindowObj);*/}, false);

	// Cancel Button
	UTILS_AddListener(WindowObj.eventButtons[2],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);

	return Elements;
}

/*
* @brief	Open Admin tools window
*
* @return	none
* @author	Rubens Suguimoto
*/
function WINDOW_CreateAdminCenter()
{
	// Return Div and Buttons;
	var Div = INTERFACE_ShowCreateAdminCenterWindow();
	var Title;

	//Title = UTILS_GetText('tourney_create');
	Title = "Administracao";

	// Create New Window
	var WindowObj = WINDOW_NewWindow(600, Div.Div, Div.Buttons, Title);

	// Close Button (X)
	UTILS_AddListener(WindowObj.eventButtons[0],"click", function(){ WINDOW_RemoveWindow(WindowObj); }, false);
	
	// Close Button
	UTILS_AddListener(WindowObj.eventButtons[1],"click", function(){ WINDOW_RemoveWindow(WindowObj);}, false);
}
