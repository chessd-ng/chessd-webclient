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

function GAME_HandleChallenge (XML)
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
		Buffer = GAME_HandleOffer(XML);
	}
	else if (Xmlns.match(/\/chessd#match#accept/))
	{
		Buffer = GAME_HandleAccept(XML);
	}
	else if (Xmlns.match(/\/chessd#match#decline/))
	{
		Buffer = GAME_HandleDecline(XML);
	}
	else if (Xmlns.match(/\/chessd#match#error/))
	{
		Buffer = GAME_HandleError(XML);
	}
		
	return Buffer;
}


/**
* Handle Offer
*/
function GAME_HandleOffer(XML)
{
	var Players, Match, MatchID, Category, Type, Rating, Rated;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	
	Type = XML.getAttribute("type");
	
	if (Type == "error")
	{
		GAME_ChallengeError (XML);
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


	//  Player is challenged
	if (Players.length > 0)
	{
		// Get information of player one
		Player1.Name = Players[0].getAttribute('jid').replace(/@.*/,"");
		Player1.Inc = Players[0].getAttribute('inc');
		Player1.Color = Players[0].getAttribute('color'); 
		Player1.Time = parseInt(Players[0].getAttribute('time')) / 60;
		Player1.Rated = Rated;
		
		// Get information of player two
		Player2.Name = Players[1].getAttribute('jid').replace(/@.*/,"");
		Player2.Inc = Players[1].getAttribute('inc');
		Player2.Color = Players[1].getAttribute('color');
		Player2.Time = parseInt(Players[1].getAttribute('time')) / 60;
		Player2.Rated = Rated;

		// Add the challenge in structure
		if (Player1.Name != MainData.Username)
		{
			MainData.AddChallenge(Player1.Name, MatchID, Player1.Name);

			Rating = MainData.GetUserRatingInRoom(MainData.RoomDefault,Player1.Name,Category);
			// Show challenge window for user
			WINDOW_Challenge(Player1.Name, Rating, Player1, MatchID);
		}
		else 
		{
			MainData.AddChallenge(Player2.Name, MatchID, Player2.Name);
		}

	}
	
	// Player received a challenge confirm
	else 
	{
		// Get the challenged name
		Player1.Name = XML.getAttribute('id').replace(/.*_/,"");
		
		// Add the challenge in structure
		MainData.AddChallenge (Player1.Name, MatchID, MainData.Username);
	}

	// TODO
	// Get the oponent rating

	return Buffer;
}


/**
* Handle Accept 
*/
function GAME_HandleAccept (XML)
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
function GAME_HandleDecline (XML)
{
	var Match, MatchID, WindowObj,i;

	// If there's no match, there's nothing to do (again)
	try 
	{
		Match = XML.getElementsByTagName('match')[0];
	}
	catch (e)
	{
		return "";
	}
	
	MatchID = Match.getAttribute('id');

	// search challenge postion in data struct
	i = MainData.FindChallengeById(MatchID);

	// get window object
	WindowObj = MainData.ChallengeList[i].Window;

	// close challenge window
	WINDOW_RemoveWindow(WindowObj);

	// Remove the ID from 'ChallengeList'
	MainData.RemoveChallengeById(MatchID);

	// TODO
	// Warn the interface that the challenge was declined
	
	return "";
}


/**
* Handle errors on challenge
*/
function GAME_ChallengeError (XML)
{
	// TODO
	return "";
}

/**
* Send a challenge message to 'Username'
*/
function GAME_SendChallenge(Oponent, Color, Time, Inc, Category, Rated, GameID)
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

//	alert('interface'+Rated);

	// Create message
	XML = MESSAGE_Challenge(Category, Rated, Players, GameID);

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
function GAME_AcceptChallenge(MatchID)
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
function GAME_DeclineChallenge(MatchID)
{
	var XML;

	// Create accept message
	XML = MESSAGE_ChallengeDecline(MatchID);

	CONNECTION_SendJabber(XML);
}
