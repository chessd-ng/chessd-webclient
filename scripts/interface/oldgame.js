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
*/

/*****************************
*	FUNCTIONS - WINDOW
******************************/

/**
*	Create elements of search old games window and returns div
*
* @return	Div; Array
* @see		WINDOW_OldGameSearch();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowOldGameSearchWindow()
{
	// Variables
	var Div;

	var FormDiv, Player1,Input1, Player2, Input2, Br1, Br1;

	var ButtonsDiv, Search, Cancel;

	var Buttons = new Array();

	// Main div
	Div = UTILS_CreateElement('div', 'OldGameSearchDiv');

	// FormDiv elements
	FormDiv = UTILS_CreateElement('div', 'FormDiv');

	Player1 = UTILS_CreateElement('span', null, null, UTILS_GetText("oldgame_player1"));
	Input1 = UTILS_CreateElement('input', "OldGameInput");
	Input1.size = "23";
	Br1 = UTILS_CreateElement('br');
	Player2 = UTILS_CreateElement('span', null, null, UTILS_GetText("oldgame_player2"));
	Input2 = UTILS_CreateElement('input', "OldGameInput");
	Input2.size = "23";
	Br2 = UTILS_CreateElement('br');

	// ButtonsDiv elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Search = UTILS_CreateElement('input',null,'button');
	Search.type = "button";
	Search.value = UTILS_GetText("window_search");
	UTILS_AddListener(Search,"click",	function() { CONNECTION_SendJabber(MESSAGE_GetOldGames(Input1.value, Input2.value, 10, 0)); }, "false");
	Buttons.push(Search);

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.type = "button";
	Cancel.value = UTILS_GetText("window_cancel");
	Buttons.push(Cancel);

	// Mount elements tree
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Search);
	ButtonsDiv.appendChild(Cancel);
	
	// FormDiv elements
	FormDiv.appendChild(Player1);
	FormDiv.appendChild(Input1);
	FormDiv.appendChild(Br1);
	FormDiv.appendChild(Player2);
	FormDiv.appendChild(Input2);
	FormDiv.appendChild(Br2);

	// Main div elements
	Div.appendChild(FormDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of search old games window and returns div
*
* @return	Div; Array
* @see		WINDOW_OldGameSearch();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowOldGameResultWindow(GameList)
{
	// Variables
	var Div;

	var TableDiv;
	var Table, TBody, Tr, Td;

	var ButtonsDiv, Close;

	var Buttons = new Array();

	var i;

	// Main div
	Div = UTILS_CreateElement('div', 'OldGameResultDiv');

	// FormDiv elements
	TableDiv = UTILS_CreateElement('div', 'TableDiv');

	Table = UTILS_CreateElement('table');
	TBody = UTILS_CreateElement('tbody');

	// Table Headers
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_white'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_black'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_category'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_winner'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_wintype'));
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',UTILS_GetText('oldgame_date'));
		Tr.appendChild(Td);
	TBody.appendChild(Tr);
	Table.appendChild(TBody);

	
 	for(i=0; i<GameList.length ; i++)
	{
		TBody.appendChild(INTERFACE_AddOldGameResult(GameList[i].white, GameList[i].black, GameList[i].gametype, GameList[i].winner, GameList[i].WinType, GameList[i].date, GameList[i].id));
	}


	// ButtonsDiv elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.type = "button";
	Close.value = UTILS_GetText("window_close");
	Buttons.push(Close);

	// Mount elements tree
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Close);
	
	// FormDiv elements
	TableDiv.appendChild(Table);

	// Main div elements
	Div.appendChild(TableDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

function INTERFACE_AddOldGameResult(White, Black, GameType, Winner, WinType, Date, Id)
{
	var Tr, Td;
	
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'header',White);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',Black);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',GameType);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',Winner);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',WinType);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'header',Date);
		Tr.appendChild(Td);
		UTILS_AddListener(Tr, "click", function(){ OLDGAME_StartOldGame(White, Black, Id)}, false);
	
	return(Tr);
}
