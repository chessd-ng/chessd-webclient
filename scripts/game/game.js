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
<<<<<<< HEAD:scripts/game/game.js
function GAME_HandleGame(XML)
=======
function GAME_HandleGame (XML)
>>>>>>> 7df20ba20fd2387b7e0f7f6d1215e7ce30cd55b4:scripts/game/game.js
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
*
* @param 	XML The xml that contains the game state
* @return 	void
* @author 	Ulysses
*/
function GAME_State (XML)
{
	var StateTag, Category;
	var BoardTag, FullMoves, Enpassant, Castle, Halfmoves, Board, Turn;
	var PlayerTag;
	var Player1 = new Object();
	var Player2 = new Object();

	StateTag = XML.getElementsByTagName("state");
	BoardTag = XML.getElementsByTagName("board");
	PlayerTag = XML.getElementsByTagName("player");

	Category = StateTag[0].getAttribute("category");

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


	// TODO TODO TODO
	// Warn the interface
	
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
function GAME_End (XML)
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
* @param 	P1JID, P2JID = Players Jabber Id
* @param 	P1Color, P2Color = Players Colors ("w"/"b")
* @return 	void
* @author 	Rubens
*/
function GAME_StartGame(GameId, P1JID, P2JID, P1Color, P2Color)
{
	var P1Name, P2Name;
	var GameDiv;
	var YourColor;

	P1Name = P1JID.split("@",1)[0];
	P2Name = P2JID.split("@",1)[0];
	
	//Hide current game
	if(MainData.CurrentGame != null)
	{
		MainData.CurrentGame.Game.hide();
	}

	if(P1Name == MainData.UserName)
	{
		YourColor = P1Color;
		if(YourColor == "w")
		{
			GameDiv = new INTERFACE_GameBoardObj(P1Name, P2Name, YourColor, 38);
			MainData.AddGame(GameId, P1JID, P2JID, P1Name, P2Name, YourColor, GameDiv);
		}
		else
		{
			GameDiv = new INTERFACE_GameBoardObj(P2Name, P1Name, YourColor, 38);
			MainData.AddGame(GameId, P2JID, P1JID, P2Name, P1Name, YourColor, GameDiv);
		}

	}
	else
	{
		YourColor = P2Color;
		if(YourColor == "w")
		{
			GameDiv = new INTERFACE_GameBoardObj(P2Name, P1Name, YourColor, 38);
			MainData.AddGame(GameId, P2JID, P1JID, P2Name, P1Name, YourColor, GameDiv);
		}
		else
		{
			GameDiv = new INTERFACE_GameBoardObj(P1Name, P2Name, YourColor, 38);
			MainData.AddGame(GameId, P1JID, P2JID, P1Name, P2Name, YourColor, GameDiv);
		}
	}

	//Show New Game
	GameDiv.show();

}

/**
* Start Game
*
* @param 	GameId = Game number
* @param 	PWTime, PBTime = Players timer when move is done
* @param 	Move = Chess Move (Piece/Orig-Dest)
* @param 	BoardStr = Board status in a string
* @param 	TurnColor = color ("w"/"b")
* @return 	void
* @author 	Rubens
*/
function GAME_UpdateBoardMove(GameId, BoardStr, Move, PWTime, PBTime, TurnColor)
{
	var NewBoardArray = UTILS_String2Board(BoardStr);
	var Game = MainData.GetGame(GameId); //Get Game from GameList

	var CurrentBoardArray;
	if(Game.CurrentMove != null)
	{
		CurrentBoardArray = Game.Moves[Game.CurrentMove].Board;
//		alert(Game.CurrentMove +" - "+ CurrentBoardArray);
	}
	else
	{
		CurrentBoardArray = new Array("--------","--------","--------","--------","--------","--------","--------","--------");
	}
	

	//DATA STRUCT
	Game.AddMove(NewBoardArray, Move, PWTime, PBTime, TurnColor);
	Game.SetIsYourTurn(TurnColor)

	//INTERFACE
	Game.Game.updateBoard(CurrentBoardArray, NewBoardArray, Game.YourColor, 38);
	Game.Game.addMove(Game.Moves.length, Move, PWTime, PBTime);
	Game.Game.setWTimer(PWTime);
	Game.Game.setBTimer(PBTime);
}
