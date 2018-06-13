import { CONNECTION_SendJabber } from 'connection/connection.js';
import {
	UTILS_GetText,
	UTILS_Capitalize,
	UTILS_CreateElement,
	UTILS_AddListener,
	UTILS_ShortString,
	UTILS_GetParentDiv,
	UTILS_GetOffset,
} from 'utils/utils.js';
import { CONTACT_HandleSearchUser } from 'contact/search.js';
import { CONTACT_ShowUserMenu } from 'contact/contact.js';
import { MESSAGE_SearchUser } from 'xmpp_messages/message.js';

import { MainData } from 'start.js';

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
* @file 	interface/user.js
* @brief	Class defition for user list object and some functions assign
*
* Create a user list object used in rooms, contact list and online list
*/

/**
* @class 	UserListObj
* @brief 	Create user list interface object
*
* This object contais pointer to HTML elements, some methods to add/remove/update user, show/hide list  and show/hide sort options
*
* @param 	Element		HTML DOM element 
* @see	 	INTERFACE_CreateUserList
* @author 	Rubens Suguimoto
*/
export function UserListObj(Element)
{
	// Create HTML elements to user list
	var UserList = INTERFACE_CreateUserList(Element);
	
	// Attributes
	this.mainDiv = UserList.MainDiv; // div with sorts and userlist
	this.userList = UserList.UserList; //user list tbody
	this.sortNick = UserList.SortNick; //span element
	this.sortRating = UserList.SortRating; // option element

	//User list with pointer to user list item tr element
	//used to control users in list on interface
	this.users = new Array();

	// Methods
	this.show = INTERFACE_ShowUserList; // show main div
	this.hide = INTERFACE_HideUserList; // hide main div

	this.addUser = INTERFACE_AddUser; // add a user in list
	this.removeUser = INTERFACE_RemoveUser; // remove user from list
	this.updateUser = INTERFACE_UpdateUser; // update user status/rating
	this.findUser = INTERFACE_FindUser; // find user in list

	this.hideSort = INTERFACE_HideSort; // hide sort elements
	this.showSort = INTERFACE_ShowSort; // show sort elements

	this.focusNick = INTERFACE_FocusNick; // focus span element
	this.blurNick = INTERFACE_BlurNick; // blur focus span element

	this.focusRating = INTERFACE_FocusRating; // focus rating option
	this.blurRating = INTERFACE_BlurRating; // blur rating option

	this.hideList = INTERFACE_HideList; // hide users list
	this.showList = INTERFACE_ShowList; // show users list

	// set sort list function when click in (sortNick) span element
	this.setSortUserFunction = INTERFACE_SetSortUserFunction;
	// set sort list function when click in (sortRating) option element
	this.setSortRatingFunction = INTERFACE_SetSortRatingFunction;
}


/**
* @brief	Show user list div
* 
* Show user list div changing element style display to block.
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowUserList()
{
	this.mainDiv.style.display = "block";
}

/**
* @brief	Hide user list div
* 
* Hide user list div changing element style display to none.
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideUserList()
{
	this.mainDiv.style.display = "none";
}


/**
* @brief	Add one user in list
* 
* Add a user in user list creating a tr element and insert it in (this.users) array.
*
* @param 	Username 	User's name 
* @param 	Status		User's status
* @param 	Rating		User's rating that will be show
* @param 	Type		User's type (teacher, admin, robot, etc.)
* @return	none
* @author	Rubens Suguimoto
* @see		INTERFACE_CreateUser
*/
function INTERFACE_AddUser(Username, Status, Rating, Type)
{
	var User;

	// User item that will be inserted in array (this.users)
	var UserObj = new Object();

	// Create tr element
	User = INTERFACE_CreateUser(Username, Status, Rating, Type)

	// Add user in users struct
	UserObj.Id = Username;
	UserObj.User = User;
	this.users.push(UserObj);

	//this.userList.insertBefore(User,null);
	this.userList.appendChild(User);
}

/**
* @brief	Remove user from list
* 
* Remove a user from user list and remove from array. 
*
* @param 	Username	User's name 
* 
* @author	Rubens Suguimoto
* @return	false - User is not founded in list, true otherwise
*/
function INTERFACE_RemoveUser(Username)
{
	var UserItem = this.findUser(Username);
	var i=0;


	// If user is not founded in user list, return false
	if(UserItem == null)
	{
		return false;
	}

	// remove from interface
	this.userList.removeChild(UserItem);


	// Find user in "users" list and remove from it
	while((Username != this.users[i].Id) && (i<this.users.length))
	{
		i++;
	}
	if(i< this.users.length)
	{
		//remove from array
		this.users.splice(i,1);
	}

	return true;
}

/**
* @brief	Update user status and rating in list
* 
* Update user status and rating in user list. Find the user and set his type status and, if exists rating, update rating;
*
* @param 	Username	User's name
* @param	NewStatus	New user's status
* @param	Rating		User's rating
* @param	NewType		New user's type
* 
* @author	Rubens Suguimoto
* @return	False if user was not founded in list, else True 
*/
function INTERFACE_UpdateUser(Username, NewStatus, Rating, NewType)
{
	var Node = this.findUser(Username);
	var User, UserRating;

	if(Node == null)
	{
		return false;
	}
	
	// Get user and status icon element
	User = Node.getElementsByTagName("td")[0];
	UserRating = Node.getElementsByTagName("td")[1];

	// If 'NewType' is not passed, set normal user status
	if (NewType == null)
	{
		User.className = User.className.replace(/_.*/, "_"+NewStatus);
	}
	else
	{
		User.className = NewType+"_"+NewStatus;
	}
	
	if(Rating != null)
	{
		UserRating.innerHTML = Rating;
	}
	
	return true;
}

/**
* @brief	Find user in user list
* 
* Search user in array (this.users);
*
* @param 	Username	User's name
* 
* @author	Rubens Suguimoto
* @return	null if user is not founded in list, else tr elemente if user item;
*/
function INTERFACE_FindUser(Username)
{
	var i=0;

	while((i<this.users.length) && (Username != this.users[i].Id))
	{
		i++;
	}

	if(i>= this.users.length)
	{
		return null;    
	}
	else
	{
		return this.users[i].User;
	}
}


/**
* @brief	Set sort list by nick function to list
* 
* Set sort by nick function when click in sort span
*
* @param 	Func 	Function that contais sort instructions
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_SetSortUserFunction(Func)
{
	UTILS_AddListener(this.sortNick , "click", Func, false);
}


/**
* @brief	Set sort list by rating function to list
* 
* Set sort by rating function when click in sort option
*
* @param 	Func 	Function that contais sort instructions
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_SetSortRatingFunction(Func)
{
	var TmpFunc = Func;

	// Get category to sort
	UTILS_AddListener(this.sortRating, "change", function(){ TmpFunc(this.value)}, false);
}

/**
* @brief	Hide sort options
* 
* Hide sort span and option
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideSort()
{
	this.sortNick.style.display = "none";
	this.sortRating.style.display = "none";
}

/**
* @brief	Show sort options
* 
* Show sort span and option
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowSort()
{
	this.sortNick.style.display = "block";
	this.sortRating.style.display = "block";
}

/**
* @brief	Hide user list element
* 
* Hide user list in interface
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideList()
{
	this.userList.parentNode.style.display = "none";
}

/**
* @brief	Show user list element
* 
* Show user list in interface
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowList()
{
	this.userList.parentNode.style.display = "block";
}

/**
* @brief	Focus sort nick button element
* 
* Show user list in interface
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_FocusNick()
{
	this.sortNick.className = "selected";
}

/**
* @brief	Blur sort nick button element
* 
* Show user list in interface
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_BlurNick()
{
	this.sortNick.className = "";
}

/**
* @brief	Focus sort rating button element
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_FocusRating()
{
	this.sortRating.className = "selected";
}

/**
* @brief	Blur sort rating button element
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_BlurRating()
{
	this.sortRating.className = "";
}


///////////////////// FUNCTION - CREATE HTML LIST
/**
* @brief	Create user list in interface
* 
* Create user list HTML, and return div, list parent, sort span, sort rating option;
*
* @param	Element 	Parent node of list main div
*
* @author	Rubens Suguimoto
* @return	Object that contains list main div, user list, sort span and sort rating option
*/
function INTERFACE_CreateUserList(Element)
{
	var MainDiv;
	var Users, Table, Tbody;
	var OrderNick, OrderRating, OrderRatingOpt;
	
	MainDiv = UTILS_CreateElement("div",null,"UserList");

	OrderNick = UTILS_CreateElement("span", "order_nick", "selected", UTILS_GetText("room_order_nick"));
	OrderRating = UTILS_CreateElement("select", "order_rating", "", UTILS_GetText("room_order_rating"));
	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Lightning)");
	OrderRatingOpt.value = "lightning";
	OrderRating.appendChild(OrderRatingOpt);
	OrderRatingOpt = UTILS_CreateElement("option", null,'selected', UTILS_GetText("contact_order_rating")+" (Blitz)");
	OrderRatingOpt.selected = true;
	OrderRatingOpt.value = "blitz";
	OrderRating.appendChild(OrderRatingOpt);
	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Standard)");
	OrderRatingOpt.value = "standard";
	OrderRating.appendChild(OrderRatingOpt);

	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Untimed)");
	OrderRatingOpt.value = "untimed";
	OrderRating.appendChild(OrderRatingOpt);


	OrderNick.onclick = function(){
		OrderNick.className = "selected";
		OrderRating.className = "";
	};

	OrderRating.onchange = function(){
		var Options;
		var i;
		var Select;
		
		OrderNick.className = "";
		OrderRating.className = "selected";
	
		Options = OrderRating.options;
		Select = OrderRating.selectedIndex;
		for(i=0; i< Options.length; i++)
		{
			if (i != Select)
			{
				Options[i].className = "not_selected";
			}
			else
			{
				Options[i].className = "selected";
			}
		}
	};

	// User list
	Users = UTILS_CreateElement("div",null,"UserTable");
	Table = UTILS_CreateElement("table");
	Tbody = UTILS_CreateElement("tbody");

	Table.appendChild(Tbody);
	Users.appendChild(Table);

	MainDiv.appendChild(OrderNick);
	MainDiv.appendChild(OrderRating);
	MainDiv.appendChild(Users);

	Element.insertBefore(MainDiv, Element.firstChild);

	return {MainDiv:MainDiv, UserList:Tbody, SortNick:OrderNick, SortRating:OrderRating};
}


/**
* @brief	Create a user item and return it
* 
* Create a user tr element, contais username, status/type and rating, and return this element.
*
* @param 	Username	The user's name
* @param	Status		The new user's status
* @param	Rating		The user's rating
* @param	Type		The new user's type
*
* @author	Rubens Suguimoto
*
* @return 	Tr HTML element with username, status/type and rating
*/
function INTERFACE_CreateUser(Username, Status, Rating, Type)
{
	var Tr, Td1, Td2;

	Tr = UTILS_CreateElement("tr",Username);

	// Default type
	if ((Type == null) || (Type== ""))
	{
		Type = "user";
	}

	// Create user and rating html elements
	if (Username.length > 10)
	{
		Td1 = UTILS_CreateElement("td", null, Type+"_"+Status, UTILS_ShortString(Username,8));
		Td1.onmouseover = function () { INTERFACE_ShowUserFullName(this, Username); }
		Td1.onmouseout = function () { INTERFACE_CloseUserFullName(); }
	}
	else
	{
		Td1 = UTILS_CreateElement("td", null, Type+"_"+Status, Username);
	}
	Td2 = UTILS_CreateElement("td", null, "rating", Rating);

	Tr.appendChild(Td1);
	Tr.appendChild(Td2);

	// Add onclick function to open user menu
	Tr.onclick = function () { CONTACT_ShowUserMenu(this, Username); };
	return Tr;
}


/**
* @brief	Show user menu when click over user list item
* 
* Create a menu and show options to challenge, view profile, add/remove contact, admin options, etc.
*
* @param 	Obj		User list item
* @param	Options		Array with user menu options;
*
* @return	none
* @author	Pedro Rocha
*/
export function INTERFACE_ShowUserMenu(Obj, Options)
{
	var Menu, Option, ParentNode, Pos, i;
	var Offset = 9;
	var Left = 0;

	Menu = UTILS_CreateElement("div", "UserMenuDiv");

	// Creating options
	for (i=0; i < Options.length; i++)
	{
		// Create element
		// If Option is match request
		if (Options[i].Name == UTILS_GetText("usermenu_match"))
		{
			// test if match request was set, if not, set class as disabled
			if (Options[i].Func == null)
				Option = UTILS_CreateElement("p", null, 'option_disabled', Options[i].Name);
			// else, add this option normally
			else
				Option = UTILS_CreateElement("p", null, null, Options[i].Name);
		}
		else
		{
			Option = UTILS_CreateElement("p", null, null, Options[i].Name);
		}

		// Setting function
		Option.onclick = Options[i].Func;

		Menu.appendChild(Option);
	}
	// Get parent scrolling
	ParentNode = UTILS_GetParentDiv(Obj);

	if (MainData.GetBrowser() == 0)
	{
		// This a quick fix to contact list open user menu correctly 
		// TODO fix this properly
		if (UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode).className.match("Group") != null)
		{
			ParentNode = UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode.parentNode);
		}
		else if (ParentNode.id.match("TableResultDiv") != null) 
		{
			Left = 9;
		}
		Offset = 0;
	}
	// This a quick fix to contact list open user menu correctly
	 // TODO fix this properly
	// Contact List
	else if (UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode).className.match("Group") != null)
	{
		ParentNode = UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode.parentNode);
		Offset = 2;
	}
	// Search User Result
	else if (ParentNode.id.match("TableResultDiv") != null) 
	{
		Offset= 3;
		Left = 9;
	}
	// Room and Online User List
	else if (ParentNode.className.match("UserTable") != null) 
	{
		if (MainData.GetBrowser() == 2)
		{
			Offset = 1; //
		}
	}

	// Get position of user list item
	Pos = UTILS_GetOffset(Obj);
	Menu.style.top = (Pos.Y+18-ParentNode.scrollTop-Offset)+"px";
	Menu.style.left = Pos.X+Left+"px";
	
	document.body.appendChild(Menu);
}


/**
* @brief	Hide user menu
* 
* Remove user menu from interface
*
* @return	none
* @author	Pedro Rocha
*/
export function INTERFACE_HideUserMenu()
{
	var Menu = document.getElementById("UserMenuDiv");

	if (Menu != null)
	{
		Menu.parentNode.removeChild(Menu);
	}
}


/*****************************
*	FUNCTIONS - WINDOW
******************************/

/**
* @brief	Create elements of an user 
*
* @param	Obj	User Object
* @return	Tr HTML element
* @author 	Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_CreateUserElement(Obj)
{
	var Tr, Td,i;

	Tr = UTILS_CreateElement("tr");

	if (Obj.Username.length > 14)
	{
		Td = UTILS_CreateElement("td", null, null, UTILS_ShortString(Obj.Username,14));
		Td.onmouseover = function () { INTERFACE_ShowUserFullName(this, Obj.Username); }
		Td.onmouseout = function () { INTERFACE_CloseUserFullName(); }
	}
	else
	{
		Td = UTILS_CreateElement("td", null, null, Obj.Username);
	}
	
	Td.onclick = function () { CONTACT_ShowUserMenu(this, Obj.Username); };
	Tr.appendChild(Td);
	
	if (Obj.Fullname.length > 14)
	{
		Td = UTILS_CreateElement("td", null, null, UTILS_ShortString(Obj.Fullname,14));
		Td.onmouseover = function () { INTERFACE_ShowUserFullName(this, Obj.Fullname); }
		Td.onmouseout = function () { INTERFACE_CloseUserFullName(); }
	}
	else
	{
		Td = UTILS_CreateElement("td", null, null, Obj.Fullname);
	}
	
	Td.onclick = function () { CONTACT_ShowUserMenu(this, Obj.Username); };
	Tr.appendChild(Td);

	Tr.onmouseover = function() { for (i=0; i<2; i++) this.childNodes[i].style.backgroundColor = "#DAF3F5"; }
	Tr.onmouseout = function() { for (i=0; i<2; i++) this.childNodes[i].style.backgroundColor = "#FFFFFF" }

	return Tr;
}

/**
* @brief	Create a hint showing complete name.
*
* Create a hint showing complete name of an user whose nick was shorted to fit in interface
*
* @param	Obj		HTML element Object
* @param	UserName	User's name string
* @author	Danilo Yorinori
*/
export function INTERFACE_ShowUserFullName(Obj,UserName)
{
	var Hint, Name, ParentNode, Pos, i;
	var Offset = 9;
	var Left = 0;

	Hint = UTILS_CreateElement("div", "UserFullNameDiv");

	Name = UTILS_CreateElement("p", null, null, UserName);

	Hint.appendChild(Name);
	
	// Get parent scrolling
	
	ParentNode = UTILS_GetParentDiv(Obj);
	
	if (MainData.GetBrowser() == 0)
	{
		// This a quick fix to contact list to open user menu correctly // TODO fix this properly
		if (UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode).className.match("Group") != null)
		{
			ParentNode = UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode.parentNode);
		}
		else if (ParentNode.id.match("TableResultDiv") != null) 
		{
			Left = 9;
		}
		Offset = 0;
	}
	// This a quick fix to contact list to open user menu correctly // TODO fix this properly
	// Contact List
	else if (UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode).className.match("Group") != null)
	{
		ParentNode = UTILS_GetParentDiv(ParentNode.parentNode.parentNode.parentNode.parentNode);
		Offset = 2; //ok
	}
	// Online and Room User List
	else if (ParentNode.className.match("UserTable") != null) 
	{
		if (MainData.GetBrowser() == 2)
		{
			Offset = 1; //
		}
		else
		{
			Offset = 9; // ok
		}
	}
	// Search User Result
	else if (ParentNode.id.match("TableResultDiv") != null) 
	{
		Offset= 3;
		Left = 9;
	}
	// User Nickname
	else if (ParentNode.id.match("UserInf") != null)
	{
		if (MainData.GetBrowser() == 2)
		{
			Offset = 3;
		}
		else
		{
			Offset = 6;
		}
	}


	// Get position of user list item
	Pos = UTILS_GetOffset(Obj);
	Hint.style.top = (Pos.Y+18-ParentNode.scrollTop-Offset)+"px";
	Hint.style.left = Pos.X+Left+"px";
	Hint.style.width = 20+UserName.length*5+'px';


	document.body.appendChild(Hint);
}

/*
* @brief	Remove hint opened by INTERFACE_ShowUserFullName function
*
* @return	none
* @author	Danilo Yorinori
*/
export function INTERFACE_CloseUserFullName()
{
	var Hint = document.getElementById("UserFullNameDiv");
	if (Hint)
	{
		document.body.removeChild(Hint);
	}
}

/*	
* @brief	Create elements of search user window
*
* @return	Search window content main div, array of buttons and object of elements
* @author Danilo Kiyoshi Simizu Yorinori
*/
export function INTERFACE_ShowSearchUserWindow()
{
	// Variables
	var Div;

	var FormDiv;

	var InputDiv;
	var UserLabel, Br1, Input;

	var TypeDiv;
	var SearchLabel, Br2, NickRadio, NickLabel, NameRadio, NameLabel;

	var Button1Div;
	var SearchButton;

	var ResultDiv;

	var InfoDiv;
	var InfoLabel;
	var TableDiv;
	var TableHeadDiv;
	var THead, Head;
	var OrderNick, OrderName;
	var Tr,Td;
	var TableResultDiv;
	var HrTop, HrBottom;
	var BorderDiv;
	var Table, TBody;
	
	var Button2Div;
	var CloseButton;

	var Buttons = new Array();
	var Elements = new Object();

	// Main div
	Div = UTILS_CreateElement('div', 'SearchUserDiv');

	// FormDiv elements
	FormDiv = UTILS_CreateElement('div', 'FormDiv');

	// InputDiv Elements
	InputDiv = UTILS_CreateElement('div', 'InputDiv');

	UserLabel = UTILS_CreateElement('span', null, 'header', UTILS_GetText("contact_user_t"));
	Br1 = UTILS_CreateElement('br');
	Input = UTILS_CreateElement('input', 'SearchUserInput');
	Input.size = "16";

	// TypeDiv Elements
	TypeDiv = UTILS_CreateElement('div','TypeDiv');

	SearchLabel = UTILS_CreateElement('span',null,null,UTILS_GetText("contact_search_by"));
	Br2 = UTILS_CreateElement('br');
	
	try
	//Fix radio button for IE
	{
		NameRadio = document.createElement('<input class="radio" type="radio" name="search_user" />');
	}
	catch(err) 
	{
		NameRadio = UTILS_CreateElement('input',null,'radio');
		NameRadio.type = "radio";
		NameRadio.name = "search_user";
	}
	NameLabel= UTILS_CreateElement('span',null,'label',UTILS_Capitalize(UTILS_GetText("contact_by_name")));

	try
	//Fix radio button for IE
	{
		NickRadio = document.createElement('<input class="radio" type="radio" name="search_user" checked="checked" />');
	}
	catch(err) 
	{
		NickRadio = UTILS_CreateElement('input',null,'radio');
		NickRadio.type = "radio";
		NickRadio.name = "search_user";
		NickRadio.checked = true;
	}
	NickLabel= UTILS_CreateElement('span',null,'label',UTILS_Capitalize(UTILS_GetText("contact_by_nick")));

	/* Both Search
	Both= UTILS_CreateElement('input');
	Both.type = "radio";
	Both.name = "search_user";
	BothLabel = UTILS_CreateElement('span',null,'label',UTILS_GetText("contact_both"));
*/

	// Buttons1Div elements
	Button1Div = UTILS_CreateElement('div','Button1Div');

	SearchButton = UTILS_CreateElement('input',null,'button');
	SearchButton.type = "button";
	SearchButton.value = UTILS_GetText("window_search");
	UTILS_AddListener(SearchButton,"click",	function() { 
		var Option;
		if (NickRadio.checked == true)
		{
			Option = 0;
		}
		else if (NameRadio.checked == true)
		{
			Option = 1;
		}
		else
		{
			Option = 0;
		}
		CONNECTION_SendJabber(MESSAGE_SearchUser(Input.value,Option)); }, "false");
	Buttons.push(SearchButton);

	// ResultDiv elements
	ResultDiv = UTILS_CreateElement('div','ResultDiv');

	// InfoDiv elements
	InfoDiv = UTILS_CreateElement('div','InfoDiv');
	InfoLabel = UTILS_CreateElement('span',null,null,UTILS_GetText("contact_search_default"));
//	InfoLabel = UTILS_CreateElement('span',null,null,"contact_search_default");

	// TableDiv elements
	TableDiv = UTILS_CreateElement('div','TableDiv');

	// TableHeadDiv elements	
	TableHeadDiv = UTILS_CreateElement('div','TableHeadDiv');

	THead = UTILS_CreateElement('table');
	Head = UTILS_CreateElement('thead');	
	Tr = UTILS_CreateElement('tr');

	Td = UTILS_CreateElement('td');
	OrderNick = UTILS_CreateElement('span',null,'disabled',UTILS_Capitalize(UTILS_GetText("contact_by_nick")));
	OrderNick.disabled = true;
	Td.appendChild(OrderNick);
	Tr.appendChild(Td);
	
	Td = UTILS_CreateElement('td');
	OrderName = UTILS_CreateElement('span',null,'disabled',UTILS_Capitalize(UTILS_GetText("contact_by_name")));
	OrderName.disabled = true;
	Td.appendChild(OrderName);
	Tr.appendChild(Td);
	Head.appendChild(Tr);
	THead.appendChild(Head);

	// BorderDiv elements
	BorderDiv = UTILS_CreateElement('div','BorderDiv');
	HrTop = UTILS_CreateElement('hr','TopBorder');
	TableResultDiv = UTILS_CreateElement('div','TableResultDiv');
	HrBottom = UTILS_CreateElement('hr','BottomBorder');

	// TableResultDiv elements
	Table = UTILS_CreateElement('table');
	TBody = UTILS_CreateElement('tbody');
	Table.appendChild(TBody);

	// Button2Div elements
	Button2Div = UTILS_CreateElement('div','Button2Div');
	CloseButton = UTILS_CreateElement('input',null,'button');
	CloseButton.type = "button";
	CloseButton.value = UTILS_GetText("window_close");

	// Mount elements tree
	// ButtonsDiv elements
	Button1Div.appendChild(SearchButton);
	Button2Div.appendChild(CloseButton);
	Buttons.push(CloseButton);

	// OptionDiv
	TypeDiv.appendChild(SearchLabel);
	TypeDiv.appendChild(Br2);
	TypeDiv.appendChild(NickRadio)
	TypeDiv.appendChild(NickLabel);
	TypeDiv.appendChild(NameRadio)
	TypeDiv.appendChild(NameLabel);

//	OptionDiv.appendChild(Both);
//	OptionDiv.appendChild(BothLabel);
	
	// InputDiv elements
	InputDiv.appendChild(UserLabel);
	InputDiv.appendChild(Br1);
	InputDiv.appendChild(Input);

	// FormDiv elements
	FormDiv.appendChild(InputDiv);
	FormDiv.appendChild(TypeDiv);

	// TableHeadDiv elements
	TableHeadDiv.appendChild(THead);

	// TableResultDiv elements
	TableResultDiv.appendChild(Table);

	// BorderDiv elements
//	BorderDiv.appendChild(HrTop);
	BorderDiv.appendChild(TableResultDiv);
//	BorderDiv.appendChild(HrBottom);

	// TableDiv elements
	TableDiv.appendChild(TableHeadDiv);
	TableDiv.appendChild(BorderDiv);

	//InfoDiv elements
	InfoDiv.appendChild(InfoLabel);

	//ResultDiv elements
	ResultDiv.appendChild(InfoDiv);
	ResultDiv.appendChild(TableDiv);

	// Main div elements
	Div.appendChild(FormDiv);
	Div.appendChild(Button1Div);
	Div.appendChild(ResultDiv);
	Div.appendChild(Button2Div);

	Elements.Input = Input;
	Elements.NickRadio = NickRadio;
	Elements.NameRadio = NameRadio;
	Elements.InfoLabel = InfoLabel;
	Elements.OrderNick = OrderNick;
	Elements.OrderName = OrderName;
	Elements.TBody = TBody;
	Elements.OrderBy = "0";

	Elements.SetResult = INTERFACE_SearchUserSetResult;
	Elements.SortByNick = INTERFACE_SortSearchUserByNick;
	Elements.SortByName = INTERFACE_SortSearchUserByName;

	return {Div:Div, Buttons:Buttons, Elements:Elements};
}

/*
* @brief	Set result of a user search in window
*
* @param	Result		Array of user's name
* @return	none
* @author	Danilo Yorinori
* @see		CONTACT_HandleSearchUser;
*/
function INTERFACE_SearchUserSetResult(Result)
{
	var Tr, i;
	var Obj = this;

	// Save Result array in Search User Object
	this.Result = Result;

	// Remove previous items
	while(this.TBody.rows.length >0)
	{
		this.TBody.removeChild(this.TBody.rows[0]);
	}

	// If list of names is empty
	if (Result == null)
	{
		// Set apropriate text info
		this.InfoLabel.innerHTML = UTILS_GetText("contact_not_found");
		if (this.NickRadio.checked == true)
		{
			this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%t/,UTILS_GetText("contact_by_nick"));
		}
		else if (this.NameRadio.checked == true)
		{
			this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%t/,UTILS_GetText("contact_by_name"));
		}

		this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%s/," <b>"+this.Input.value+"*</b>");

		// Set class for sort buttons
		this.OrderNick.className = 'disabled';
		this.OrderName.className = 'disabled';
		this.OrderNick.disabled = true;
		this.OrderName.disabled = true;
		
		// Disable Order nick and Order name buttons 
		this.OrderNick.onclick = function()
		{
			return false;
		}

		this.OrderName.onclick = function()
		{
			return false;
		}
	}
	else 
	{
		// Set apropriate text info
		this.InfoLabel.innerHTML = UTILS_GetText("contact_user_found");
		if (this.NickRadio.checked == true)
		{
			this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%t/,UTILS_GetText("contact_by_nick"));
		}
		else if (this.NameRadio.checked == true)
		{
			this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%t/,UTILS_GetText("contact_by_name"));
		}
		
		this.InfoLabel.innerHTML = this.InfoLabel.innerHTML.replace(/%s/," <b>"+this.Input.value+"*</b>");

		// Set default sort order
		this.OrderBy = "0";

		// Call function that sort Result list
		MainData.SortSearchUserByNick();

		for(i=0; i< this.Result.length; i++)
		{
			// Insert each item of the user founded list in interface
			Tr = INTERFACE_CreateUserElement(this.Result[i]);
			this.TBody.appendChild(Tr);
		}
		
		// Set class for sort buttons
		this.OrderNick.className = 'selected';
		this.OrderNick.disabled = false;
		this.OrderName.className = 'unselected';
		this.OrderName.disabled = false;

		// Set functions for sort buttons
		this.OrderNick.onclick = function()
		{
			Obj.SortByNick();
		}

		this.OrderName.onclick = function()
		{
			Obj.SortByName();
		}
	}
}

/**
* @brief	Change sort order and display result list order by nick
*
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_SortSearchUserByNick() {
	var Tr, i;

	// Change sort order
	if (this.OrderBy == "0")
	{
		this.OrderBy = "1";
	}
	else
	{
		this.OrderBy = "0";
	}

	MainData.SortSearchUserByNick();

	this.OrderNick.className = 'selected';
	this.OrderName.className = 'unselected';
	
	// Remove previous items
	while(this.TBody.rows.length >0)
	{
		this.TBody.removeChild(this.TBody.rows[0]);
	}

	for(i=0; i< this.Result.length; i++)
	{
		// Insert each item of the user founded list in interface
		Tr = INTERFACE_CreateUserElement(this.Result[i]);
		this.TBody.appendChild(Tr);
	}
}

/**
* @brief	Change sort order and display result list order by name
*
* @return	none
* @author Danilo Yorinori
*/
function INTERFACE_SortSearchUserByName() {
	var Tr, i;

	// Change sort order
	if (this.OrderBy == "2")
	{
		this.OrderBy = "3";
	}
	else
	{
		this.OrderBy = "2";
	}

	MainData.SortSearchUserByName();

	this.OrderName.className = 'selected';
	this.OrderNick.className = 'unselected';
	
	// Remove previous items
	while(this.TBody.rows.length >0)
	{
		this.TBody.removeChild(this.TBody.rows[0]);
	}

	for(i=0; i< this.Result.length; i++)
	{
		// Insert each item of the user founded list in interface
		Tr = INTERFACE_CreateUserElement(this.Result[i]);
		this.TBody.appendChild(Tr);
	}
}
