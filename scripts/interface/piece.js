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
* Functions to create, update and remove pieces
*/ 

function INTERFACE_NewPiece(Piece, PlayerColor, Size)
{
	var PieceImg;
	var PieceName, PieceTitle;
	var DragPieceW, DrawPieceB;
	var PieceDir = "images/pieces";

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
			PieceImg.src = PieceDir+"/wtower.png";
			PieceImg.title = UTILS_GetText("game_white_rook");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Knight
		case 'N':
			PieceImg.src = PieceDir+"/wknight.png";
			PieceImg.title = UTILS_GetText("game_white_knight");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Bishop  
		case 'B':
			PieceImg.src = PieceDir+"/wbishop.png";
			PieceImg.title = UTILS_GetText("game_white_bishop");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Queen
		case 'Q':
			PieceImg.src = PieceDir+"/wqueen.png";
			PieceImg.title = UTILS_GetText("game_white_queen");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White King
		case 'K':
			PieceImg.src = PieceDir+"/wking.png";
			PieceImg.title = UTILS_GetText("game_white_king");
			PieceImg.onmousedown = DragPieceW;
			break;

		// White Pawn
		case 'P':
			PieceImg.src = PieceDir+"/wpawn.png";	
			PieceImg.title = UTILS_GetText("game_white_pawn");
			PieceImg.onmousedown = DragPieceW;
			break;

		// Black Rook
		case 'r':
			PieceImg.src = PieceDir+"/btower.png";
			PieceImg.title = UTILS_GetText("game_black_rook");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Knight
		case 'n':
			PieceImg.src = PieceDir+"/bknight.png";
			PieceImg.title = UTILS_GetText("game_black_knight");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Bishop
		case 'b':
			PieceImg.src = PieceDir+"/bbishop.png";
			PieceImg.title = UTILS_GetText("game_black_bishop");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black King
		case 'q':
			PieceImg.src = PieceDir+"/bqueen.png";
			PieceImg.title = UTILS_GetText("game_black_queen");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Queen
		case 'k':
			PieceImg.src = PieceDir+"/bking.png";
			PieceImg.title = UTILS_GetText("game_black_king");
			PieceImg.onmousedown = DragPieceB;
			break;

		// Black Pawn
		case 'p':
			PieceImg.src = PieceDir+"/bpawn.png";
			PieceImg.title = UTILS_GetText("game_black_pawn");
			PieceImg.onmousedown = DragPieceB;
			break;

		default:
				break;

	}

	PieceImg.style.position = "absolute";

	PieceImg.style.width = Size+"px";
	PieceImg.style.height = Size+"px";

	return PieceImg;
}

//Private
function INTERFACE_FindPiece(BoardDiv, Id)
{
	var BoardList = BoardDiv.getElementsByTagName("img");
	var i=0;

	while(i<BoardList.length)
	{
		if(BoardList[i].getAttribute("id") == Id)
		{
			return BoardList[i]
		}
		i++;
	}
	return null;
}

//Public
function INTERFACE_RemovePiece(Line, Col)
{
	var Board = this.Board;
	var Piece = INTERFACE_FindPiece(Board, "Piece"+UTILS_HorizontalIndex(Col+1)+(Line+1));

	alert("Removendo peca "+Piece.id);
	if (Piece != null)
	{
		Board.removeChild(Piece);
		return Piece;
	}
}

//Public
function INTERFACE_DisplayPiece(Piece, Line, Col, PlayerColor)
{
	var Board = this.Board; 
	var PieceImg = INTERFACE_NewPiece(Piece, PlayerColor, this.PieceSize);

	if (PlayerColor == "white")
	{
		PieceImg.style.left = (Col * this.PieceSize)+"px";
		PieceImg.style.top = (Line * this.PieceSize)+"px";
	}
	else
	{
		PieceImg.style.left = ((7 * this.PieceSize) - (Col * this.PieceSize))+"px";
		PieceImg.style.top  = ((7 * this.PieceSize) - (Line * this.PieceSize))+"px";
	}
	PieceImg.id = "Piece"+UTILS_HorizontalIndex(Col+1)+(8-Line);
	
	Board.appendChild(PieceImg);
}

//Public
function INTERFACE_UpdateBoard(OldBoard, NewBoard, PlayerColor)
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
					this.RemovePiece(i,j);
				}
				else
				{
					//Remover a peça no tauleiro anterior
					if (OldBoard[i].charAt(j)!= "-")
					{
						this.RemovePiece(i, j);
					}
					this.InsertPiece(Piece, i, j, PlayerColor);
				}
			}	
		}
	}
}
