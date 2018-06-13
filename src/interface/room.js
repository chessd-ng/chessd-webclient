import {
	WINDOW_CreateRoom,
	WINDOW_Alert,
	WINDOW_CancelRoom,
} from 'window/window.js';
import { MESSAGE_Presence } from 'xmpp_messages/message.js';
import {
	UTILS_CreateElement,
	UTILS_ReturnKeyCode,
	UTILS_GetText,
	UTILS_Capitalize,
	UTILS_ConvertChatString,
	UTILS_ShortString,
	UTILS_GetTime,
	UTILS_AddListener,
	UTILS_RemoveListener,
} from 'utils/utils.js';
import {
	ROOM_ErrorMessageLength,
	ROOM_SortUsersByNick,
	ROOM_SortUsersByRating,
	ROOM_SendMessage,
	ROOM_EnterRoom,
	ROOM_ExitRoom,
	ROOM_FocusRoom,
	ROOM_ShowHideUserList,
} from 'room/room.js';
import { UserListObj } from 'interface/user.js';
import { GAME_StartObserverGame, GAME_StartGame } from 'game/game.js';
import {
	INTERFACE_ShowFullName,
	INTERFACE_CloseFullName,
	INTERFACE_CreateLoadingBox,
} from 'interface/interface.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';

import { MainData } from 'main_data.js';

import ImageEmoticonDefault from 'images/emoticons/default.png';
import ImageRoomArrow from 'images/room_arrow.png';

import ImageCloseChat from 'images/close_chat.png';

import ImageEmoticon0 from 'images/emoticons/0.png';
import ImageEmoticon1 from 'images/emoticons/1.png';
import ImageEmoticon2 from 'images/emoticons/2.png';
import ImageEmoticon3 from 'images/emoticons/3.png';
import ImageEmoticon4 from 'images/emoticons/4.png';
import ImageEmoticon5 from 'images/emoticons/5.png';
import ImageEmoticon6 from 'images/emoticons/6.png';
import ImageEmoticon7 from 'images/emoticons/7.png';
import ImageEmoticon8 from 'images/emoticons/8.png';
import ImageEmoticon9 from 'images/emoticons/9.png';
import ImageEmoticon10 from 'images/emoticons/10.png';
import ImageEmoticon11 from 'images/emoticons/11.png';
import ImageEmoticon12 from 'images/emoticons/12.png';
import ImageEmoticon13 from 'images/emoticons/13.png';
import ImageEmoticon14 from 'images/emoticons/14.png';
import ImageEmoticon15 from 'images/emoticons/15.png';
import ImageEmoticon16 from 'images/emoticons/16.png';
import ImageEmoticon17 from 'images/emoticons/17.png';
import ImageEmoticon18 from 'images/emoticons/18.png';
import ImageEmoticon19 from 'images/emoticons/19.png';
import ImageEmoticon20 from 'images/emoticons/20.png';
import ImageEmoticon21 from 'images/emoticons/21.png';
import ImageEmoticon22 from 'images/emoticons/22.png';
import ImageEmoticon23 from 'images/emoticons/23.png';
import ImageEmoticon24 from 'images/emoticons/24.png';
import ImageEmoticon25 from 'images/emoticons/25.png';
import ImageEmoticon26 from 'images/emoticons/26.png';
import ImageEmoticon27 from 'images/emoticons/27.png';
import ImageEmoticon28 from 'images/emoticons/28.png';
import ImageEmoticon29 from 'images/emoticons/29.png';
import ImageEmoticon30 from 'images/emoticons/30.png';
import ImageEmoticon31 from 'images/emoticons/31.png';
import ImageEmoticon32 from 'images/emoticons/32.png';
import ImageEmoticon33 from 'images/emoticons/33.png';

var Emoticons = {
  '0': ImageEmoticon0,
  '1': ImageEmoticon1,
  '2': ImageEmoticon2,
  '3': ImageEmoticon3,
  '4': ImageEmoticon4,
  '5': ImageEmoticon5,
  '6': ImageEmoticon6,
  '7': ImageEmoticon7,
  '8': ImageEmoticon8,
  '9': ImageEmoticon0,
  '10': ImageEmoticon10,
  '11': ImageEmoticon11,
  '12': ImageEmoticon12,
  '13': ImageEmoticon13,
  '14': ImageEmoticon14,
  '15': ImageEmoticon15,
  '16': ImageEmoticon16,
  '17': ImageEmoticon17,
  '18': ImageEmoticon18,
  '19': ImageEmoticon10,
  '20': ImageEmoticon20,
  '21': ImageEmoticon21,
  '22': ImageEmoticon22,
  '23': ImageEmoticon23,
  '24': ImageEmoticon24,
  '25': ImageEmoticon25,
  '26': ImageEmoticon26,
  '27': ImageEmoticon27,
  '28': ImageEmoticon28,
  '29': ImageEmoticon20,
  '30': ImageEmoticon30,
  '31': ImageEmoticon31,
  '32': ImageEmoticon32,
  '33': ImageEmoticon33,
};

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
* @file		interface/room.js
* @brief	Control rooms interface elements 
*/



// FUNCTIONS - ROOM INTERFACE OBJECT
/*
* @class	RoomObj
* @brief	Create room object
*
* @param	Roomname	Room's name 
* @return       none
* @author       Rubens Suguimoto
*/

export function RoomObj(Roomname)
{
	var Room = INTERFACE_CreateRoom(Roomname);
	
	//Attributes
	this.roomName = Roomname;
	this.room = Room.RoomDiv;
	this.msgList = Room.MsgList;
	this.input = Room.Input;

	this.userListButton = Room.UserListButton;
	this.userListVisibility = false;

	this.userList = new UserListObj(Room.RoomDiv);
	this.userList.setSortUserFunction(ROOM_SortUsersByNick);
	this.userList.setSortRatingFunction(ROOM_SortUsersByRating);

	//Methods Public
	this.show = INTERFACE_ShowRoom;
	this.hide = INTERFACE_HideRoom;
	this.remove = INTERFACE_RemoveRoom;
	this.addMsg = INTERFACE_AddMsgInRoom;
	this.addMsgError = INTERFACE_AddMsgErrorInRoom;
	this.focus = INTERFACE_FocusRoomInput;
	this.showUserList = INTERFACE_ShowRoomUserList;
	this.hideUserList = INTERFACE_HideRoomUserList;

	this.hideUserList();
}


/**
* @brief	Create a room HTML DOM elements
* 
* @param	RoomName	Room's name
* @return 	Room main HTML DOM Div, Room messages HTML DOM List, Input text box and Show user HTML DOM span
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_CreateRoom(RoomName)
{
	var RoomDiv, RoomInside;
	var RoomUserDiv;
	var MessageList;
	var Input, Emoticon;
	var UserListVisibility;

	// General room
	RoomDiv = UTILS_CreateElement("div", "Room_"+RoomName, "Room");
	RoomDiv.style.display = "none";
	RoomInside = UTILS_CreateElement("div", "RoomInside_"+RoomName, "RoomInside");

	// Show/Hide user list
	RoomUserDiv = UTILS_CreateElement("div", "RoomUserDiv");
	UserListVisibility = UTILS_CreateElement("span",null,"UserListVisibility",UTILS_GetText("room_show_user_list"));
	UserListVisibility.onclick = function(){
		ROOM_ShowHideUserList(RoomName);
	}


	// MessageList
	MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
	Input = UTILS_CreateElement("input", "Input_"+RoomName);
	Input.type = "text";
	Input.onkeypress = function(event) {
		if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
		{
			if( Input.value.length <= MainData.GetMaxRoomChar())
			{
				// Send message to room
				ROOM_SendMessage(RoomName, Input.value);
				Input.value = "";
			}
			else
			{
				ROOM_ErrorMessageLength(RoomName);
			}
		}
	}

	// Emoticons
	Emoticon = UTILS_CreateElement("img", null, "emoticon");
  Emoticon.src = ImageEmoticonDefault;
	Emoticon.onclick = function () {
		INTERFACE_ShowEmoticonList(RoomName);
	}

	// MessageList
	MessageList = UTILS_CreateElement("ul", RoomName+"_Messages", "MessageList");
	Input = UTILS_CreateElement("input", "Input_"+RoomName);
	Input.type = "text";
	Input.onkeypress = function(event) {
		if ((UTILS_ReturnKeyCode(event) == 13) && (Input.value != ""))
		{
			if(Input.value.length < 2000)
			{
				// Send message to room
				ROOM_SendMessage(RoomName, Input.value);
				Input.value = "";
			}
			else
			{
				ROOM_ErrorMessageLength(RoomName);
			}
		}
	}

	RoomUserDiv.appendChild(UserListVisibility);

	RoomInside.appendChild(RoomUserDiv);
	RoomInside.appendChild(MessageList);
	RoomInside.appendChild(Input);
	RoomInside.appendChild(Emoticon);

	RoomDiv.appendChild(RoomInside);

	return {RoomDiv:RoomDiv, MsgList:MessageList, Input:Input, UserListButton:UserListVisibility};
}

/*
* @brief	Show room
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowRoom()
{
	var RoomMain;

	// The code above is used in specific case of this interface.
	// All rooms should be in "Rooms" div.
	RoomMain = document.getElementById("Rooms");
	if(this.room.parentNode != RoomMain)
	{
		RoomMain.appendChild(this.room);
	}
	
	this.room.style.display = "block";
}

/*
* @brief	Hide room
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideRoom()
{
	this.room.style.display = "none";
}

/*
* @brief	Remove interface room
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_RemoveRoom()
{
	var RoomParent = this.room.parentNode;
	RoomParent.removeChild(this.room);
}

/*
* @brief	Focus room input text
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_FocusRoomInput()
{
	this.input.focus();
}


/*
* @brief	Show room's user list
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowRoomUserList()
{
	this.userList.show();
	this.userListVisibility = true;

	this.userListButton.innerHTML = UTILS_GetText("room_hide_user_list");
	this.userListButton.className = "UserListVisibilityOn";
}

/*
* @brief	Hide room's user list
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideRoomUserList()
{
	this.userList.hide();
	this.userListVisibility = false;
	this.userListButton.innerHTML = UTILS_GetText("room_show_user_list");
	this.userListButton.className = "UserListVisibility";
}

/*
* @brief	Add message in room
* 
* @param	Username	User's name
* @param	Msg		Message text
* @param	TimeStamp	Time in timestamp format
* @return	True
* @author	Pedro Rocha and Rubens Suguimoto
*/
function INTERFACE_AddMsgInRoom(Username, Msg, Timestamp)
{
	var Item;
	var Message, Time, EmoticonNum;

	Msg =UTILS_ConvertChatString(Msg);

	// Show emoticons
	while (Msg.match(/\[img{\d*}\]/) != null)
	{
		EmoticonNum = Msg.match(/\[img{\d*}\]/)[0];
		EmoticonNum = EmoticonNum.match(/\d+/);
		
		Msg = Msg.replace(/\[img{\d*}\]/, "<img src='" + Emoticons[EmoticonNum] + "' />");
	}

	// Get time from a given timestamp
	Time = UTILS_GetTime(Timestamp);

	Message = "<strong>"+Time+" "+Username+"</strong>: "+Msg;
	Item = UTILS_CreateElement("li", null, null, Message);

	this.msgList.appendChild(Item);
	this.msgList.scrollTop += Item.clientHeight + 1000;

	return true;
}

/*
* @brief	Show error messagem in room
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddMsgErrorInRoom(Msg)
{
	var Item;

	Item = UTILS_CreateElement("li", null, "error", Msg);

	this.msgList.appendChild(Item);
	this.msgList.scrollTop += Item.clientHeight + 1000;
}

/*
* @brief	Refresh room's occupants and online users number
*
* @param	RoomName	Room's name
* @return	none
* @author	Danilo Yorinori
*/
export function INTERFACE_RefreshOccupantsNumber(RoomName)
{
	var N_Occupants;
	var Focused;
	var Node, Node2 = null;

	// If general room
	if (RoomName == "general")
	{
		// Get element in interface that will be refreshed
		Node = document.getElementById("general_occupants");
		Node2 = document.getElementById("OnlineNumber");
	}
	else {
		// else get name of focused room
		Focused = document.getElementById("Room_"+RoomName);

		// If change of occupant's number occured in focused room
		if ((Focused != null) && (Focused.style.display == 'block'))
		{
			// Get element in interface that will be refreshed
			Node = document.getElementById("Sec_occupants");
		}
		// else do nothing
		else
		{
			Node = null;
		}
	}

	// If Room is showed at interface, refresh the number of occupants
	if(Node)
	{
		var Room = MainData.GetRoom(RoomName);
		// Get number of occupants in room data struct
		N_Occupants = Room.UserList.length;
		Node.innerHTML= " ("+N_Occupants+")";
		if (Node2)
		{
			Node2.innerHTML= " ("+N_Occupants+")";
		}
	}
}

/////////////// * FUNCTIONS - ROOM TOP MENU LIST 

/**
* @brief	Show room's list in the room menu
*
* @param       Rooms	Array of room names
* @return       none
* @author       Pedro Rocha
*/
export function INTERFACE_ShowRoomList(Rooms)
{
        var Node = document.getElementById("RoomMenuList");
        var Room, i;

        // If menu is not on screen
        if (!Node)
        {
                return null;
        }
        // If rooms was already been inserted
        else if (Node.childNodes.length > 0)
        {
                return null;
        }

        // Create elements and insert rooms
        for (i=0; i < Rooms.length; i++)
        {
                Room = UTILS_CreateElement("li", Rooms[i].Id, null, Rooms[i].Name);
                Room.onclick = function () {
									ROOM_EnterRoom(this.id);
                }
                Node.appendChild(Room);
        }
        return true;
}
/**
* @brief	Hide room list menu
*
* @return       True or false (if element list node not founded)
* @author       Pedro Rocha
*/
export function INTERFACE_HideRoomList()
{
        var Node = document.getElementById("RoomMenuDiv");

        if (!Node)
        {
                return false;
        }
        Node.parentNode.removeChild(Node);

	return true;
}

//////////// * FUNCTIONS - ROOM GAME TOP MENU LIST 
/**
* @brief	Hide game room list menu
*
* @return       True or false (if element list node not founded)
* @author       Ulysses
*/
export function INTERFACE_HideGameRoomList()
{
	var Node = document.getElementById("GameRoomMenuDiv");

	if (!Node)
	{
		return false;
	}
	Node.parentNode.removeChild(Node);

	return true;
}

/**
* @brief	Add a game room list in the room menu
*
* @param 	GameId		Current game identification field
* @param	PW		White player object
* @param	PB		Black player object
* @param	GameType	Game category
* @return       True or false (if element list node not founded)
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
function INTERFACE_ShowGameRoomList(GameId, PW, PB, GameType)
{
//TODO -> CHANGE THIS FUNCTION'S NAME TO "AddGameRoomList"
	// Get game menu
	var Node = document.getElementById("GameRoomMenuDiv");
	var List;
	var Room, i;
	var MyUsername = MainData.GetUsername();

	if (Node == null)
	{
		return false;
	}
	else
	{
		// Get default list
		List = document.getElementById("GameRoomMenuList"+UTILS_Capitalize(GameType));
		// If list doesn't exists, create one
		if(List == null)
		{
			List = UTILS_CreateElement("ul","GameRoomMenuList"+UTILS_Capitalize(GameType),null, UTILS_Capitalize(GameType));
			Node.appendChild(List);
		}
	}

	// Create elements and insert rooms
	Room = UTILS_CreateElement("li", null, null, PW.Name+" x "+PB.Name);

	Room.onclick = function(){
		var Buffer="";
		var To;
		var CurrentGame = MainData.GetCurrentGame();

		//Check if user is not playing or observe a game
		if(CurrentGame == null)
		{
			if((PB.Name!= MyUsername) &&(PW.Name != MyUsername))
			{
				Buffer += GAME_StartObserverGame(GameId, PW, PB);				
			}
			else
			{
				//Open game board and enter game in room
				Buffer += GAME_StartGame(GameId, PW, PB);
				To = GameId+"@"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MyUsername;
				Buffer += MESSAGE_Presence(To)
			}
		}
		else
		{
			WINDOW_Alert(UTILS_GetText("game_observer_alert_title"), UTILS_GetText("game_observer_alert"));
		}
		CONNECTION_SendJabber(Buffer);
	}

	// Insert item in current game list
	List.appendChild(Room);

	return true;
}

/*********************************************
 * FUNCTIONS - ROOM LIST (Right of rooms div)
 *********************************************/
/** 
* Show or hide list of user's rooms 
* 
* @return	True if visibile or false otherwise
*/ 
function INTERFACE_ChangeRoomListVisibility() 
{ 
	var Div, List, Node, Item, i; 
	var Menu = document.getElementById('RoomListMenu'); 
	var Node = document.getElementById('RoomList'); 

	var RoomList = MainData.GetRoomList();
	var Room;

	// If already exists room list menu, hide it 
	if (Menu != null) 
	{ 
		Menu.parentNode.removeChild(Menu); 
		return false;
	} 
	//else show (create) menu 
	Div = UTILS_CreateElement("div", "RoomListMenu"); 
	List = UTILS_CreateElement('ul'); 

	Div.style.position = "absolute"; 
	 
	// Population list with user's rooms 
	for (i=0; i < RoomList.length; i++) 
	{ 
		Room = RoomList[i];

		Item = UTILS_CreateElement('li'); 
		if (Room.Name == MainData.GetRoomDefault())
		{
			Item.innerHTML = UTILS_GetText("room_default")+" ("+Room.UserList.length+")"; 
		}
		else
		{
			Item.innerHTML = Room.Name+" ("+Room.UserList.length+")"; 
		}
		Item.onclick = function () { 
			var RoomName;
			// Get name from innerHTML without number of users
			RoomName = this.innerHTML.split(" (")[0];
			if (RoomName == UTILS_GetText("room_default"))
			{
				ROOM_FocusRoom(MainData.GetRoomDefault());
			}
			else
			{
				ROOM_FocusRoom(RoomName); 
			}
			INTERFACE_ChangeRoomListVisibility(); 
		} 
		List.appendChild(Item); 
	} 

	Div.appendChild(List); 

	try 
	{ 
		document.getElementById('Rooms').insertBefore(Div, Node); 
	} 
	catch(e) 
	{ 
		return false; 
	} 
	return true; 
}




/**
* @brief	Remove a room from room list
*
* @param        Room	Room name
* @return       none
* @author       Rubens
*/
export function INTERFACE_RemoveRoomFromList(Room)
{
	var Menu = document.getElementById("RoomListMenu");
	var ListItens;
	var i=0;

	// if list is not opened, then do nothing;
	if(Menu == null)
	{
		return;
	}

	ListItens = Menu.getElementsByTagName("li");

	while( (ListItens[i].innerHTML != Room) && (i<ListItens.length) )
	{
		i++;
	}

	// If room founded in list, then remove it from;
	if(i != ListItens.length)
	{
		ListItens[i].parentNode.removeChild(ListItens[i]);
	}
}

////////////////// FUNCTIONS - EMOTICONS LIST
/**
* @brief	Show emoticon list
*
* @param	RName	Room's name
* @return	none
* @author	Pedro Rocha
*/
function INTERFACE_ShowEmoticonList(RName)
{
	var Div, List, Item, Img, i;
	var Func, Hide = 0;
	var RoomName = RName;
	var EmoticonNum = MainData.GetEmoticonNum();

	Func = function () {
		Hide += 1;

		if (Hide == 2)
		{
			UTILS_RemoveListener(document, "click", Func, false);
			INTERFACE_HideEmoticonList();
		}
	};

	Div = UTILS_CreateElement("div", "EmoticonDiv");
	List = UTILS_CreateElement("ul", "EmoticonList");

	for (i=0; i<EmoticonNum; i++)
	{
		Item = UTILS_CreateElement("li");
		Img = UTILS_CreateElement("img", null, i);
    Img.src = Emoticons[i.toString()];
		Img.onclick = function () {
			var Node = document.getElementById("Input_"+RoomName);
			var Num = i;

			if (!Node)
			{
				return null;
			}
			Node.value += "[img{"+this.className+"}] ";
			Node.focus();

			return true;
		}

		Item.appendChild(Img);
		List.appendChild(Item);
	}
	Div.appendChild(List);

	document.getElementById("RoomInside_"+RoomName).appendChild(Div);

	UTILS_AddListener(document, "click", Func, false);
}

/**
* @brief	Hide emoticon list
*
* @return	True or null (if emoticon div exists)
* @author	Pedro Rocha
*/
function INTERFACE_HideEmoticonList()
{
	var Node = document.getElementById("EmoticonDiv");

	if (!Node)
	{
		return null;
	}

	Node.parentNode.removeChild(Node);
	return true;
}



//// * FUNCTIONS - CHANGE ROOM BAR

/**
* @brief	Give focus to a room in change room bar
*
* @param	RoomName	Room's name
* @return	True or null (if room was not founded)
* @author	Pedro Rocha
*/
export function INTERFACE_FocusRoom(RoomName)
{
	var RoomList = document.getElementById("RoomList");
	var RoomItem, RoomClose, Current, NewRoom, Node, ShortName;

	if (RoomList == null)
	{
		return null;
	}

	// Focus to default room
	if (RoomName == MainData.GetRoomDefault())
	{
		RoomList.childNodes[0].className = "room_selec";

		// If exists other rooms, remove focus
		if (RoomList.childNodes.length > 2)
		{
			RoomList.childNodes[1].className = "";
		}
	}
	// Already have 2 opened rooms
	else if (RoomList.childNodes.length > 2)
	{
		Node = document.getElementById("RoomSecName");
		if (!Node)
		{
			return null;
		}

		Node.parentNode.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}

		if(RoomName.length > 4)
		{
			ShortName = UTILS_ShortString(RoomName, 4);
			Node.innerHTML = ShortName;
			Node.onmouseover = function() { INTERFACE_ShowFullName(this, RoomName); }
			Node.onmouseout = function() { INTERFACE_CloseFullName(); }
		}
		else
		{
			Node.innerHTML = RoomName;
		}
		RoomList.childNodes[1].className = "room_selec";
		RoomList.childNodes[0].className = "";
		RoomClose = document.getElementById("CloseRoom");
		RoomClose.onclick = function() { ROOM_ExitRoom(RoomName); };
	}

	return true;
}

/*
* @brief	Create room in room change bar
*
* @param	RoomName	Room's name
* @return	none
* @author	Rubens Suguimoto and Danilo Yorinori
*/
export function INTERFACE_CreateRoomInBar(RoomName)
{
	var RoomList = document.getElementById("RoomList");
	var RoomItem, RoomClose, ShortName;
	var RoomItemTitle, RoomOccupants;

	//Create Room Default (General room)
	if(RoomList.childNodes.length == 1)
	{
		if (UTILS_GetText("room_default") > 4)
		{
			RoomItemTitle = UTILS_CreateElement("span",null,null,UTILS_GetText("room_default"));
			RoomItemTitle.onmouseover = function() { INTERFACE_ShowFullName(this, UTILS_GetText("room_default")); }
			RoomItemTitle.onmouseout = function() { INTERFACE_CloseFullName(); }
		}
		else
		{
			RoomItemTitle = UTILS_CreateElement("span",null,null,UTILS_GetText("room_default"));
		}
		RoomItemTitle.style.fontWeight = "bold";
		RoomItem = UTILS_CreateElement("li","RoomPrimary");
		RoomItem.appendChild(RoomItemTitle);
		RoomOccupants = UTILS_CreateElement("span",MainData.GetRoomDefault()+"_occupants",null," (0)");
		RoomItem.appendChild(RoomOccupants);

		RoomItem.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}

		RoomList.insertBefore(RoomItem, RoomList.childNodes[0]);
	}
	// Create secondary room and others
	else if(RoomList.childNodes.length == 2)
	{
		// Create a item and set focus to it
		if(RoomName > 4)
		{
			ShortName = UTILS_ShortString(RoomName, 4);
			RoomItemTitle = UTILS_CreateElement("span","RoomSecName",null,ShortName);
			RoomItemTitle.onmouseover = function() { INTERFACE_ShowFullName(this, RoomName); }
			RoomItemTitle.onmouseout = function() { INTERFACE_CloseFullName(); }
		}
		else
		{
			RoomItemTitle = UTILS_CreateElement("span","RoomSecName",null,RoomName);
		}
		RoomItemTitle.style.fontWeight = "bold";
		RoomItem = UTILS_CreateElement("li", "RoomSecondary");
		RoomItem.appendChild(RoomItemTitle);
		RoomOccupants = UTILS_CreateElement('span',"Sec_occupants",null," (0)");
		RoomItem.appendChild(RoomOccupants);

		RoomItem.onclick = function () {
			ROOM_FocusRoom(RoomName);
		}

		RoomClose = UTILS_CreateElement("img", "CloseRoom", "close");
    RoomClose.src = ImageCloseChat;
		RoomClose.onclick = function() { ROOM_ExitRoom(RoomName); };
		RoomItem.appendChild(RoomClose);

		RoomList.insertBefore(RoomItem, RoomList.childNodes[1]);
	}
}

/**
* @brief	Close the room that are displayed as a secondary room 
*
* @param	RoomName	Room's name
* @return	Room's name
* @author	Pedro Rocha
*/
export function INTERFACE_CloseRoom(RoomName)
{
	var NodeParent, Node, Div;

	// Find element
	Node = document.getElementById("RoomSecondary");

	if (Node == null)
	{
		return null;
	}

	// Remove room's div
	Div = document.getElementById("Room_"+RoomName);
	Div.parentNode.removeChild(Div);

	// Remove from change room bar
	NodeParent = Node.parentNode;
	NodeParent.removeChild(Node);
	
	return RoomName;
}



//// * FUNCTIONS - START INTERFACE

/**
* @brief	Create rooms HTML DOM Div element
*
* @return	Rooms HTML DOM Div element
* @author	Pedro Rocha
*/
export function INTERFACE_CreateRooms()
{
	var RoomDiv, RoomsDiv, RoomsList, RoomsListGeneral, RoomsListArrow, Arrow;


	// Room list
	RoomsDiv = UTILS_CreateElement("div", "Rooms");
	RoomsList = UTILS_CreateElement("ul", "RoomList");
	RoomsListGeneral = UTILS_CreateElement("li", null, "room_selec", UTILS_GetText("room_default"));

	RoomsListArrow = UTILS_CreateElement("li", null, "room_arrow");
	RoomsListArrow.onclick = function () { INTERFACE_ChangeRoomListVisibility(); };
	Arrow = UTILS_CreateElement("img");
	Arrow.src = ImageRoomArrow;

	// Creating DOM tree
	RoomsListArrow.appendChild(Arrow);
	
	RoomsList.appendChild(RoomsListArrow);

	RoomsDiv.appendChild(INTERFACE_CreateLoadingBox("room_loading",UTILS_GetText("room_loading")));
	RoomsDiv.appendChild(RoomsList);

	return RoomsDiv;
}

/**********************************
 * FUNCTIONS - ROOMS WINDOWS
 ***********************************/


/**
* @brief	Create HTML DOM elements to create room window content
*
* @return	Return divs and array of buttons
* @see		WINDOW_CreateRoom();
* @author	Danilo Kiyoshi Simizu Yorinori
*/
export function INTERFACE_ShowCreateRoomWindow()
{
	var Div;

	var OptionsDiv;
	var Label, Input, Br;
	var Description, Textarea;

	var CounterDiv;
	var CounterInput, CounterLabel;

	var ButtonsDiv;
	var Create, Cancel;

	var RoomName;
	var Buttons = new Array();
	var MyUsername = MainData.GetUsername();

	// Main Div
	Div = UTILS_CreateElement('div', 'CreateRoomDiv');

	// Options Div
	OptionsDiv = UTILS_CreateElement('div', 'OptionsDiv');

	// Room Name Input
	Label = UTILS_CreateElement('p', null, null, UTILS_GetText('room_name'));
	Input = UTILS_CreateElement('input','CreateRoomInputName');
	Br = UTILS_CreateElement('br');

	CounterDiv = UTILS_CreateElement('div', 'CounterDiv');
	CounterInput = UTILS_CreateElement("input",null,"counter_input");
	CounterInput.type="text";
	CounterInput.value = 30;
	CounterInput.setAttribute("size",2);
	CounterInput.readOnly = true;
	CounterLabel = UTILS_CreateElement("span",null,null,UTILS_GetText("window_character"));
	CounterLabel.innerHTML = CounterLabel.innerHTML.replace(/%s/,"30");

	Input.type = "text";
	Input.setAttribute("size",22);
	Input.maxLength = 30;
	Input.onkeypress = function(event) {

		if (UTILS_ReturnKeyCode(event) == 13) // enter key pressed
		{
			if (Input.value == '' || Input.value == null)
			{
				return;
			}

			RoomName = Input.value.replace(/ /g,"_"); // replace ' ' with '_'

			if (RoomName == UTILS_GetText("room_default"))
			{
				WINDOW_Alert(UTILS_GetText('room_error'),UTILS_GetText('room_invalid_name'));
				CounterInput.value = 0;
				Input.value = "";
				return;
			}
			if (RoomName.length > 30)
			{
				WINDOW_Alert(UTILS_GetText('room_error'),UTILS_GetText('room_invalid_length'));
				CounterInput.value = 0;
				Input.value = "";
				return;
			}
			// message to create room
			else
			{
				CONNECTION_SendJabber(MESSAGE_Presence(RoomName+"@conference."+MainData.GetHost()+"/"+MyUsername));
			}
		}
	};

	Input.onkeyup = function() {
		CounterInput.value = 30 - Input.value.length;
		CounterLabel.innerHTML = UTILS_GetText("window_character");
		CounterLabel.innerHTML = CounterLabel.innerHTML.replace(/%s/,30 - Input.value.length);
		Input.value = Input.value.toLowerCase();
	}
	
	// TODO - not implemented
	// Room Description Input 
	Description = UTILS_CreateElement('p',null,null,UTILS_GetText('room_description'));
	Textarea = UTILS_CreateElement('textarea','CreateRoomTextarea');
	Textarea.rows = "3";
	Textarea.cols = "20";
	Textarea.disabled = true; // Disable textarea field - Option not implemented

	// Buttons Div
	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	// Create Button
	Create = UTILS_CreateElement('input',null,'button');
	Create.type = "button";
	Create.value = UTILS_GetText('room_create');

	Create.onclick = function() {
		if (Input.value == '' || Input.value == null)
		{
			return;
		}

		RoomName = Input.value.replace(/ /g,"_");
		if (RoomName == UTILS_GetText("room_default"))
		{
			WINDOW_Alert(UTILS_GetText('room_error'),UTILS_GetText('room_invalid_name'));
			Input.value = "";
			CounterInput.value = 0;
			return;
		}
		else if (RoomName.length > 30)
		{
			WINDOW_Alert(UTILS_GetText('room_error'),UTILS_GetText('room_invalid_length'));
			CounterInput.value = 0;
			Input.value = "";
			return;
		}
		// Send a message to create room
		else
		{
			CONNECTION_SendJabber(MESSAGE_Presence(RoomName+"@conference."+MainData.GetHost()+"/"+MyUsername));
		}
	};

	// Cancel Button
	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.type = "button";
	Cancel.value = UTILS_GetText('window_cancel');

	// Mount elements tree
	// Counter Div
//	CounterDiv.appendChild(CounterInput);
	CounterDiv.appendChild(CounterLabel);

	// Options Div
	OptionsDiv.appendChild(Label);
	OptionsDiv.appendChild(Input);
	OptionsDiv.appendChild(Br);
	OptionsDiv.appendChild(CounterDiv);
//	OptionsDiv.appendChild(Description);
//	OptionsDiv.appendChild(Textarea);

	// Buttons Div
	ButtonsDiv.appendChild(Create);
	ButtonsDiv.appendChild(Cancel);

	// Main Div
	Div.appendChild(OptionsDiv);
	Div.appendChild(ButtonsDiv);

	// Insert buttons in Buttons array
	Buttons.push(Create);
	Buttons.push(Cancel);
	Buttons.push(Input);

	return {Div:Div, Buttons:Buttons};
}

/**
* Create elements to cancel room creation window and return divs and array of buttons
*
* TODO -> ACTIVE THIS FUNCTION 
* @return     Div, Array 
* @see        WINDOW_CancelRoom();
* @author     Danilo Kiyoshi Simizu Yorinori
*/
export function INTERFACE_ShowCancelRoomWindow()
{
	var Div;

	var TextDiv;
	var Label;

	var ButtonsDiv;
	var Yes, No;

	var RoomName;
	var Buttons = new Array();

	// Main Div
	Div = UTILS_CreateElement('div', 'CancelRoomDiv');

	// Text Div
	TextDiv = UTILS_CreateElement('div', 'TextDiv');
	Label = UTILS_CreateElement('p', null, null, UTILS_GetText('room_cancel_text'));

	// Buttons Div
	ButtonsDiv = UTILS_CreateElement('div', 'ButtonsDiv');

	// Yes Button
	Yes = UTILS_CreateElement('input',null,'button');
	Yes.type = "button";
	Yes.value = UTILS_GetText('window_yes');

	// No Button
	No = UTILS_CreateElement('input',null,'button');
	No.type = "button";
	No.value = UTILS_GetText('window_no');

	// Mount elements tree
	// Text Div
	TextDiv.appendChild(Label);

	// Buttons Div
	ButtonsDiv.appendChild(Yes);
	ButtonsDiv.appendChild(No);

	// Main Div
	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	// Insert buttons in Buttons array
	Buttons.push(Yes);
	Buttons.push(No);

	return {Div:Div, Buttons:Buttons};
}

