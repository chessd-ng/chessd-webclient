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
}


/**
* Handle Game State
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

	return "";
}