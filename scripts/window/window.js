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
* Control Windows
*/

//Window Object is defined in interface/windows.js

/**
* 
*/
function WINDOW_NewWindow(WinSize, Div, Title, CloseCommands)
{
	var Height, Width;
	var Win;

	var zIndex = MainData.Windows.WindowList.length;

	Width = WinSize;
	Height = ""; //auto

	//Create Window Object
	Win = new WindowObj(Height, Width, Div, Title, CloseCommands);

	//Close Button event
	UTILS_AddListener(Win.window.getElementsByTagName("span")[1], "click", function(){ WINDOW_RemoveWindow(Win) }, false);

	//Window Focus Event
	UTILS_AddListener(Win.window ,"mousedown", function(){ WINDOW_ChangeFocus(Win)},false);

	//Show Windows on browser
	Win.show();

	if(MainData.Windows.Focus != null)
	{
		MainData.Windows.Focus.blur();
	}

	//Set focus on Browser
	Win.focus();
	Win.setZIndex(zIndex);

	//Add Window on WindowList 
	MainData.AddWindow(Win);
}

function WINDOW_ChangeFocus(WindowObj)
{
	var zIndex = WindowObj.getZIndex();
	var i;
	var WindowTmp;

	MainData.Windows.Focus.blur();

	MainData.ChangeWindowFocus(WindowObj);
	WindowObj.focus();

	for(i=0; i<MainData.Windows.WindowList.length; i++)
	{
		WindowTmp = MainData.Windows.WindowList[i];
		if(WindowTmp.getZIndex() > zIndex)
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	WindowObj.setZIndex(i-1);

}

function WINDOW_RemoveWindow(WindowObj)
{
	var i;
	var WindowTmp;

	MainData.RemoveWindow(WindowObj);

	//Reset zIndex of others windows
	for(i=0; i<MainData.Windows.WindowList.length; i++)
	{
		WindowTmp = MainData.Windows.WindowList[i]
		if(WindowTmp.getZIndex() > WindowObj.getZIndex())
		{
			WindowTmp.setZIndex(WindowTmp.getZIndex()-1);
		}
	}
	WindowObj.close();
}

function teste(str)
{
	var Div = UTILS_CreateElement("div",null,null,null);

	var p = UTILS_CreateElement("span",null,null,str);

	Div.appendChild(p);

	return Div;
}
