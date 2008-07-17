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
* Shows load screen to user
*/

function INTERFACE_StartLoad()
{
	var LoadDiv, LoadHeader, WaitLabel, LoadingLabel;
	var LoadList, Item, Img, i;

	// Creating elements
	LoadDiv = UTILS_CreateElement("div", "LoadDiv");
	LoadHeader = UTILS_CreateElement("h1", null, null, UTILS_GetText("general_name"));
	WaitLabel = UTILS_CreateElement("h3", null, null, UTILS_GetText("login_load_wait"));
	LoadingLabel = UTILS_CreateElement("p", "LoadingLabel", null);
	LoadList = UTILS_CreateElement("ul", "LoadList");

	// Creating balls
	for (i=1; i<=5; i++)
	{
		Item = UTILS_CreateElement("li", "LoadingBall"+i, "grey_ball");
		LoadList.appendChild(Item);
	}

	// Creating tree
	LoadDiv.appendChild(LoadHeader);
	LoadDiv.appendChild(WaitLabel);
	LoadDiv.appendChild(LoadingLabel);
	LoadDiv.appendChild(LoadList);

	document.body.appendChild(LoadDiv);
	
	// Setting first message in the loading box
	INTERFACE_SetLoadPhrase(UTILS_GetText("login_load_start"), 1);
}

/** 
* Remove load screen
*/ 
function INTERFACE_EndLoad()
{
	var Node = document.getElementById("LoadDiv");

	if (Node)
		Node.parentNode.removeChild(Node);
}

/**
* Show phrase in the load box and paint next ball
*/ 
function INTERFACE_SetLoadPhrase(Phrase, Num)
{
	var Node = document.getElementById('LoadingLabel');
	var Ball = document.getElementById('LoadingBall'+Num);

	// Setting phrease
	if (Node)
	{
		Node.innerHTML = Phrase;
		
		// Changing ball color
		if (Ball)
		{
			Ball.className = "green_ball";
		}
		return Phrase;
	}
	else
	{
		return null;
	}
}
