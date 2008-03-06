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
function INTERFACE_GameBoardObj(GameID, Player1, Player2, YourColor, PieceSize)
{
	// Attributes
	this.Game = null;
	this.Board = null;
	this.BoardBlocks = null;
	this.Time = new Object();
	this.name = new Object();
	this.photo = new Object();
	this.MoveList = null;
	this.EventButtons = null;
	this.Timer = null;
	this.Turn = "white";
	this.LastMove = null;

	this.MyColor = YourColor;
	this.Id = GameID;
	this.Finished = false;

	// Setting white and black players
	if (this.MyColor == "white")
	{
		if (Player1.Name == MainData.Username)
		{
			this.WhitePlayer = Player1;
			this.BlackPlayer = Player2;
		}
		else if( Player2.Name == MainData.UserName)
		{
			this.WhitePlayer = Player2;
			this.BlackPlayer = Player1;
		}
		else // Observer Mode
		{
			this.WhitePlayer = Player1;
			this.BlackPlayer = Player2;
		}
	}
	else
	{
		if (Player1.Name == MainData.Username)
		{
			this.WhitePlayer = Player2;
			this.BlackPlayer = Player1;
		}
		else if( Player2.Name == MainData.UserName)
		{
			this.WhitePlayer = Player1;
			this.BlackPlayer = Player2;
		}
		else // Observer Mode
		{
			this.WhitePlayer = Player1;
			this.BlackPlayer = Player2;
		}
	}

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
	this.SetWTime = INTERFACE_SetWTime;
	this.SetBTime = INTERFACE_SetBTime;

	this.UpdateWTime = INTERFACE_UpdateWTime;
	this.UpdateBTime = INTERFACE_UpdateBTime;

	this.DecreaseTime = INTERFACE_DecreaseTime;
	this.StartTimer = INTERFACE_StartTimer;
	this.StopTimer = INTERFACE_StopTimer;

	this.RemovePiece = INTERFACE_RemovePiece;
	this.InsertPiece = INTERFACE_InsertPiece;

	this.SetBoard = INTERFACE_SetBoard;
	this.ClearBoard = INTERFACE_ClearBoard

	this.SetWPhoto = INTERFACE_SetWPhoto;
	this.SetBPhoto = INTERFACE_SetBPhoto;

	this.removeMove = INTERFACE_RemoveMove;

	this.ObserverMode = INTERFACE_ObserverMode;
	this.OldGameMode = INTERFACE_OldGameMode;

	this.SetLastMove = INTERFACE_LastMove;
	this.FindBlock = INTERFACE_FindBlock;

	// Constructor
	this.constructor = INTERFACE_CreateGame;
	this.constructor();

}


/***************************
** CONSTRUCTOR
*****************************/

/**
* Creating game div and set all attributes
*
* @constructor
* @param	void
* @return	void
* @author	Rubens and Pedro
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
	var Options = INTERFACE_CreateGameOptions(this.Id);
	
	// Move list
	var MoveList = INTERFACE_CreateMoveList();

	// Players photos
	var Photo = INTERFACE_CreatePhoto(this.WhitePlayer.Name, this.BlackPlayer.Name);

	// Options and Move list Tab
	var Tab = INTERFACE_CreateTab(Options.Div, MoveList.Div);

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
	GameTab.appendChild(Tab);
	GameInfo.appendChild(GameTab);
	GameInfo.appendChild(GameClose);

	GameDiv.appendChild(GameInfo);


	// Setting attributes
	this.Game = GameDiv;

	this.BoardBlocks = BoardBlocks;
	this.Board = BoardPiece;
	this.Time.WTime = Timer.WTimer;
	this.Time.BTime = Timer.BTimer;
	this.photo.wphoto = Photo.WPhoto;
	this.photo.bphoto = Photo.BPhoto;
	this.tab = Tab;
	this.MoveList = MoveList.List;
	this.EventButtons = Options.ButtonList;
	//Add "X" close buttons to EventButtons
	this.EventButtons.push(GameClose);

	this.StartTimer();

	this.SetWTime();
	this.SetBTime();
}

/**
* Show this game in the interface
*
* @public
* @param	void
* @return	true if game is showed with sucess, else false
* @author	Rubens and Pedro
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
* @param	void
* @return	void
* @author	Rubens and Pedro
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
* @param	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_FinishGame()
{
	this.Finished = true;
}


/**
* Remove this game
*
* @public
* @param	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_RemoveGame()
{
	var Game = MainData.GetGame(this.Id);
	var Node = this.Game;

	if (!Game)
	{	
		if(!Node)
		{
			return false
		}
		else
		{
			Node.parentNode.removeChild(Node);
			return true;
		}
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

/*
* Set game interface to observer mode (Move list without options)
*
* @public
* @param	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_ObserverMode()
{
	var MoveList = INTERFACE_CreateMoveList();
	var NewTab = INTERFACE_CreateOldGameTab(MoveList.Div);

	var TabParent = this.tab.parentNode;

	TabParent.removeChild(this.tab);
	TabParent.appendChild(NewTab);

	this.MoveList = MoveList.List;
	this.tab = NewTab;
}

/*
* Set game interface to oldgame mode(Observer mode with buttons to review(?) game)
*
* @public
* @param	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_OldGameMode()
{
	var MoveList = INTERFACE_CreateOldGameMoveList();
	var NewTab = INTERFACE_CreateOldGameTab(MoveList.Div);

	var TabParent = this.tab.parentNode;

	TabParent.removeChild(this.tab);
	TabParent.appendChild(NewTab);

	this.MoveList = MoveList.List;
	this.tab = NewTab;
}

/**
* Clean all pieces of a board
*
* @param	void
* @return	void
* @author	Rubens and Pedro
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
*
* @param	BoardArray is board in array of array format
* @return	void
* @author	Rubens and Pedro
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
*
* @param	Piece is piece char
* @param 	Line is line where is the piece will be place
* @param 	Col is column where is the piece will be place
* @return	void
* @author	Rubens and Pedro
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
*
* @param 	Line is line where the piece was placed
* @param 	Col is column where the piece was placed
* @return	void
* @author	Rubens and Pedro
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
* Update the board on the screen, where the pieces is diferrent
*
* @param 	OldBoard is current Board
* @param 	NewBoard is new board that will be show
* @return	void
* @author	Rubens and Pedro
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
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_UndoMove()
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
*
* @param 	Color is the player color
* @return	void
* @author	Rubens and Pedro
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

	this.Turn = Color;
	return true;
}

/**
* Decrease user time. Executed each second
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_DecreaseTime()
{
	if (MainData.CurrentGame.Game.Turn == "white")
	{
		MainData.CurrentGame.Game.WhitePlayer.Time -= 1;
		MainData.CurrentGame.Game.SetWTime();
	}
	else
	{
		MainData.CurrentGame.Game.BlackPlayer.Time -= 1;
		MainData.CurrentGame.Game.SetBTime();
	}
}

/**
* Start timer
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_StartTimer()
{
	this.Timer = setInterval(this.DecreaseTime, 1000);
}

/**
* Stop timer
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_StopTimer()
{
	this.Timer = window.clearInterval(this.Timer);
}


/**
* Update white timer
*
* @param 	NewTime is the new time to be update
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_UpdateWTime(NewTime)
{
	this.WhitePlayer.Time = NewTime;
}

/**
* Update black timer
*
* @param 	NewTime is the new time to be update
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_UpdateBTime(NewTime)
{
	this.BlackPlayer.Time = NewTime;
}

/**
* Show white timer on interface
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_SetWTime()
{
	var min, sec;
	var minStr, secStr;

	if (this.WhitePlayer.Time <= 0)
	{
		this.Timer = clearInterval(this.Timer);
	}

	min = Math.floor(this.WhitePlayer.Time / 60);
	sec = this.WhitePlayer.Time % 60;

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

	this.Time.WTime.innerHTML = minStr+":"+secStr;
}

/**
* Show black timer on interface
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_SetBTime()
{
	var min, sec;
	var minStr, secStr;

	if (this.BlackPlayer.Time <= 0)
	{
		this.Timer = clearInterval(this.Timer);
	}

	min = Math.floor(this.BlackPlayer.Time / 60);
	sec = this.BlackPlayer.Time % 60;

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

	this.Time.BTime.innerHTML = minStr+":"+secStr;
}

/**
* Show white avatar image (in base64)
*
* @param 	PhotoType is the image type (png/gif)
* @param 	PhotoStr is the image in base64 format string
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_SetWPhoto(Img)
{
	this.photo.wphoto.src = IMAGE_ImageDecode(Img);
}

/**
* Show black avatar image (in base64)
*
* @param 	PhotoType is the image type (png/gif)
* @param 	PhotoStr is the image in base64 format string
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_SetBPhoto(Img)
{
	this.photo.bphoto.src = IMAGE_ImageDecode(Img);
}

/**
* Show a new move in Move List
*
* @param 	NumTurn is the turn number
* @param 	Move is the move done
* @param 	WTime is white time when move is done
* @param 	BTime is black time when move is done
* @return	void
* @author	Rubens and Pedro
*/
function INTERFACE_AddMove(NumTurn, Move, WTime, BTime)
{
	var ScrollTop, ScrollHeight, ClientHeight;
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

	// Set Movelist scroll position;
	ScrollTop = this.MoveList.scrollTop;
	ScrollHeight = this.MoveList.scrollHeight;
	ClientHeight = this.MoveList.clientHeight;

	if((ScrollHeight > ClientHeight) && ((ScrollTop+1)>=(ScrollHeight-ClientHeight-20)))
	{
		this.MoveList.scrollTop += 20;
	}
}

/**
* Remove last move in Move List (this is should be used when players agree to return one move)
*
* @param 	void
* @return	void
* @author	Rubens and Pedro
*/
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
* @param 	MyColor is player color in the game
* @param 	PieceSize is the board piece size
* @return	board html div
* @author	Rubens and Pedro
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
*
* @param 	void
* @return	Timer html div, White Timer html span and Black Timer html span
* @author	Rubens and Pedro
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
	var OptionFinish = UTILS_CreateElement("li", "GameOptionFinish", null, UTILS_GetText("game_send_terminate"));
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
	UTILS_AddListener(OptionResign, "click", function() {GAME_SendResign(GameID);}, false);
	UTILS_AddListener(OptionFinish, "click", function() {GAME_SendCancel(GameID);}, false);
	UTILS_AddListener(OptionStop, "click", function() {GAME_SendAdjourn(GameID);}, false);

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
	var PWName = UTILS_CreateElement("span", "PWName", null, WhitePlayer);
	var PBName = UTILS_CreateElement("span", "PBName", null, BlackPlayer);
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

	var TabMove = UTILS_CreateElement("span", "InfoTab1", "oldgame", "Lances");

	Tab.appendChild(TabMove);
	Tab.appendChild(DivMoves);

	return Tab;
}

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

		if((parseInt(UTILS_HorizontalIndex(OldPosOrig.charAt(0))) + parseInt(OldPosOrig.charAt(1))) % 2 == 0)
		{
			OldBlockOrig.className = "black";
		}
		else
		{
			OldBlockOrig.className = "white";
		}

		if((parseInt(UTILS_HorizontalIndex(OldPosDest.charAt(0))) + parseInt(OldPosDest.charAt(1))) % 2 == 0)
		{
			OldBlockDest.className = "black";
		}
		else
		{
			OldBlockDest.className = "white";
		}

	}
	
	if(Move != "------")
	{
		BlockOrig = this.FindBlock(PosOrig);
		BlockDest = this.FindBlock(PosDest);

		BlockDest.className = "select";
		BlockOrig.className = "select";

		this.LastMove = Move;
	}
	else
	{
		this.LastMove = null;
	}
}

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
