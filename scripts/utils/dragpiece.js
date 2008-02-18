function UTILS_StartDragPiece(Obj, Size)
{
	var MousePos, OldPos;
	var BorderOffSet = 3;
	Obj.style.position = "absolute";

	OldPos = new Object();
	OldPos.x = Obj.style.left.replace(/px/, "");
	OldPos.y = Obj.style.top.replace(/px/, "");

	Offset = Size / 2;

	OffsetLeft = Offset + MainData.CurrentGame.Game.game.offsetLeft;
	OffsetTop = Offset + MainData.CurrentGame.Game.game.offsetTop;

	document.onmousemove = function (ev) {
		MousePos = UTILS_GetMouseCoords(ev);

		Obj.style.top = (MousePos.y-OffsetTop)+"px";
		Obj.style.left = (MousePos.x-OffsetLeft)+"px";
	};

	
	document.onmouseup = function(ev) {	
		var NewPos = new Object();
		var Col, Line;

		MousePos = UTILS_GetMouseCoords(ev);
		MousePos.x -= OffsetLeft;
		MousePos.y -= OffsetTop;
		MousePos.x += Size/2;
		MousePos.y += Size/2;

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
		Line = 8 - (NewPos.y / Size);
		Col = (NewPos.x / Size) + 1;

		Obj.style.top =  (NewPos.y + BorderOffSet) +"px";
		Obj.style.left = (NewPos.x+ BorderOffSet) +"px";
		document.onmousemove = null;
		document.onmouseup = null;
	}	
	
}

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


