function WindowObj(Height, Width, Div, Title, CloseCommands)
{
	//Constructor and attribute
	this.window = WINDOW_CreateWindow(Height, Width, Div, Title, CloseCommands);

	//Methods
	this.show = WINDOW_ShowWindow;
	this.close = WINDOW_CloseWindow;
	this.setId = WINDOW_SetId;
	this.setSize = WINDOW_SetSize;
	this.setTitle = WINDOW_SetTitle;
	this.focus = WINDOW_SetFocus;
	this.blur = WINDOW_SetBlur;
	this.setZIndex = WINDOW_SetZIndex;
	this.getZIndex = WINDOW_GetZIndex;
}


function WINDOW_ShowWindow(Element)
{
	if(Element == null)
	{
		document.body.appendChild(this.window);
	}
	else
	{
		Element.appendChild(this.window);
	}
}

function WINDOW_CloseWindow()
{
	this.window.parentNode.removeChild(this.window);
	delete this;
}

function WINDOW_SetId(Id)
{
	this.window.id=Id;
}

function WINDOW_SetSize(Width, Height)
{
	this.window.style.width = Width;
	this.window.style.height = Height;
}

function WINDOW_SetTitle(Title)
{
	this.window.getElementById("Title").innerHTML = Title;
}

function WINDOW_SetFocus()
{
	//Title
	this.window.getElementsByTagName("div")[0].className = "focus";
	//Content
	this.window.getElementsByTagName("div")[1].className = "focus";
}

function WINDOW_SetBlur()
{
	//Title
	this.window.getElementsByTagName("div")[0].className = "";
	//Content
	this.window.getElementsByTagName("div")[1].className = "";
}

function WINDOW_SetZIndex(Index)
{
	this.window.style.zIndex = Index;
}

function WINDOW_GetZIndex()
{
	return this.window.style.zIndex;
}

/***************************************************/
/***************************************************/
/***************************************************/
/***************************************************/
function WINDOW_CreateWindow(Height, Width, Div, Title, CloseCommands)
{
	var WindowBox = document.createElement("div");
	var SubWindowBox     = document.createElement("div");

	var TitleBar= document.createElement("div");

	var TmpTitle = document.createElement("span");

	var TmpClose = document.createElement("span");

	var i;


	WindowBox.id ="WindowBox";
	WindowBox.style.width = Width+"px";
	WindowBox.style.height= Height+"px";

	SubWindowBox.id ="SubWindowBox";
	SubWindowBox.style.height =(Height - 21)+"px";
	SubWindowBox.style.width = Width +"px";

	TitleBar.id = "TitleBar";
	TitleBar.style.width = Width+"px";

	//Drag and Drop Window
	UTILS_AddListener(TitleBar, "mousedown", function(){ UTILS_DragWindow(WindowBox); }, false);


	TmpTitle.innerHTML = Title;
	TmpTitle.id = "Title";

	TmpClose.innerHTML = "X";
	TmpClose.id = "Close";

	//Additional Commands when close a window
	if(CloseCommands != null)
	{
		UTILS_AddListener(TmpClose, "click", CloseCommands ,false);
	}

	Div.style.width = Width - 10;



	TitleBar.appendChild(TmpTitle);
	TitleBar.appendChild(TmpClose);

	SubWindowBox.appendChild(Div);

	WindowBox.appendChild(TitleBar);
	WindowBox.appendChild(SubWindowBox);

	return WindowBox;
}

