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
* @file		interface/top.js
* @brief	Contais all top menu functions to create and manage top elements
*/

/**
* @brief	Create element of top of the screen
* 
* @return	Top HTML DOM Div
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_CreateTop()
{
	var MainDiv, Logo, MenuDiv, MenuList, Item, ItemTitle;
	var Pos;
	var ExitText;
	var Admin, Room, Pref, Game, Help;

	MainDiv = UTILS_CreateElement("div", "Top");
	Logo = UTILS_CreateElement("h1", null, null, UTILS_GetText("general_name"));
	MenuDiv = UTILS_CreateElement("div", "TopMenu");
	MenuList = UTILS_CreateElement("ul", null, "menu");

	// Append icons to list
	// Admin tools
	// Create a invisible button, and show icon after get user's type;
	Admin = UTILS_CreateElement("li", "admin_icon", "null", null);

	// Rooms
	Room = UTILS_CreateElement("li", null, "rooms", UTILS_GetText("menu_rooms"));
	Room.onclick = function () {
		Pos = UTILS_GetOffset(this);
		ROOM_ShowRoomList(Pos.X);
	}

	// Search game
	ItemTitle = UTILS_GetText("menu_search_game")
	Game = UTILS_CreateElement("li", null, "search_game",ItemTitle);
	UTILS_AddListener(Game,"click",function() { OLDGAME_OpenOldGameWindow(); }, "false");

	// Preferences
	ItemTitle = UTILS_GetText("menu_preferences")
	Pref = UTILS_CreateElement("li", null, "preferences",ItemTitle);

	Pref.onclick = function () {
		WINDOW_Alert(UTILS_GetText("not_implemented_title"),UTILS_GetText("not_implemented"));
	}

	// Help
	ItemTitle = UTILS_GetText("menu_help")
	Help = UTILS_CreateElement("li", null, "help",ItemTitle);

	UTILS_AddListener(Help,"click",function() { WINDOW_Help(); }, "false");

	// Exit
	ItemTitle = UTILS_GetText("menu_exit");
	Exit = UTILS_CreateElement("li", "ExitButton", "exit");
	ExitText = UTILS_CreateElement("p","ExitText", null, ItemTitle);
	Exit.onclick = function () { 
		LOGIN_Logout();
	}
	Exit.appendChild(ExitText);

	MenuList.appendChild(Exit);
	MenuList.appendChild(Help);
	MenuList.appendChild(Pref);
	MenuList.appendChild(Game);
	MenuList.appendChild(Room);
	MenuList.appendChild(Admin);

	MenuDiv.appendChild(MenuList);
	MainDiv.appendChild(Logo);
	MainDiv.appendChild(MenuDiv);

	return MainDiv;
}

/**
* @brief	Show rooms list
*
* @param	OffsetLeft	Position off set left
* @return	True if created menu with success or null (if room list was opened)
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_ShowRoomMenu(OffsetLeft)
{
	var MenuDiv, RoomList, RoomItem, CreateP, Create;
	var Node, Menu, Func, i, Hide = 0;

	Node = document.getElementById("Page");
	Menu = document.getElementById("RoomMenuDiv");



	if (!Node || Menu)
	{
		return null;
	}

	Func = function () {
		Hide += 1;
		
		if (Hide == 2)
		{
			UTILS_RemoveListener(document, "click", Func, false);

			// Remove menu from screen
			INTERFACE_HideRoomList();
		}
	};

	// Creating elements
	MenuDiv = UTILS_CreateElement("div", "RoomMenuDiv");
	RoomList = UTILS_CreateElement("ul", "RoomMenuList");


	// Show the create room window
	CreateP = UTILS_CreateElement("p");
	Create = UTILS_CreateElement("span", "createRoom", null, UTILS_GetText("room_create_rooms"));
	Create.onclick = function () {
		WINDOW_CreateRoom();
	}
	
	// Show loading message
	MenuDiv.appendChild(INTERFACE_ShowLoadBox());

	MenuDiv.appendChild(RoomList);
	CreateP.appendChild(Create);
	MenuDiv.appendChild(CreateP);
	Node.appendChild(MenuDiv);

	MenuDiv.style.left = (OffsetLeft-1)+"px";

	UTILS_AddListener(document, "click", Func, false);

	return true;
}


/**
* @brief	Show rooms menu
*
* @param	OffsetLeft	Position off set left
* @return	True if created menu with success or null (if room list was opened)
* @see		room/room.js: ROOM_HandleGameRoomInfoList to load list itens
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function INTERFACE_ShowGameRoomMenu(OffsetLeft)
{
	var MenuDiv, RoomItem;
	var Node, Menu, Func, i, Hide = 0;

	Node = document.getElementById("Page");
	Menu = document.getElementById("GameRoomMenuDiv");

	if (!Node || Menu)
	{
		return null;
	}

	Func = function () {
		Hide += 1;
		
		if (Hide == 2)
		{
			UTILS_RemoveListener(document, "click", Func, false);

			// Remove menu from screen
			INTERFACE_HideGameRoomList();
		}
	};

	// Creating elements
	MenuDiv = UTILS_CreateElement("div", "GameRoomMenuDiv");

	// Show loading message
	MenuDiv.appendChild(INTERFACE_ShowLoadBox());

	MenuDiv.style.left = OffsetLeft+"px";

	Node.appendChild(MenuDiv);

	UTILS_AddListener(document, "click", Func, false);

	return true;
}

/*
* @brief	Create a loading box
*
* @return	Loading box HTML DOM Div
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowLoadBox()
{
	var Div = UTILS_CreateElement("div", "DivLoadBox");

	var Span = UTILS_CreateElement("span",null,null,UTILS_GetText("menu_loading"));

	Div.appendChild(Span);

	return Div;
}

/*
* @brief	Remove loading box
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_RemoveLoadBox()
{
	var Div = document.getElementById("DivLoadBox");

	if(Div != null)
	{
		Div.parentNode.removeChild(Div);
	}
}

/*
* @brief	Create a no current games box
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_NoGamesInGameList()
{
	var GameList = document.getElementById("GameRoomMenuDiv");
	var Div = UTILS_CreateElement("div", "DivNoGames");

	var Span = UTILS_CreateElement("span",null,null,UTILS_GetText("menu_no_games"));

	if(GameList != null)
	{
		Div.appendChild(Span);
		GameList.appendChild(Div);
	}
}

/*
* @brief	Show admin icon 
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowAdminIcon()
{
	var Item = document.getElementById("admin_icon");
	var ItemTitle;

	if(Item != null)
	{
		ItemTitle = UTILS_GetText("menu_adjourn")
		Item.innerHTML = ItemTitle;
		Item.className = "admin";
		UTILS_AddListener(Item,"click",function() { WINDOW_CreateAdminCenter(); }, "false");
	}
}

