import { CONTACT_ChangeStatus } from 'contact/status.js';
import { MESSAGE_GetProfile, MESSAGE_GetOldGames } from 'xmpp_messages/message.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import {
	UTILS_GetText,
	UTILS_GetNodeText,
	UTILS_ConvertTimeStamp,
	UTILS_String2Board,
} from 'utils/utils.js';
import { ROOM_ExitRoom } from 'room/room.js';
import { INTERFACE_GameBoardObj } from 'interface/game.js';
import { INTERFACE_HideOldgameLoading } from 'interface/oldgame.js';
import { GAMECENTER_HideGameCenter, GAMECENTER_ShowGameCenter } from 'gamecenter/gamecenter.js';
import { WINDOW_Alert, WINDOW_OldGame } from 'window/window.js';

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
* @file		game/oldgame.js
* @brief	This file contains old game functions
*/

/**
* @brief	Handle search old games messages
*
* @param        XML	XMPP that contains search game data result
* @return       XMPP to be send
* @author       Rubens Suguimoto
*/
export function OLDGAME_HandleSearchOldGame(XML)
{
	var Games, GameList;
	var i;
	var Buffer="";
	var GameList = new Array();
	var GameInfoTmp;
	var Players;
	var Result;
	var More;
	var Id, SearchGameWindow;
	var LoadingBox;


	// Get window's Id
	Id = XML.getAttribute("id").split("-")[1];

	SearchGameWindow = MainData.GetSearchGameInfo(Id);
	Games = XML.getElementsByTagName("game");
	if(XML.getElementsByTagName("more")[0] != undefined)
	{
		SearchGameWindow.More = true;
		More = true;
	}
	else
	{
		SearchGameWindow.More = false;
		More = false;
	}

	// Create a Array of game infos object
	for(i=0; i<Games.length; i++)
	{
		// Create a game object and set attributes (white, black,
		// date, id, gametype, wintype)
		GameInfoTmp = new Object();
		Players = Games[i].getElementsByTagName("player");

		if(Players[0].getAttribute("role")=="white")
		{
			GameInfoTmp.white = Players[0].getAttribute("jid").split("@")[0];
			GameInfoTmp.black = Players[1].getAttribute("jid").split("@")[0];
		}
		else
		{
			GameInfoTmp.white = Players[1].getAttribute("jid").split("@")[0];
			GameInfoTmp.black = Players[0].getAttribute("jid").split("@")[0];
		}

		GameInfoTmp.date = UTILS_ConvertTimeStamp(Games[i].getAttribute("time_stamp"));
		GameInfoTmp.gametype = Games[i].getAttribute("category");
		GameInfoTmp.id = Games[i].getAttribute("id");
		GameInfoTmp.result = OLDGAME_GameResult(Games[i].getAttribute("result"));
	
		GameList.push(GameInfoTmp);
	}

	// Remove loading message
	INTERFACE_HideOldgameLoading();

	// Show old game search result
	SearchGameWindow.Elements.SetResult(Id, GameList, More);
	SearchGameWindow.Elements.SetPlayer1(SearchGameWindow.P1);
	SearchGameWindow.Elements.SetPlayer2(SearchGameWindow.P2);
	SearchGameWindow.Elements.SetColor(SearchGameWindow.Color);
	SearchGameWindow.Elements.SetFrom(SearchGameWindow.From);
	SearchGameWindow.Elements.SetTo(SearchGameWindow.To);

	return Buffer;
}

/** 
* @brief	Start Game in OldGame Mode
*
* @param	OldGameId	Old game identification number (index) 
* @param        P1 	First player object (Name, Time, Color, Inc)
* @param        P2	Second player object (Name, Time, Color, Inc)
* @return       XMPP to send 
* @author       Rubens Suguimoto
*/
function OLDGAME_StartOldGame(OldGameId, P1, P2)
{
	var GameDiv;
	var Index;
	var Color;
	var Buffer = "";
	var Consts = MainData.GetConst();
	
	var MyUsername = MainData.GetUsername();

	var CurrentOldGame = MainData.GetCurrentOldGame();

	// Hide current game
	if (CurrentOldGame != null)
	{
		//In this version, user can only see one OldGame
		//CurrentOldGame.Game.Hide();
		Buffer += OLDGAME_RemoveOldGame(OldGameId);

	}

	// Check if player is watch own old game
	if(P1.Name == MyUsername)
	{
		Color = P1.Color;
	}
	else if (P2.Name == MyUsername)
	{
		Color = P2.Color;
	}
	else //See anothers players old game
	{
		Color = "white";
	}

	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj(OldGameId, P1, P2, Color, 38, true);
	Index = MainData.AddOldGame(P1, P2, "none", GameDiv);

	// Show New Game
	GameDiv.Show();
	// Set Old Game Mode
	GameDiv.OldGameMode();

	//Change "X" close board button function when clicked
	GameDiv.EventButtons[GameDiv.EventButtons.length-1].onclick = function(){ OLDGAME_RemoveOldGame(Index)};

	Buffer += MESSAGE_GetProfile(P1.Name,Consts.IQ_ID_OldGamePhoto);
	Buffer += MESSAGE_GetProfile(P2.Name,Consts.IQ_ID_OldGamePhoto);

	//Change user status to observer
	//Buffer += CONTACT_ChangeStatus("","return");

	// Hide gamecenter
	GAMECENTER_HideGameCenter();

	return Buffer;
}

/**
* @brief	Handle old game states
*
* @param 	XML 	XMPP that contains the game state
* @return 	XMPP to send
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
export function OLDGAME_FetchOldGame(XML)
{
	var GameTag;
	var GamePos, PlayerTag;
	var Player1 = new Object();
	var Player2 = new Object();
	var Buffer = "";
	var History;

	GameTag = XML.getElementsByTagName("game")[0];

	//GamePos = MainData.OldGameList.length;
	GamePos = 0;

	PlayerTag = XML.getElementsByTagName("player");

	History = XML.getElementsByTagName("history")[0];

	Player1.Name = PlayerTag[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = PlayerTag[0].getAttribute('inc');
	Player1.Color = PlayerTag[0].getAttribute('color');
	Player1.Time = PlayerTag[0].getAttribute('time');
		
	Player2.Name = PlayerTag[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = PlayerTag[1].getAttribute('inc');
	Player2.Color = PlayerTag[1].getAttribute('color');
	Player2.Time = PlayerTag[1].getAttribute('time');

	// Open a board
	Buffer = OLDGAME_StartOldGame(GamePos, Player1, Player2);

	// Load history moves
	Buffer += OLDGAME_LoadGameHistory(GamePos, History, Player1, Player2);

	return Buffer;
}

/**
* @brief	Load all game history moves done in the game
*
* @param        GamePos		Game identification number (index)
* @param        HistoryXml 	XML that contains all games states
* @param        Player1 	First Player object (Name, Time, Color, Inc)
* @param        Player2 	Second Player object (Name, Time, Color, Inc)
* @return       XMPP to send
* @author       Rubens Suguimoto
*/
function OLDGAME_LoadGameHistory(GamePos, HistoryXml, Player1, Player2)
{
	var i;
	var StartP1Time, StartP2Time, HTurn, HTime, HBoard, HMove, HShortMove;
	var HPlayer1 = new Object();
	var HPlayer2 = new Object();
	var HistoryMoves;
	var Buffer;

	var CurrentOldGame = MainData.GetCurrentOldGame();

	if(HistoryXml == undefined)
	{
		return "";
	}

	HistoryMoves = HistoryXml.getElementsByTagName("state");

	StartP1Time = HistoryXml.getElementsByTagName("player")[0].getAttribute("time");
	StartP2Time = HistoryXml.getElementsByTagName("player")[1].getAttribute("time");
	HPlayer1.Name = Player1.Name;
	HPlayer1.Inc = Player1.Inc;
	HPlayer1.Color = Player1.Color;
	HPlayer1.Time = StartP1Time;

	HPlayer2.Name = Player2.Name;
	HPlayer2.Inc = Player2.Inc;
	HPlayer2.Color = Player2.Color;
	HPlayer2.Time = StartP2Time;

	if(HistoryMoves.length == 0)
	{
		WINDOW_Alert(UTILS_GetText("game_observer_alert_title"), UTILS_GetText("oldgame_no_moves"));
	}
	else
	{
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

			Buffer += OLDGAME_UpdateBoard(GamePos, HBoard, HMove, HShortMove, HPlayer1, HPlayer2, HTurn)
		}

		OLDGAME_FirstBoard();
	}

	CurrentOldGame.Game.HideLoadingMove();
	return Buffer;
}

/**
* @brief	Update board in data struct and interface
*
* @param        GamePos		Game identification number (index)
* @param        BoardStr	Board status in a string
* @param        Move		Chess game move (Piece/Orig-Dest)
* @param	ShortMove	Move in short format
* @param        P1		First player object (Name, Time, Color, Inc)
* @param        P2 		Second player object (Name, Time, Color, Inc)
* @param        TurnColor	Game turn color ("white"/"black")
* @return       Empty string
* @author       Rubens Suguimoto
*/
function OLDGAME_UpdateBoard(GamePos, BoardStr, Move, ShortMove, P1, P2, TurnColor)
{
	var NewBoardArray = UTILS_String2Board(BoardStr);
	var CurrentBoardArray;
	var Game;

	// Get game from GameList
	//Game = MainData.GetOldGame(GamePos);
	// In this version, user can only see one OldGame
	Game = MainData.GetCurrentOldGame();
	
	if (Game.CurrentMove != null)
	{
		CurrentBoardArray = Game.Moves[Game.CurrentMove].Board;
	}
	// If there's no previous moves
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

	if((Move !="") || (ShortMove !=""))
	{
		Game.Game.AddMove(Game.Moves.length, Move, ShortMove, P1.Time, P2.Time);
	}

	return "";
}


/** 
* @brief	Change board GameMode to OldGame Mode when game was over
* 
* @param        Id	Game identification number
* @return       none
* @author       Rubens Suguimoto
*/
export function OLDGAME_EndGame(Id)
{
	var EndedGame;
	var PWName, PBName, Color;
	var NewOldGame;
	var i;
	var MoveObj;
	var Index;
	
	var CurrentOldGame;

	EndedGame = MainData.RemoveGame(Id);

	//Add game to oldgamelist, set this game to CurrentOldGame
	//and return EndedGame Pos;
	Index = MainData.PushOldGame(EndedGame);

	CurrentOldGame = MainData.GetCurrentOldGame();

	CurrentOldGame.Color = "none";

	// Remove on mouse over and on mouse out events from blocks
	CurrentOldGame.Game.RemoveBlockEvents();

	PWName = CurrentOldGame.PW;
	PBName = CurrentOldGame.PB;
	Color = CurrentOldGame.BoardColor;

	NewOldGame = CurrentOldGame.Game;
	NewOldGame.OldGameMode();

	//Change "X" close board button function when clicked
	NewOldGame.EventButtons[NewOldGame.EventButtons.length-1].onclick = function(){ OLDGAME_RemoveOldGame(Index)};
	
	OLDGAME_LastBoard();
	
	//Reload all moves done in MoveList
	for(i=1 ; i<CurrentOldGame.Moves.length; i++)
	{
		MoveObj = CurrentOldGame.Moves[i];
		// i+1 is a QuickFix
		NewOldGame.AddMove((i+1), MoveObj.Move, MoveObj.ShortMove, MoveObj.PWTime, MoveObj.PBTime)
	}

	NewOldGame.HideLoadingMove();
}


/**
* @brief	Handle game players photos
*
* @param        XML	XMPP that contains vCard photo
* @return       Empty string
* @author       Rubens Suguimoto
*/
export function OLDGAME_HandleVCardPhoto(XML)
{
	var Photo;
	var Player;
	var Binval;
	var PhotoType;
	var Img;

	var CurrentOldGame = MainData.GetCurrentOldGame();

	if( CurrentOldGame == null)
	{
		return "";
	}

	// Get player image
	Photo = XML.getElementsByTagName("PHOTO")[0];

	// If player don't use any image, do nothing
	if(Photo == null)
	{
		return "";
	}

	// Get photo image 
	PhotoType = UTILS_GetNodeText(Photo.getElementsByTagName("TYPE")[0]);
	Binval = UTILS_GetNodeText(Photo.getElementsByTagName("BINVAL")[0]);
	Img = "data:"+PhotoType+";base64,"+Binval;

	Player = XML.getAttribute("from").split("@")[0];

	// Update current old game player image
	if(CurrentOldGame.PW.Name == Player)
	{
		CurrentOldGame.WPhoto = Img;
		CurrentOldGame.Game.SetWPhoto(Img);
	}
	else if(CurrentOldGame.PB.Name == Player)
	{
		CurrentOldGame.BPhoto = Img;
		CurrentOldGame.Game.SetBPhoto(Img);
	}

	return "";
}


/** 
* @brief	Remove OldGame board from interface and OldGameList
* 
* @param        Index	OldGame identification number (index)
* @return       none
* @author       Rubens Suguimoto
*/
export function OLDGAME_RemoveOldGame(Index)
{
	var Room;
	var Buffer = "";
	var OldGame;

	OldGame = MainData.GetOldGame(Index);

	//Remove Board from interface
	OldGame.Game.Remove();

	//Exit room if is there some room affiliated with oldgame;
	Room = MainData.GetRoom(OldGame.Id);
	if(Room != null)
	{
		// Send a message to leave from room
		Buffer += ROOM_ExitRoom(Room.Name);
	}

	MainData.RemoveOldGame(Index);

	// Show gamecenter again
	GAMECENTER_ShowGameCenter();
}

/** 
* @brief	Change current board state to first game board state
* 
* @return       none 
* @author       Rubens Suguimoto
*/
export function OLDGAME_FirstBoard()
{
	var Color, Board;
	var WTime, BTime;
	var Move;

	var CurrentOldGame = MainData.GetCurrentOldGame();
	var MovePos = CurrentOldGame.CurrentMove;

	Color = CurrentOldGame.BoardColor;
	Board = CurrentOldGame.Moves[0].Board;

	Move = CurrentOldGame.Moves[0].Move;

	WTime = CurrentOldGame.Moves[ 0 ].PWTime;
	BTime = CurrentOldGame.Moves[ 0 ].PBTime;

	CurrentOldGame.CurrentMove = 0;
	CurrentOldGame.Game.SetBoard(Board, Color, 38);
	CurrentOldGame.Game.UpdateWTime(WTime);
	CurrentOldGame.Game.UpdateBTime(BTime);
	CurrentOldGame.Game.SetWTime();
	CurrentOldGame.Game.SetBTime();
	CurrentOldGame.Game.SetLastMove(Move);
}

/** 
* @brief	Change current board state to previous game board state
* 
* @return       False (if not found a previous state) or True otherwise
* @author       Rubens Suguimoto 
*/
export function OLDGAME_PrevBoard()
{
	var Color, OldBoard, Board;
	var WTime, BTime;
	var Move; 

	var CurrentOldGame = MainData.GetCurrentOldGame();
	var MovePos = CurrentOldGame.CurrentMove;

	if(MovePos == 0)
	{
		return false;
	}

	Color = CurrentOldGame.BoardColor;
	OldBoard = CurrentOldGame.Moves[MovePos].Board;
	Board = CurrentOldGame.Moves[MovePos -1].Board;
	Move = CurrentOldGame.Moves[MovePos - 1].Move;

	WTime = CurrentOldGame.Moves[ MovePos - 1 ].PWTime;
	BTime = CurrentOldGame.Moves[ MovePos - 1 ].PBTime;

	CurrentOldGame.CurrentMove = MovePos - 1;
	CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	CurrentOldGame.Game.UpdateWTime(WTime);
	CurrentOldGame.Game.UpdateBTime(BTime);
	CurrentOldGame.Game.SetWTime();
	CurrentOldGame.Game.SetBTime();
	CurrentOldGame.Game.SetLastMove(Move);

	return true;
}

/** 
* @brief	Change current board state to next game board state
* 
* @return       False (if not found a next state) or True otherwise
* @author       Rubens Suguimoto
*/
export function OLDGAME_NextBoard()
{
	var Color, OldBoard, Board;

	var WTime, BTime;
	var Move; 

	var CurrentOldGame = MainData.GetCurrentOldGame();
	var MovePos = CurrentOldGame.CurrentMove;

	if(MovePos == CurrentOldGame.Moves.length-1)
	{
		return false;
	}

	Color = CurrentOldGame.BoardColor;
	OldBoard = CurrentOldGame.Moves[MovePos].Board;
	Board = CurrentOldGame.Moves[ MovePos + 1 ].Board;
	Move = CurrentOldGame.Moves[MovePos + 1].Move;

	WTime = CurrentOldGame.Moves[ MovePos + 1 ].PWTime;
	BTime = CurrentOldGame.Moves[ MovePos + 1 ].PBTime;

	CurrentOldGame.CurrentMove = MovePos + 1;
	CurrentOldGame.Game.UpdateBoard(OldBoard, Board, Color, 38);
	CurrentOldGame.Game.UpdateWTime(WTime);
	CurrentOldGame.Game.UpdateBTime(BTime);
	CurrentOldGame.Game.SetWTime();
	CurrentOldGame.Game.SetBTime();
	CurrentOldGame.Game.SetLastMove(Move);

	return true;
}

/** 
* @brief	Change current board state to last game board state
* 
* @return       none
* @author       Rubens Suguimoto
*/
export function OLDGAME_LastBoard()
{
	var Color, Board;
	var WTime, BTime;
	var Move; 

	var CurrentOldGame = MainData.GetCurrentOldGame();
	var MoveListLen = CurrentOldGame.Moves.length;

	Color = CurrentOldGame.BoardColor;
	Board = CurrentOldGame.Moves[MoveListLen-1].Board;
	Move = CurrentOldGame.Moves[MoveListLen -1].Move;

	WTime = CurrentOldGame.Moves[ MoveListLen - 1 ].PWTime;
	BTime = CurrentOldGame.Moves[ MoveListLen - 1 ].PBTime;

	CurrentOldGame.CurrentMove = MoveListLen-1;
	CurrentOldGame.Game.SetBoard(Board, Color, 38);
	CurrentOldGame.Game.UpdateWTime(WTime);
	CurrentOldGame.Game.UpdateBTime(BTime);
	CurrentOldGame.Game.SetWTime();
	CurrentOldGame.Game.SetBTime();
	CurrentOldGame.Game.SetLastMove(Move);
}

/** 
* @brief	Change current board state to some game board state
* 
* @param        NumBoard	Board number state
* @return       void 
* @author       Rubens Suguimoto 
*/
export function OLDGAME_GotoBoard(NumBoard)
{
	var Color, Board;
	var WTime, BTime;
	var Move; 

	var CurrentOldGame = MainData.GetCurrentOldGame();

	Color = CurrentOldGame.BoardColor;
	Board = CurrentOldGame.Moves[NumBoard-1].Board;
	Move = CurrentOldGame.Moves[NumBoard -1].Move;

	WTime = CurrentOldGame.Moves[ NumBoard - 1 ].PWTime;
	BTime = CurrentOldGame.Moves[ NumBoard - 1 ].PBTime;

	CurrentOldGame.CurrentMove = NumBoard-1;
	CurrentOldGame.Game.SetBoard(Board, Color, 38);
	CurrentOldGame.Game.UpdateWTime(WTime);
	CurrentOldGame.Game.UpdateBTime(BTime);
	CurrentOldGame.Game.SetWTime();
	CurrentOldGame.Game.SetBTime();
	CurrentOldGame.Game.SetLastMove(Move);
}

/**
* @brief	Create search old game window and get old game list
*
* @return       none
* @author       Danilo Yorinori
*/
export function OLDGAME_OpenOldGameWindow(User)
{	
	// Quick fix to check if search old game window exists
	if (document.getElementById("OldGamesDiv"))
	{
		return;
	}
	var Elements;
	var SearchInfo;
	var Id = MainData.SearchGameMaxId; 
	MainData.SearchGameMaxId++; 

	if (User == null)
	{
		User ="";
	}

	Elements = WINDOW_OldGame(Id);

	MainData.AddSearchGameInfo(Id, Elements, User);

	// Get the first 10 old games from server
	CONNECTION_SendJabber(MESSAGE_GetOldGames(Id,User,"",10,0));

	SearchInfo = MainData.GetSearchGameInfo(Id);
	SearchInfo.Elements.SetSearchButton(SearchInfo);
	SearchInfo.Elements.SetPrevButton(SearchInfo);
	SearchInfo.Elements.SetNextButton(SearchInfo);
}

/**
* @brief	Remove Search Game Info in data struct and set new old game window max id count
*
* @param	Id		Window's id
* @return       void
* @author       Danilo Yorinori
*/
export function OLDGAME_CloseWindow(Id)
{
	MainData.RemoveSearchGameInfo(Id);

	if (Id == MainData.SearchGameMaxId - 1)
	{
		MainData.SearchGameMaxId--;
	}
	else if (MainData.SearchGameInfoList.length == 0)
	{
		MainData.SearchGameMaxId = 0;
	}
}

/**
* @brief	Return apropriate result text according to old game result  
*
* @param	Result		Result's string
* @return	Result text string
* @see OLDGAME_HandleSearchOldGame
* @author Danilo Yorinori
*/
function OLDGAME_GameResult(Result)
{
	if ((Result == "") || (Result == null) || (Result == undefined))
	{
		return "";
	}
	else if (Result == "white-timeover")
	{
		return UTILS_GetText("game_result_white-timeover");
	}
	else if (Result == "black-timeover")
	{
		return UTILS_GetText("game_result_black-timeover");
	}
	else if (Result == "white-mated")
	{
		return UTILS_GetText("game_result_white-mated");
	}
	else if (Result == "black-mated")
	{
		return UTILS_GetText("game_result_black-mated");
	}
	else if (Result == "stalemate")
	{
		return UTILS_GetText("game_result_stalemate");
	}
	else if (Result == "white-resigned")
	{
		return UTILS_GetText("game_result_white-resigned");
	}
	else if (Result == "black-resigned")
	{
		return UTILS_GetText("game_result_black-resigned");
	}
	else if (Result == "draw-agreement")
	{
		return UTILS_GetText("game_result_draw-agreement");
	}
	else if (Result == "draw-repetition")
	{
		return UTILS_GetText("game_result_draw-repetition");
	}
	else if (Result == "draw-fifty-moves")
	{
		return UTILS_GetText("game_result_draw-fifty-moves");
	}
	else if (Result == "draw-impossible-mate")
	{
		return UTILS_GetText("game_result_draw-impossible-mate");
	}
	else if (Result == "draw-timeover")
	{
		return UTILS_GetText("game_result_draw-timeover");
	}
	else if (Result == "canceled-agreement")
	{
		return UTILS_GetText("game_result_canceled_agreement");
	}
	else if (Result == "canceled-timed-out")
	{
		return UTILS_GetText("game_result_canceled-timed-out");
	}
	else if (Result == "adjourned-agreement")
	{
		return UTILS_GetText("game_result_adjourned-agreement");
	}
	else if (Result == "adjourned-shutdown")
	{
		return UTILS_GetText("game_result_adjourned-shutdown");
	}
	else if (Result == "white-wo")
	{
		return UTILS_GetText("game_result_white-wo");
	}
	else if (Result == "black-wo")
	{
		return UTILS_GetText("game_result_black-wo");
	}
	else
	{
		return null;
	}
}
