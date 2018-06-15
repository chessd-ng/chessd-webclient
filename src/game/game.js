import { CONTACT_ChangeStatus } from 'contact/status.js';
import { ROOM_EnterRoomGame, ROOM_ExitRoom } from 'room/room.js';
import {
	MESSAGE_GameMove,
	MESSAGE_GameSearchCurrentGame,
	MESSAGE_GetProfile,
	MESSAGE_Presence,
	MESSAGE_Unavailable,
  MESSAGE_GameCancelAccept,
  MESSAGE_GameDrawAccept,
  MESSAGE_GameDrawDeny,
  MESSAGE_GameCancelDeny,
  MESSAGE_GameAdjournAccept,
  MESSAGE_GameAdjournDeny,
  MESSAGE_GameRequestDraw,
  MESSAGE_GameRequestCancel,
  MESSAGE_GameRequestAdjourn,
  MESSAGE_GameResign,
} from 'xmpp_messages/message.js';
import { INTERFACE_GameBoardObj } from 'interface/game.js';
import {
	UTILS_GetNodeText,
	UTILS_GetText,
	UTILS_HorizontalIndex,
	UTILS_String2Board,
} from 'utils/utils.js';
import { GAMECENTER_HideGameCenter, GAMECENTER_ShowGameCenter } from 'gamecenter/gamecenter.js';
import { CHALLENGE_ClearChallenges } from 'challenge/challenge.js';
import { ANNOUNCE_CancelAllAnnounce } from 'challenge/announce.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { OLDGAME_RemoveOldGame, OLDGAME_EndGame } from 'game/oldgame.js';
import { WINDOW_Confirm, WINDOW_Alert } from 'window/window.js';

import { MainData } from 'main_data.js';

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
* @file		game/game.js
* @brief	This file will handle all kind of game massages
*/


/**
* @brief	Handle Game Messages
*
* @param 	XML	XMPP with game messages
* @return 	Buffer with XMPP that must be send
* @author 	Ulysses	Bomfim and Rubens Suguimoto
*/
export function GAME_HandleGame(XML)
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

	if (Xmlns.match(/\/chessd\/game\/state/))
	{
		Buffer += GAME_State(XML);
	}
	else if (Xmlns.match(/\/chessd\/game\/move/))
	{
		Buffer += GAME_Move(XML);
	}
	else if (Xmlns.match(/\/chessd\/game\/canceled/))
	{
		Buffer += GAME_End(XML);
	}
	else if (Xmlns.match(/\/chessd\/game\/end/))
	{
		Buffer += GAME_End(XML);
	}
	else if (Xmlns.match(/\/chessd\/game\/cancel/))
	{
		Buffer += GAME_HandleCancel(XML, Xmlns);
	}
	else if (Xmlns.match(/\/chessd\/game\/draw/))
	{
		Buffer += GAME_HandleDraw (XML, Xmlns);
	}
	else if (Xmlns.match(/\/chessd\/game\/adjourn/))
	{
		Buffer += GAME_HandleAdjourn(XML, Xmlns);
	}
	
	return Buffer;
}

/**
* @brief	Handle game presence
*
* @param 	XML	XMPP with game messages
* @return 	Buffer with XMPP that must be send
* @author	Rubens Suguimoto
*/
export function GAME_HandlePresence(XML)
{
	var Username = XML.getAttribute("from").split("/")[1];
	var GameId = XML.getAttribute("from").split("@")[0];
	var Buffer = "";
	var Type = XML.getAttribute("type");

	var Game = MainData.GetGame(GameId);

	if(Game == null)
	{
		return Buffer;
	}
	if(Type == "unavailable")
	{
		// If some player leave from game, show a W.O. message;
		if (Game.PB == Username)
		{
			Game.Game.ShowLeaveUser("black");
		}
		else if (Game.PW == Username)
		{
			Game.Game.ShowLeaveUser("white");
		}
	}
	else
	{
		// If some player reenter in game, hide a W.O. message;
		if ((Game.PB == Username) || (Game.PW == Username))
		{
			Game.Game.HideLeaveUser();
		}

	}
	return Buffer;
}

/**
* @brief	Handle Game Move
*
* @param 	XML	The XMPP that contains the game move
* @return 	none
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_Move(XML)
{
	var GameID;
	var BoardTag, Board, Turn;
	var PlayerTag, MoveTag, Move, ShortMove;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";

	GameID = XML.getAttribute("from").replace(/@.*/,"");

	BoardTag = XML.getElementsByTagName("board");
	PlayerTag = XML.getElementsByTagName("player");
	MoveTag = XML.getElementsByTagName("move");

	// Get the PGN of last move
	if(MoveTag != null)
	{
		Move = MoveTag[0].getAttribute("long");
		ShortMove = MoveTag[0].getAttribute("short");
	}
	else
	{
		Move = "------";
		ShortMove = "------";
	}

	//Get all game data
	Board = BoardTag[0].getAttribute("state");
	Turn = BoardTag[0].getAttribute("turn");

	// Get first player data
	Player1.Name = PlayerTag[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = PlayerTag[0].getAttribute('inc');
	Player1.Color = PlayerTag[0].getAttribute('color');
	Player1.Time = PlayerTag[0].getAttribute('time');
	
	// Get second player data
	Player2.Name = PlayerTag[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = PlayerTag[1].getAttribute('inc');
	Player2.Color = PlayerTag[1].getAttribute('color');
	Player2.Time = PlayerTag[1].getAttribute('time');


	//Find the game to update move	
	if (MainData.FindGame(GameID) == null)
	{
		// If game was not founded, start a new game and show this move
		Buffer += GAME_StartGame(GameID, Player1, Player2);

		Buffer += GAME_UpdateBoard(GameID, Board, Move, ShortMove, Player1, Player2, Turn);
	}
	else
	{
		// Else show this move
		Buffer += GAME_UpdateBoard(GameID, Board, Move, ShortMove, Player1, Player2, Turn);
	}

	return Buffer;
}

/**
* @brief	Handle Game Result
*
* This code is used to parse games that player is dnd. Used to enter automatically in some game that player is playing.
*
* @param 	XML	The xml that contains the game result
* @return 	XMPP to be send
* @author 	Rubens Suguimoto
*/
export function GAME_HandleGameResult(XML)
{
	var Id = XML.getAttribute("id");
	var Buffer = "";
	var Room;
	var GameTag;
	var i;
	var To;
	var Consts = MainData.GetConst();
	var MyUsername = MainData.GetUsername();
	var MyUser = MainData.GetUser(MyUsername);

	if(Id == Consts.IQ_ID_SearchCurrentGame)
	{
		GameTag = XML.getElementsByTagName("game");

		if(GameTag.length != 0)
		{
			for(i=0; i< GameTag.length; i++)
			{
				Room = GameTag[i].getAttribute("room");
				MyUser.SetStatus("dnd");
				To = Room+"@"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MyUsername;
				Buffer += MESSAGE_Presence(To);
			}
		}
	}
	return Buffer;
}

/**
* @brief	Handle Game State
*
* @param 	XML The xml that contains the game state
* @return 	XMPP to be send
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_State(XML)
{
	var GameID, PlayerTag;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	var History;
	var HistoryStates;

	var SPlayer;
	var WTime, BTime;


	GameID = XML.getAttribute("from").replace(/@.*/,"");
	PlayerTag = XML.getElementsByTagName("player");

	// Get game move history
	History = XML.getElementsByTagName("history")[0];
	HistoryStates = History.getElementsByTagName("state");

	// Get players time left
	SPlayer = XML.getElementsByTagName("player");
	if(SPlayer != null)
	{
		if(SPlayer[0].getAttribute("color") == "white")
		{
			WTime = SPlayer[0].getAttribute("time");
			BTime = SPlayer[1].getAttribute("time");
		}
		else
		{
			WTime = SPlayer[1].getAttribute("time");
			BTime = SPlayer[0].getAttribute("time");
		}
	}

	// Get first player data
	Player1.Name = PlayerTag[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = PlayerTag[0].getAttribute('inc');
	Player1.Color = PlayerTag[0].getAttribute('color');
	Player1.Time = PlayerTag[0].getAttribute('time');
		
	// Get second player data
	Player2.Name = PlayerTag[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = PlayerTag[1].getAttribute('inc');
	Player2.Color = PlayerTag[1].getAttribute('color');
	Player2.Time = PlayerTag[1].getAttribute('time');

	// First Board State (without history tag)
	if(HistoryStates.length <= 0)
	{
		Buffer = GAME_Move(XML);
	}
	else
	{
		// History moves
		if (MainData.FindGame(GameID) == null)
		{
			Buffer += GAME_StartGame(GameID, Player1, Player2);
			Buffer += GAME_LoadGameHistory(GameID, History, Player1, Player2);
			// Set time left for each player
			Buffer += GAME_SetLeftTime(GameID, WTime, BTime);
		}
		else
		{
			Buffer += GAME_LoadGameHistory(GameID, History, Player1, Player2);
			// Set time left for each player
			Buffer += GAME_SetLeftTime(GameID, WTime, BTime);
		}
	}

	return Buffer;
}
/**
* @brief	Handle Draw Request
*
* @param 	XML 	Xml that contains the draw message
* @param	Xmlns	Xml namespace string
* @return 	Empty string
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_HandleDraw(XML, Xmlns)
{
	var GameID = XML.getAttribute("from").replace(/@.*/,"");
	var Oponent = GAME_GetOponent(GameID);
	var Title = UTILS_GetText("game_draw");
	var Text;
	var Button1, Button2;

	// If receive a draw decline message
	if (Xmlns.match(/-decline/))
	{
		Text = UTILS_GetText("game_draw_denied");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}

		// Show message as a default alert window
		WINDOW_Alert(Title, Text);
	}
	// Show a confirm window to accept or decline draw game request
	else
	{
		Text = UTILS_GetText("game_draw_text");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}
		Button1 = new Object();
		Button2 = new Object();

		// Ok button
		Button1.Name = UTILS_GetText("window_accept");
		Button1.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameDrawAccept(GameID));
		};

		// Cancel button
		Button2.Name = UTILS_GetText("window_decline");
		Button2.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameDrawDeny(GameID));
		};

		// Show message as a default confirm window
		WINDOW_Confirm(Title, Text, Button1, Button2);
	}
	return "";
}

/**
* @brief	Handle Cancel Request
*
* @param 	XML The xml that contains the cancel game message
* @param	Xmlns	Xml namespace string
* @return 	Empty string
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_HandleCancel(XML, Xmlns)
{
	var GameID = XML.getAttribute("from").replace(/@.*/,"");
	var Oponent = GAME_GetOponent(GameID);
	var Title = UTILS_GetText("game_abort");
	var Text;
	var Button1, Button2;

	// If receive a cancel game decline message
	if (Xmlns.match(/-decline/))
	{
		Text = UTILS_GetText("game_abort_denied");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}

		// Show message as a default alert window
		WINDOW_Alert(Title, Text);
	}
	// Show a confirm window to accept or decline cancel game request
	else
	{
		Text = UTILS_GetText("game_abort_text");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}
		Button1 = new Object();
		Button2 = new Object();

		// Ok button
		Button1.Name = UTILS_GetText("window_accept");
		Button1.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameCancelAccept(GameID));
		};

		// Cancel button
		Button2.Name = UTILS_GetText("window_decline");
		Button2.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameCancelDeny(GameID));
		};

		// Show message as a default confirm window
		WINDOW_Confirm(Title, Text, Button1, Button2);
	}
	return "";
}

/**
* @brief	Handle Adjourn Request
*
* Assume adjourn and postpone the samething here
*
* @param 	XML The xml that contains the adjourn message
* @param	Xmlns	Xml namespace string
* @return 	Empty string
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_HandleAdjourn(XML, Xmlns)
{
	var GameID = XML.getAttribute("from").replace(/@.*/,"");
	var Oponent = GAME_GetOponent(GameID);
	var Title = UTILS_GetText("game_adjourn");
	var Text;
	var Button1, Button2;

	// If receive a adjourn decline message
	if (Xmlns.match(/-decline/))
	{
		Text = UTILS_GetText("game_adjourn_denied");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}

		// Show message as a default alert window
		WINDOW_Alert(Title, Text);
	}
	// Show a confirm window to accept or declien adjourn
	else
	{
		Text = UTILS_GetText("game_adjourn_text");
		if (Text != null)
		{
			Text = Text.replace(/%s/, "<b>"+Oponent+"</b>");
		}
		Button1 = new Object();
		Button2 = new Object();

		// Ok button
		Button1.Name = UTILS_GetText("window_accept");
		Button1.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameAdjournAccept(GameID));
		};

		// Cancel button
		Button2.Name = UTILS_GetText("window_decline");
		Button2.Func = function () {
			CONNECTION_SendJabber(MESSAGE_GameAdjournDeny(GameID));
		};

		// Show message as a default confirm window
		WINDOW_Confirm(Title, Text, Button1, Button2);
	}
	return "";
}


/**
* @brief	Handle a game over message
*
* @param 	XML The xml that contains the ending game message
* @return 	XMPP to send
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function GAME_End(XML)
{
	var EndTag, Result;
  var Game, GameID;
	var Title = UTILS_GetText("game_end_game");
	var Playing;
	var CurrentGame = MainData.GetCurrentGame();

	var MyUsername = MainData.GetUsername();

	// Get the room name
	GameID = XML.getAttribute("from").replace(/@.*/,"");

	Game = MainData.GetGame(GameID);

	// Stop timer
	Game.Game.StopTimer();

	// Hide loading box
	Game.Game.HideLoadingMove();
	// Hide leave user box
	Game.Game.HideLeaveUser();

	// Finish game in structure
	if (Game)
	{
		Game.Finished = true;
	}

	// If this end game message is from a current game then
	// show message
	if(CurrentGame.Id == GameID)
	{
		// Get the reason 
		EndTag = XML.getElementsByTagName("end");
		if (EndTag.length > 0)
		{
			// Get the reason from tag 'reason'
			Result = EndTag[0].getAttribute("result");
		}
		else
		{
			Result = "canceled";
		}
		
		// Show end game message to user
		WINDOW_Alert(Title, UTILS_GetText("game_result_"+Result));
	}

	if ((Game.PB != MyUsername) && (Game.PW != MyUsername))
	{
		Playing = false;
	}
	else
	{
		Playing = true;
	}

	OLDGAME_EndGame(GameID);

	// Set status avaialable for players
	// TODO -> CHANGE THIS returns TO "BUFFER"
	if (Playing)
	{
		return CONTACT_ChangeStatus("available", "return");
	}
	// and do nothing for observers
	else
	{
		return "";
	}
}


/**
* @brief	Handle Game Error
*
* @param 	XML The xml that contains the error message
* @return 	XMPP to be send
* @author 	Pedro Rocha and Rubens Suguimoto
*/
export function GAME_HandleGameError(XML)
{
	var Query = XML.getElementsByTagName("query");
	var Xmlns;
	var Game, GameID;
	var Invalid, Over;

	// Getting query xmlns
	if (Query.length > 0)
	{
		Xmlns = Query[0].getAttribute("xmlns");
	}
	else 
	{
		return "";
	}

	// Getting game id
	GameID = XML.getAttribute("from").replace(/@.*/,"");

	if (Xmlns.match(/\/chessd\/game\/move/))
	{
		Invalid = XML.getElementsByTagName('invalid-move');
		Over = XML.getElementsByTagName('game-over');

		// If it's a invalid move
		if (Invalid.length > 0)
		{
			// Get game from GameList
			Game = MainData.GetGame(GameID);

			// Undo last move
			Game.Game.UndoMove();

			// Remove loading move message
			GAME_HideLoadingMove(GameID);
		}
		// If game is over
		else if (Over.length > 0)
		{
			return "";
		}
		// This case should happen when game is over in server
		// but not in interface
		else
		{
			WINDOW_Alert(UTILS_GetText("game_end_game"),UTILS_GetText("game_result_closed"));
			OLDGAME_EndGame(GameID);
		}
	}
	return "";
}

/**
* @brief	Start some game
*
* @param 	GameId 	Game identification number
* @param 	P1 	First Player Object (Name, Time, Color, Inc)
* @param 	P2 	Second Player Object (Name, Time, Color, Inc)
* @return 	XMPP to be send
* @author 	Rubens Suguimoto
*/
export function GAME_StartGame(GameId, P1, P2)
{
	var GameDiv;
	var YourColor;
	var Buffer="";
	var Room; 

	var Consts = MainData.GetConst();
	var CurrentGame = MainData.GetCurrentGame();
	var CurrentOldGame = MainData.GetCurrentOldGame();

	var MyUsername = MainData.GetUsername();

	// Cancel all announces
	ANNOUNCE_CancelAllAnnounce();

	// Hide current game (this case should happen when player
	// is observing a game)
	if (CurrentGame != null)
	{

		//Quickfix to leave room when you is observing some game
		Room = MainData.GetRoom(CurrentGame.Id);
		Buffer  += MESSAGE_Unavailable(Room.MsgTo);
		CurrentGame.Game.Hide();
		CurrentGame.Game.StopTimer();
		MainData.RemoveGame(CurrentGame.Id);
	}

	if (CurrentOldGame != null)
	{
		//Quickfix to leave room when you is observing a old game
		Room = MainData.GetRoom(CurrentOldGame.Id);
		if(Room != null)
		{
			Buffer  += MESSAGE_Unavailable(Room.MsgTo);
		}

		//TODO -> CHANGE THE ABOVE CODE TO OLDGAME_RemoveOldGame
		CurrentOldGame.Game.Hide();
		// In this version, player can see only one oldgame
		//MainData.RemoveOldGame(CurrentOldGame.Id);
		MainData.RemoveOldGame(0);

	}

	if (P1.Name == MyUsername)
	{
		YourColor = P1.Color;
	}
	else
	{
		YourColor = P2.Color;
	}

	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj(GameId, P1, P2, YourColor, 38, false);

	// Add game to data struct and set it to current game
	MainData.AddGame(GameId, P1.Name, P2.Name, YourColor, GameDiv);

	// Show New Game
	GameDiv.Show();

	// Get Players Photo
	Buffer += MESSAGE_GetProfile(P1.Name,Consts.IQ_ID_GamePhoto);
	Buffer += MESSAGE_GetProfile(P2.Name,Consts.IQ_ID_GamePhoto);

	// Hide gamecenter
	GAMECENTER_HideGameCenter();

	// Remove all challenges
	CHALLENGE_ClearChallenges();

	// Set status to dnd
	//TODO --> PUT THIS CHANGE STATUS IN BUFFER
	return CONTACT_ChangeStatus("dnd", "return") + Buffer;

}

/**
* @brief	Start Game in Observer Mode
*
* @param 	GameId	Game identification number
* @param 	P1 	White player object
* @param 	P2 	Black player object
* @return 	none
* @author 	Rubens Suguimoto
*/
export function GAME_StartObserverGame(GameId, P1, P2)
{
	//TODO -> CHANGE P1 TO PW AND P2 TO PB
	var GameDiv;
	var Buffer = "";

	var Consts = MainData.GetConst();
	var CurrentGame = MainData.GetCurrentGame();
	var CurrentOldGame = MainData.GetCurrentOldGame();
	var NewCurrentGame;

	// Hide gamecenter
	GAMECENTER_HideGameCenter();

	// Hide current game
	if (CurrentGame != null)
	{
		// In this version, player should be able to
		// observer just one game.
		GAME_RemoveGame(CurrentGame.Id);
	}

	if (CurrentOldGame != null)
	{
		OLDGAME_RemoveOldGame(0);
	}

	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj(GameId, P1, P2, "white", 38, true);
	MainData.AddGame(GameId, P1.Name, P2.Name, "none", GameDiv);

	NewCurrentGame = MainData.GetCurrentGame();
	NewCurrentGame.Finished = true;

	// Show New Game
	GameDiv.Show();
	// Set Observer Mode
	GameDiv.ObserverMode();

	//Set Timers
	GameDiv.UpdateWTime(0);
	GameDiv.UpdateBTime(0);
	GameDiv.SetWTime();
	GameDiv.SetBTime();

	// Get players Photos
	Buffer += MESSAGE_GetProfile(P1.Name,Consts.IQ_ID_GamePhoto);
	Buffer += MESSAGE_GetProfile(P2.Name,Consts.IQ_ID_GamePhoto);
	CONNECTION_SendJabber(Buffer);

	// Get game's history moves when enter in game room
	ROOM_EnterRoomGame(GameId);
}

/**
* @brief	Update board in data struct and interface
*
* @param 	GameId 		Game identification number
* @param 	BoardStr 	Board status in a string
* @param 	Move 		Chess Move (Piece/Orig-Dest)
* @param	ShortMove	Move in short notation
* @param 	P1 		First player object (Name, Time, Color, Inc)
* @param 	P2 		Second player object (Name, Time, Color, Inc)
* @param 	TurnColor 	Turn's Color("white"/"black")
* @return 	Empty string
* @author 	Rubens Suguimoto
*/
function GAME_UpdateBoard(GameId, BoardStr, Move, ShortMove, P1, P2, TurnColor)
{
	var NewBoardArray = UTILS_String2Board(BoardStr);
	var CurrentBoardArray;
	var Game;

	// Get game from GameList
	Game = MainData.GetGame(GameId);
	
	if (Game.CurrentMove != null)
	{
		CurrentBoardArray = Game.Moves[Game.CurrentMove].Board;
	}
	// if Move is first move in game
	else
	{
		CurrentBoardArray = new Array("--------","--------","--------","--------","--------","--------","--------","--------");
	}

	// Update data sctructure
	if (P1.Color == "white")
	{
		Game.AddMove(NewBoardArray, Move, ShortMove, P1.Time, P2.Time, TurnColor);
		Game.Game.UpdateWTime(P1.Time);
		Game.Game.UpdateBTime(P2.Time);
	}
	else
	{
		Game.AddMove(NewBoardArray, Move, ShortMove, P2.Time, P1.Time, TurnColor);
		Game.Game.UpdateWTime(P2.Time);
		Game.Game.UpdateBTime(P1.Time);
	}

	// Update turn in structure and interface
	Game.SetTurn(TurnColor);
	Game.Game.SetTurn(TurnColor);
	
	// Show new time
	Game.Game.SetWTime();
	Game.Game.SetBTime();

	// Update interface
	Game.Game.UpdateBoard(CurrentBoardArray, NewBoardArray, Game.YourColor);

	if((Move != "") || (ShortMove!= ""))
	{
		Game.Game.AddMove(Game.Moves.length, Move, ShortMove, P1.Time, P2.Time);
		Game.Game.SetLastMove(Move);
	}

	//Quick fix to start counter timers
	if (Game.Moves.length == 3)
	{
		Game.Game.StartTimer();
	}

	// Hide loading div
	Game.Game.HideLoadingMove();

	return "";
}

/**
* @brief	Remove a game from data struct and interface
*
* @param 	GameID 		Game identification number
* @return 	none
* @author 	Rubens Suguimoto and Pedro Rocha
*/
export function GAME_RemoveGame(GameID)
{
	var Game = MainData.GetGame(GameID);

	if (Game != null)
	{
		// TODO -> put comparation "== true"
		if (Game.Finished)
		{
			// Remove game board from interface
			Game.Game.StopTimer();
			Game.Game.Remove();
			
			// Remove board from data struct
			MainData.RemoveGame(GameID);

			// Send message to leave room
			ROOM_ExitRoom(GameID);

			// Show gamecenter again
			GAMECENTER_ShowGameCenter();
		}
		else
		{
			WINDOW_Alert(UTILS_GetText("game_remove_game_title"), UTILS_GetText("game_remove_board"));
		}
	}
}

/**
* @brief	Send a game movement to server
*
* @param 	OldLine		Line origin position
* @param 	OldCol 		Column origin position
* @param 	NewLine		Line dest position
* @param 	NewCol 		Column dest position
* @return 	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function GAME_SendMove(OldLine, OldCol, NewLine, NewCol)
{
	var Move;
	var Promotion = "";

	var CurrentGame = MainData.GetCurrentGame();
	var CurrentMove = CurrentGame.CurrentMove;
	var CurrentBoard = CurrentGame.Moves[CurrentMove].Board;

	// Create long notation
	if (CurrentGame.YourColor == "white")
	{
		Move = UTILS_HorizontalIndex(OldCol)+OldLine+UTILS_HorizontalIndex(NewCol)+NewLine;

	}
	else
	{
		Move = UTILS_HorizontalIndex(9-OldCol)+(9-OldLine)+UTILS_HorizontalIndex(9-NewCol)+(9-NewLine);

	}

	// Check for pawn promotion.
	if(NewLine == 8)
	{
		if(CurrentGame.YourColor == "white")
		{
			if(CurrentBoard[8-OldLine][OldCol-1] == "P")
			{
				Promotion = CurrentGame.Promotion;
			}
		}
		else
		{
			if(CurrentBoard[OldLine-1][8-OldCol] == "p")
			{
				Promotion = CurrentGame.Promotion;
			}
		}
	}

	// Send move for the current game
	CONNECTION_SendJabber(MESSAGE_GameMove(Move, CurrentGame.Id, Promotion));
}

/**
* @brief	Send a draw message request to oponent
*
* @param 	GameID		Game identification number
* @return 	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function GAME_SendDraw(GameID)
{
	CONNECTION_SendJabber(MESSAGE_GameRequestDraw(GameID));
}

/**
* @brief	Send a adjourn message to oponent
*
* @param 	GameID		Game identification number
* @return 	none
* @author	Pedro
*/
export function GAME_SendCancel(GameID)
{
	CONNECTION_SendJabber(MESSAGE_GameRequestCancel(GameID));
}

/**
* @brief	Send a adjourn message to oponent
*
* @param 	GameID		Game identification number
* @return 	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function GAME_SendAdjourn(GameID)
{
	CONNECTION_SendJabber(MESSAGE_GameRequestAdjourn(GameID));
}

/*
* @brief	Send a message to get your current games
*
* This function is used to continue your game, if for some reason your game was interrupted
*
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_SearchCurrentGame()
{
	CONNECTION_SendJabber(MESSAGE_GameSearchCurrentGame());
}

/**
* @brief	Change current game piece promotion
*
* @param 	Piece	Piece character
* @return 	none
* @author	Rubens Suguimoto
*/
export function GAME_ChangePromotion(Piece)
{
	var CurrentGame = MainData.GetCurrentGame();
	CurrentGame.Promotion = Piece;
}

/**
* @brief	Send a resign message request to oponent
*
* @param 	GameID 	Game identification number
* @return 	none
* @author	Pedro Rocha and Rubens Suguimoto
*/
export function GAME_SendResign(GameID)
{
	var Title = UTILS_GetText("game_resign");
	var Text;
	var Button1, Button2;

	Text = UTILS_GetText("game_resign_confirm");
	Button1 = new Object();
	Button2 = new Object();

	// Ok button
	Button1.Name = UTILS_GetText("window_ok");
	Button1.Func = function () {
		CONNECTION_SendJabber(MESSAGE_GameResign(GameID));
	};

	// Cancel button
	Button2.Name = UTILS_GetText("window_cancel");
	
	// Show message as a default confirm window
	WINDOW_Confirm(Title, Text, Button1, Button2);
}

/**
* @brief	Load all game history moves done in the game
*
* @param 	GameID 		Game identification number
* @param 	HistoryXml 	XML that contains all games states
* @param 	Player1 	First player object (Name, Time, Color, Inc)
* @param 	Player2 	Second player object (Name, Time, Color, Inc)
* @return 	none
* @author	Rubens Suguimoto
*/
function GAME_LoadGameHistory(GameID, HistoryXml, Player1, Player2)
{
	var i;
	var StartP1Time, StartP2Time, HTurn, HTime, HBoard, HMove, HShortMove;
	var HPlayer1 = new Object();
	var HPlayer2 = new Object();
	var HistoryMoves;
	var Buffer = "";

	if(HistoryXml == undefined)
	{
		return Buffer;
	}

	HistoryMoves = HistoryXml.getElementsByTagName("state");

	StartP1Time = HistoryXml.getElementsByTagName("player")[0].getAttribute("time");
	StartP2Time = HistoryXml.getElementsByTagName("player")[1].getAttribute("time");

	// Get first player data
	HPlayer1.Name = Player1.Name;
	HPlayer1.Inc = Player1.Inc;
	HPlayer1.Color = Player1.Color;
	HPlayer1.Time = StartP1Time;

	// Get second player data
	HPlayer2.Name = Player2.Name;
	HPlayer2.Inc = Player2.Inc;
	HPlayer2.Color = Player2.Color;
	HPlayer2.Time = StartP2Time;

	// Load game history
	for(i=0 ; i<HistoryMoves.length; i++)
	{
		HTime = HistoryMoves[i].getAttribute("time");
		HTurn = HistoryMoves[i].getAttribute("turn");
		HBoard = HistoryMoves[i].getAttribute("board");
		HMove = HistoryMoves[i].getAttribute("move");
		HShortMove = HistoryMoves[i].getAttribute("short");

		if(HTurn == "white")
		{
			HPlayer2.Time = HTime;
		}
		else
		{
			HPlayer1.Time = HTime;
		}

		Buffer += GAME_UpdateBoard(GameID, HBoard, HMove, HShortMove, HPlayer1, HPlayer2, HTurn);
	}

	return Buffer;
}

/**
* @brief	Handle Game Players Photo
*
* @param 	XML 	XMPP that contains vCard photo
* @return 	none
* @author 	Rubens Suguimoto
*/
export function GAME_HandleVCardPhoto(XML)
{
  console.log('vcard: ', XML);
	var Photo;
	var Player;
	var Binval;
	var PhotoType;
	var Img;

	var CurrentGame = MainData.GetCurrentGame();

	// If there is no game opened, do nothing;
	if(CurrentGame == null)
	{
		return "";
	}
	
	// Get player image
	Photo = XML.getElementsByTagName("PHOTO")[0]; 

	// If player don't use any image, do nothing
	if(!Photo) 
	{ 
		return "";
	}

	// Get photo image type 
	PhotoType = UTILS_GetNodeText(Photo.getElementsByTagName("TYPE")[0]); 
	// Get photo image in base64
	Binval = UTILS_GetNodeText(Photo.getElementsByTagName("BINVAL")[0]); 

  if (!Binval) {
    return "";
  }

	Img = "data:"+PhotoType+";base64,"+Binval; 

	Player = XML.getAttribute("from").split("@")[0];

	// Update current game player image
	// Player White
	if(CurrentGame.PW == Player)
	{
		CurrentGame.WPhoto = Img;
		CurrentGame.Game.SetWPhoto(Img);
	}
	// Player Black
	else if(CurrentGame.PB == Player)
	{
		CurrentGame.BPhoto = Img;
		CurrentGame.Game.SetBPhoto(Img);
	}

	return "";
}

/*
* @brief	Set remaining time to both players
*
* @param	GameID	Game identification number
* @param	WTime	White player's remaining time
* @param	BTime	Black player's remaining time
* @return	none
* @author	Rubens Suguimoto
*/
function GAME_SetLeftTime(GameID, WTime, BTime)
{
	var Game = MainData.GetGame(GameID);

	if(Game != null)
	{
		Game.Game.UpdateWTime(WTime);
		Game.Game.UpdateBTime(BTime);

		Game.Game.SetWTime();
		Game.Game.SetBTime();
	}
}

/*
* @brief	Show loading move message
*
* @param	Id	Game identification number
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_ShowLoadingMove(Id)
{
	var Game = MainData.GetGame(Id);

	Game.Game.ShowLoadingMove();
}

/*
* @brief	Hide loading move message
*
* @param	Id	Game identification number
* @return	none
* @author	Rubens Suguimoto
*/
function GAME_HideLoadingMove(Id)
{
	var Game = MainData.GetGame(Id);

	Game.Game.HideLoadingMove();
}

/*
* @brief	Set a border around some block in current game board
*
* @param	Line	Block line
* @param	Col	Block column
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_SetBlockBorder(Line, Col)
{
	var CurrentGame = MainData.GetCurrentGame();
	var BlockId;

	// Create long notation
	if (CurrentGame.YourColor == "white")
	{
		BlockId = UTILS_HorizontalIndex(Col)+Line;
	}
	else
	{
		BlockId = UTILS_HorizontalIndex(9-Col)+(9-Line);
	}

	CurrentGame.Game.SetBlockBorder(BlockId);
}

/*
* @brief	Set block class
*
* @param	Line	Block line
* @param	Col	Block column
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_SetBlockClass(Line, Col)
{
	var Game = MainData.GetCurrentGame();
	var BlockId;

	// Create long notation
	if (Game.YourColor == "white")
	{
		BlockId = UTILS_HorizontalIndex(Col)+Line;
	}
	else
	{
		BlockId = UTILS_HorizontalIndex(9-Col)+(9-Line);
	}

	Game.Game.SetBlockClass(BlockId);
}

/*
* @brief	Remove border around some block in current game board
*
* @param	Line	Block line
* @param	Col	Block column
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_RemoveBlockBorder(Line, Col)
{
	var CurrentGame = MainData.GetCurrentGame();
	var BlockId;

	if (CurrentGame == null)
	{
		CurrentGame = MainData.GetCurrentOldGame();
	}

	// Create long notation
	if (CurrentGame.YourColor == "white")
	{
		BlockId = UTILS_HorizontalIndex(Col)+Line;
	}
	else
	{
		BlockId = UTILS_HorizontalIndex(9-Col)+(9-Line);
	}

	CurrentGame.Game.RemoveBlockBorder(BlockId);
}

/*
* @brief	Get oponent's username
*
* @param	GameId	Game identification number
* @return	Oponent's username string
* @author	Rubens Suguimoto
*/
function GAME_GetOponent(GameId)
{
	var Game = MainData.GetGame(GameId);

	if(Game == null)
	{
		return null;
	}

	if(Game.YourColor == "white")
	{
		return Game.PB;
	}
	else
	{
		return Game.PW;
	}
}

/*
* @brief	Remove block class
*
* @param	Line	Block line
* @param	Col	Block column
* @return	none
* @author	Rubens Suguimoto
*/
export function GAME_RemoveBlockClass(Line, Col)
{
	var Game = MainData.GetCurrentGame();
	var BlockId;

	if (Game == null)
	{
		Game = MainData.GetCurrentOldGame();
	}

	// Create long notation
	if (Game.YourColor == "white")
	{
		BlockId = UTILS_HorizontalIndex(Col)+Line;
	}
	else
	{
		BlockId = UTILS_HorizontalIndex(9-Col)+(9-Line);
	}

	Game.Game.RemoveBlockClass(BlockId);
}
