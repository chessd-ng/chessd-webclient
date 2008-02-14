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
	var Players, Match, MatchID, Category;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";

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
	Players = XML.getElementsByTagName('player');

	//  Player is challenged
	if (Players.length > 0)
	{
		// Get information of player one
		Player1.Name = Players[0].getAttribute('jid').replace(/@.*/,"");
		Player1.Inc = Players[0].getAttribute('inc');
		Player1.Color = Players[0].getAttribute('color');
		Player1.Time = Players[0].getAttribute('time');
		
		// Get information of player two
		Player2.Name = Players[1].getAttribute('jid').replace(/@.*/,"");
		Player2.Inc = Players[1].getAttribute('inc');
		Player2.Color = Players[1].getAttribute('color');
		Player2.Time = Players[1].getAttribute('time');

		// Add the challenge in structure
		if (Player1.Name != MainData.Username)
		{
			MainData.AddChallenge(Player1.Name, MatchID, Player1.Name);

			// TODO TODO provisorio!
			if (confirm(Player1.Name+" esta te desafiando, deseja aceitar?"))
			{	
				Buffer += MESSAGE_ChallengeAccept(MatchID);
			}
			else
			{
				Buffer += MESSAGE_ChallengeDecline(MatchID);
			}
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

 	// TODO
	// Interface functions should be inserted here

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

	// Send a presence to GameRoom
	return (MESSAGE_Presence(GameRoom+"/"+MainData.Username));	
}


/**
* Handle Decline
*/
function GAME_HandleDecline (XML)
{
	var Match, MatchID;

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
function GAME_SendChallenge(User, Color, Time, Inc)
{
	var XML;
	var Player = new Object();

	Player.Name = User;

	//Player.Color = Color;
	//Player.Time = Time;
	//Player.Inc = Inc;

	// Only for testing
	Player.Color = "black";
	Player.Time = 30;
	Player.Inc = 5;

	XML = MESSAGE_Challenge("standard", Player);
	CONNECTION_SendJabber(XML);
}
