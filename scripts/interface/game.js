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
* @file		interface/game.js
* @brief	Interface functions that control game
*/ 

// GAME BOARD OBJECT
/*
* @class	GameBoard
* @brief	Create interface game object
*
* @param	GameID		Game identification field
* @param	Player1		First player object
* @param	Player2		Second player object
* @param	YourColor	Your color in game
* @param	PieceSize	Board piece size
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_GameBoardObj(GameID, Player1, Player2, YourColor, PieceSize, Observer)
{
	var Tmp;
	var MyUsername = MainData.GetUsername();

	// Setting white and black players
	if (YourColor == "white")
	{
		if (Player1.Name == MyUsername)
		{
			this.WhitePlayer = Player1;
			this.BlackPlayer = Player2;
		}
		else if(Player2.Name == MyUsername)
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
		if (Player1.Name == MyUsername)
		{
			this.WhitePlayer = Player2;
			this.BlackPlayer = Player1;
		}
		else if(Player2.Name == MyUsername)
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


	Tmp = INTERFACE_CreateGame(GameID, this.WhitePlayer.Name, this.BlackPlayer.Name, YourColor, this.PieceSize, Observer);

	this.Time = new Object();
	this.name = new Object();
	this.photo = new Object();
	this.EventButtons = new Array();
	this.WCapturedList = new Array();
	this.BCapturedList = new Array();

	// Attributes
	this.Game = Tmp.GameDiv;
	this.Board = Tmp.Board;
	this.BoardBlocks = Tmp.BoardBlocks;
	this.Time.WTime = Tmp.WTimer;
	this.Time.BTime = Tmp.BTimer;
	this.photo.wphoto = Tmp.WPhoto;
	this.photo.bphoto = Tmp.BPhoto;
	this.MoveList = Tmp.MoveList;
	this.EventButtons.push(Tmp.OptionsButtons);
	this.EventButtons.push(Tmp.GameClose);
	this.LoadingMove = Tmp.LoadingMove;
	this.LeaveUser = Tmp.LeaveUserDiv;
	this.LeaveUserText = Tmp.LeaveUserText;
	this.tab = Tmp.Tab;
	this.PWCapturedList = Tmp.PWCapturedList;
	this.PBCapturedList = Tmp.PBCapturedList;

	this.Timer = null; // used to set interval
	this.Turn = "white";
	this.LastMove = null;


	this.MyColor = YourColor;
	this.Id = GameID;
	this.Finished = false;

	
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
	this.SetBlockBorder = INTERFACE_SetBlockBorder;
	this.SetBlockClass = INTERFACE_SetBlockClass;
	this.RemoveBlockBorder = INTERFACE_RemoveBlockBorder;
	this.RemoveBlockClass = INTERFACE_RemoveBlockClass;
	this.RemoveBlockEvents = INTERFACE_RemoveBlockEvents;

	this.AddCapturedWPiece = INTERFACE_AddCapturedWPiece;
	this.AddCapturedBPiece = INTERFACE_AddCapturedBPiece;
	this.PopCapturedWPiece = INTERFACE_PopCapturedWPiece;
	this.PopCapturedBPiece = INTERFACE_PopCapturedBPiece;

	this.ShowLoadingMove = INTERFACE_ShowLoadingMove;
	this.HideLoadingMove = INTERFACE_HideLoadingMove;

	this.ShowLeaveUser = INTERFACE_ShowLeaveUser;
	this.HideLeaveUser = INTERFACE_HideLeaveUser;

	this.SetWTime();
	this.SetBTime();
}



/**
* @brief	Show this game in the interface
*
* @return	true if game is showed with sucess, else false
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_ShowGame()
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
* @brief	Hide this game in the interface
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_HideGame()
{
	var ParentGame = this.Game.parentNode;

	ParentGame.removeChild(this.Game);
}


/**
* @brief	Set game as finished
*
* Disable options and drag pieces
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_FinishGame()
{
	this.Finished = true;
}


/**
* @brief	Remove this game
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_RemoveGame()
{
	var GameObj = MainData.GetGame(this.Id);
	var Board = this.Game;

	
	// If game exists
	if (GameObj != null)
	{	
		// if board isn't opened, do nothing.
		if(Board == null)
		{
			return false
		}
		// else if game is no finished, show message.
		else if (GameObj.Finished == false)
		{
			WINDOW_Alert(UTILS_GetText("game_remove_game"));
			return false;
		}
	}

	//Remove board from interface
	Board.parentNode.removeChild(Board);
	return true;

}

/*
* @brief	Set game interface to observer mode
*
* Show move list and remove game options
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Set game interface to oldgame mode
*
* Show move list with buttons to review game moves and remove game options
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Remove all pieces from board
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Clean the board and show new board
*
* @param	BoardArray 	Board in arrays format
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Display a piece in specified line and column of the board
*
* @param	Piece 	Piece char
* @param 	Line 	Line where is the piece will be place
* @param 	Col 	Column where is the piece will be place
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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

	Board.appendChild(PieceImg);
}


/**
* @brief	Remove a piece from the board
*
* @param 	Line 	Line where the piece was placed
* @param 	Col 	Column where the piece was placed
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
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
	else
	{
		return null;
	}
}

/**
* @brief	Update the board on the screen
*
* Get diff between old board and new board and update
*
* @param 	OldBoard 	Current Board
* @param 	NewBoard 	New board that will be show
* @return	void
* @author	Rubens and Pedro
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Undo the last move done by you
*
* @return	True if sucess or false if game not found
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Set and show current player turn
*
* @param 	Color is the player color
* @return	void
* @author	Rubens Suguimoto and Pedro Rocha
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
* @brief	Decrease players time
*
* Executed in each second and accordly to game turn color
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_DecreaseTime()
{
	var CurrentGame = MainData.GetCurrentGame();

	if (CurrentGame != null)
	{
		if (CurrentGame.Game.Turn == "white")
		{
			if (CurrentGame.Game.WhitePlayer.Time != null)
			{
				CurrentGame.Game.WhitePlayer.Time -= 1;
				CurrentGame.Game.SetWTime();
			}
		}
		else
		{
			if (CurrentGame.Game.BlackPlayer.Time != null)
			{
				CurrentGame.Game.BlackPlayer.Time -= 1;
				CurrentGame.Game.SetBTime();
			}
		}
	}
	else
	{
		alert("Game error - Current game is null, no timer to decrease");
	}
}

/**
* @brief	Start timer
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_StartTimer()
{
	this.Timer = setInterval(this.DecreaseTime, 1000);
}

/**
* @brief	Stop timer
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_StopTimer()
{
	if(this.Timer != undefined)
	{
		this.Timer = window.clearInterval(this.Timer);
	}
}


/**
* @brief	Update white player time value
*
* @param 	NewTime 	New time to be update
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_UpdateWTime(NewTime)
{
	this.WhitePlayer.Time = NewTime;
}

/**
* @brief	Update black player time value
*
* @param 	NewTime 	New time to be update
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_UpdateBTime(NewTime)
{
	this.BlackPlayer.Time = NewTime;
}

/**
* @brief	Show white player time on interface
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_SetWTime()
{
	var min, sec;
	var minStr, secStr;

	if(this.WhitePlayer.Time == null)
	{
		this.WhitePlayer.Time == "-- : --";
	}
	else if (this.WhitePlayer.Time < 0)
	{
		this.WhitePlayer.Time == "-- : --";
	}
	else {
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
}

/**
* @brief	Show black player time on interface
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_SetBTime()
{
	var min, sec;
	var minStr, secStr;

	if(this.BlackPlayer.Time == null)
	{
		this.BlackPlayer.Time == "-- : --";
	}
	else if (this.BlackPlayer.Time < 0)
	{
		this.BlackPlayer.Time == "-- : --";
	}
	else {
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
}

/**
* @brief	Show white player image
*
* @param 	Img	Image with type concatenated with iamge in base64
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_SetWPhoto(Img)
{
	this.photo.wphoto.src = IMAGE_ImageDecode(Img);
}

/**
* @brief	Show black player image
*
* @param 	Img	Image with type concatenated with iamge in base64
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_SetBPhoto(Img)
{
	this.photo.bphoto.src = IMAGE_ImageDecode(Img);
}

/**
* @brief	Show a new move in Move List
*
* @param 	NumTurn 	Turn number
* @param 	Move 		Move done
* @param	ShortMove	Move done in short format
* @param 	WTime 		White player time when move was done
* @param 	BTime 		Black time when move was done
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_AddMove(NumTurn, Move, ShortMove, WTime, BTime)
{
	var ScrollTop, ScrollHeight, ClientHeight;
	var Num;
	var FullMove;
	var MoveSpan;
	var Item;

	var CurrentGame = MainData.GetCurrentGame();

	// NumTurn-1 is a Quickfix to display moves in move list 
	// without the first board of game (contains no move and shortmove)
	FullMove = Math.ceil((NumTurn-1)/2);
	if ((NumTurn-1) % 2 == 1)
	{
		// Create a item on list 
		if(FullMove % 2 == 1)
		{
			Item = UTILS_CreateElement("li",this.Id+"_"+FullMove,"white",null);
		}
		else
		{
			Item = UTILS_CreateElement("li",this.Id+"_"+FullMove,"black",null);
		}
		Num = UTILS_CreateElement("p", null, null, FullMove+".");
		Item.appendChild(Num);
	}
	else
	{
		// TODO -> remove getElementById, and set list of pointer to
		// li HTML element in board object;

		// Get item from list 
		Item = document.getElementById(this.Id+"_"+((NumTurn-1)/2));
	}

	MoveSpan = UTILS_CreateElement("p", null, "move", ShortMove);

	Item.appendChild(MoveSpan);

	//Players can see old moves when game is finished
	//CurrentGame.Finished is not used here because
	//observer game set Finished = true;
	if(CurrentGame == null)
	{
		UTILS_AddListener(MoveSpan, "click", function(){ OLDGAME_GotoBoard(NumTurn); }, false);
	}

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
* @brief	Remove last move in Move List
*
* This is should be used when players agree to return one move
*
* @return	none
* @author	Rubens Suguimoto and Pedro Rocha
*/
function INTERFACE_RemoveMove()
{
	this.MoveList.removeChild(this.MoveList.lastChild);
}

/**
* @brief	Add a white captured piece in black player's captured list
* 
* @param	Piece	Piece character
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddCapturedWPiece(Piece)
{
	var TmpPiece = Piece.toLowerCase();

	var PieceType="W";
	var PieceElement;

	switch(TmpPiece)
	{
		case "p":
			PieceType += "pawn"
			break;
		case "k":
			PieceType += "knight"
			break;
		case "b":
			PieceType += "bishop"
			break;
		case "r":
			PieceType += "rook"
			break;
		case "q":
			PieceType += "queen"
			break;
	}

	// Create captured piece element
	PieceElement = UTILS_CreateElement("li",PieceType);

	// Add to Black player captured array
	this.BCapturedList.push(PieceElement);

	// Append piece in captured list 
	this.PBCapturedList.appendChild(PieceElement);
}

/**
* @brief	Add a black captured piece in white player's captured list
* 
* @param	Piece	Piece character
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddCapturedBPiece(Piece)
{
	var TmpPiece = Piece.toLowerCase();

	var PieceType="B";
	var PieceElement;

	switch(TmpPiece)
	{
		case "p":
			PieceType += "pawn"
			break;
		case "k":
			PieceType += "knight"
			break;
		case "b":
			PieceType += "bishop"
			break;
		case "r":
			PieceType += "rook"
			break;
		case "q":
			PieceType += "queen"
			break;
	}

	// Create captured piece element
	PieceElement = UTILS_CreateElement("li",PieceType);
	
	// Add to White player captured array
	this.WCapturedList.push(PieceElement);

	// Append piece in captured list 
	this.PWCapturedList.appendChild(PieceElement);
}

/*
* @brief	Remove last piece from white captured pieces list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_PopCapturedWPiece()
{
	var Piece;
	var PieceParent;
	if(this.BCapturedList.length != 0)
	{
		Piece = this.BCapturedList.pop();
		PieceParent = Piece.parentNode;
		PieceParent.removeChild(Piece);
	}
}

/*
* @brief	Remove last piece from black captured pieces list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_PopCapturedBPiece()
{
	var Piece;
	var PieceParent;
	if(this.WCapturedList.length != 0)
	{
		Piece = this.WCapturedList.pop();
		PieceParent = Piece.parentNode;
		PieceParent.removeChild(Piece);
	}
}

