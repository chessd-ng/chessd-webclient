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
* Interface functions that control game
*/ 

/***************************
** GAME BOARD OBJECT
*****************************/

function INTERFACE_GameBoardObj(GameID, WhitePlayer, BlackPlayer, YourColor, PieceSize)
{
	// Attributes
	this.Game = null;
	this.Board = null;
	this.timer = new Object();
	this.name = new Object();
	this.photo = new Object();
	this.MoveList = null;
	this.eventButtons = null;

	this.WhitePlayer = WhitePlayer;
	this.BlackPlayer = BlackPlayer;
	this.MyColor = YourColor;
	this.Id = GameID;
	this.Finished = false;

	if (PieceSize == null)
	{
		this.PieceSize = 38;
	}
	else
	{
		this.PieceSize = PieceSize;
	}
	
	// Public methods
	this.Show = INTERFACE_ShowGame;
	this.Finish = INTERFACE_FinishGame;
	this.Hide = INTERFACE_HideGame;
	this.Remove = INTERFACE_RemoveGame;

	this.UpdateBoard = INTERFACE_UpdateBoard;
	this.UndoMove = INTERFACE_UndoMove;
	this.AddMove = INTERFACE_AddMove;

	this.SetTurn = INTERFACE_SetTurn;
	this.SetWTimer = INTERFACE_SetWTimer;
	this.SetBTimer = INTERFACE_SetBTimer;

	this.RemovePiece = INTERFACE_RemovePiece;
	this.InsertPiece = INTERFACE_InsertPiece;

	this.SetBoard = INTERFACE_SetBoard;
	this.ClearBoard = INTERFACE_ClearBoard

	this.setWPhoto = INTERFACE_SetWPhoto;
	this.setBPhoto = INTERFACE_SetBPhoto;

	this.removeMove = INTERFACE_RemoveMove;


	// Constructor
	this.constructor = INTERFACE_CreateGame;
	this.constructor();

}


/***************************
** CONSTRUCTOR
*****************************/

/**
* Creating game div
*
* @constructor
*/
function INTERFACE_CreateGame()
{
	var GameDiv = UTILS_CreateElement("div","GameDiv");
	var GameInfo = UTILS_CreateElement("div","GameInfoDiv");
	var GameTab = UTILS_CreateElement("div","GameInfoTab");
	var Board = UTILS_CreateElement("div","TBoard");
	var GameClose = UTILS_CreateElement("p", "GameClose", null, "X");
	var GameID = this.Id;
	
	// Creating board
	var BoardBlocks = INTERFACE_CreateBoard(this.MyColor, this.PieceSize);

	// Create div for pieces
	var BoardPiece = UTILS_CreateElement("div","BoardPiece",null,null);

	// Timers for both players
	var Timer = INTERFACE_CreateTimer();

	// Game options
	var Options = INTERFACE_CreateGameOptions();
	
	// Move list
	var MoveList = INTERFACE_CreateMoveList();

	// Players photos
	var Photo = INTERFACE_CreatePhoto(this.WhitePlayer, this.BlackPlayer);

	// Setting board width, depending on piece size
	GameDiv.style.width = (this.PieceSize*8) + 195 + 20 + "px";

	// Close board function
	GameClose.onclick = function () {
		GAME_RemoveGame(GameID);
	};

	// Creating tree
	Board.appendChild(BoardBlocks);
	Board.appendChild(INTERFACE_CreateVerticalIndex(this.MyColor, this.PieceSize));
	Board.appendChild(INTERFACE_CreateHorizontalIndex(this.MyColor, this.PieceSize));
	GameDiv.appendChild(Board);
	Board.appendChild(BoardPiece);

	GameInfo.appendChild(Photo.Div);
	GameInfo.appendChild(Timer.Div);
	GameTab.appendChild(INTERFACE_CreateTab(Options.Div, MoveList.Div));
	GameInfo.appendChild(GameTab);
	GameInfo.appendChild(GameClose);


	GameDiv.appendChild(GameInfo);

	// Setting attributes
	this.Game = GameDiv;

	this.Board = BoardPiece;
	this.timer.wtimer = Timer.WTimer;
	this.timer.btimer = Timer.BTimer;
	this.photo.wphoto = Photo.WPhoto;
	this.photo.bphoto = Photo.BPhoto;
	this.MoveList = MoveList.List;
	this.eventButtons = Options.ButtonList;
}

/**
* Show this game in the interface
*
* @public
*/
function INTERFACE_ShowGame(Div)
{
	var Div = document.getElementById("Center");

	if (Div)
	{
		Div.appendChild(this.Game);
		return true;
	}
	return false;
}


/**
* Hide this game in the interface
*
* @public
*/
function INTERFACE_HideGame()
{
	var ParentGame = this.Game.parentNode;

	ParentGame.removeChild(this.Game);
}


/**
* Disable options and drag pieces
*
* @public
*/
function INTERFACE_FinishGame()
{
	this.Finished = true;
}


/**
* Remove this game
*
* @public
*/
function INTERFACE_RemoveGame()
{
	var Game = MainData.GetGame(this.Id);
	var Node = document.getElementById("GameDiv");

	if (!Game || !Node)
	{
		return false;
	}

	if (Game.Finished)
	{
		Node.parentNode.removeChild(Node);
	}
	else
	{
		// TODO TODO TODO
		WINDOW_Alert("Voce nao pode fechar um jogo em andamento");
	}
}


/**
* Clean all pieces of a board
*/
function INTERFACE_ClearBoard()
{
	var i,j;

	for(i=0 ; i<8 ; i++)
	{
		for(j=0 ; j<8 ; j++)
		{
			this.RemovePiece(i+1 ,j+1);
		}
	}
}

/**
* Clean the board and show 'BoardArray' in the screen
*/
function INTERFACE_SetBoard(BoardArray)
{
	var i,j;	
	var Piece;

	this.ClearBoard();

	for(i=0 ; i<8 ; i++)
	{
		for(j=0 ; j<8 ; j++)
		{
			Piece = BoardArray[i].charAt(j);
			if (Piece != "-")
			{
				this.InsertPiece(Piece, i+1, j+1, this.MyColor);
			}
		}
	}
}


/**
* Display a piece in specified Line and Col of the board
*/
function INTERFACE_InsertPiece(Piece, Line, Col)
{
	var Board = this.Board; 
	var PieceImg = INTERFACE_NewPiece(Piece, this.MyColor, this.PieceSize);

	// If it's a white player
	if (this.MyColor == "white")
	{
		PieceImg.style.left = ((Col-1) * this.PieceSize)  +"px";
		PieceImg.style.top  = ((Line-1) * this.PieceSize) +"px";
	}
	// Black player
	else
	{
		PieceImg.style.left = ((8 - Col) * this.PieceSize) +"px";
		PieceImg.style.top  = ((8 - Line) * this.PieceSize)+"px";
	}
	PieceImg.id = this.Id+"_piece_"+UTILS_HorizontalIndex(Col)+(9-Line);
	

	//alert(Line+","+Col +"///"+ PieceImg.style.top +" - "+ PieceImg.style.left);
	Board.appendChild(PieceImg);
}


/**
* Remove a piece from the board
*/
function INTERFACE_RemovePiece(Line, Col)
{
	var PieceId = this.Id+"_piece_"+UTILS_HorizontalIndex(Col)+(9-Line);
	var Piece = document.getElementById(PieceId);

	if (Piece != null)
	{
		Piece.parentNode.removeChild(Piece);
		return Piece;
	}
}

/**
* Update the board on the screen
*/
function INTERFACE_UpdateBoard(OldBoard, NewBoard)
{
	var i,j;	
	var Piece;

	for (i=0 ; i<8 ; i++)
	{
		for (j=0 ; j<8 ; j++)
		{
			if (OldBoard[i].charAt(j) != NewBoard[i].charAt(j))
			{
				Piece = NewBoard[i].charAt(j);
				if (Piece == '-')
				{
					this.RemovePiece(i+1, j+1);
				}
				else
				{
					//Remover a peça no tauleiro anterior
					if (OldBoard[i].charAt(j)!= "-")
					{
						this.RemovePiece(i+1, j+1);
					}
					this.InsertPiece(Piece, i+1, j+1);
				}
			}	
		}
	}
}

/**
* Undo the last move done by the user
*/
function INTERFACE_UndoMove(Long)
{
	var Game = MainData.GetGame(this.Id);

	if (Game == null)
	{
		return false;
	}

	try
	{
		this.SetBoard(Game.Moves[Game.Moves.length-1].Board);
	}
	catch(e)
	{
		return false;
	}
	return true;
}

/**
* Show turn info to user
*/
function INTERFACE_SetTurn(Color)
{
	var TurnNode, OtherNode;

	if (Color == "white")
	{
		TurnNode = document.getElementById("PWName");
		OtherNode = document.getElementById("PBName");
	}
	else
	{
		TurnNode = document.getElementById("PBName");
		OtherNode = document.getElementById("PWName");
	}
	
	if (!TurnNode || !OtherNode)
	{
		return false;
	}
	// Set the turn player to bold, underlined
	TurnNode.style.fontWeight = "bold";
	TurnNode.style.textDecoration = "underline";

	// Set other player to normal
	OtherNode.style.fontWeight = "normal";
	OtherNode.style.textDecoration = "none";
	return true;
}


function INTERFACE_SetWTimer(TimeSec)
{
	var min, sec;
	var minStr, secStr;

	min = Math.round(TimeSec / 60);
	sec = TimeSec % 60;

	if(min < 10)
	{
		minStr = "0"+min;
	}
	else
	{
		minStr = min;
	}

	if(sec < 10)
	{
		secStr = "0"+sec;
	}
	else
	{
		secStr = sec;
	}

	this.timer.wtimer.innerHTML = minStr+":"+secStr;
}

function INTERFACE_SetBTimer(TimeSec)
{
	var min, sec;
	var minStr, secStr;

	min = Math.round(TimeSec / 60);
	sec = TimeSec % 60;

	if(min < 10)
	{
		minStr = "0"+min;
	}
	else
	{
		minStr = min;
	}

	if(sec < 10)
	{
		secStr = "0"+sec;
	}
	else
	{
		secStr = sec;
	}

	this.timer.btimer.innerHTML = minStr+":"+secStr;
}

function INTERFACE_SetWPhoto(PhotoType, PhotoStr)
{
	this.photo.wphoto.src = "data:"+PhotoType+";base64,"+PhotoStr;
}

function INTERFACE_SetBPhoto(PhotoType, PhotoStr)
{
	this.photo.bphoto.src = "data:"+PhotoType+";base64,"+PhotoStr;
}

function INTERFACE_AddMove(NumTurn, Move, WTime, BTime)
{
	
	var Item;
	if(NumTurn % 2)
	{
		Item = UTILS_CreateElement("li",null,"black",null);
	}
	else
	{
		Item = UTILS_CreateElement("li",null,"white",null);
	}

	var Num = UTILS_CreateElement("span", null, null, NumTurn+".");

	var WTimeMin = Math.round(WTime / 60);
	var WTimeMinStr;
	if(WTimeMin < 10)
	{
		WTimeMinStr = "0"+WTimeMin;
	}
	else
	{
		WTimeMinStr = WTimeMin;
	}

	var WTimeSec = WTime % 60;
	var WTimeSecStr;
	if(WTimeSec < 10)
	{
		WTimeSecStr = "0"+WTimeSec;
	}
	else
	{
		WTimeSecStr = WTimeSec;
	}

	var BTimeMin = Math.round(BTime / 60);
	var BTimeMinStr;
	if(BTimeMin < 10)
	{
		BTimeMinStr = "0"+BTimeMin;
	}
	else
	{
		BTimeMinStr = BTimeMin;
	}

	var BTimeSec = BTime % 60;
	var BTimeSecStr;
	if(BTimeSec < 10)
	{
		BTimeSecStr = "0"+BTimeSec;
	}
	else
	{
		BTimeSecStr = BTimeSec;
	}

	var MoveSpan = UTILS_CreateElement("span", null, null, Move);
	var WTimerSpan = UTILS_CreateElement("span",null,null, WTimeMinStr+":"+WTimeSecStr);
	var BTimerSpan = UTILS_CreateElement("span",null,null, BTimeMinStr+":"+BTimeSecStr);

	Item.appendChild(Num);
	Item.appendChild(MoveSpan);
	Item.appendChild(WTimerSpan);
	Item.appendChild(BTimerSpan);

	this.MoveList.appendChild(Item);
}

function INTERFACE_RemoveMove()
{
	this.MoveList.removeChild(this.MoveList.lastChild);
}



/***************************
 * INTERFACE AUX FUNCTIONS
 **************************/

/**
* Create a board
*
* @return
*/
function INTERFACE_CreateBoard(MyColor, PieceSize)
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
			}
			else
			{
				Block = UTILS_CreateElement("div", null, "white");
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
* Create timer elements
*/
function INTERFACE_CreateTimer()
{
	var TimerDiv = UTILS_CreateElement("div", "TimerDiv");
	var PWTimer = UTILS_CreateElement("span", "PWTimer", null, "00:00");
	var PBTimer = UTILS_CreateElement("span", "PBTimer", null, "00:00");
	
	TimerDiv.appendChild(PWTimer);
	TimerDiv.appendChild(PBTimer);

	return {Div:TimerDiv, WTimer:PWTimer, BTimer:PBTimer};
}

/**
* Create game options
*/
function INTERFACE_CreateGameOptions()
{
	var GameOptionDiv = UTILS_CreateElement("div", "GameOptionDiv");
	var OptionList = UTILS_CreateElement("ul", "GameOptionList");
	var OptionDraw = UTILS_CreateElement("li", "GameOptionDraw", null, UTILS_GetText("game_send_draw"));
	var OptionResign = UTILS_CreateElement("li", "GameOptionResign", null, UTILS_GetText("game_send_resign"));
	var OptionFinish = UTILS_CreateElement("li", "GameOptionFinish", null, UTILS_GetText("game_send_terminate"));
	var OptionStop = UTILS_CreateElement("li", "GameOptionStop", null, UTILS_GetText("game_send_adjourn"));
	var OptionGiveTime = UTILS_CreateElement("li", "GameOptionGiveTime", null, UTILS_GetText("game_give_time"));
	var OptionPromotion = UTILS_CreateElement("li", "GameOptionPromotion", "promotion", UTILS_GetText("game_pawn_promotion")+":");

	var OptionSelectPromotion = UTILS_CreateElement("select", "GameSelectPromotion");
	var OptionSelectQ = UTILS_CreateElement("option", "GameSelectQ", null, UTILS_GetText("game_promotion_queen"));
	var OptionSelectR = UTILS_CreateElement("option", "GameSelectT", null, UTILS_GetText("game_promotion_rook"));
	var OptionSelectB = UTILS_CreateElement("option", "GameSelectB", null, UTILS_GetText("game_promotion_bishop"));
	var OptionSelectN = UTILS_CreateElement("option", "GameSelectN", null, UTILS_GetText("game_promotion_knight"));

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
*/
function INTERFACE_CreateMoveList()
{
	var MoveListDiv = UTILS_CreateElement("div", "MoveListDiv");
	var MoveList = UTILS_CreateElement("ul", "MoveList");
	
	MoveListDiv.appendChild(MoveList);
	return {Div:MoveListDiv, List:MoveList};
}

/**
* Create photos
*/
function INTERFACE_CreatePhoto(WhitePlayer, BlackPlayer)
{
	var PhotoDiv = UTILS_CreateElement("div", "PhotoDiv");
	var PWPhoto = UTILS_CreateElement("img", "PWPhoto");
	var PBPhoto = UTILS_CreateElement("img", "PBPhoto");
	var VS = UTILS_CreateElement("span", "vs", null, "x");
	var PWName = UTILS_CreateElement("span", "PWName", null, WhitePlayer);
	var PBName = UTILS_CreateElement("span", "PBName", null, BlackPlayer);
	var PWPawn = UTILS_CreateElement("div", "PWPawn");
	var PBPawn = UTILS_CreateElement("div", "PBPawn");
	
	PhotoDiv.appendChild(PWPhoto);
	PhotoDiv.appendChild(VS);
	PhotoDiv.appendChild(PBPhoto);
	PhotoDiv.appendChild(PWPawn);
	PhotoDiv.appendChild(PBPawn);
	PhotoDiv.appendChild(PWName);
	PhotoDiv.appendChild(PBName);
	
	return {Div:PhotoDiv, WPhoto:PWPhoto, BPhoto:PBPhoto, WName:PWName, BName:PBName};
}

/**
* Create tabs
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
* Vertical indexes of board
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

	return IndexV;
}

/**
* Horizontal indexes of board
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
	return IndexH;
}

/**
* Create a new piece, with drag listener in 'PLayerColor' pieces
*/ 
function INTERFACE_NewPiece(Piece, PlayerColor, Size)
{
	var PieceImg;
	var PieceName, PieceTitle;
	var DragPieceW, DrawPieceB;
	var PieceDir, Extension;

	if(MainData.Browser != 1) //IE
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
		DragPieceW = function (event) { UTILS_StartDragPiece(this, Size); return false; };
		DragPieceB = function () { return false; };
	}
	else
	{
		DragPieceW = function(){return false;};
		DragPieceB = function(event){ UTILS_StartDragPiece(this, Size); return false;};
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

/*****************************
*	FUNCTIONS - WINDOW
******************************/

/**
*	Create elements of draw game request window and return div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_DrawGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowDrawGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'DrawDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_draw_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of resign window and return div
*
* @param	User	User's nickname that resigned the game
* @return	Div; Array
* @see		WINDOW_ResignGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowResignGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'ResignDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_resign_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of adjourn game request window and returns div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_PauseGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowAdjournGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'AdjournDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_adjourn_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of abort game request window and returns div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_AbortGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowAbortGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'AbortDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_abort_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of checkmate winner window and return div
*
* @param	User	User's nickname that won the game by checkmate
* @return	Div; Array
* @see		WINDOW_CheckmateWin();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCheckmateWinWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CheckmateDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_checkmatew_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of checkmate looser window and return duv
*
* @param	User	User's nickname that lost the game by checkmate
* @return	Div; Array
* @see		WINDOW_CheckmateLose();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCheckmateLoseWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CheckmateDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_checkmatel_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of time winner window and return div
*
* @param	User	User's nickname that won the game by time
* @return	Div; Array
* @see		WINDOW_TimeWin();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowTimeWinWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'TimeDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_timew_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of time looser window and return duv
*
* @param	User	User's nickname that lost the game by time
* @return	Div; Array
* @see		WINDOW_TimeLose();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowTimeLoseWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'TimeDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_timel_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

