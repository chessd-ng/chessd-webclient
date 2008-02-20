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
* This file will handle all kind of game massages
*/


/**
* Handle Game Messages
*
* @param 	XML The xml that contains the string 'match' in xmlns attribute
* @return 	Buffer with the messages that must be send
* @author 	Ulysses
*/
function GAME_HandleGame(XML)
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

	if (Xmlns.match(/\/chessd#game#state/))
	{
		Buffer = GAME_State(XML);
	}
	else if (Xmlns.match(/\/chessd#game#move/))
	{
		Buffer = GAME_State(XML);
	}
	else if (Xmlns.match(/\/chessd#game#cancel/))
	{
		Buffer = GAME_HandleCancel(XML);
	}
	else if (Xmlns.match(/\/chessd#game#draw/))
	{
		Buffer = GAME_HandleDraw (XML);
	}
	else if (Xmlns.match(/\/chessd#game#adjourn/))
	{
		Buffer = GAME_HandleAdjourn(XML);
	}
	else if (Xmlns.match(/\/chessd#game#end/))
	{
		Buffer = GAME_End(XML);
	}
	else if (Xmlns.match(/\/chessd#game#error/))
	{
		Buffer = GAME_HandleError(XML);
	}
	
	return Buffer;
}


/**
* Handle Game State
* It's a good ideia to read the server's documentation before reading the code above
*
* @param 	XML The xml that contains the game state
* @return 	void
* @author 	Ulysses
*/
function GAME_State(XML)
{
	var StateTag, Category, GameID;
	var BoardTag, FullMoves, Enpassant, Castle, Halfmoves, Board, Turn;
	var PlayerTag, MoveTag, Move;
	var Player1 = new Object();
	var Player2 = new Object();

	StateTag = XML.getElementsByTagName("state");
	BoardTag = XML.getElementsByTagName("board");
	PlayerTag = XML.getElementsByTagName("player");
	MoveTag = XML.getElementsByTagName("move");
	GameID = XML.getAttribute("from").replace(/@.*/,"");

	Category = StateTag[0].getAttribute("category");

	// Get the pgn of the last move
	try 
	{
		Move = MoveTag[0].getAttribute("long");
	}
	catch(e)
	{
		Move = "------";
	}

	FullMoves = BoardTag[0].getAttribute("fullmoves");
	Enpassant = BoardTag[0].getAttribute("enpassant");
	Castle = BoardTag[0].getAttribute("castle");
	Halfmoves = BoardTag[0].getAttribute("halfmoves");
	Board = BoardTag[0].getAttribute("state");
	Turn = BoardTag[0].getAttribute("turn");

	Player1.Name = PlayerTag[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = PlayerTag[0].getAttribute('inc');
	Player1.Color = PlayerTag[0].getAttribute('color');
	Player1.Time = PlayerTag[0].getAttribute('time');
	
	Player2.Name = PlayerTag[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = PlayerTag[1].getAttribute('inc');
	Player2.Color = PlayerTag[1].getAttribute('color');
	Player2.Time = PlayerTag[1].getAttribute('time');

	// If it's the first board of the game
	if (MainData.FindGame(GameID) == null)
	{
		GAME_StartGame(GameID, Player1, Player2);
		GAME_UpdateBoard(GameID, Board, Move, Player1, Player2, Turn)
	}
	else
	{
		GAME_UpdateBoard(GameID, Board, Move, Player1, Player2, Turn)
	}

	return "";
}

/**
* Handle Draw Request
*
* @param 	XML The xml that contains the draw message
* @return 	The message to accept or deny the draw request
* @author 	Ulysses
*/
function GAME_HandleDraw (XML)
{
	var RoomID = XML.getAttribute("from").replace(/@.*/,"");
 
	// TODO TODO TODO
	if (confirm("O adversario esta requisitando empate."))
	{
		return GameDrawAccept (RoomID);
	}	
	else 
	{
		return GameDrawDeny (RoomID);
	}
}

/**
* Handle Cancel Request
*
* @param 	XML The xml that contains the cancel message
* @return 	The XML to accept or deny the cancel request
* @author 	Ulysses
*/
function GAME_HandleAdjourn (XML)
{
	var RoomID = XML.getAttribute("from").replace(/@.*/,"");
 
	// TODO TODO TODO
	if (confirm("O adversario esta requisitando cancelamento da partida."))
	{
		return GameCancelAccept (RoomID);
	}	
	else 
	{
		return GameCancelDeny (RoomID);
	}
}

/**
* Handle Adjourn Request
*
* @param 	XML The xml that contains the adjourn message
* @return 	The XML to accept or deny the adjourn request
* @author 	Ulysses
*/
function GAME_HandleAdjourn (XML)
{
	var RoomID = XML.getAttribute("from").replace(/@.*/,"");
 
	// TODO TODO TODO
	if (confirm("O adversario esta requisitando o adiamento da partida."))
	{
		return GameAdjournAccept (RoomID);
	}	
	else 
	{
		return GameAdjournDeny (RoomID);
	}
}


/**
* Game Over
*
* @param 	XML The xml that contains the ending game message
* @return 	void
* @author 	Ulysses
*/
function GAME_End(XML)
{
	var PlayerTag, ReasonTag;
	var RoomID, Reason, Player, WinnerID;

	// Get the room name
	RoomID = XML.getAttribute("from").replace(/@.*/,"");

	// Get the reason 
	ReasonTag = XML.getElementsByTagName("reason");
	if (ReasonTag)
	{
		// Get the reason from tag 'reason'
		Reason = UTILS_GetNodeText(ReasonTag[0]);
	}
	
	// Get the winner player
	PlayerTag = XML.getElementsByTagName("player");
	if (PlayerTag[0].getAttribute("result") == "winner")
	{
		// Winner JID
		WinnerID = PlayerTag[0].getAttribute("jid").replace(/@.*/,"");
	}
	else 
	{
		WinnerID = PlayerTag[1].getAttribute("jid").replace(/@.*/,"");
	}
	
	// TODO TODO TODO
	alert ("Fim de jogo\nVencedor:"+WinnerID+"Razao: "+Reason);
	
	return "";
}


/**
* Handle Game Error
*
* @param 	XML The xml that contains the error message
* @return 	void
* @author 	Ulysses
*/
function GAME_HandleError (XML)
{
	// TODO TODO TODO 
	alert ("Ultima jogada invalida");
	
	return "";
}

/**
* Start Game
*
* @param 	GameId = Game number
* @param 	P1 = Player 1 Object (Name, Time, Color, Inc)
* @param 	P2 = Player 2 Object (Name, Time, Color, Inc)
* @return 	void
* @author 	Rubens
*/
function GAME_StartGame(GameId, P1, P2)
{
	var P1Name, P2Name;
	var GameDiv;
	var YourColor;

	// Hide current game
	if (MainData.CurrentGame != null)
	{
		MainData.CurrentGame.Game.hide();
	}

	if (P1.Name == MainData.Username)
	{
		YourColor = P1.Color;
	}
	else
	{
		YourColor = P2.Color;
	}
	// 38 -> default piece size
	GameDiv = new INTERFACE_GameBoardObj(GameId, P1.Name, P2.Name, YourColor);
	MainData.AddGame(GameId, P1.Name, P2.Name, YourColor, GameDiv);

	// Show New Game
	GameDiv.Show();
}

/**
* Start Game
*
* @param 	GameId = Game number
* @param 	BoardStr = Board status in a string
* @param 	Move = Chess Move (Piece/Orig-Dest)
* @param 	P1 = Player 1 Object (Name, Time, Color, Inc)
* @param 	P2 = Player 2 Object (Name, Time, Color, Inc)
* @param 	TurnColor = color ("w"/"b")
* @return 	void
* @author 	Rubens
*/
function GAME_UpdateBoard(GameId, BoardStr, Move, P1, P2, TurnColor)
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
	// If there's no previous moves
	else
	{
		CurrentBoardArray = new Array("--------","--------","--------","--------","--------","--------","--------","--------");
	}

	// Update data sctructure
	if (P1.Color == "white")
	{
		Game.AddMove(NewBoardArray, Move, P1.Time, P2.Time, TurnColor);
	}
	else
	{
		Game.AddMove(NewBoardArray, Move, P2.Time, P1.Time, TurnColor);
	}

	// Update turn in structure and interface
	Game.SetTurn(TurnColor);
	Game.Game.SetTurn(TurnColor);

	// Update interface
	Game.Game.UpdateBoard(CurrentBoardArray, NewBoardArray, Game.YourColor);
	Game.Game.AddMove(Game.Moves.length, Move, P1.Time, P2.Time);
	Game.Game.SetWTimer(P1.Time);
	Game.Game.SetBTimer(P2.Time);
}

/**
* Send a movement to server
*
* @author	Pedro
*/
function GAME_SendMove(OldLine, OldCol, NewLine, NewCol)
{
	var GameID = MainData.CurrentGame.Id;
	var Move;

	// Create long notation
	if (MainData.CurrentGame.YourColor == "white")
	{
		Move = UTILS_HorizontalIndex(OldCol)+OldLine+UTILS_HorizontalIndex(NewCol)+NewLine;
	}
	else
	{
		Move = UTILS_HorizontalIndex(9-OldCol)+(9-OldLine)+UTILS_HorizontalIndex(9-NewCol)+(9-NewLine);
	}

	// Send move for the current game
	CONNECTION_SendJabber(MESSAGE_GameMove(Move, MainData.CurrentGame.Id));
}
