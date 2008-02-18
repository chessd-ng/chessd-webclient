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
*/
function GAME_HandleGame (XML)
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

	Player1.Name = Players[0].getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = Players[0].getAttribute('inc');
	Player1.Color = Players[0].getAttribute('color');
	Player1.Time = Players[0].getAttribute('time');
	
	Player2.Name = Players[1].getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = Players[1].getAttribute('inc');
	Player2.Color = Players[1].getAttribute('color');
	Player2.Time = Players[1].getAttribute('time');

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
