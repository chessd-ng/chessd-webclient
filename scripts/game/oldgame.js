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
* Start Game in OldGame Mode
* 
* @param        P1 is Player 1 Object (Attributes: Name, Time, Color, Inc) 
* @param        P2 is Player 2 Object (Attributes: Name, Time, Color, Inc) 
* @return       void 
* @see		MainData methods and Game Interface Object;
* @author       Rubens 
*/
function OLDGAME_StartOldGame(P1, P2)
{
	var GameDiv, GameId;

	// Hide current game
	if (MainData.CurrentGame != null)
	{
		MainData.CurrentGame.Game.Hide();
	}

	GameId = MainData.OldGameList.length;

	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj("OldGame_"+GameId, P1.Name, P2.Name, "w");
	MainData.AddOldGame(GameId, P1.Name, P2.Name, "none", GameDiv);

	// Show New Game
	GameDiv.Show();
	// Set Old Game Mode
	GameDiv.OldGameMode();

	// Send a message to get game moves
	// TODO TODO TODO

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
	var NewOIdGame;
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

	Color = MainData.CurrentOldGame.BoardColor;
	Board = MainData.CurrentOldGame.Moves[0].Board;

	WTime = MainData.CurrentOldGame.Moves[ 0 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ 0 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = 0;
	MainData.CurrentOldGame.Game.SetBoard(Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
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

	if(MovePos == 0)
	{
		return false;
	}

	Color = MainData.CurrentOldGame.BoardColor;
	OldBoard = MainData.CurrentOldGame.Moves[MovePos].Board;
	Board = MainData.CurrentOldGame.Moves[MovePos -1].Board;

	WTime = MainData.CurrentOldGame.Moves[ MovePos - 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MovePos - 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MovePos - 1;
	MainData.CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
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

	if(MovePos == MainData.CurrentOldGame.Moves.length-1)
	{
		return false;
	}

	Color = MainData.CurrentOldGame.BoardColor;
	OldBoard = MainData.CurrentOldGame.Moves[MovePos].Board;
	Board = MainData.CurrentOldGame.Moves[ MovePos + 1 ].Board;

	WTime = MainData.CurrentOldGame.Moves[ MovePos + 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MovePos + 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MovePos + 1;
	MainData.CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
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

	Color = MainData.CurrentOldGame.BoardColor;
	Board = MainData.CurrentOldGame.Moves[MoveListLen-1].Board;

	WTime = MainData.CurrentOldGame.Moves[ MoveListLen - 1 ].PWTime;
	BTime = MainData.CurrentOldGame.Moves[ MoveListLen - 1 ].PBTime;

	MainData.CurrentOldGame.CurrentMove = MoveListLen-1;
	MainData.CurrentOldGame.Game.SetBoard(Board, Color, 38);
	MainData.CurrentOldGame.Game.UpdateWTime(WTime);
	MainData.CurrentOldGame.Game.UpdateBTime(BTime);
	MainData.CurrentOldGame.Game.SetWTime();
	MainData.CurrentOldGame.Game.SetBTime();
}

