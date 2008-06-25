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
* Handle Challenge
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
		return "";
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
		Buffer = CHALLENGE_HandleError(XML);
	}
		
	return Buffer;
}


/**
* Handle Offer
*/
function CHALLENGE_HandleOffer(XML)
{
	var Players, Match, MatchID, Category, Type, Rating, Rated;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	var ChallengeID;

	ChallengeID = XML.getAttribute("id");
	Type = XML.getAttribute("type");
	
	if (Type == "error")
	{
		CHALLENGE_ChallengeError (XML);
		return "";
	}

	// If there's no match, there's nothing to do
	try 
	{
		Match = XML.getElementsByTagName('match')[0];
	}
	catch (e)
	{
		return "";
	}
	
	MatchID = Match.getAttribute('id');
	Category = Match.getAttribute('category');
	if (Type == 'set')
	{
		Rated = Match.getAttribute('rated');
	}
	Players = XML.getElementsByTagName('player');


	// You receive a challenge from other player
	if (Players.length > 0)
	{
		// Get information of player one
		Player1.Name = Players[0].getAttribute('jid').replace(/@.*/,"");
		Player1.Inc = Players[0].getAttribute('inc');
		Player1.Color = Players[0].getAttribute('color'); 
		Player1.Time = parseInt(Players[0].getAttribute('time')) / 60;
		
		// Get information of player two
		Player2.Name = Players[1].getAttribute('jid').replace(/@.*/,"");
		Player2.Inc = Players[1].getAttribute('inc');
		Player2.Color = Players[1].getAttribute('color');
		Player2.Time = parseInt(Players[1].getAttribute('time')) / 60;


		// Add the challenge in structure
		if (Player1.Name == MainData.Username)
		{

			if(MainData.FindChallenge(ChallengeID, MatchID) == null)
			{
				MainData.AddChallenge(ChallengeID, Player2, Player1, Category, Rated, MatchID);
			}
			else // Receive a re-match
			{
				MainData.UpdateChallenge(ChallengeID, Player2, Player1, Category, Rated, MatchID);
				
			}

			//Quick fix to get oponent rating
			Rating = MainData.GetUserRatingInRoom(MainData.RoomDefault,Player2.Name,Category);
			// Show challenge window for user
			WINDOW_Challenge(Player2.Name, Rating, Player2, MatchID);
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
			}

			//Quick fix to get oponent rating
			Rating = MainData.GetUserRatingInRoom(MainData.RoomDefault,Player1.Name,Category);
			// Show challenge window for user
			WINDOW_Challenge(Player1.Name, Rating, Player1, MatchID);

		}

	}
	// You received a challenge confirm with match id
	else 
	{
		// Set match id in challenge
		MainData.UpdateChallenge(ChallengeID, null, null, null, null, MatchID);
	}

	// TODO
	// Get the oponent rating

	return Buffer;
}


/**
* Handle Accept 
*/
function CHALLENGE_HandleAccept (XML)
{
	var Match, GameRoom;

	// Try to get the Match tag
	try 
	{
		Match = XML.getElementsByTagName('match')[0]
	}
	catch (e)
	{
		return "";
	}
		
	// Get the game room name
	GameRoom = Match.getAttribute('room');

	// Remove all challanges on structure
	MainData.ClearChallenges();

	// TODO
	// Warn the player's interface

	// Send a presence to GameRoom with playing status
	return (MESSAGE_ChangeStatus("playing",GameRoom));	
}


/**
* Handle Decline
*/
function CHALLENGE_HandleDecline (XML)
{
	var Match, MatchID, WindowObj,i;

	// If there's no match, there's nothing to do (again)
	Match = XML.getElementsByTagName('match')[0];
	if(Match == null)
	{
		return "";
	}
	
	MatchID = Match.getAttribute('id');

	// search challenge postion in data struct
	i = MainData.FindChallenge(null, MatchID);

	// get window object
	WindowObj = MainData.ChallengeList[i].Window;
	
	// close challenge window if exists.
	if(WindowObj != null)
	{
		if(WindowObj.parentNode != null)
		{
			WINDOW_RemoveWindow(WindowObj);
		}
	}
	// Remove the challenge from Challenge List
	MainData.RemoveChallenge(null, MatchID);

	// TODO
	// Warn the interface that the challenge was declined
	
	return "";
}


/**
* Handle errors on challenge
*/
function CHALLENGE_ChallengeError (XML)
{
	// Remove challenge from list
	var ChallengeId = XML.getAttribute("id");

	MainData.RemoveChallenge(ChallengeId,null);

	return "";
}

/**
* Send a challenge message to 'Username'
*/
function CHALLENGE_SendChallenge(Oponent, Color, Time, Inc, Category, Rated)
{
	var XML, Player1, Player2, OpColor;
	var Players = new Array();
	var ChallengeID;

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
	Time *= 60;

	// Setting attributes
	Player1.Name = MainData.Username;
	Player1.Color = Color;
	Player1.Time = Time;
	Player1.Inc = Inc;

	Player2.Name = Oponent;
	Player2.Color = OpColor;
	Player2.Time = Time;
	Player2.Inc = Inc;

	Players[0] = Player1;
	Players[1] = Player2;

	// Set ChallengeID
	ChallengeID = "Challenge_"+MainData.ChallengeSequence;
	MainData.ChallengeSequence++;

	// Create challenge in main data
	MainData.AddChallenge(ChallengeID, Player1, Player2, Category, Rated, null);

	// Create message
	XML = MESSAGE_Challenge(ChallengeID, Category, Rated, Players);

	// Sending message
	CONNECTION_SendJabber(XML);
}

/**
 * Send a rematch to oponent and update challenge information in main data
 */
function CHALLENGE_SendReChallenge(Oponent, Color, Time, Inc, Category, Rated, MatchID)
{
	var XML, Player1, Player2, OpColor;
	var Players = new Array();

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
	Time *= 60;

	// Setting attributes
	Player1.Name = MainData.Username;
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
}
/**
* Accept the challenge with the specified MatchID
*
* @param	MatchID 	Id of the match to be accepted
* @return 	void
* @author 	Pedro
*/
function CHALLENGE_AcceptChallenge(MatchID)
{
	var XML;

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

	// Create accept message
	XML = MESSAGE_ChallengeDecline(MatchID);

	CONNECTION_SendJabber(XML);
}
