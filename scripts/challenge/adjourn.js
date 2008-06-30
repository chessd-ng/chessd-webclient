/**
* 3C
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
* Handle Adjourn Challenge
*/

/**
 * Parse XML with adjourned games list and show in challenge menu
 */
function CHALLENGE_HandleAdjourn(XML)
{
	var Query = XML.getElementsByTagName("query");
	var Xmlns;
	var Buffer = "";
	
	var AdjournList = XML.getElementsByTagName("game");
	var Game, Players;
	var Player1, Player2;
	var AdjournId, Category, Date;

	var i;

	for(i=0; i< AdjournList.length; i++)
	{
		Game = AdjournList[i];

		AdjournId = Game.getAttribute("id");
		Category = Game.getAttribute("category");
		Date = Game.getAttribute("time_stamp").split("T")[0];

		if(MainData.FindPostpone(AdjournId) == null)
		{
			Players = Game.getElementsByTagName("player")

			Player1 = new Object();
			Player2 = new Object();

			Player1.Name = Players[0].getAttribute("jid").split("@")[0];
			Player1.Color= "undefined";
			Player1.Time = 0;
			Player1.Inc = 0;

			Player2.Name = Players[1].getAttribute("jid").split("@")[0];
			Player2.Color= "undefined";
			Player2.Time = 0;
			Player2.Inc = 0;

			if(Player1.Name == MainData.Username)
			{
				// Add in main data postpone list
				MainData.AddPostpone(Player2, Category, Date, AdjournId);

				// Add in challenge menu
				MainData.ChallengeMenu.addPostpone(Player2, Category, Date, AdjournId);

				CHALLENGE_PostponePresence(Player2.Name);
			}
			else
			{
				// Add in main data postpone list
				MainData.AddPostpone(Player1, Category, Date, AdjournId);

				// Add in challenge menu
				MainData.ChallengeMenu.addPostpone(Player1, Category, Date, AdjournId);

				CHALLENGE_PostponePresence(Player1.Name);
			}
		}
	}

	MainData.ChallengeMenu.showPostpone();

	return "";
}

/**
 * Check presence to adjourn list
 */
function CHALLENGE_HandlePresence(XML)
{
	var GeneralRoom = XML.getAttribute("from").split("@")[0];
	var Item, Username, i;

	if(GeneralRoom == "general")
	{
		Item = XML.getElementsByTagName("item");

		for(i=0; i<Item.length; i++)
		{
			Username = Item[i].getAttribute("jid").split("@")[0];
			CHALLENGE_PostponePresence(Username);
		}
	}

	return "";
}



/**
 * Update status of user in postpone list
 */
function CHALLENGE_PostponePresence(Username)
{
	var i = MainData.FindUserInRoom(MainData.RoomDefault, Username);

	if(i != null)
	{
		MainData.ChallengeMenu.updatePostpone(Username, "online");
	}
	else
	{
		MainData.ChallengeMenu.updatePostpone(Username, "offline");
	}
}


/**
 * Create and send message to resume a game to some player
 */
function CHALLENGE_SendResumeGame(AdjournId)
{
	var XMPP;
	
	var PostponePos = MainData.FindPostpone(AdjournId);
	var Postpone = MainData.PostponeList[PostponePos];

	var Challenger = new Object();
	var Challenged = new Object();

	// Create Challenge in challenge list
	Challenged.Name = Postpone.Challenged.Name;
	Challenged.Color = Postpone.Challenged.Color;
	Challenged.Time = Postpone.Challenged.Time;
	Challenged.Inc = Postpone.Challenged.Inc;

	Challenger.Name = MainData.Username;
	Challenger.Color = "undefined";
	Challenged.Time = 0;
	Challenged.Inc = 0;

	MainData.AddChallenge("offer_adj", Challenger, Challenged, Postpone.Category, "false", null);

	XMPP = MESSAGE_ChallengeResumeGame(AdjournId);

	CONNECTION_SendJabber(XMPP);

	CHALLENGE_RemovePostpone(AdjournId);
}

/**
 * Create and send message to get adjourned games
 */
function CHALLENGE_GetAdjournGames()
{
	var XMPP;
	var Num = 10; // Get just 10 adjourned games

	XMPP = MESSAGE_ChallengeGetAdjournList(Num,0);

	CONNECTION_SendJabber(XMPP);
}

/**
 * Remove post pone from maindata and challenge menu
 */
function CHALLENGE_RemovePostpone(Id)
{
	MainData.RemovePostpone(Id);
	MainData.ChallengeMenu.removePostpone(Id);
}
