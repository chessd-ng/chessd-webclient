function UTILS_StartDragPiece(Obj, Size)
{
	var MousePos, OldPos;
	var Offset, OffsetLeft, OffsetTop, OffsetBoard;

	
	Obj.style.position = "absolute";

	// Get Obj position
	OldPos = new Object();
	OldPos.x = Obj.style.left.replace(/px/, "");
	OldPos.y = Obj.style.top.replace(/px/, "");

	// Getting offsets
	Offset = Size / 2;
	OffsetBoard = UTILS_GetOffset(MainData.CurrentGame.Game.Board);

	// Add half of the piece size and others elements margin and borders
	OffsetTop = OffsetBoard.Y + Offset + 38;
	OffsetLeft = OffsetBoard.X + Offset - 257;
	
	// Drag piece
	document.onmousemove = function (ev) {
		MousePos = UTILS_GetMouseCoords(ev);

		Obj.style.top = (MousePos.y-OffsetTop)+"px";
		Obj.style.left = (MousePos.x-OffsetLeft)+"px";
	};

	// Stop drag
	document.onmouseup = function(ev) {	
		var NewPos = new Object();
		var NewCol, NewLine, OldCol, OldLine;

		// Getting mouse coord
		MousePos = UTILS_GetMouseCoords(ev);
		MousePos.x -= OffsetLeft;
		MousePos.y -= OffsetTop;
		MousePos.x += Size/2;
		MousePos.y += Size/2;

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

		// Remove listener
		document.onmousemove = null;
		document.onmouseup = null;

		// If piece has been moved
		if ((NewCol != OldCol) || (NewLine != OldLine))
		{
			// Send movement
			GAME_SendMove(OldLine, OldCol, NewLine, NewCol);
		}
	}	
}


/**
* Return mouse coords
*/
function UTILS_GetMouseCoords(ev)
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
