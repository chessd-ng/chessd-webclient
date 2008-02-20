function UTILS_StartDragWindow(ev, Obj)
{
	var MousePos, OldPos;
	var OffsetLeft, OffsetTop;

	Obj.style.position = "absolute";

	// Get mouse position when click on window title
	MousePos = UTILS_GetMouseCoords(ev);
	MousePos.x -= 19;

	// Get mouse offset in window
	OffsetTop = MousePos.y - Obj.offsetTop;
	OffsetLeft = MousePos.x - Obj.offsetLeft;

	// Drag window
	document.body.onmousemove = function(ev){
		var NewMousePos;
		NewMousePos = UTILS_GetMouseCoords(ev);
		NewMousePos.x -= 19;

		Obj.style.top = (NewMousePos.y - OffsetTop)+"px";
		Obj.style.left = (NewMousePos.x - OffsetLeft)+"px";

		return false;
	};

	// Stop drag
	document.body.onmouseup = function (ev){	
		var NewMousePos;

		// Getting mouse coord
		NewMousePos = UTILS_GetMouseCoords(ev);
		NewMousePos.x -= 19;

		// Set object in the new position
		Obj.style.top = (NewMousePos.y - OffsetTop)+"px";
		Obj.style.left = (NewMousePos.x - OffsetLeft)+"px";

		// Remove listener
		document.body.onmousemove = null;
		document.body.onmouseup = null;

		return false;
	}

	return false;
}
