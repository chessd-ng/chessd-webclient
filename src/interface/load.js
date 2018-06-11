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

/*
* @file		interface/load.js
* @brief	This file contains all functions to manage scripts to be load
*/

/*
* @class	LoadObj
* @brief	Create interface load object
*
* @return	none
* @author	Rubens Suguimoto
*/
function LoadObj() 
{
	var Load = INTERFACE_StartLoad();

	// Attributes
	this.LoadDiv = Load.LoadDiv;
	this.LoadLabel = Load.LoadLabel;
	this.BarBorder = Load.BarBorder;
	this.LoadBar = new LoadingBar();

	// Methods
	this.show = INTERFACE_ShowLoad;
	this.hide = INTERFACE_HideLoading;
	this.remove = INTERFACE_RemoveLoad;
	this.setLabel = INTERFACE_SetLabel;

	// Show LoadDiv
	this.LoadBar.show(this.BarBorder);
	this.show();
}

/**
* @brief	Create load box HTML DOM elements
* 
* @return	Load main HTML DOM Div, load file text HTML DOM P and load bar HTML DOM Div element
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_StartLoad()
{
	var LoadDiv, LoadHeader, WaitLabel, LoadingLabel;
	var BarBorder;

	// Creating elements
	LoadDiv = UTILS_CreateElement("div", "LoadDiv");
	LoadHeader = UTILS_CreateElement("h1", null, null, UTILS_GetText("general_name"));
	WaitLabel = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_load_wait"));
	LoadingLabel = UTILS_CreateElement("p", "LoadingLabel", null);
	
	BarBorder = UTILS_CreateElement("div","BarBorder");

	// Creating tree
	LoadDiv.appendChild(LoadHeader);
	LoadDiv.appendChild(WaitLabel);
	LoadDiv.appendChild(LoadingLabel);

	LoadDiv.appendChild(BarBorder);

	return {LoadDiv:LoadDiv, LoadLabel:LoadingLabel, BarBorder:BarBorder}
}



/** 
* @brief	Show load box
*
* @return	none 
* @author	Rubens Suguimoto
*/ 
function INTERFACE_ShowLoad()
{
	if(this.LoadDiv.parentNode != document.body)
	{
		document.body.appendChild(this.LoadDiv);
	}
	this.LoadDiv.style.display = "block";
}

/** 
* @brief	Hide load box
*
* @return	none 
* @author	Rubens Suguimoto
*/ 
function INTERFACE_HideLoading()
{
	this.LoadDiv.style.display = "none";
}

/** 
* @brief	Remove load box
*
* @return	none 
* @author	Rubens Suguimoto
*/ 
function INTERFACE_RemoveLoad()
{
	this.LoadDiv.parentNode.removeChild(this.LoadDiv);
}

/** 
* @brief	Set load file text
*
* @return	none 
* @author	Rubens Suguimoto
*/ 
function INTERFACE_SetLabel(Str)
{
	this.LoadLabel.innerHTML = Str;
}

///////LOADING BAR OBJECT
/*
* @class	LoadingBarObj
* @brief	Create interface loading bar object
*
* @return	none
* @author	Rubens Suguimoto
*/
function LoadingBar()
{
	// Attributes
	this.MaxValue = 300;
	this.CurrentValue = 0;
	this.ProgressBar = INTERFACE_CreateBar("Bar");

	//methods
	this.add = INTERFACE_AddValue;
	this.sub = INTERFACE_SubValue;
	this.show = INTERFACE_ShowLoadingBar;
	this.hide = INTERFACE_HideLoadingBar;
	this.remove = INTERFACE_RemoveLoadingBar;
}

/*
* @brief	Create loading bar HTML DOM element
*
* @return	Loading bar Div element
* @author	Rubens Suguimoto
*/
function INTERFACE_CreateBar(Id)
{
	var Bar = document.createElement("div");

	Bar.id = Id;

	return Bar;
}

/*
* @brief	Add some value to loading bar
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddValue(Num)
{
	if((this.CurrentValue + Num) > this.MaxValue)
	{
		this.CurrentValue = this.MaxValue;
	}
	else
	{
		this.CurrentValue += Num;
	}

	this.ProgressBar.style.width = this.CurrentValue+"px";
}

/*
* @brief	Subtract some value from loading bar
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_SubValue(Num)
{
	if((this.CurrentValue - Num) < 0)
	{
		this.CurrentValue = 0;
	}
	else
	{
		this.CurrentValue -= Num;
	}

	this.ProgressBar.style.width = this.CurrentValue+"px";
}

/*
* @brief	Show loading bar
*
* @param	Element		HTML DOM Element
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowLoadingBar(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.ProgressBar);
	}
	else
	{
		document.body.appendChild(this.ProgressBar);
	}

	this.ProgressBar.style.display = "block";
}

/*
* @brief	Hide loading bar
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideLoadingBar()
{
	this.ProgressBar.style.display = "none";
}

/*
* @brief	Remove loading bar
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_RemoveLoadingBar()
{
	this.ProgressBar.parendNode.removeChild(this.ProgressBar);
}
