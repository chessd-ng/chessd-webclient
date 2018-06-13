import { CONNECTION_SendJabber } from 'connection/connection.js';
import { USER_AddUser } from 'contact/user.js';
import { MESSAGE_ChallengeResumeGame, MESSAGE_ChallengeGetAdjournList } from 'xmpp_messages/message.js';

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
 * @file 	challenge/adjourn.js
 * @brief	Functions to parse adjourned games message and show result
 * 		in interface
 *
 * See interface challenge menu (scripts/interface/challengemenu.js) and data
 * methods to adjourn/postpone game list (scripts/data/data.js)
 *
 * PS: Currently, adjourn and postpone games are considered the same thing.
*/

/**
 * @brief 	Parse XML with adjourned games list and show in interface
 *
 * @param	XML	XML with adjourned games
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
 */
export function CHALLENGE_HandleAdjourn(XML)
{
	var Query = XML.getElementsByTagName("query");
	var Buffer = "";
	
	var AdjournList = XML.getElementsByTagName("game");
	var Game, Players;
	var Player1, Player2;
	var AdjournId, Category, Date;
	var GameCenter = MainData.GetGamecenter();
	var Status;

	var MyUsername = MainData.GetUsername();
	var User;

	var i;
	
	var P1Rating, P2Rating;

	for(i=0; i< AdjournList.length; i++)
	{
		Game = AdjournList[i];

		AdjournId = Game.getAttribute("id");
		Category = Game.getAttribute("category");
		Date = Game.getAttribute("time_stamp").split("T")[0];

		if(MainData.FindPostpone(AdjournId) == null)
		{
			Players = Game.getElementsByTagName("player");

			Player1 = new Object();
			Player2 = new Object();

			Player1.Name = Players[0].getAttribute("jid").split("@")[0];
			Player1.Color= Players[0].getAttribute("role");
			Player1.Time = Players[0].getAttribute("time");
			Player1.Inc  = Players[0].getAttribute("inc");

			Player2.Name = Players[1].getAttribute("jid").split("@")[0];
			Player2.Color= Players[1].getAttribute("role");
			Player2.Time = Players[1].getAttribute("time");
			Player2.Inc  = Players[1].getAttribute("inc");

			//Search for player1's rating
			if(MainData.GetUser(Player1.Name) != null)
			{
				P1Rating = MainData.GetUser(Player1.Name).GetRatingList().GetRatingValue(Category);
			}
			else
			{
				USER_AddUser(Player1.Name, "offline");
				P1Rating = 1500;
			}

			//Search for player2's rating
			if(MainData.GetUser(Player2.Name) != null)
			{
				P2Rating = MainData.GetUser(Player2.Name).GetRatingList().GetRatingValue(Category);
			}
			else
			{
				USER_AddUser(Player2.Name, "offline");
				P2Rating = 1500;
			}


			if(Player1.Name == MyUsername)
			{
				// Get oponent status
				User = MainData.GetUser(Player2.Name);
				if(User != null)
				{
					Status = User.GetStatus();
				}
				else
				{
					Status = "offline";
				}				

				// Add in main data postpone list
				MainData.AddPostpone(Player2, Player2.Time, Player2.Inc, Category, P2Rating, Date, Status, AdjournId);

				// Show this postpone game in interface
				GameCenter.Postpone.add(Player2, Player2.Time, Player2.Inc, Category, P2Rating, Date, AdjournId);


				CHALLENGE_PostponePresence(Player2.Name, Status);
			}
			else
			{
				// Get oponent status
				User = MainData.GetUser(Player1.Name);
				if(User != null)
				{
					Status = User.GetStatus();
				}
				else
				{
					Status = "offline";
				}				

				// Add in main data postpone list
				MainData.AddPostpone(Player1, Player1.Time, Player1.Inc, Category, P1Rating, Date, Status, AdjournId);

				// Show this postpone game in interface
				GameCenter.Postpone.add(Player1, Player1.Time, Player1.Inc, Category, P1Rating, Date, AdjournId);

				CHALLENGE_PostponePresence(Player1.Name, Status);
			}
		}
	}

	return Buffer;
}

/**
 * @brief 	Parse presence to adjourn game user;
 *
 * Parse presence to user in challenge list. I.E.: if user comes offline
 * the adjourn game with this user turn unavailable to play.
 *
 * @param	XML	XML with adjourned games
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
 */
export function CHALLENGE_HandlePresence(XML)
{
	var GeneralRoom = XML.getAttribute("from").split("@")[0];
	var StatusType, Username;
	var Status;
	var Buffer = "";

	Username = XML.getAttribute("from").split("/")[1];
	StatusType = XML.getAttribute("type");

	if(StatusType == "unavailable")
	{
		Status = "offline";
	}
	else
	{
		Status = "available";
	}

	MainData.SetPostponeStatus(Username, Status);
	
	CHALLENGE_PostponePresence(Username, Status);

	return Buffer;
}



/**
 * @brief	Update status of user in postpone list
 *
 * @param	Username	Name used by user
 * @param	PresenceType	User status (offline or others status)
 * @return	Empty string;
 * @author	Rubens Suguimoto
 */
export function CHALLENGE_PostponePresence(Username, PresenceType)
{
	var GameCenter = MainData.GetGamecenter();

	//If user is founded, set adjourn game to available, else unavailable
	if(PresenceType == "offline")
	{
		GameCenter.Postpone.update(Username, "offline");
	}
	else
	{
		GameCenter.Postpone.update(Username, "online");
	}
	return "";
}


/**
 * @brief 	Create and send a message to resume a game with some player
 *
 * @param	AdjournId	Adjourned game Id;
 * @return	Empty string;
 * @author	Rubens Suguimoto
 */
export function CHALLENGE_SendResumeGame(AdjournId)
{
	var XMPP = "";
	
	var Postpone = MainData.GetPostpone(AdjournId);

	var Challenger = new Object();
	var Challenged = new Object();

	var Category = Postpone.Category;
	var MyUsername = MainData.GetUsername();
	var ChallengeSequence = MainData.GetChallengeSequence();
	var ChallengeId = "offer_adj"+ChallengeSequence;

	// Create challenge in challenge list
	Challenged.Name = Postpone.Challenged.Name;
	Challenged.Color = Postpone.Challenged.Color;
	Challenged.Time = Postpone.Challenged.Time;
	Challenged.Inc = Postpone.Challenged.Inc;

	Challenger.Name = MyUsername;
	Challenger.Color = "undefined";
	Challenger.Time = 0;
	Challenger.Inc = 0;

	// Add challenge in challenge list
	MainData.AddChallenge(ChallengeId, Challenger, Challenged, Category, "false", null);
	MainData.SetChallengeSequence(ChallengeSequence + 1);

	// Create and send message to resume adjourned game
	XMPP += MESSAGE_ChallengeResumeGame(AdjournId, ChallengeId);
	CONNECTION_SendJabber(XMPP);

	// Remove adjourned game from postponed list;
	CHALLENGE_RemovePostpone(AdjournId);

	//TODO -> Remove and don't show again a removed adjourn game with 
	// AdjournId

	return "";
}

/**
 * @brief 	Create and send message to get adjourned games list
 *
 * @return	Empty string;
 * @author	Rubens Suguimoto
 */
function CHALLENGE_GetAdjournGames()
{
	var XMPP;
	var Num = 10; // Get just 10 adjourned games

	XMPP = MESSAGE_ChallengeGetAdjournList(Num,0);

	CONNECTION_SendJabber(XMPP);

	return "";
}

/**
 * @brief	Remove post pone from maindata and challenge menu
 *
 * @param	Id	Adjourned/Postpone game Id
 * @return	Empty string;
 * @author	Rubens Suguimoto
 */

function CHALLENGE_RemovePostpone(Id)
{
	var GameCenter = MainData.GetGamecenter();

	MainData.RemovePostpone(Id);
	GameCenter.Postpone.remove(Id);

	return "";
}
