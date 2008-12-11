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
 * @file 	challenge.js
 * @brief	Functions to parse challenges offered and receive.
 *
 * See interface challenge menu (scripts/interface/challengemenu.js), data
 * methods to challenge list (scripts/data/data.js) and window challenge
 * (scripts/window/window.js).
 */

/**
 * @brief	Handle challenge messages from server
 *
 * @param	XML	XML with challenge parameters
 * @return	Buffer with XMPP to send
 * @author	Ulysses Bomfim
 */
function CHALLENGE_HandleChallenge (XML)
{
	var Query = XML.getElementsByTagName("query");
	var Xmlns;
	var Buffer = "";

	// Getting query xmlns
	if (Query.length > 0)
	{
		Xmlns = Query[0].getAttribute("xmlns");
	}
	else 
	{
		return Buffer;
	}

	if (Xmlns.match(/\/chessd#match#offer/))
	{ 
		Buffer = CHALLENGE_HandleOffer(XML);
	}
	else if (Xmlns.match(/\/chessd#match#accept/))
	{
		Buffer = CHALLENGE_HandleAccept(XML);
	}
	else if (Xmlns.match(/\/chessd#match#decline/))
	{
		Buffer = CHALLENGE_HandleDecline(XML);
	}
	else if (Xmlns.match(/\/chessd#match#error/))
	{
		Buffer = CHALLENGE_ChallengeError(XML);
	}
		
	return Buffer;
}

/**
 * @brief	Handle errors challenge messages from server
 *
 * @param	XML	XML with challenge parameters
 * @return	Buffer with XMPP to send
 * @author	Rubens Suguimoto
 */
function CHALLENGE_HandleErrorChallenge (XML)
{
	var Query = XML.getElementsByTagName("query");
	var Xmlns;
	var Buffer = "";
	var ErrorTag;
	var ErrorType;

	// Getting query xmlns
	if (Query.length > 0)
	{
		Xmlns = Query[0].getAttribute("xmlns");
	}
	else 
	{
		return Buffer;
	}

	if (Xmlns.match(/\/chessd#match#offer/))
	{ 
		ErrorTag = XML.getElementsByTagName("error")[0];
		ErrorType = ErrorTag.getAttribute("type");

		switch(ErrorType)
		{
			case "modify":
				WINDOW_Alert(UTILS_GetText("challenge_error"),UTILS_GetText("challenge_offer_opponent_offline"));
				break;

			case "cancel":
				WINDOW_Alert(UTILS_GetText("challenge_error"),UTILS_GetText("challenge_offer_user_offline"))
				break;
		}
	}
	/*
	else if (Xmlns.match(/\/chessd#match#accept/))
	{
		Buffer = CHALLENGE_HandleAccept(XML);
	}
	else if (Xmlns.match(/\/chessd#match#decline/))
	{
		Buffer = CHALLENGE_HandleDecline(XML);
	}
	else if (Xmlns.match(/\/chessd#match#error/))
	{
		Buffer = CHALLENGE_HandleError(XML);
	}
	*/	

	Buffer = CHALLENGE_ChallengeError(XML);
	return Buffer;
}


/**
 * @brief	Parse challenge offered
 *
 * @param	XML	XML with challenge parameters
 * @return	Buffer	Buffer with XMPP to send
 * @author	Ulysses Bomfim
 */
function CHALLENGE_HandleOffer(XML)
{
	var Players, Match, MatchID, Category, Type, Rated;
	var RatingObj;
	var MatchTag;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	var ChallengeID;
	var ChallengeObj;
	var ChallengeMenu = MainData.GetChallengeMenu();
	var ChallengedPlayer;
	var Room, User;
	var MyUsername = MainData.GetUsername();
	var MatchType;

	ChallengeID = XML.getAttribute("id");
	Type = XML.getAttribute("type");
	
	if (Type == "error")
	{
		CHALLENGE_ChallengeError (XML);
		return Buffer;
	}

	MatchTag = XML.getElementsByTagName('match');
	// If there's no match, there's nothing to do
	if(MatchTag == null)
	{
		return Buffer;
	}
	Match = MatchTag[0];

	MatchID = Match.getAttribute('id');
	Category = Match.getAttribute('category');
	MatchType = Match.getAttribute('type');

	if (Type == 'set')
	{
		Rated = Match.getAttribute('rated');
	}
	else
	{
		Rated = null;
	}
	Players = XML.getElementsByTagName('player');


	// You receive a challenge from other player
	if (Players.length > 0)
	{
		// Get information of player one
		Player1.Name = Players[0].getAttribute('jid').replace(/@.*/,"");
		Player1.Inc = Players[0].getAttribute('inc');
		Player1.Color = Players[0].getAttribute('color');
		
		
		Player2.Name = Players[1].getAttribute('jid').replace(/@.*/,"");
		Player2.Inc = Players[1].getAttribute('inc');
		Player2.Color = Players[1].getAttribute('color');
		/*
		if(Players[1].getAttribute("time") == "untimed")
		{
			Player2.Time = Players[1].getAttribute('time');
		}
		else
		{
			Player2.Time = parseInt(Players[1].getAttribute('time')) / 60;
		}
		*/

		// Get players time
		if(Category == "untimed")
		{
			Player1.Time = "untimed";
			Player2.Time = "untimed";
		}
		else
		{
			Player1.Time = parseInt(Players[0].getAttribute('time')) / 60;
			Player2.Time = parseInt(Players[1].getAttribute('time')) / 60;
		}
		// Add the challenge in structure
		if (Player1.Name == MyUsername)
		{

			if(MainData.FindChallenge(ChallengeID, MatchID) == null)
			{
				MainData.AddChallenge(ChallengeID, Player2, Player1, Category, Rated, MatchID);
			}
			else // Receive a re-match
			{
				MainData.UpdateChallenge(ChallengeID, Player2, Player1, Category, Rated, MatchID);
				// Remove offer from challenge menu
				ChallengeMenu.removeMatch(MatchID);
				
			}

			User = MainData.GetUser(Player2.Name);
			if(User != null)
			{
				RatingObj = User.GetRatingList();
			}
			else
			{
				RatingObj = null;
			}

			if(MatchType != "adjourned")
			{
				// Show challenge window for user
				WINDOW_Challenge(Player2.Name, RatingObj, Player2, Rated, MatchID);
			}
			else
			{
				// Show resume postpone window
				WINDOW_Postpone(Player2.Name, RatingObj, Player2, Rated, MatchID);
			}
		}
		else 
		{
			if(MainData.FindChallenge(ChallengeID, MatchID) == null)
			{
				MainData.AddChallenge(ChallengeID, Player1, Player2, Category, Rated, MatchID);
			}
			else // Receive a re-match
			{
				MainData.UpdateChallenge(ChallengeID, Player1, Player2, Category, Rated, MatchID);
				// Remove offer from challenge menu
				ChallengeMenu.removeMatch(MatchID);
			}

			User = MainData.GetUser(Player1.Name);
			if(User != null)
			{
				RatingObj = User.GetRatingList();
			}
			else
			{
				RatingObj = null;
			}

			if(MatchType != "adjourned")
			{
				// Show challenge window for user
				WINDOW_Challenge(Player1.Name, RatingObj, Player1, Rated, MatchID);
			}
			else
			{
				// Show resume postpone window
				WINDOW_Postpone(Player1.Name, RatingObj, Player1, Rated, MatchID);
			}

		}

	}
	// You received a challenge confirm with match id
	// -> Challenge id is used when user send a challlenge to another
	// player but there is no match id defined. 
	else 
	{
		// Set match id in challenge
		MainData.UpdateChallenge(ChallengeID, null, null, null, null, MatchID);

		// Add offered challenge in challenge menu
		ChallengeObj = MainData.GetChallenge(ChallengeID,MatchID);
		ChallengedPlayer = ChallengeObj.Challenged;
	
		// Check challenge time if category is untimed or not	
		if(ChallengeObj.Category != "untimed")
		{
			ChallengeMenu.addMatch(ChallengedPlayer, Math.floor(ChallengedPlayer.Time/60), ChallengedPlayer.Inc, ChallengeObj.Rated, ChallengeObj.Private, MatchID);
		}
		else
		{
			// Put a infinit symbol
			ChallengeMenu.addMatch(ChallengedPlayer, "&#8734", ChallengedPlayer.Inc, ChallengeObj.Rated, ChallengeObj.Private, MatchID);
		}
	}


	return Buffer;
}


/**
 * @brief	Parse challenge accept
 *
 * @param	XML	XML with challenge parameters
 * @return	Buffer with XMPP to send
 * @author	Ulysses Bomfim
 */
function CHALLENGE_HandleAccept (XML)
{
	var Match, GameRoom;
	var MatchTag;
	var Buffer = "";

	// Try to get the Match tag
	MatchTag = XML.getElementsByTagName('match');
	if(MatchTag == null)
	{
		return Buffer;
	}
	Match = MatchTag[0];
		
	// Get the game room name
	GameRoom = Match.getAttribute('room');

	// Remove all challanges on structure
	//MainData.ClearChallenges();
	CHALLENGE_ClearChallenges();

	// TODO
	// Warn the player's interface

	// Send a presence to GameRoom with playing status
	Buffer += MESSAGE_ChangeStatus("playing",GameRoom);	

	return Buffer;	
}


/**
 * @brief	Parse challenge decline
 *
 * @param	XML	XML with challenge parameters
 * @return	Buffer with XMPP to send
 * @author	Ulysses Bomfim
 */
function CHALLENGE_HandleDecline (XML)
{
	var Match, MatchID, WindowObj,i;
	var Buffer = "";
	var ChallengeObj;
	var ChallengeMenu = MainData.GetChallengeMenu();

	// If there's no match, there's nothing to do (again)
	Match = XML.getElementsByTagName('match')[0];
	if(Match == null)
	{
		return Buffer;
	}
	
	MatchID = Match.getAttribute('id');

	// search challenge postion in data struct
	ChallengeObj = MainData.GetChallenge(null, MatchID);

	if(ChallengeObj != null)
	{
		// get window object
		WindowObj = ChallengeObj.Window;

		// close challenge window if exists.
		if(WindowObj != null)
		{
			// Quick fix to remove challenge window
			if(WindowObj.window.parentNode != null)
			{
				WINDOW_RemoveWindow(WindowObj);
			}
		}

		// Remove the challenge from Challenge List
		MainData.RemoveChallenge(null, MatchID);

		// Remove from challenge menu
		ChallengeMenu.removeMatch(MatchID);

		// TODO -> ?
		// Warn the interface that the challenge was declined
	}
	return Buffer;
}


/**
 * @brief	Parse challenge errors
 *
 * @param	XML	XML with challenge parameters
 * @return	Empty string
 * @author	Ulysses Bomfim
 */
function CHALLENGE_ChallengeError (XML)
{
	// Remove challenge from list
	var ChallengeId = XML.getAttribute("id");

	MainData.RemoveChallenge(ChallengeId,null);

	return "";
}

/**
 * @brief	Send a challenge message to other user
 *
 * @param	Oponent	Oponent username
 * @param	Color	Your color
 * @param	Time	Game time
 * @param	Inc	Game time increment
 * @param	Category	Game category
 * @param	Rated	Rated match (boolean)
 * @return	Empty string
 * @author	Rubens Suguimoto
 */
function CHALLENGE_SendChallenge(Oponent, Color, Time, Inc, Category, Rated)
{
	var XML, Player1, Player2, OpColor;
	var Players = new Array();
	var ChallengeID;
	var ChallengeSeq;
	var MyUsername = MainData.GetUsername();

	Player1 = new Object();
	Player2 = new Object();

	// Setting oponent's color
	if (Color == "white")
	{
		OpColor = "black";
	}
	else if (Color == "black")
	{
		OpColor = "white";
	}
	else // random color 
	{
		OpColor = "";
	}

	// Convert time in seconds
	if(Time != "untimed")
	{
		Time *= 60;
	}

	// Setting attributes
	Player1.Name = MyUsername;
	Player1.Color = Color;
	Player1.Time = Time;
	Player1.Inc = Inc;

	Player2.Name = Oponent;
	Player2.Color = OpColor;
	Player2.Time = Time;
	Player2.Inc = Inc;

	Players[0] = Player1;
	Players[1] = Player2;

	// Set ChallengeID, this id is used temporary to identify challenge
	// in challenge list when match id is not defined yet
	ChallengeSeq = MainData.GetChallengeSequence();
	ChallengeID = "Challenge_"+ChallengeSeq;
	MainData.SetChallengeSequence(ChallengeSeq+1);

	// Create challenge in main data -> Player 1 challenger
	MainData.AddChallenge(ChallengeID, Player1, Player2, Category, Rated, null);
	
	// Create message
	XML = MESSAGE_Challenge(ChallengeID, Category, Rated, Players);

	// Sending message
	CONNECTION_SendJabber(XML);

	return "";
}

/**
 * @brief	Send a rematch to oponent and update challenge information in main data
 *
 * @param	Oponent	Oponent username
 * @param	Color	Your color
 * @param	Time	Game time
 * @param	Inc	Game time increment
 * @param	Category	Game category
 * @param	Rated	Rated match (boolean)
 * @param	MatchId	Match identificator
 * @return	Empty string
 * @author	Rubens Suguimoto
 */

function CHALLENGE_SendReChallenge(Oponent, Color, Time, Inc, Category, Rated, MatchID)
{
	var XML, Player1, Player2, OpColor;
	var Players = new Array();
	var MyUsername = MainData.GetUsername();

	Player1 = new Object();
	Player2 = new Object();

	// Setting oponent's color
	if (Color == "white")
	{
		OpColor = "black";
	}
	else if (Color == "black")
	{
		OpColor = "white";
	}
	else // random color 
	{
		OpColor = "";
	}

	if(Category != "untimed")
	{
		// Convert time in seconds
		Time *= 60;
	}
	else
	{
		Time = "untimed";
	}

	// Setting attributes
	Player1.Name = MyUsername;
	Player1.Color = Color;
	Player1.Time = Time;
	Player1.Inc = Inc;

	Player2.Name = Oponent;
	Player2.Color = OpColor;
	Player2.Time = Time;
	Player2.Inc = Inc;

	Players[0] = Player1;
	Players[1] = Player2;

	//Update Challenge
	MainData.UpdateChallenge(null, Player1, Player2, Category, Rated, MatchID);

	// Create message
	XML = MESSAGE_Challenge(null, Category, Rated, Players, MatchID);

	// Sending message
	CONNECTION_SendJabber(XML);

	return "";
}
/**
* @brief 	Accept the challenge with the specified MatchID
*
* @param	MatchID 	Id of the match to be accepted
* @return 	void
* @author 	Pedro
*/
function CHALLENGE_AcceptChallenge(MatchID)
{
	var XML;
	
	//Remove all challenges
	CHALLENGE_ClearChallenges()

	// Create accept message
	XML = MESSAGE_ChallengeAccept(MatchID);

	CONNECTION_SendJabber(XML);
}

/**
* Decline the challenge with the specified MatchID
*
* @param	MatchID 	Id of the match to be declined
* @return 	void
* @author 	Pedro
*/
function CHALLENGE_DeclineChallenge(MatchID)
{
	var XML;

	// Create decline message
	XML = MESSAGE_ChallengeDecline(MatchID);

	CONNECTION_SendJabber(XML);
}

/*******************************
 * CHALLENGE MENU
 * ****************************/

/*
 * @brief 	Initialize Challenge menu object
 *
 * Create challenge menu in main data
 *
 * @return	Empty string
 * @see		scripts/interface/challengemenu.js
 * @author	Rubens Suguimoto
 */
function CHALLENGE_StartChallenge()
{
	var ChallengeMenu = new ChallengeMenuObj();
	MainData.SetChallengeMenu(ChallengeMenu);

	ChallengeMenu.hideMenu();
	ChallengeMenu.showMatch();
	ChallengeMenu.showAnnounce();
	ChallengeMenu.hidePostpone();

	//Get adjourned games list -> see adjourn.js
	//CHALLENGE_GetAdjournGames();
	
	return "";
}


/*
 * @brief	Show challenge menu, set menu position and click function to hide it.
 *
 * @param	Left	Left position of challenge menu
 * @param	Top	Top position of challenge menu
 * @return	Empty string
 * @author	Rubens Suguimoto
 */
function CHALLENGE_ShowChallengeMenu(Left, Top)
{
	var Func;
	var Hide = 0;
	var ChallengeMenu = MainData.GetChallengeMenu();

	// This function is used to hide challenge menu
	// TODO -> need fix
	Func = function(){
		//Hide += 1;

		if(ChallengeMenu.MenuVisible == true)
		//if(Hide == 2)
		{
			UTILS_RemoveListener(document,"mousedown",Func,false);

			// Hide Challenge menu from screen
			CHALLENGE_HideChallengeMenu();
		}
	}

	UTILS_AddListener(document, "mousedown",Func,false);

	// TODO - Quick fix - but this will be removed
	var Exit = document.getElementById("ExitButton");
	UTILS_AddListener(Exit,"click", function() {UTILS_RemoveListener(document,"click",Func,false) }, false);

	ChallengeMenu.showMenu(Left-80, Top+20);

	ANNOUNCE_ClearAnnounce();
	ANNOUNCE_HideNoAnnounce();
	ANNOUNCE_ShowLoadingAnnounce();

	// Get adjourn games list
	/*
	CHALLENGE_GetAdjournGames();
	ANNOUNCE_GetAnnounceGames();
	*/
	CONNECTION_SendJabber(MESSAGE_ChallengeGetAdjournList(10,0),MESSAGE_GetAnnounceMatch(0,10,"","","",true),MESSAGE_GetAnnounceMatch(0,10,"","","",false));

	return "";
}

/**
 * @brief	Hide challenge menu from screen
 *
 * @return	Empty string
 * @author	Rubens Suguimoto
 */
function CHALLENGE_HideChallengeMenu()
{
	var ChallengeMenu = MainData.GetChallengeMenu();

	ChallengeMenu.hideMenu();

	return "";
}

/**
 * @brief	Remove all challenges from main data and interface
 *
 * @return	Empty string
 * @author	Rubens Suguimoto
 */
function CHALLENGE_ClearChallenges()
{
	var i;
	var MatchId;
	var ChallengeWindow;
	var ChallengeList = MainData.GetChallengeList();
	var ChallengeMenu = MainData.GetChallengeMenu();

	// Remove all challenges from challenge menu and challenge list
	for(i=0;i<ChallengeList.length; i++)
	{
		MatchId = ChallengeList[i].MatchId;
		ChallengeWindow = ChallengeList[i].Window;

		if(MatchId != null)
		{
			//CHALLENGE_DeclineChallenge(MatchID);
			ChallengeMenu.removeMatch(MatchId);
			MainData.RemoveChallenge(MatchId, MatchId);
		}

		// Close all challenge window, if exists
		if(ChallengeWindow != null)
		{
			WINDOW_RemoveWindow(ChallengeWindow);
		}
		
		//Send a message to decline challenges
		CHALLENGE_DeclineChallenge(MatchId);
	}

	// Remove all challenges from main data
	//MainData.ClearChallenges();

	return "";
}

/**
 * @brief	Remove all announces from main data and interface
 *
 * @return	Empty string
 * @author	Rubens Suguimoto
 */
/*
function CHALLENGE_ClearAnnounce()
{
	var i;
	var AnnounceId;
	var ChallengeWindow;
	var ChallengeMenu = MainData.GetChallengeMenu();

	// Remove all challenges from challenge menu
	for(i=0;i<MainData.AnnounceList.length; i++)
	{
		AnnounceId = MainData.AnnounceList[i].Id;
		ChallengeWindow = MainData.AnnounceList[i].Window;

		if(AnnounceId != null)
		{
			//CHALLENGE_DeclineChallenge(MatchID);
			ChallengeMenu.removeAnnounce(AnnounceId);
		}

	}

	// Remove all announces from main data
	MainData.ClearAnnounces();

}
*/
