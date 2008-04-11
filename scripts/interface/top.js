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
* Create element of top of the screen
*/

function INTERFACE_CreateTop()
{
	var MainDiv, Logo, MenuDiv, IconsList, MenuList, Item, ItemTitle;
	var Pos;

	MainDiv = UTILS_CreateElement("div", "Top");
	Logo = UTILS_CreateElement("h1", null, null, UTILS_GetText("general_name"));
	MenuDiv = UTILS_CreateElement("div", "TopMenu");
	IconsList = UTILS_CreateElement("ul", null, "icons");
	MenuList = UTILS_CreateElement("ul", null, "menu");

	// Append icons to list
	// Search game
	ItemTitle = UTILS_GetText("menu_search_game")
	Item = UTILS_CreateElement("li", null, "search_game", ItemTitle);
	Item.title = ItemTitle;
	UTILS_AddListener(Item,"click",function() { WINDOW_OldGameSearch(); }, "false");
	IconsList.appendChild(Item);
	
	// Search user
	ItemTitle = UTILS_GetText("menu_search_user")
	Item = UTILS_CreateElement("li", null, "search_user", ItemTitle);
	Item.title = ItemTitle;
	UTILS_AddListener(Item,"click",function() { WINDOW_SearchUser(); }, "false");
	IconsList.appendChild(Item);

	// News
	ItemTitle = UTILS_GetText("menu_news")
	Item = UTILS_CreateElement("li", null, "news", ItemTitle);
	Item.title = ItemTitle;
	IconsList.appendChild(Item);

	// Preferences
	ItemTitle = UTILS_GetText("menu_preferences")
	Item = UTILS_CreateElement("li", null, "preferences", ItemTitle);
	Item.title = ItemTitle;
	IconsList.appendChild(Item);

	// Help
	ItemTitle = UTILS_GetText("menu_help")
	Item = UTILS_CreateElement("li", null, "help", ItemTitle);
	Item.title = ItemTitle;
	IconsList.appendChild(Item);

	// Exit
	ItemTitle = UTILS_GetText("menu_exit");
	Item = UTILS_CreateElement("li", null, "exit", ItemTitle);
	Item.onclick = function () { 
		LOGIN_Logout();
	}
	Item.title = ItemTitle;
	IconsList.appendChild(Item);

	// Appending itens to menu
	// Current games
	Item = UTILS_CreateElement("li", null, "currentGames", UTILS_GetText("menu_current_games"));
	Item.onclick = function () {
		Pos = UTILS_GetOffset(this);
		ROOM_ShowGameRoomList(Pos.X);
	}
	MenuList.appendChild(Item);
	
	// Challenges
	Item = UTILS_CreateElement("li", null, null, UTILS_GetText("menu_challenges"));
	MenuList.appendChild(Item);
		Item.onclick = function () {
		Pos = UTILS_GetOffset(this);
		INTERFACE_ShowChallengeMenu(Pos.X);
	}

	MenuList.appendChild(Item);
	// Tourneys
	Item = UTILS_CreateElement("li", null, null, UTILS_GetText("menu_tourneys"));
	MenuList.appendChild(Item);
	
	// Rooms
	Item = UTILS_CreateElement("li", null, null, UTILS_GetText("menu_rooms"));
	Item.onclick = function () {
		Pos = UTILS_GetOffset(this);
		ROOM_ShowRoomList(Pos.X);
	}
	MenuList.appendChild(Item);
	
	MenuDiv.appendChild(IconsList);
	MenuDiv.appendChild(MenuList);
	MainDiv.appendChild(Logo);
	MainDiv.appendChild(MenuDiv);

	return MainDiv;
}

/**
* Show rooms menu
*/
function INTERFACE_ShowRoomMenu(OffsetLeft)
{
	var MenuDiv, RoomList, RoomItem, Create;
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
	Create = UTILS_CreateElement("p", null, null, UTILS_GetText("room_create_room"));
	Create.onclick = function () {
		WINDOW_CreateRoom();
	}
	
	MenuDiv.appendChild(Create);
	MenuDiv.appendChild(RoomList);
	Node.appendChild(MenuDiv);

	MenuDiv.style.left = (OffsetLeft-72+46)+"px";

	UTILS_AddListener(document, "click", Func, false);

	return true;
}


/**
* Show rooms menu
*
* @return 	bool
* @author 	Ulysses
*/
function INTERFACE_ShowGameRoomMenu(OffsetLeft)
{
	var MenuDiv, GameRoomList, RoomItem;
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
	GameRoomList = UTILS_CreateElement("ul", "GameRoomMenuList");

	MenuDiv.style.left = OffsetLeft+"px";

	MenuDiv.appendChild(GameRoomList);
	Node.appendChild(MenuDiv);

	UTILS_AddListener(document, "click", Func, false);

	return true;
}

/**
* Show challange menu
*
* @return 	bool
* @author 	Ulysses
*/
function INTERFACE_ShowChallengeMenu(OffsetLeft)
{
	var Challenge, MenuDiv, ChallengeList, RoomItem;
	var Node, Menu, Func, i, Hide = 0;

	Node = document.getElementById("Page");
	Menu = document.getElementById("ChallengeMenuDiv");

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
			INTERFACE_HideChallengeList();
		}
	};

	// Creating elements
	MenuDiv = UTILS_CreateElement("div", "ChallengeMenuDiv");
	ChallengeList = UTILS_CreateElement("ul", "ChallengeMenuList");

	// Create elements and insert challenges
	for (i=0; i < MainData.ChallengeList.length; i++)
	{
		Challenge = UTILS_CreateElement("li", null, null, "<img src='images/cancel.png' onclick='GAME_DeclineChallenge("+MainData.ChallengeList[i].Id+")' /> "+MainData.ChallengeList[i].Username); 
		ChallengeList.appendChild(Challenge);
	}

	MenuDiv.style.left = (OffsetLeft-1)+"px";

	MenuDiv.appendChild(ChallengeList);
	Node.appendChild(MenuDiv);

	UTILS_AddListener(document, "click", Func, false);

	return true;
}
