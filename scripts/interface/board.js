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

/***************************
** CREATE BOARD INTERFACE
*****************************/

/**
* Creating game div and set all attributes
*
* @constructor
* @param	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_CreateGame(GameId, WName, BName, MyColor, PieceSize, Observer)
{
	var GameDiv = UTILS_CreateElement("div","GameDiv");
	var GameInfo = UTILS_CreateElement("div","GameInfoDiv");
	var GameTab = UTILS_CreateElement("div","GameInfoTab");
	var Board = UTILS_CreateElement("div","TBoard");
	var GameClose = UTILS_CreateElement("p", "GameClose", null, "X");
	var GameID = GameId;
	
	// Creating board
	var BoardBlocks = INTERFACE_CreateBoard(MyColor, PieceSize, Observer);

	// Create div for pieces
	var BoardPiece = UTILS_CreateElement("div","BoardPiece",null,null);

	// Timers for both players
	var Timer = INTERFACE_CreateTimer();

	// Game options
	var Options = INTERFACE_CreateGameOptions(GameId);
	
	// Move list
	var MoveList = INTERFACE_CreateMoveList();

	// Players photos
	var Photo = INTERFACE_CreatePhoto(WName, BName);

	// Options and Move list Tab
	var Tab = INTERFACE_CreateTab(Options.Div, MoveList.Div);

	// Loading Move box
	var LoadingMoveDiv = UTILS_CreateElement("div","GameLoadingMove");
	var LoadingSpan = UTILS_CreateElement("span",null,null,UTILS_GetText("game_loading_move"));

	// Leave user box
	var LeaveUserDiv = UTILS_CreateElement("div","GameLeaveUser");
	var LeaveUserSpan = UTILS_CreateElement("span",null,null,"");
	// Hide leave user box
	LeaveUserDiv.style.display = "none";

	//LoadingMoveDiv.style.display = "none";

	// Setting board width, depending on piece size
	GameDiv.style.width = (PieceSize*8) + 195 + 20 + "px";

	// Close board function
	GameClose.onclick = function () {
		GAME_RemoveGame(GameID);
	};

	// Creating tree
	Board.appendChild(BoardBlocks);
	Board.appendChild(INTERFACE_CreateVerticalIndex(MyColor, PieceSize));
	Board.appendChild(INTERFACE_CreateHorizontalIndex(MyColor, PieceSize));
	GameDiv.appendChild(Board);
	Board.appendChild(BoardPiece);

	GameInfo.appendChild(Photo.Div);
	GameInfo.appendChild(Timer.Div);
	GameTab.appendChild(Tab);
	GameInfo.appendChild(GameTab);
	GameInfo.appendChild(GameClose);

	GameDiv.appendChild(GameInfo);
	
	LoadingMoveDiv.appendChild(LoadingSpan);
	GameDiv.appendChild(LoadingMoveDiv);

	LeaveUserDiv.appendChild(LeaveUserSpan);
	GameDiv.appendChild(LeaveUserDiv);
	
	return {GameDiv:GameDiv,
		BoardBlocks:BoardBlocks,
		Board:BoardPiece,
		WTimer:Timer.WTimer,
		BTimer:Timer.BTimer,
		WPhoto:Photo.WPhoto,
		BPhoto:Photo.BPhoto,
		Tab:Tab,
		MoveList:MoveList.List,
		LoadingMove:LoadingMoveDiv,
		LeaveUserDiv:LeaveUserDiv,
		LeaveUserText:LeaveUserSpan,
		OptionsButtons:Options.ButtonList,
		GameClose:GameClose
	}
}

/***************************
 * INTERFACE AUX FUNCTIONS
 **************************/

/**
* Create a board
*
* @param 	MyColor is player color in the game
* @param 	PieceSize is the board piece size
* @param 	Observer is true if game will be observed, false if game will be played
* @return	board html div
* @author	Rubens and Pedro
*/
function INTERFACE_CreateBoard(MyColor, PieceSize, Observer)
{
	var Board = UTILS_CreateElement("div", "Board");
	var X, Y;
	var Block, color;
	var Line, Col;


	// Setting board dimensions
	Board.style.width = (PieceSize * 8) + "px";
	Board.style.height = (PieceSize * 8) + "px";

	// Creating board block
	for (Y=0; Y < 8; Y++)
	{
		for (X=0; X < 8; X++)
		{
			// Setting block colors
			if ((X+Y) % 2 == 1)
			{
				Block = UTILS_CreateElement("div", null, "black");
				// If not observer, set block to change color if mouse is over or out of its
				if(!Observer)
				{
					Block.onmouseover = function() { this.className = "select" };
					Block.onmouseout = function() { this.className = "black" };
				}
			}
			else
			{
				Block = UTILS_CreateElement("div", null, "white");
				// If not observer, set block to change color if mouse is over or out of its
				if(!Observer)
				{
					Block.onmouseover = function() { this.className = "select" };
					Block.onmouseout = function() { this.className = "white" };
				}
			}
			
			// Blocks size
			Block.style.height = PieceSize+"px";
			Block.style.width = PieceSize+"px";

			// Setting block id
			if (MyColor == "black")
			{
				Col = 7-X;
				Line = Y;
			}
			else
			{
				Col = X;
				Line = 7-Y;
			}
			Block.id = UTILS_HorizontalIndex(Col+1)+""+(Line+1);
	
			Board.appendChild(Block);
		}
	}
	return Board;
}

/**
* Remove mouse event associated to board blocks

* @return	void
* @author	Danilo
*/
function INTERFACE_RemoveBlockEvents()
{
	var i;

	// Creating board block
	for (i=0; i < 64; i++)
	{
			this.BoardBlocks.childNodes[i].onmouseover = function() { return false; };
			this.BoardBlocks.childNodes[i].onmouseout = function() { return false; };
	}
}

/**
* Create timer elements
*
* @param 	void
* @return	Timer html div, White Timer html span and Black Timer html span
* @author	Rubens and Pedro
*/
function INTERFACE_CreateTimer()
{
	var TimerDiv = UTILS_CreateElement("div", "TimerDiv");
	var PWTimer = UTILS_CreateElement("span", "PWTimer", null, "-- : --");
	var PBTimer = UTILS_CreateElement("span", "PBTimer", null, "-- : --");
	
	TimerDiv.appendChild(PWTimer);
	TimerDiv.appendChild(PBTimer);

	// Set timer div text unselectable
	UTILS_DisableSelection(TimerDiv);

	return {Div:TimerDiv, WTimer:PWTimer, BTimer:PBTimer};
}

/**
* Create game options
*
* @param 	GameId is game id string
* @return	Options html div and Array of html elements
* @author	Rubens and Pedro
*/
function INTERFACE_CreateGameOptions(GameID)
{
	var GameOptionDiv = UTILS_CreateElement("div", "GameOptionDiv");
	var OptionList = UTILS_CreateElement("ul", "GameOptionList");
	var OptionDraw = UTILS_CreateElement("li", "GameOptionDraw", null, UTILS_GetText("game_send_draw"));
	var OptionResign = UTILS_CreateElement("li", "GameOptionResign", null, UTILS_GetText("game_send_resign"));
	var OptionFinish = UTILS_CreateElement("li", "GameOptionFinish", null, UTILS_GetText("game_send_cancel"));
	var OptionStop = UTILS_CreateElement("li", "GameOptionStop", null, UTILS_GetText("game_send_adjourn"));
	var OptionGiveTime = UTILS_CreateElement("li", "GameOptionGiveTime", null, UTILS_GetText("game_give_time"));
	var OptionPromotion = UTILS_CreateElement("li", "GameOptionPromotion", "promotion", UTILS_GetText("game_pawn_promotion")+":");

	var OptionSelectPromotion = UTILS_CreateElement("select", "GameSelectPromotion");
	var OptionSelectQ = UTILS_CreateElement("option", "GameSelectQ", null, UTILS_GetText("game_promotion_queen"));
	var OptionSelectR = UTILS_CreateElement("option", "GameSelectT", null, UTILS_GetText("game_promotion_rook"));
	var OptionSelectB = UTILS_CreateElement("option", "GameSelectB", null, UTILS_GetText("game_promotion_bishop"));
	var OptionSelectN = UTILS_CreateElement("option", "GameSelectN", null, UTILS_GetText("game_promotion_knight"));

	// Add listeners
	UTILS_AddListener(OptionDraw, "click", function() {GAME_SendDraw(GameID);}, false);
	UTILS_AddListener(OptionDraw, "mousedown", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionDraw, "mouseout", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionDraw, "mouseup", function() { this.className = "release";}, false);
	UTILS_AddListener(OptionDraw, "mouseover", function() { this.className = "release";}, false);

	UTILS_AddListener(OptionResign, "click", function() {GAME_SendResign(GameID);}, false);
	UTILS_AddListener(OptionResign, "mousedown", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionResign, "mouseup", function() { this.className = "release";}, false);
	UTILS_AddListener(OptionResign, "mouseout", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionResign, "mouseover", function() { this.className = "release";}, false);

	UTILS_AddListener(OptionFinish, "click", function() {GAME_SendCancel(GameID);}, false);
	UTILS_AddListener(OptionFinish, "mousedown", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionFinish, "mouseup", function() { this.className = "release";}, false);
	UTILS_AddListener(OptionFinish, "mouseout", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionFinish, "mouseover", function() { this.className = "release";}, false);


	UTILS_AddListener(OptionStop, "click", function() {GAME_SendAdjourn(GameID);}, false);
	UTILS_AddListener(OptionStop, "mousedown", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionStop, "mouseup", function() { this.className = "release";}, false);
	UTILS_AddListener(OptionStop, "mouseout", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionStop, "mouseover", function() { this.className = "release"; }, false);

	UTILS_AddListener(OptionGiveTime, "click", function() {
			WINDOW_Alert(UTILS_GetText("not_implemented_title"),UTILS_GetText("not_implemented"));
			}, 
	false);
	UTILS_AddListener(OptionGiveTime, "mousedown", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionGiveTime, "mouseup", function() { this.className = "release";}, false);
	UTILS_AddListener(OptionGiveTime, "mouseout", function() { this.className = "press";}, false);
	UTILS_AddListener(OptionGiveTime, "mouseover", function() { this.className = "release";}, false);
	
	OptionSelectQ.onclick = function (){ GAME_ChangePromotion("q"); }
	OptionSelectR.onclick = function (){ GAME_ChangePromotion("r"); }
	OptionSelectB.onclick = function (){ GAME_ChangePromotion("b"); }
	OptionSelectN.onclick = function (){ GAME_ChangePromotion("n"); }

	var ButtonList = new Array();

	ButtonList.push(OptionDraw);
	ButtonList.push(OptionResign);
	ButtonList.push(OptionFinish);
	ButtonList.push(OptionStop);
	ButtonList.push(OptionGiveTime);
	ButtonList.push(OptionSelectQ);
	ButtonList.push(OptionSelectR);
	ButtonList.push(OptionSelectB);
	ButtonList.push(OptionSelectN);

	OptionSelectPromotion.appendChild(OptionSelectQ);
	OptionSelectPromotion.appendChild(OptionSelectR);
	OptionSelectPromotion.appendChild(OptionSelectB);
	OptionSelectPromotion.appendChild(OptionSelectN);

	OptionList.appendChild(OptionDraw);
	OptionList.appendChild(OptionResign);
	OptionList.appendChild(OptionFinish);
	OptionList.appendChild(OptionStop);
	OptionList.appendChild(OptionGiveTime);

	OptionPromotion.appendChild(OptionSelectPromotion);
	OptionList.appendChild(OptionPromotion);

	GameOptionDiv.appendChild(OptionList);

	return {Div:GameOptionDiv, ButtonList:ButtonList};
}

/**
* Create a move list
*
* @param 	void
* @return	MoveListDiv html div and MoveList html list
* @author	Rubens and Pedro
*/
function INTERFACE_CreateMoveList()
{
	var MoveListDiv = UTILS_CreateElement("div", "MoveListDiv");
	var MoveList = UTILS_CreateElement("ul", "MoveList");
	
	MoveListDiv.appendChild(MoveList);
	return {Div:MoveListDiv, List:MoveList};
}

/**
* Create photo images and names
*
* @param 	WhitePlayer is White player name
* @param 	BlackPlayer is Black player name
* @return	Photo html div, WPhoto html img, BPhoto html img, WName html span and BName html span
* @author	Rubens and Pedro
*/
function INTERFACE_CreatePhoto(WhitePlayer, BlackPlayer)
{
	var PhotoDiv = UTILS_CreateElement("div", "PhotoDiv");
	var PWPhoto = UTILS_CreateElement("img", "PWPhoto");
	var PBPhoto = UTILS_CreateElement("img", "PBPhoto");
	var VS = UTILS_CreateElement("span", "vs", null, "x");
	var PWName = UTILS_CreateElement("span", "PWName", null, UTILS_ShortString(WhitePlayer,8));
	var PBName = UTILS_CreateElement("span", "PBName", null, UTILS_ShortString(BlackPlayer,8));
	var PWPawn = UTILS_CreateElement("div", "PWPawn");
	var PBPawn = UTILS_CreateElement("div", "PBPawn");
	
	PWPhoto.src = "./images/no_photo.png";
	PBPhoto.src = "./images/no_photo.png";

	PhotoDiv.appendChild(PWPhoto);
	PhotoDiv.appendChild(VS);
	PhotoDiv.appendChild(PBPhoto);
	PhotoDiv.appendChild(PWPawn);
	PhotoDiv.appendChild(PBPawn);
	PhotoDiv.appendChild(PWName);
	PhotoDiv.appendChild(PBName);

	// Set photo div text unselectable
	UTILS_DisableSelection(PhotoDiv);
	
	return {Div:PhotoDiv, WPhoto:PWPhoto, BPhoto:PBPhoto, WName:PWName, BName:PBName};
}

/**
* Create tabs with 2 divs
*
* @param 	Div1 is first div in tab
* @param 	Div2 is second div in tab
* @return	Tab html Div
* @author	Rubens and Pedro
*/
function INTERFACE_CreateTab(Div1, Div2)
{
	var Tab = UTILS_CreateElement("div", "InfoTab");
	var Tab1 = UTILS_CreateElement("span", "InfoTab1", "active", UTILS_GetText("game_options"));
	var Tab2 = UTILS_CreateElement("span", "InfoTab2", null, UTILS_GetText("game_moves"));
	var Func1, Func2;

	// Hide tab 2
	Div2.style.visibility = "hidden";

	// Functions to show/hide tabs
	Func1 = function () {
		Tab1.className = "active";
		Tab2.className = ""; 
		Div1.style.visibility = "visible";
		Div2.style.visibility = "hidden";
	};

	Func2 = function () {
		Tab1.className = ""; 
		Tab2.className = "active";
		Div1.style.visibility = "hidden";
		Div2.style.visibility = "visible";
	};

	// Add listeners
	UTILS_AddListener(Tab1, "click", Func1, false);
	UTILS_AddListener(Tab2, "click", Func2, false);

	Tab.appendChild(Tab1);
	Tab.appendChild(Tab2);
	Tab.appendChild(Div1);
	Tab.appendChild(Div2);

	return Tab;
}

/**
* Create vertical indexes of board
*
* @param 	Color is the board color
* @param 	Size is size of blocks of each block in board
* @return	Vertical index html list
* @author	Rubens and Pedro
*/
function INTERFACE_CreateVerticalIndex(Color, Size)
{
	var IndexV, IndexItem;
	var i;

	IndexV = UTILS_CreateElement("ul", "IndexV", "IndexV")

	for (i=1; i<=8; i++)
	{
		if (Color == 'black')
		{
			IndexItem = UTILS_CreateElement("li", null, "IndexVItem", i);
		}
		else
		{
			IndexItem = UTILS_CreateElement("li", null, "IndexVItem", 9-i);
		}

		IndexItem.style.width = Size + "px";
		IndexItem.style.height = Size + "px";
		IndexV.appendChild(IndexItem);
	}

	// Set vertical index text unselectable
	UTILS_DisableSelection(IndexV);

	return IndexV;
}

/**
* Create horizontal indexes of board
*
* @param 	Color is the board color
* @param 	Size is size of blocks of each block in board
* @return	Horizontal index html list
* @author	Rubens and Pedro
*/
function INTERFACE_CreateHorizontalIndex(Color, Size)
{
	var IndexH = UTILS_CreateElement("ul", "IndexH", "IndexH")
	var IndexItem;
	var i;
	
	for (i=1; i<=8; i++)
	{
		if (Color == 'white')
		{
			IndexItem = UTILS_CreateElement("li", null, "IndexHItem", UTILS_HorizontalIndex(i));
		}
		else
		{
			IndexItem = UTILS_CreateElement("li", null, "IndexHItem", UTILS_HorizontalIndex(9-i));
		}

		IndexItem.style.width = Size + "px";
		IndexItem.style.height = Size + "px";

		IndexH.appendChild(IndexItem);
	}

	// Set vertical index text unselectable
	UTILS_DisableSelection(IndexH);

	return IndexH;
}

/**
* Create a new piece, with drag listener in 'PLayerColor' pieces
*
* @param 	Piece is piece char
* @param 	PlayerColor is the current player color
* @param 	Size is size of blocks of each block in board
* @return	Piece html img
* @author	Rubens and Pedro
*/ 
function INTERFACE_NewPiece(Piece, PlayerColor, Size)
{
	var PieceImg;
	var PieceName, PieceTitle;
	var DragPieceW, DrawPieceB;
	var PieceDir, Extension;

	if(MainData.Browser == 0) //IE
	{
		PieceDir = "images/ie/pieces";
		Extension = ".gif";
	}
	else
	{
		PieceDir = "images/pieces";
		Extension = ".png";
	}
	if (PlayerColor == "white")
	{
		DragPieceW = function (event) { UTILS_StartDragPiece(this, Size, event); return false; };
		DragPieceB = function () { return false; };
	}
	else
	{
		DragPieceW = function(){return false;};
		DragPieceB = function(event){ UTILS_StartDragPiece(this, Size, event); return false;};
	}

	PieceImg = UTILS_CreateElement("img");
	switch(Piece)
	{
		// White Rook
		case 'R':
			PieceImg.src = PieceDir+"/wrook"+Extension;
			PieceImg.title = UTILS_GetText("game_white_rook");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Knight
		case 'N':
			PieceImg.src = PieceDir+"/wknight"+Extension;
			PieceImg.title = UTILS_GetText("game_white_knight");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Bishop  
		case 'B':
			PieceImg.src = PieceDir+"/wbishop"+Extension;
			PieceImg.title = UTILS_GetText("game_white_bishop");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Queen
		case 'Q':
			PieceImg.src = PieceDir+"/wqueen"+Extension;
			PieceImg.title = UTILS_GetText("game_white_queen");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White King
		case 'K':
			PieceImg.src = PieceDir+"/wking"+Extension;
			PieceImg.title = UTILS_GetText("game_white_king");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Pawn
		case 'P':
			PieceImg.src = PieceDir+"/wpawn"+Extension;	
			PieceImg.title = UTILS_GetText("game_white_pawn");
			PieceImg.onmousedown = DragPieceW;
			break;

		// Black Rook
		case 'r':
			PieceImg.src = PieceDir+"/brook"+Extension;
			PieceImg.title = UTILS_GetText("game_black_rook");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Knight
		case 'n':
			PieceImg.src = PieceDir+"/bknight"+Extension;
			PieceImg.title = UTILS_GetText("game_black_knight");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Bishop
		case 'b':
			PieceImg.src = PieceDir+"/bbishop"+Extension;
			PieceImg.title = UTILS_GetText("game_black_bishop");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black King
		case 'q':
			PieceImg.src = PieceDir+"/bqueen"+Extension;
			PieceImg.title = UTILS_GetText("game_black_queen");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Queen
		case 'k':
			PieceImg.src = PieceDir+"/bking"+Extension;
			PieceImg.title = UTILS_GetText("game_black_king");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Pawn
		case 'p':
			PieceImg.src = PieceDir+"/bpawn"+Extension;
			PieceImg.title = UTILS_GetText("game_black_pawn");
			PieceImg.onmousedown = DragPieceB;
			break;

		default:
				break;

	}

	// Setting element attributes
	PieceImg.style.position = "absolute";
	PieceImg.style.width = Size+"px";
	PieceImg.style.height = Size+"px";

	return PieceImg;
}

/***********************************************
 * OLD GAME MOVE LIST
***********************************************/
/**
* Create OldGame move list with buttons to review all game moves
*
* @param 	void
* @return	MoveListDiv html div and MoveList html list
* @author	Rubens and Pedro
*/
function INTERFACE_CreateOldGameMoveList()
{
	var MoveListDiv = UTILS_CreateElement("div", "MoveListDiv", null, null);
	var MoveList = UTILS_CreateElement("ul", "MoveList", "oldgame", null);
	var MoveListButtons = UTILS_CreateElement("div", "MoveListButtons", null, null);

	var ButtonFirst = UTILS_CreateElement("input", "MoveListFirst");
	var ButtonLast = UTILS_CreateElement("input", "MoveListLast");
	var ButtonNext = UTILS_CreateElement("input", "MoveListNext");
	var ButtonPrev = UTILS_CreateElement("input", "MoveListPrev");

	ButtonFirst.title =UTILS_GetText("game_button_first");
	ButtonPrev.title = UTILS_GetText("game_button_prev");
	ButtonNext.title = UTILS_GetText("game_button_next");
	ButtonLast.title = UTILS_GetText("game_button_last");

	ButtonFirst.type = "button";
	ButtonPrev.type = "button";
	ButtonNext.type = "button";
	ButtonLast.type = "button";
	
	/***********************************/
	ButtonFirst.onclick = function(){OLDGAME_FirstBoard();}
	ButtonPrev.onclick  = function(){OLDGAME_PrevBoard(); }
	ButtonNext.onclick  = function(){OLDGAME_NextBoard(); }
	ButtonLast.onclick  = function(){OLDGAME_LastBoard(); }
	/***********************************/

	MoveListButtons.appendChild(ButtonFirst);
	MoveListButtons.appendChild(ButtonPrev);
	MoveListButtons.appendChild(ButtonNext);
	MoveListButtons.appendChild(ButtonLast);

	MoveListDiv.appendChild(MoveList);
	MoveListDiv.appendChild(MoveListButtons);

	return {Div:MoveListDiv, List:MoveList};
}

/**
* Create tab with 1 div(this should be used in Observer and OldGame mode)
*
* @param 	Div1 is first div in tab
* @return	Tab html Div
* @author	Rubens and Pedro
*/
function INTERFACE_CreateOldGameTab(DivMoves)
{
	var Tab = UTILS_CreateElement("div", "InfoTab", null, null);

	var TabMove = UTILS_CreateElement("span", "InfoTab1", "oldgame", UTILS_GetText("game_moves"));

	Tab.appendChild(TabMove);
	Tab.appendChild(DivMoves);

	return Tab;
}

/**
* Change board to last move done
*
* @param 	Move string (i.e: a2a3)
* @return	void
* @author	Rubens
*/
function INTERFACE_LastMove(Move)
{
	var PosOrig = Move.charAt(0)+Move.charAt(1);
	var PosDest = Move.charAt(2)+Move.charAt(3);

	var OldPosOrig, OldPosDest;
	var BlockOrig, BlockDest;
	var OldBlockOrig, OldBlockDest;

	if(this.LastMove != null)
	{
		OldPosOrig = this.LastMove.charAt(0)+this.LastMove.charAt(1);
		OldPosDest = this.LastMove.charAt(2)+this.LastMove.charAt(3);
		OldBlockOrig = this.FindBlock(OldPosOrig);
		OldBlockDest = this.FindBlock(OldPosDest);

		this.RemoveBlockBorder(OldBlockOrig);
		if((parseInt(UTILS_HorizontalIndex(OldPosOrig.charAt(0))) + parseInt(OldPosOrig.charAt(1))) % 2 == 0)
		{
			OldBlockOrig.className = "black";
		}
		else
		{
			OldBlockOrig.className = "white";
		}

		this.RemoveBlockBorder(OldBlockDest);
		if((parseInt(UTILS_HorizontalIndex(OldPosDest.charAt(0))) + parseInt(OldPosDest.charAt(1))) % 2 == 0)
		{
			OldBlockDest.className = "black";
		}
		else
		{
			OldBlockDest.className = "white";
		}

	}
	
	if((Move != "------")&&( Move != "" ))
	{
		BlockOrig = this.FindBlock(PosOrig);
		BlockDest = this.FindBlock(PosDest);
		this.SetBlockBorder(BlockOrig);
		this.SetBlockBorder(BlockDest);

		this.LastMove = Move;
	}
	else
	{
		this.LastMove = null;
	}
}

/**
* Find a block with parameter Identificator
*
* @param 	id is the block identificator
* @return	null ou Block HTML div element
* @author	Rubens
*/
function INTERFACE_FindBlock(id)
{
	var i = 0;
	var Blocks = this.BoardBlocks.getElementsByTagName("div");

	while((Blocks[i].getAttribute("id")!=id) && (i<Blocks.length))
	{
		i++;
	}

	if(i==Blocks.length)
	{
		return null;
	}
	else
	{
		return Blocks[i];
	}
}

/**
* Show loading move box
*
* @return	void
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowLoadingMove()
{
	this.LoadingMove.style.display = "block";
}
/**
* Hide loading move box
*
* @return	void
* @author	Rubens Suguimoto
*/
function INTERFACE_HideLoadingMove()
{
	this.LoadingMove.style.display = "none";
}

/**
* Show leave user from game message
*
* @return	void
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowLeaveUser(Color)
{
	if(Color == "white")
	{
		this.LeaveUserText.innerHTML = UTILS_GetText("game_white_player_leave");
	}
	else
	{
		this.LeaveUserText.innerHTML = UTILS_GetText("game_black_player_leave");
	}
	this.LeaveUser.style.display = "block";
}

/**
* Hide leave user from game message
*
* @return	void
* @author	Rubens Suguimoto
*/
function INTERFACE_HideLeaveUser()
{
	this.LeaveUser.style.display = "none";
}

/**
* Set a border to block
*
*	@param Block - block element
* @return void
* @author Danilo
*/
function INTERFACE_SetBlockBorder(Block)
{
	var Border = UTILS_CreateElement("div","BlockBoard");

	Border.style.width = (this.PieceSize - 4)+"px";
	Border.style.height = (this.PieceSize - 4)+"px";
	Block.appendChild(Border);
}

/**
* Set block class as selected
*
*	@param BlockId - Id of block to search and change
* @return void
* @author Danilo
*/
function INTERFACE_SetBlockClass(BlockId)
{
	var Block = this.FindBlock(BlockId);

	Block.className = "select";
}

/**
* Remove border from block
*
*	@param Block - block element
* @return void
* @author Danilo
*/
function INTERFACE_RemoveBlockBorder(Block)
{
	if(Block.firstChild != null)
	{
		Block.removeChild(Block.firstChild);
	}
}

/**
* Remove select class from block and set its real color (black/white)
*
*	@param BlockId - Id of block to search and change
* @return void
* @author Danilo
*/
function INTERFACE_RemoveBlockClass(BlockId)
{
	var Block = this.FindBlock(BlockId);

	if((parseInt(UTILS_HorizontalIndex(BlockId.charAt(0))) + parseInt(BlockId.charAt(1))) % 2 == 0)
	{
		Block.className = "black";
	}
	else
	{
		Block.className = "white";
	}
}
