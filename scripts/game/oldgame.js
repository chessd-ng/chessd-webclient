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
* This file contains OldGame 
*/

/**
* Handle Search Old Games Messages
*
* @param        XML The xml that contains the string 'search_game' in xmlns attribute
* @return       Buffer with the messages that must be send
* @author       Rubens;
*/
function OLDGAME_HandleSearchOldGame(XML)
{
	var Games;
	var i;
	var Buffer="";
	var GameList = new Array();
	var GameInfoTmp;
	var Players;


	Games = XML.getElementsByTagName("game");

	// Create a Array of game infos object
	for(i=0; i<Games.length; i++)
	{
		// Create a game object and set attributes (white, black,
		// winner, date, id, gametype, wintype)
		GameInfoTmp = new Object();
		Players = Games[i].getElementsByTagName("player");

		if(Players[0].getAttribute("role")=="white")
		{
			GameInfoTmp.white = Player[0].getAttribute("role");
			GameInfoTmp.black = Player[1].getAttribute("role");

			if(Players[0].getAttribute("score")=="1")
			{
				GameInfoTmp.winner = "white";
			}
			else
			{
				GameInfoTmp.winner = "black";
			}
		}
		else
		{
			GameInfoTmp.white = Player[1].getAttribute("role");
			GameInfoTmp.black = Player[0].getAttribute("role");

			if(Players[0].getAttribute("score")=="1")
			{
				GameInfoTmp.winner = "black";
			}
			else
			{
				GameInfoTmp.winner = "white";
			}
		}


		GameInfoTmp.date = Games[i].getAttribute("time_stamp");
		GameInfoTmp.gametype = Games[i].getAttribute("category");
		GameInfoTmp.id = Games[i].getAttribute("id");
		GameInfoTmp.wintype = "-----";

		GameList.push(GameInfoTmp);
	}

	WINDOW_OldGameResult(Games);

	return Buffer;
}

/** 
* Start Game in OldGame Mode
* 
* @param        P1 is Player 1 Object (Attributes: Name, Time, Color, Inc) 
* @param        P2 is Player 2 Object (Attributes: Name, Time, Color, Inc) 
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_StartOldGame(P1, P2, OldGameId)
{
	var GameDiv;
	var Index;

	// Hide current game
	if (MainData.CurrentOldGame != null)
	{
		MainData.CurrentOldGame.Game.Hide();
	}

	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj(OldGameId, P1.Name, P2.Name, "white");
	Index = MainData.AddOldGame(OldGameId, P1.Name, P2.Name, "none", GameDiv);

	// Show New Game
	GameDiv.Show();
	// Set Old Game Mode
	GameDiv.OldGameMode();

	//Change "X" close board button function when clicked
	NewOldGame.EventButtons[NewOldGame.EventButtons.length-1].onclick = function(){ OLDGAME_RemoveOldGame(Index)};

	// Send a message to get game moves
	MESSAGE_FecthOldGame(OldGameId);

}

/**
* Handle Game State
* It's a good ideia to read the server's documentation before reading the code above
*
* @param 	XML The xml that contains the game state
* @return 	void
* @author 	Ulysses and Rubens
*/
function OLDGAME_FetchOldGame(XML)
{
	var GameTag;
	var GameID, PlayerTag;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	var HistoryStates;

	GameTag = XML.getElementsByTagName[0];

	GameID = Game.getAttribute("id");
	PlayerTag = XML.getElementsByTagName("player");

	HistoryStates = XML.getElementsByTagName("state");

	Player1.Name = PlayerTag[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = PlayerTag[0].getAttribute('inc');
	Player1.Color = PlayerTag[0].getAttribute('color');
	Player1.Time = PlayerTag[0].getAttribute('time');
		
	Player2.Name = PlayerTag[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = PlayerTag[1].getAttribute('inc');
	Player2.Color = PlayerTag[1].getAttribute('color');
	Player2.Time = PlayerTag[1].getAttribute('time');

	// History moves
	if (MainData.FindGame(GameID) == null)
	{
		Buffer += OLDGAME_StartOldGame(GameID, Player1, Player2);
		Buffer += GAME_LoadGameHistory(GameID, History, Player1, Player2);
	}
	else
	{
		Buffer += GAME_LoadGameHistory(GameID, History, Player1, Player2);
	}

	return Buffer;
}

/** 
* Change board GameMode to OldGame Mode when game is over
* 
* @param        Id is Game ID  
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_EndGame(Id)
{
	var EndedGame;
	var PWName, PBName, Color;
	var NewOldGame;
	var i;
	var MoveObj;
	var Index;
	
	EndedGame = MainData.RemoveGame(Id);

	//Add game to oldgamelist, set this game to CurrentOldGame
	//and return EndedGame Pos;
	Index = MainData.PushOldGame(EndedGame);

	MainData.CurrentOldGame.Color = "none";

	PWName = MainData.CurrentOldGame.PW;
	PBName = MainData.CurrentOldGame.PB;
	Color = MainData.CurrentOldGame.BoardColor;

	NewOldGame = MainData.CurrentOldGame.Game;
	NewOldGame.OldGameMode();

	//Change "X" close board button function when clicked
	NewOldGame.EventButtons[NewOldGame.EventButtons.length-1].onclick = function(){ OLDGAME_RemoveOldGame(Index)};
	
	OLDGAME_LastBoard();
	
	//Reload all moves done in MoveList
	for(i=0 ; i<MainData.CurrentOldGame.Moves.length; i++)
	{
		MoveObj = MainData.CurrentOldGame.Moves[i];
		NewOldGame.AddMove((i+1), MoveObj.Move, MoveObj.PWTime, MoveObj.PBTime)
	}

}

/** 
* Remove OldGame board from interface and OldGameList
* 
* @param        Index is array index of OldGame
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_RemoveOldGame(Index)
{
	//Remove Board
	MainData.OldGameList[Index].Game.Remove();
	MainData.RemoveOldGame(Index);
	//ROOM_ExitRoom();
}

/** 
* Change current board to first game board
* 
* @param        void
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_FirstBoard()
{
	var Color, Board;
	var MovePos = MainData.CurrentOldGame.CurrentMove;
	var WTime, BTime;
	var Move;

	Color = MainData.CurrentOldGame.BoardColor;
	Board = MainData.CurrentOldGame.Moves[0].Board;

	Move = MainData.CurrentOldGame.Moves[0].Move;

	WTime = MainData.CurrentOldGame.Moves[ 0 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ 0 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = 0;
	MainData.CurrentOldGame.Game.SetBoard(Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
	MainData.CurrentOldGame.Game.SetLastMove(Move);
}

/** 
* Change current board to previous game board
* 
* @param        void
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_PrevBoard()
{
	var Color, OldBoard, Board;
	var MovePos = MainData.CurrentOldGame.CurrentMove;
	var WTime, BTime;
	var Move; 

	if(MovePos == 0)
	{
		return false;
	}

	Color = MainData.CurrentOldGame.BoardColor;
	OldBoard = MainData.CurrentOldGame.Moves[MovePos].Board;
	Board = MainData.CurrentOldGame.Moves[MovePos -1].Board;
	Move = MainData.CurrentOldGame.Moves[MovePos - 1].Move;

	WTime = MainData.CurrentOldGame.Moves[ MovePos - 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MovePos - 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MovePos - 1;
	MainData.CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
	MainData.CurrentOldGame.Game.SetLastMove(Move);
}

/** 
* Change current board to next game board
* 
* @param        void
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_NextBoard()
{
	var Color, OldBoard, Board;

	var MovePos = MainData.CurrentOldGame.CurrentMove;
	var WTime, BTime;
	var Move; 

	if(MovePos == MainData.CurrentOldGame.Moves.length-1)
	{
		return false;
	}

	Color = MainData.CurrentOldGame.BoardColor;
	OldBoard = MainData.CurrentOldGame.Moves[MovePos].Board;
	Board = MainData.CurrentOldGame.Moves[ MovePos + 1 ].Board;
	Move = MainData.CurrentOldGame.Moves[MovePos + 1].Move;

	WTime = MainData.CurrentOldGame.Moves[ MovePos + 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MovePos + 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MovePos + 1;
	MainData.CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
	MainData.CurrentOldGame.Game.SetLastMove(Move);
}

/** 
* Change current board to last game board
* 
* @param        void
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_LastBoard()
{
	var Color, Board;
	var MoveListLen = MainData.CurrentOldGame.Moves.length;
	var WTime, BTime;
	var Move; 

	Color = MainData.CurrentOldGame.BoardColor;
	Board = MainData.CurrentOldGame.Moves[MoveListLen-1].Board;
	Move = MainData.CurrentOldGame.Moves[MoveListLen -1].Move;

	WTime = MainData.CurrentOldGame.Moves[ MoveListLen - 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MoveListLen - 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MoveListLen-1;
	MainData.CurrentOldGame.Game.SetBoard(Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
	MainData.CurrentOldGame.Game.SetLastMove(Move);
}

