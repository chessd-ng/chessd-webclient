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
* Handle Challenge 
*/
function GAME_HandleChallenge (XML)
{
	var Players, Player1, Player2, Match, MatchID, Category;
	
	Match = XML.getElementByTagName('match')[0];
	MatchID = XML.getAttribute('id');
	Category = XML.getAttribute('category');

	// Get information of player one
	Players = XML.getElementByTagName('match');
	Player1.Name = Players[0].XML.getAttribute('jid').replace(/@.*/,"");
	Player1.Inc = Players[0].XML.getAttribute('inc');
	Player1.Color = Players[0].XML.getAttribute('color');
	Player1.Time = Players[0].XML.getAttribute('time');


	// Get information of player two
	Player2.Name = Players[0].XML.getAttribute('jid').replace(/@.*/,"");
	Player2.Inc = Players[0].XML.getAttribute('inc');
	Player2.Color = Players[0].XML.getAttribute('color');
	Player2.Time = Players[0].XML.getAttribute('time');

	// TODO
	// Interface functions should be inserted here
}