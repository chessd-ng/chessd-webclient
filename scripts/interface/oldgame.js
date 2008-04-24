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
function INTERFACE_ShowOldGameWindow(Id)
{
	// Variables
	var Div;

	var FormDiv;

	var IdDiv;

	var SelectDiv;
	var Select, Opt;

	var Layer1Div;
	var L1LeftDiv;
	var Player1Label,Player1Input;
	var L1RightDiv;
	var PiecesLabel, WRadio, WImg, BRadio, BImg, ARadio, ALabel;

	var Layer2Div;
	var L2LeftDiv;
	var Player2Label, Br2, Player2Input;
	var L2RightDiv;
	var DateLabel, Br3, FromLabel, FromInput, ToLabel, ToInput;

	var ButtonsDiv;
	var Search, NewSearch;

	var ResultDiv;
	var SearchResultLabel, NoFound;
	var TableDiv;
	var THead, TPlayer1Label, TPlayer2Label, TDateLabel, TResultLabel, TCategoryLabel;
	var TBodyDiv,TBody, Table; 
	var TFoot, Hr, Prev, PageLabel, Next;
	var Buttons = new Array();
	var Elements = new Object();

	var Who;

	// Main Div
	Div = UTILS_CreateElement('div','OldGamesDiv');

	// Id Div
	IdDiv = UTILS_CreateElement('div','OldGamesDivId'+Id);

	// Form Div
	FormDiv = UTILS_CreateElement('div','FormDiv');

	// SelectDiv
	SelectDiv= UTILS_CreateElement('div','SelectDiv');

	// Select
	Select= UTILS_CreateElement('select');
	Opt = UTILS_CreateElement('option',null,null,UTILS_GetText('oldgame_my_games'));
	Select.appendChild(Opt);
	Opt = UTILS_CreateElement('option',null,null,UTILS_GetText('oldgame_other_games'));
	Opt.selected = true;
	Select.appendChild(Opt);
	Select.onchange = function() 
	{
		Who = Select.options.selectedIndex;	

		if (Who == 0)
		{
			Player1Input.value = MainData.Username;
			Player1Input.disabled = true;
		}
		else
		{
			Player1Input.disabled = false;
		}
	}
	// End Select
	// End Select Div

	// Layer 1 Div
	Layer1Div= UTILS_CreateElement('div','Layer1Div');

	// Layer 1 Left Div
	L1LeftDiv= UTILS_CreateElement('div','L1LeftDiv','left_div');

	// Player 1 Form
	Player1Label= UTILS_CreateElement('p',null,null,UTILS_GetText('oldgame_player1'));
	Player1Input = UTILS_CreateElement('input');
	Player1Input.type = 'text';
	// End Player 1 Form
	// End Layer 1 Left Div

	// Layer 1 Right Div
	L1RightDiv= UTILS_CreateElement('div','L1RightDiv');

	// Pieces Form
	PiecesLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('oldgame_pieces'));
	
	WRadio = UTILS_CreateElement('input');
	WRadio.type = "radio";
	WRadio.name = "color";
	WRadio.value = "white";
	WRadio.disabled = true;

	WImg = UTILS_CreateElement('img');
	WImg.src = "images/invite_white_pawn.png";
	
	BRadio = UTILS_CreateElement('input');
	BRadio.type = "radio";
	BRadio.name = "color";
	BRadio.value = "black";
	BRadio.disabled = true;

	BImg = UTILS_CreateElement('img');
	BImg.src = "images/invite_black_pawn.png";
	
	ARadio = UTILS_CreateElement('input');
	ARadio.type = "radio";
	ARadio.name = "color";
	ARadio.value = "both";
	ARadio.checked = true;
	ARadio.disabled = true;

	ALabel = UTILS_CreateElement('span',null,'pieces_span',UTILS_GetText('oldgame_both'));
	// End Pieces Form

	// Layer 2 Div
	Layer2Div= UTILS_CreateElement('div','Layer2Div');

	// Layer 2 Left Div
	L2LeftDiv= UTILS_CreateElement('div','L2LeftDiv','left_div');

	// Player 2 Form
	Player2Label= UTILS_CreateElement('p',null,null,UTILS_GetText('oldgame_player2'));
	Player2Input = UTILS_CreateElement('input');
	Player2Input.type = 'text';
	// End Player 2 Form
	// End Layer 2 Left Div

	// Layer 2 Right Div
	L2RightDiv= UTILS_CreateElement('div','L2RightDiv');

	// Date Form
	DateLabel = UTILS_CreateElement('p',null,null,UTILS_GetText('oldgame_date_form'));
	FromLabel	= UTILS_CreateElement('span',null,null,UTILS_GetText('oldgame_from'));
	FromInput	= UTILS_CreateElement('input');
	FromInput.size = "10";
	FromInput.disabled = true;
	ToLabel	= UTILS_CreateElement('span',null,null,UTILS_GetText('oldgame_to'));
	ToInput = UTILS_CreateElement('input');
	ToInput.size = "10";
	ToInput.disabled = true;
	// End Date Form
	// End Layer 2 Right Div
	// End Layer 2
	
	// Buttons Div
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Search = UTILS_CreateElement('input', null, 'button');
	Search.type = "button";
	Search.value = UTILS_GetText("window_search");
	Buttons.push(Search);
	NewSearch	= UTILS_CreateElement('input',null,'button');
	NewSearch.type = "button";
	NewSearch.value = UTILS_GetText("oldgame_new_search");
	UTILS_AddListener(NewSearch,"click",	function() { if(Select.options.selectedIndex != 0) Player1Input.value = ""; Player2Input.value = ""; ARadio.checked = true; FromInput.value = ""; ToInput.value = "" }, "false");
	Buttons.push(NewSearch);
	// End ButtonsDiv;

	// Result Div
	ResultDiv = UTILS_CreateElement('div','ResultDiv');

	SearchResultLabel = UTILS_CreateElement('p',null,'result',UTILS_GetText("oldgame_search_result"));

	// Table Div
	TableDiv = UTILS_CreateElement('div','TableDiv');

	// THead Div
	THead = UTILS_CreateElement('div','THeadDiv');
	TPlayer1Label = UTILS_CreateElement('span',null,'player1header',UTILS_GetText('oldgame_player1_hd'));
	TPlayer2Label = UTILS_CreateElement('span',null,'player2header',UTILS_GetText('oldgame_player2_hd'));
	TDateLabel =UTILS_CreateElement('span',null,'dateheader',UTILS_GetText('oldgame_date'));
	TCategoryLabel = UTILS_CreateElement('span',null,'catheader',UTILS_GetText('oldgame_category'));
	TResultLabel = UTILS_CreateElement('span',null,'resultheader',UTILS_GetText('oldgame_result'));

	// TBody Div
	TBodyDiv = UTILS_CreateElement('div','TBodyDiv');
	
	// Table
	Table = UTILS_CreateElement('table');
	TBody = UTILS_CreateElement('tbody');
	Table.appendChild(TBody);

	// TFoot Div
	TFoot = UTILS_CreateElement('div','TFootDiv');
	Hr = UTILS_CreateElement('hr');
	Prev = UTILS_CreateElement('input', null, 'button');
	Prev.type = "button";
	Prev.value = UTILS_GetText("oldgame_prev");
	PageLabel = UTILS_CreateElement('span', null, 'page');
	Next	= UTILS_CreateElement('input',null,'button');
	Next.type = "button";
	Next.value = UTILS_GetText("oldgame_next");

	TFoot.appendChild(Hr);
	TFoot.appendChild(Prev);
	TFoot.appendChild(PageLabel);
	TFoot.appendChild(Next);
	NoFound = UTILS_CreateElement('p',null,null,UTILS_GetText("oldgame_no_result"));
	
	// End Table Div
	
	// Mount Tree of Elements
	
	// Select Div
	SelectDiv.appendChild(Select);

	// Layer 1 Left Div
	L1LeftDiv.appendChild(Player1Label);
	L1LeftDiv.appendChild(Player1Input);

	// Layer 1 Right Div
	L1RightDiv.appendChild(PiecesLabel);
	L1RightDiv.appendChild(WRadio);
	L1RightDiv.appendChild(WImg);
	L1RightDiv.appendChild(BRadio);
	L1RightDiv.appendChild(BImg);
	L1RightDiv.appendChild(ARadio);
	L1RightDiv.appendChild(ALabel);

	// Layer 1 Div
	Layer1Div.appendChild(L1LeftDiv);
	Layer1Div.appendChild(L1RightDiv);

	// Layer 2 Left Div
	L2LeftDiv.appendChild(Player2Label);
	L2LeftDiv.appendChild(Player2Input);

	// Layer 2 Right Div
	L2RightDiv.appendChild(DateLabel);
	L2RightDiv.appendChild(FromLabel);
	L2RightDiv.appendChild(FromInput);
	L2RightDiv.appendChild(ToLabel);
	L2RightDiv.appendChild(ToInput);

	// Layer 2 Div
	Layer2Div.appendChild(L2LeftDiv);
	Layer2Div.appendChild(L2RightDiv);

	// Form Div
	FormDiv.appendChild(SelectDiv);
	FormDiv.appendChild(Layer1Div);
	FormDiv.appendChild(Layer2Div);

	// Buttons Div
	ButtonsDiv.appendChild(Search);
	ButtonsDiv.appendChild(NewSearch);

	// THead Div
	THead.appendChild(TPlayer1Label);
	THead.appendChild(TPlayer2Label);
	THead.appendChild(TDateLabel);
	THead.appendChild(TCategoryLabel);
	THead.appendChild(TResultLabel);

	// TBody
	TBodyDiv.appendChild(Table);
	
	// Table Div
	TableDiv.appendChild(THead);
	TableDiv.appendChild(TBodyDiv);
	TableDiv.appendChild(TFoot);

	// ResultDiv
	ResultDiv.appendChild(SearchResultLabel);
	ResultDiv.appendChild(TableDiv);

	// Main Div
	Div.appendChild(IdDiv);
	Div.appendChild(FormDiv);
	Div.appendChild(ButtonsDiv);
	Div.appendChild(ResultDiv);

	Elements.Player1 = Player1Input;
	Elements.Player2 = Player2Input;
	Elements.Color = "";
	Elements.From = FromInput;
	Elements.To = ToInput;
	Elements.TBody = TBody;
	Elements.Table = Table
	Elements.TFoot = TFoot;
	Elements.Page = PageLabel;
	Elements.TableDiv = TableDiv;
	Elements.ResultDiv = ResultDiv;
	Elements.NoFound = NoFound;
	Elements.Prev = Prev;
	Elements.Next = Next;
	Elements.Search = Search;
	Elements.WRadio = WRadio;
	Elements.BRadio = BRadio;
	Elements.ARadio = ARadio;

	Elements.SetPlayer1 = INTERFACE_Player1Input;
	Elements.SetPlayer2 = INTERFACE_Player2Input;
	Elements.SetColor = INTERFACE_Color;
	Elements.SetFrom = INTERFACE_FromInput;
	Elements.SetTo = INTERFACE_ToInput;
	Elements.SetTable = INTERFACE_OldGameSetTable;
	Elements.SetResult = INTERFACE_OldGameSetResult;
	Elements.SetSearchButton = INTERFACE_SetSearchButton;
	Elements.SetPrevButton = INTERFACE_SetPrevButton;
	Elements.SetNextButton = INTERFACE_SetNextButton;
	
//	CONNECTION_SendJabber(MESSAGE_GetOldGames("", "", 10, 0));

	return {Div:Div, Buttons:Buttons, Elements:Elements};
}

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

	var FormDiv, Player1,Input1, Player2, Input2, Br1, Br2;

	var ButtonsDiv, Search, Cancel;

	var Buttons = new Array();

	// Main div
	Div = UTILS_CreateElement('div', 'OldGameSearchDiv');

	// FormDiv elements
	FormDiv = UTILS_CreateElement('div', 'FormDiv');

	Player1 = UTILS_CreateElement('span', null, null, UTILS_GetText("oldgame_player1"));
	Input1 = UTILS_CreateElement('input', "OldGameInput1");
	Input1.size = "23";
	Br1 = UTILS_CreateElement('br');
	Player2 = UTILS_CreateElement('span', null, null, UTILS_GetText("oldgame_player2"));
	Input2 = UTILS_CreateElement('input', "OldGameInput2");
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
* @param	Games	Array of old games
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

	var ControlDiv, LeftDiv, RightDiv;
	var Prev, Next;

	var ButtonsDiv, Close;

	var Buttons = new Array();

	var i;

	// Main div
	Div = UTILS_CreateElement('div', 'OldGameResultDiv');

	// TableDiv elements
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
		TBody.appendChild(INTERFACE_AddOldGameResult(GameList[i].white, GameList[i].black, GameList[i].gametype, GameList[i].winner, GameList[i].wintype, GameList[i].date, GameList[i].id));
	}

	// ControlDiv Elements
	ControlDiv = UTILS_CreateElement('div', 'ControlDiv');
	RightDiv = UTILS_CreateElement('div', 'RightDiv');
	LeftDiv = UTILS_CreateElement('div', 'LeftDiv');

	Prev = UTILS_CreateElement('span',null,'left',"Anterior");
	Next = UTILS_CreateElement('span',null,'right',"Proximo");

	// ButtonsDiv elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Close = UTILS_CreateElement('input',null,'button');
	Close.type = "button";
	Close.value = UTILS_GetText("window_close");
	Buttons.push(Close);

	// Mount elements tree
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Close);
	
	LeftDiv.appendChild(Prev);
	RightDiv.appendChild(Next);

	ControlDiv.appendChild(LeftDiv);
	ControlDiv.appendChild(RightDiv);
	
	// TableDiv elements
	TableDiv.appendChild(Table);

	// Main div elements
	Div.appendChild(TableDiv);
	Div.appendChild(ControlDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*
* @author	Rubens 
*/
function INTERFACE_AddOldGameResultR(White, Black, Date, GameType, WinType,  Id)
{
	var Tr, Td;
	
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,null,White);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,null,Black);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,null,Date);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,null,GameType);
		Tr.appendChild(Td);
//		Td = UTILS_CreateElement('td',null,null,Winner);
//		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,null,WinType);
		Tr.appendChild(Td);
		UTILS_AddListener(Tr, "click", function(){ CONNECTION_SendJabber(MESSAGE_FetchOldGame(Id))}, false);
	
	return(Tr);
}

function INTERFACE_AddOldGameResult(White, Black, Date, GameType, WinType,  Id)
{
	var Tr, Td;
	
	Tr = UTILS_CreateElement('tr');
		Td = UTILS_CreateElement('td',null,'player1td',White);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'player2td',Black);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'datetd',Date);
		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'cattd',GameType);
		Tr.appendChild(Td);
//		Td = UTILS_CreateElement('td',null,null,Winner);
//		Tr.appendChild(Td);
		Td = UTILS_CreateElement('td',null,'resulttd',WinType);
		Tr.appendChild(Td);
		UTILS_AddListener(Tr, "click", function(){ CONNECTION_SendJabber(MESSAGE_FetchOldGame(Id))}, false);
	
	return(Tr);
}
function INTERFACE_Player1Input() 
{
}
function INTERFACE_Player2Input()
{
}
function INTERFACE_Color()
{
}
function INTERFACE_FromInput()
{
}
function INTERFACE_ToInput()
{
}

/**
*	Display result of a old game search 
*
* @param	GameList	Array of old games
* @return	boolean
* @see		OLDGAME_HandleSearchOldGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_OldGameSetResult(Id, GameList, More)
{
	// if list of games is empty
	if (GameList.length == 0)
	{
		// if table of results is displayed
		if (this.TableDiv.parentNode != null)
		{
			// remove table of results
			this.ResultDiv.removeChild(this.TableDiv);

			// show no found message
			this.ResultDiv.appendChild(this.NoFound);
		}
	}
	// if list games contain some data
	else
	{
		if (this.TableDiv.parentNode != null)
		{
			this.SetTable(Id, GameList, More);
		}
		else
		{	
			this.ResultDiv.removeChild(this.NoFound);

			this.ResultDiv.appendChild(this.TableDiv);
			this.SetTable(Id, GameList, More);
		}
	}

	return true;
}

/**
*	Set result table of old games search
*
* @param	GameList	Array of old games
* @return	boolean
* @see		WINDOW_SetResult();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_OldGameSetTable(Id, GameList, More)
{
	var i=0;
	var SearchInfo = MainData.GetSearchGameInfo(Id);
	var GameLen = GameList.length;
	var Start = SearchInfo.Offset;
	var End = Start + GameLen; 

	// Remove old results
	while (this.TBody.childNodes.length != 0)
	{
		this.TBody.removeChild(this.TBody.childNodes[0]);
	}

	// Append new results
	for(i=0; i<GameLen ; i++)
	{
			this.TBody.appendChild(INTERFACE_AddOldGameResult(GameList[i].white, GameList[i].black, GameList[i].date, GameList[i].gametype,  GameList[i].wintype, GameList[i].id));
	}
	this.Page.innerHTML = Start+" - "+End;
	// Set buttons class
	if (SearchInfo.Offset == 0)
	{
		SearchInfo.Elements.Prev.className = "button_disabled";
	}
	else
	{
		SearchInfo.Elements.Prev.className = "button";
	}
	if (!More)
	{
		SearchInfo.Elements.Next.className = "button_disabled";
	}
	else
	{
		SearchInfo.Elements.Next.className = "button";
	}
	return true;
}

function INTERFACE_SetPrevButton(Node)
{
	UTILS_AddListener(this.Prev,"click",
		function() { 
			if(Node.Offset != 0)
			{
				Node.Offset -= Node.NGames;
				CONNECTION_SendJabber(MESSAGE_GetOldGames(Node.Id, Node.P1, Node.P2, Node.NGames, Node.Offset));
			}
		}, "false");
}

function INTERFACE_SetNextButton(Node)
{
	UTILS_AddListener(this.Next,"click",
		function() { 
			if (Node.More)
			{
				Node.Offset += Node.NGames;
				CONNECTION_SendJabber(MESSAGE_GetOldGames(Node.Id, Node.P1, Node.P2, Node.NGames, Node.Offset));
			}
		}, "false");
}

function INTERFACE_SetSearchButton(Node)
{
	UTILS_AddListener(this.Search,"click",	
		function() { 
			Node.P1 = Node.Elements.Player1.value;
			Node.P2 = Node.Elements.Player2.value;
			// Verify selected color
			if(Node.Elements.WRadio.checked == true)
				Node.Color = "white";
			else if(Node.Elements.BRadio.checked == true)
				Node.Color = "black";
			else
				Node.Color = "";
			// end selected color verification
			Node.To = Node.Elements.To.value;
			Node.From = Node.Elements.From.value;
			Node.Offset = 0;
			CONNECTION_SendJabber(MESSAGE_GetOldGames(Node.Id,Node.P1, Node.P2,Node.NGames, Node.Offset)); 
		}, "false");
}
