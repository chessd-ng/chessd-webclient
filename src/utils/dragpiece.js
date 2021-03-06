import {
	GAME_RemoveBlockClass,
	GAME_ShowLoadingMove,
	GAME_RemoveBlockBorder,
	GAME_SetBlockClass,
	GAME_SendMove,
} from 'game/game.js';
import { UTILS_GetOffset } from 'utils/utils.js';

import { MainData } from 'main_data.js';

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
* @file		utils/dragpiece.js
* @brief	Drag and drop game board pieces 
*/

//This variable is used to save original position of piece when move it
var OldPos;
//TODO -> REMOVE THIS VARIABLE AND DEFINE INSIDE THE FUNCTION BELOW

/**
* @brief	Drag and drop piece board 
* Start drag a piece when click or click and hold button a button over a piece. If click for second time(without hold button) then release piece and send move to server. If click and hold button was set and release the button drop piece and send move to server;
*
* @param	Obj	DOM Element
* @param	Size	Piece size
* @param	event	Javascript Event
* @return	True of False
* @author	Rubens Suguimoto
*/
export function UTILS_StartDragPiece(Obj, Size, event)
{
	var MousePos;
	var OffsetLeft, OffsetTop, OffsetBoard;
	
	var CurrentGame = MainData.GetCurrentGame();

	if(CurrentGame == null)
	{
		return false;
	}

	// If ut's not your turn, don't drag
	if ((CurrentGame.IsYourTurn == false) || (CurrentGame.Finished == true))
	{
		return false;
	}

	//Obj.style.position = "absolute";

	// Getting offsets
	OffsetBoard = UTILS_GetOffset(CurrentGame.Game.Board);
  //
	// Set BoardPiece OffSet
	var BoardPieceOffset = new Object;

	// PS: FF3 use same values as IE to drag piece
	if(MainData.GetBrowser() != 1) //is not FF2
	{
		BoardPieceOffset.y = -335;
		BoardPieceOffset.x = 260;
	}
	else
	{
		BoardPieceOffset.y = -300;
		BoardPieceOffset.x = 0;
	}

	// Getting offsets
  var Offset = Size / 2;
	OffsetBoard = UTILS_GetOffset(CurrentGame.Game.Board);


	// Add half of the piece size and others elements margin and borders
	OffsetTop = OffsetBoard.Y + BoardPieceOffset.y;
	OffsetLeft = OffsetBoard.X + BoardPieceOffset.x;


	//alert(OffsetTop +" = " +OffsetBoard.Y +" + "+ Offset+" + 38 + "+BoardPieceOffset.y +"\n"+OffsetLeft +" = " +OffsetBoard.X +" + "+ Offset+" + 257 + "+BoardPieceOffset.x);

	// Drag piece
	if(document.body.onmouseup == null) // Quick fix to not use global variable
	{
		// Get Obj position
		OldPos = new Object();
		OldPos.x = parseInt(Obj.style.left.replace(/px/, ""));
		OldPos.y = parseInt(Obj.style.top.replace(/px/, ""));

    Obj.style.pointerEvents = 'none';

		// Set block class of origin
		GAME_SetBlockClass((8 - OldPos.y/Size), (OldPos.x/Size + 1));
	
		document.body.onmousemove = function (ev) {
			MousePos = UTILS_GetMouseCoords(ev);

      Obj.style.top = (MousePos.y-Offset-OffsetTop)+"px";
      Obj.style.left = (MousePos.x-Offset-OffsetLeft)+"px";

			// Change cursor to move
			document.body.style.cursor = "move";
			// Set piece zIndex
			Obj.style.zIndex = 1;

			// If mousedown was set, and piece was moved
			// then set mouseup to stop drag when release the button
			document.body.onmouseup = function(evt){
				var NewPos = new Object();
				var NewCol, NewLine, OldCol, OldLine;
				CurrentGame = MainData.GetCurrentGame();

				// Getting mouse coord
				MousePos = UTILS_GetMouseCoords(evt);
				MousePos.x = MousePos.x - OffsetLeft;
				MousePos.y = MousePos.y - OffsetTop;
				// If release outside the board
				if (MousePos.x < 0 || MousePos.x > 8*Size || MousePos.y < 0 || MousePos.y > 8*Size)
				{
					NewPos.x = OldPos.x;
					NewPos.y = OldPos.y;
				}
				else
				{
					NewPos.x = MousePos.x - (MousePos.x % Size);
					NewPos.y = MousePos.y - (MousePos.y % Size);
				}
				// Previous position
				OldLine = 8 - (OldPos.y / Size);
				OldCol = (OldPos.x / Size) + 1;

				// NewPosition
				NewLine = 8 - (NewPos.y / Size);
				NewCol = (NewPos.x / Size) + 1;

				// Set object in the new position
        Obj.style.top =  (NewPos.y) +"px";
        Obj.style.left = (NewPos.x) +"px";

				// Remove listener
				//Obj.onmouseup = null;
				document.body.onmousemove = null;
				document.body.onmouseup = null;
        Obj.style.pointerEvents = 'inherit';

				if (CurrentGame != null)
				{
					// If piece has been moved
					if ((NewCol != OldCol) || (NewLine != OldLine))
					{
						// Send movement
						GAME_SendMove(OldLine, OldCol, NewLine, NewCol);
						// Show loading move message
						GAME_ShowLoadingMove(CurrentGame.Id);
          }
        }

				// Return to deafult cursor
				document.body.style.cursor = "default";

				// Remove block border of origin
				GAME_RemoveBlockBorder(OldLine, OldCol);

				// If game time over while making a move, remove block class from selected block
				GAME_RemoveBlockClass(OldLine, OldCol);

        OldPos = undefined;

				return false;
			};
			return false;
		};
	}
	else // Stop drag when click for second time
	{
		var NewPos = new Object();
		var NewCol, NewLine, OldCol, OldLine;
		CurrentGame = MainData.GetCurrentGame();

		// Getting mouse coord
		MousePos = UTILS_GetMouseCoords(event);
		MousePos.x = MousePos.x - OffsetLeft;
		MousePos.y = MousePos.y - OffsetTop;
		// If release outside the board
		if (MousePos.x < 0 || MousePos.x > 8*Size || MousePos.y < 0 || MousePos.y > 8*Size)
		{
			NewPos.x = OldPos.x;
			NewPos.y = OldPos.y;
		}
		else
		{
			NewPos.x = MousePos.x - (MousePos.x % Size);
			NewPos.y = MousePos.y - (MousePos.y % Size);
		}
		// Previous position
		OldLine = 8 - (OldPos.y / Size);
		OldCol = (OldPos.x / Size) + 1;

		// NewPosition
		NewLine = 8 - (NewPos.y / Size);
		NewCol = (NewPos.x / Size) + 1;

		// Set object in the new position
		Obj.style.top =  NewPos.y +"px";
		Obj.style.left = NewPos.x +"px";
    Obj.style.pointerEvents = 'inherit';

		// Remove listener
		//Obj.onmouseup = null;
		document.body.onmousemove = null;
		document.body.onmouseup = null;

		if (CurrentGame != null)
		{
			// If piece has been moved
			if ((NewCol != OldCol) || (NewLine != OldLine))
			{
				// Send movement
				GAME_SendMove(OldLine, OldCol, NewLine, NewCol);

				// Show loading move message
				GAME_ShowLoadingMove(CurrentGame.Id);

			}
		}

		// Return to default cursor
		document.body.style.cursor = "default";

		// Remove block class of origin
		GAME_RemoveBlockClass(OldLine, OldCol);

    OldPos = undefined;

		return false;
	}
	return true;
}


/**
* @brief 	Get mouse coords 
*
* @param        ev 	Javascript Event
* @return       Tuple with X and Y position (in pixels)
* @author       Rubens Suguimoto and Pedro Rocha
*/
export function UTILS_GetMouseCoords(ev)
{
	var X, Y;
	ev = ev || window.event;

	if (ev.pageX || ev.pageY)
	{
		X = ev.pageX;
		Y = ev.pageY;
	}
	else
	{
		X = ev.clientX;
		Y = ev.clientY;
	}
	return {x: X, y:Y};
}
