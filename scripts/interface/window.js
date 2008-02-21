function WindowObj(Height, Width, Div, Title, CloseCommands)
{
	//Constructor and attribute
	var tmp = WINDOW_CreateWindow(Height, Width, Div, Title, CloseCommands);


	this.window = tmp.Div; //WindowObject;
	this.eventButtons = tmp.Close; //Event buttons;

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
	this.pushEventButtons = WINDOW_ConcatEventButtons;
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
	//delete this;
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

function WINDOW_ConcatEventButtons(ButtonsList)
{
	var i;

	for(i=0; i<ButtonsList.length; i++)
	{
		this.eventButtons.push(ButtonsList[i]);
	}
}

/***************************************************/
function WINDOW_CreateWindow(Height, Width, Div, Title)
{
	var WindowBox = document.createElement("div");
	var SubWindowBox     = document.createElement("div");

	var TitleBar= document.createElement("div");

	var TmpTitle = document.createElement("span");

	var TmpClose = document.createElement("span");

	//Array of buttons;
	var Close = new Array();

	var i;
	
	WindowBox.id ="WindowBox";
	WindowBox.style.width = Width+"px";
	if(Height != null)
	{
		WindowBox.style.height= Height+"px";
	}

	SubWindowBox.id ="SubWindowBox";
	SubWindowBox.style.width = Width +"px";
	if(Height != null)
	{
		SubWindowBox.style.height =(Height - 21)+"px";
	}

	TitleBar.id = "TitleBar";
	TitleBar.style.width = Width+"px";

	//Drag and Drop Window
	UTILS_AddListener(TitleBar, "mousedown", function(event){ UTILS_StartDragWindow(event, WindowBox); }, false);


	TmpTitle.innerHTML = Title;
	TmpTitle.id = "Title";

	TmpClose.innerHTML = "X";
	TmpClose.id = "Close";

	Close.push(TmpClose);

	//Additional Commands when close a window
	/*
	if(CloseCommands != null)
	{
		UTILS_AddListener(TmpClose, "click", CloseCommands ,false);
	}
	*/
	Div.style.width = Width - 10;


	TitleBar.appendChild(TmpTitle);
	TitleBar.appendChild(TmpClose);

	SubWindowBox.appendChild(Div);

	WindowBox.appendChild(TitleBar);
	WindowBox.appendChild(SubWindowBox);

	return {Div:WindowBox, Close:Close}
}


/******************************************************
*******************************************************
*******************************************************
*******************************************************
*******************************************************
******************************************************/


function WINDOW_CreateAlert(Text)
{
	var Div;

	var TextDiv;
	var Span;

	var ButtonsDiv;
	var Ok;
	
	var Buttons = new Array();

	Div = UTILS_CreateElement("div","AlertDiv");

	TextDiv = UTILS_CreateElement("div","TextDiv");
	Span = UTILS_CreateElement("p",null,null,Text);

	ButtonsDiv = UTILS_CreateElement("div","ButtonsDiv");
	Ok = UTILS_CreateElement("input", null,"button");
	Ok.type = "button";
	Ok.value = "Ok";

	Buttons.push(Ok);

	TextDiv.appendChild(Span);

	ButtonsDiv.appendChild(Ok);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}


function WINDOW_CreateConfirm(Text)
{
	var Div;

	var Buttons = new Array();

	var TextDiv;
	var Label;

	var ButtonsDiv;
	var Ok;
	var Cancel;

	Div = UTILS_CreateElement("div","ConfirmDiv");

	TextDiv = UTILS_CreateElement("div","TextDiv");
	Label = UTILS_CreateElement("p",null,null,Text);

	ButtonsDiv = UTILS_CreateElement("div","ButtonsDiv");
	Ok = UTILS_CreateElement("input", null,"button");
	Ok.type = "button";
	Ok.value = "ok";

	Cancel = UTILS_CreateElement("input", null,"button");
	Cancel.type = "button";
	Cancel.value = "cancelar";

	Buttons.push(Ok);
	Buttons.push(Cancel);

	ButtonsDiv.appendChild(Ok);
	ButtonsDiv.appendChild(Cancel);

	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of game alert window and returns div
*
* @param	Text	Text to display in confirm box
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_GameAlert();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function WINDOW_CreateGameAlert(Text, User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'GameAlertDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('p', null, null, UTILS_GetText(Text).replace(/%s/,UTILS_Capitalize(User)));

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
*	Create elements of confirm request window and returns div
*
* @param	Text	Text to display in confirm box
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_GameConfirm();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function WINDOW_CreateGameConfirm(Text, User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'GameConfirmDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('p', null, null, UTILS_GetText(Text).replace(/%s/,UTILS_Capitalize(User)));

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
