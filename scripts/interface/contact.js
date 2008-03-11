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
* Control interface of contact list
*/


/**
* Add user in contact list
*
* @public
*/
function INTERFACE_AddContact(Username, Status)
{
	var Node = document.getElementById("ContactOnlineList");
	var Search = document.getElementById("contact-"+Username);
	var Contact, NextUser, Next;

	// If contact node in interface not founded
	if (!Node)
	{
		return false;
	}
	
	// If user already exists in interface
	if (Search != null)
	{
		INTERFACE_SetUserStatus(Username, Status);
		return true;
	}

	// Take next user position at userlist in struct
	NextUser = MainData.FindNextUser(Username, Status);

	// Create elements of contact
	Contact = INTERFACE_CreateContact(Username, Status)

	// if not exits other user after, insert at last position in online list
	if (NextUser == null)
	{
		Node.insertBefore(Contact, null);
	}
	// insert contact before the next user 
	else
	{
		Next = document.getElementById("contact-"+MainData.UserList[NextUser].Username).parentNode;
		Node.insertBefore(Contact, Next);
	}

	return true;
}

/**
* Remove user in contact list
*
* @public
*/
function INTERFACE_RemoveContact(Username)
{
	var Node = document.getElementById("contact-"+Username);

	if (!Node)
	{
		return false;
	}
	
	// Remove node
	Node = Node.parentNode;
	Node.parentNode.removeChild(Node);

	return true;
}

/**
* Set status of user in interface
*
* @public
*/
function INTERFACE_SetUserStatus(Username, NewStatus)
{
	var User = document.getElementById("contact-"+Username);
	var List;
	var NextUser, Next;

	NextUser = MainData.FindNextUser(Username, NewStatus);

	if (!User)
	{
		return false;
	}

	// User were offline
	if ((User.className.match(/offline/)) && (NewStatus != "offline"))
	{
		List = document.getElementById("ContactOnlineList");

		if (!List)
		{
			return false;
		}
		// Updating status
		User.className = User.className.replace(/_.*/, "_"+NewStatus);

		// Up to 'tr'
		User = User.parentNode;
		User.style.display = "block";

		if (NextUser == null)
		{
			List.insertBefore(User, null);
		}
		else
		{
			Next = document.getElementById("contact-"+MainData.UserList[NextUser].Username).parentNode;
			List.insertBefore(User, Next);
		}
	}
	// User disconnected
	else if ((!User.className.match(/offline/)) && (NewStatus == "offline"))
	{
		List = document.getElementById("ContactOfflineList");

		if (!List)
		{
			return false;
		}
		// Updating status
		User.className = User.className.replace(/_.*/, "_"+NewStatus);

		// Up to 'tr'
		User = User.parentNode;
		User.style.display = "block";

		if (NextUser == null)
		{
			List.insertBefore(User, null);
		}
		else
		{
			Next = document.getElementById("contact-"+MainData.UserList[NextUser].Username).parentNode;
			List.insertBefore(User, Next);
		}

	}
	// Only update status, dont change list
	else
	{
		// Updating status
		User.className = User.className.replace(/_.*/, "_"+NewStatus);
	}

	return true;
}

/**
* Set rating of user in interface
*
* @public
*/
function INTERFACE_SetUserRating(Username, Category, Rating)
{
	var User = document.getElementById("contact-"+Username+"-rating");
	var List, Node, i;

	// Updating user's type
	if (User)
	{
		User.innerHTML = Rating;
	}

	// Updating in room lists
	for (i=0; i<MainData.RoomList.length; i++)
	{
		if (MainData.FindUserInRoom(MainData.RoomList[i].Name, Username) != null)
		{
			// Search user node in room user list
			Node = document.getElementById(MainData.RoomList[i].Name+"_"+Username+"-rating");

			if (Node)
			{
				Node.innerHTML = Rating;
			}
		}
	}

	return true;
}

/**
* Change current rating type showed in interface
*
* @public
*/
function INTERFACE_ChangeCurrentRating(Type)
{
	var Node, NewRating;
	var i, j;

	// Changing ratings in contact list
	for (i=0; i<MainData.UserList.length; i++)
	{
		// Search for the node
		Node = document.getElementById("contact-"+MainData.UserList[i].Username+"-rating");

		if (!Node)
		{
			continue;
		}

		// Getting new rating from structure
		eval("NewRating = MainData.UserList[i].Rating."+UTILS_Capitalize(Type));

		// Updating rating
		if (NewRating)
		{
			Node.innerHTML = NewRating;
		}
		else
		{
			Node.innerHTML = "";
		}
	}

	// Changing ratings in rooms list
	for (i=0; i<MainData.RoomList.length; i++)
	{
		for (j=0; j<MainData.RoomList[i].UserList.length; j++)
		{
			// Search for the node
			Node = document.getElementById(MainData.RoomList[i].Name+"_"+MainData.RoomList[i].UserList[j].Username+"-rating");

			if (!Node)
			{
				continue;
			}

			// Getting new rating from structure
			eval("NewRating = MainData.RoomList[i].UserList[j].Rating."+UTILS_Capitalize(Type));

			// Updating rating
			if (NewRating)
			{
				Node.innerHTML = NewRating;
			}
			else
			{
				Node.innerHTML = "";
			}	
		}
	}

	// Update current rating in the sctructure
	MainData.CurrentRating = UTILS_Capitalize(Type);
}

/**
* Set type of user in interface
*
* @public
*/
function INTERFACE_SetUserType(Username, NewType)
{
	var User = document.getElementById("contact-"+Username);
	var List, Node, i;


	// Updating user's type
	if (User)
	{
		User.className = User.className.replace(/.*_/, NewType+"_");
	}

	// Updating in room lists
	for (i=0; i<MainData.RoomList.length; i++)
	{
		if (MainData.FindUserInRoom(MainData.RoomList[i].Name, Username) != null)
		{
			// Search user node in room user list
			Node = document.getElementById(MainData.RoomList[i].Name+"_"+Username);

			if (Node)
			{
				Node.className = Node.className.replace(/.*_/, NewType+"_");
			}
		}
	}

	return true;
}

/**
* Change user's status
*/


/**
* Create a contact node
*
* @private
* @return DOM object
*/
function INTERFACE_CreateContact(Username, Status, Rating, Type, RoomName)
{
	var Tr, Td1, Td2;

	Tr = UTILS_CreateElement("tr");

	// Default type
	if (Type == null)
	{
		Type = "user";
	}

	if (RoomName == null)
	{
		Td1 = UTILS_CreateElement("td", "contact-"+Username, Type+"_"+Status, Username);
		Td2 = UTILS_CreateElement("td", "contact-"+Username+"-rating", "rating", Rating);
	}
	else
	{
		Td1 = UTILS_CreateElement("td", RoomName+"_"+Username, Type+"_"+Status, Username);
		Td2 = UTILS_CreateElement("td", RoomName+"_"+Username+"-rating", "rating", Rating);
	}
	Td1.onclick = function () { CONTACT_ShowUserMenu(this, Username); };
	Tr.appendChild(Td1);
	Tr.appendChild(Td2);
	
	return Tr;
}


/**
* Show user menu
*
* @private
*/
function INTERFACE_ShowUserMenu(Obj, Options)
{
	var Menu, Option, ParentDiv, Pos, i;

	Menu = UTILS_CreateElement("div", "UserMenuDiv");

	// Creating options
	for (i=0; i < Options.length; i++)
	{
		// Create element
		Option = UTILS_CreateElement("p", null, null, Options[i].Name);

		// Setting function
		Option.onclick = Options[i].Func;

		Menu.appendChild(Option);
	}
	// Get parent scrolling
	ParentDiv = UTILS_GetParentDiv(Obj);
	Pos = UTILS_GetOffset(Obj);

	Menu.style.top = (Pos.Y+18-ParentDiv.scrollTop)+"px";
	Menu.style.left = Pos.X+"px";

	document.body.appendChild(Menu);
}


/**
* Hide user menu from screen
*
* @private
*/
function INTERFACE_HideUserMenu()
{
	var Menu = document.getElementById("UserMenuDiv");

	if (!Menu)
	{
		return false;
	}
	Menu.parentNode.removeChild(Menu);
	return true;
}


/**
* Show or hide contact groups
*
* @private
*/
function INTERFACE_ChangeGroupVisibility(Obj, Id)
{
	var Node = document.getElementById(Id);
	
	if (!Node)
	{
		return false;
	}
	// Changing node visibilty
	if (Node.style.display == "none")
	{
		// Display should be "list-item", "table" don't work in IE6
		Node.style.display = "list-item";
		Obj.innerHTML = Obj.innerHTML.replace("+", "-");
	}
	else
	{
		Node.style.display = "none";
		Obj.innerHTML = Obj.innerHTML.replace("-", "+");
	}
}


/**
* Create contact list
*
* @private
*/
function INTERFACE_CreateContactList()
{
	var ContactDiv, ContactsDiv, ContactTitle, ContactInside, ContactOnlineDiv, ContactOfflineDiv, ContactOnline, ContactOffline;
	var ContactsOnline, ContactsOffline;
	var OnlineTable, OnlineTbody;
	var OfflineTable, OfflineTbody;
	var OrderNick, OrderRating, OrderRatingOpt, Search, Hr, i;

	// Main div
	ContactDiv = UTILS_CreateElement("div", "Contact");
	ContactTitle = UTILS_CreateElement("h3", null, "title", UTILS_GetText("contact_contacts"));
	ContactInside = UTILS_CreateElement("div", "ContactInside");

	// Order buttons
	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("contact_order_nick"));
	OrderNick.onclick = function() { INTERFACE_SortUserByNick(); }; 

	OrderRating = UTILS_CreateElement("select", "order_rating", null, UTILS_GetText("contact_order_rating"));
	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Lightning)");
	OrderRatingOpt.value = "lightning";
	OrderRating.appendChild(OrderRatingOpt);
	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Blitz)");
	OrderRatingOpt.selected = true;
	OrderRatingOpt.value = "blitz";
	OrderRating.appendChild(OrderRatingOpt);
	OrderRatingOpt = UTILS_CreateElement("option", null, null, UTILS_GetText("contact_order_rating")+" (Standard)");
	OrderRatingOpt.value = "standard";
	OrderRating.appendChild(OrderRatingOpt);
	OrderRating.onchange = function () {
		INTERFACE_ChangeCurrentRating(this.value);
	}

	// Group labels
	ContactsDiv = UTILS_CreateElement("div", "Contacts");
	ContactOnlineDiv = UTILS_CreateElement("div", "ContactOnlineDiv");
	ContactOnline = UTILS_CreateElement("label", null, null, "- "+UTILS_GetText("contact_online"));
	ContactOnline.onclick = function () { INTERFACE_ChangeGroupVisibility(this, "ContactOnlineTable"); };
	ContactOfflineDiv = UTILS_CreateElement("div", "ContactOfflineDiv");
	ContactOffline = UTILS_CreateElement("label", null, null, "- "+UTILS_GetText("contact_offline"));
	ContactOffline.onclick = function () { INTERFACE_ChangeGroupVisibility(this, "ContactOfflineTable"); };

	// User tables
	OnlineTable = UTILS_CreateElement("table","ContactOnlineTable");
	// Display should be "list-item", "table" don't work in IE6
	OnlineTable.style.display = "list-item";
	OnlineTbody = UTILS_CreateElement("tbody", "ContactOnlineList");

	OfflineTable = UTILS_CreateElement("table","ContactOfflineTable");
	// Display should be "list-item", "table" don't work in IE6
	OfflineTable.style.display = "list-item";
	OfflineTbody = UTILS_CreateElement("tbody", "ContactOfflineList");

	// Loading user list
	for (i=0; i < MainData.UserList.length; i++)
	{
		if (MainData.UserList[i].Status != "offline")
		{
			ContactsOnline = INTERFACE_CreateContact(	MainData.UserList[i].Username, 
														MainData.UserList[i].Status,
														MainData.UserList[i].Rating.Blitz,
														MainData.UserList[i].Type
													);
	//		OnlineTbody.appendChild(ContactsOnline);
		}
		else
		{
			ContactsOffline = INTERFACE_CreateContact(	MainData.UserList[i].Username, 
														MainData.UserList[i].Status,
														MainData.UserList[i].Rating.Blitz,
														MainData.UserList[i].Type
													);
			OfflineTbody.appendChild(ContactsOffline);
		}
	}

	// Search user
	Search = UTILS_CreateElement("a", null, null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(Search, "click", function() { WINDOW_SearchUser(); }, "false");
	Hr = UTILS_CreateElement("hr");
	
	// Creating DOM tree
	OnlineTable.appendChild(OnlineTbody);
	OfflineTable.appendChild(OfflineTbody);

	ContactOnlineDiv.appendChild(ContactOnline);
	ContactOnlineDiv.appendChild(OnlineTable);
	ContactOfflineDiv.appendChild(ContactOffline);
	ContactOfflineDiv.appendChild(OfflineTable);
	
	ContactsDiv.appendChild(ContactOnlineDiv);
	ContactsDiv.appendChild(ContactOfflineDiv);
	
	ContactInside.appendChild(OrderNick);
	ContactInside.appendChild(OrderRating);
	ContactInside.appendChild(ContactsDiv);
	ContactInside.appendChild(Hr);
	ContactInside.appendChild(Search);

	ContactDiv.appendChild(ContactTitle);
	ContactDiv.appendChild(ContactInside);

	return ContactDiv;
}

/*****************************
*	FUNCTIONS - WINDOW
******************************/

/**
*	Create elements of search user window and returns div
*
* @param	User	User's nickname that sent the invitation
* @return	Div; Array
* @see		WINDOW_Invite();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowSearchUserWindow()
{
	// Variables
	var Div;

	var FormDiv, Username,Input, Br;

	var ButtonsDiv, Search, Cancel;

	var Buttons = new Array();

	// Main div
	Div = UTILS_CreateElement('div', 'SearchUserDiv');

	// FormDiv elements
	FormDiv = UTILS_CreateElement('div', 'FormDiv');

	Username = UTILS_CreateElement('span', null, 'option', UTILS_GetText("contact_user"));
	Br = UTILS_CreateElement('br');
	Input = UTILS_CreateElement('input', "SearchUserInput");
	Input.size = "23";

	// ButtonsDiv elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Search = UTILS_CreateElement('input',null,'button');
	Search.type = "button";
	Search.value = UTILS_GetText("contact_search");
	UTILS_AddListener(Search,"click",	function() { CONNECTION_SendJabber(MESSAGE_SearchUser(Input.value)); }, "false");
	Buttons.push(Search);

	Cancel = UTILS_CreateElement('input',null,'button');
	Cancel.type = "button";
	Cancel.value = UTILS_GetText("contact_cancel");
	Buttons.push(Cancel);

	// Mount elements tree
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Search);
	ButtonsDiv.appendChild(Cancel);
	
	// FormDiv elements
	FormDiv.appendChild(Username);
	FormDiv.appendChild(Br);
	FormDiv.appendChild(Input);

	// Main div elements
	Div.appendChild(FormDiv);
	Div.appendChild(ButtonsDiv);

	Input.focus();

	return {Div:Div, Buttons:Buttons};
}



/**
*	Create elements of an user 
*
* @param	Username	User that will be inserted
* @return	Tr
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_CreateUserElement(Username)
{
	var Tr, Td;

	Tr = UTILS_CreateElement("tr");

	Td = UTILS_CreateElement("td", null, null, Username);
	
	Td.onclick = function () { CONTACT_ShowUserMenu(this, Username); };
	Tr.appendChild(Td);

	return Tr;
}

/**
*	Create elements of search user result window and returns div
*
* @param	UserList	List of users founded
* @return	Div; Array
* @see		WINDOW_Invite();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowSearchUserResultWindow(UserList)
{
	// Variables
	var Div;
	var ListDiv, Label, Table, Tr, Item, Br;
	var ButtonsDiv, Button;
	var Buttons = new Array();
	var i;
	this.User;

	// Main Div
	Div = UTILS_CreateElement('div', 'SearchUserDiv');

	// Div of results
	ListDiv = UTILS_CreateElement('div', 'ListDiv');

	Table = UTILS_CreateElement('tbody');

	if (UserList == null)
	{
		Label = UTILS_CreateElement('span', null, 'no_found', UTILS_GetText("contact_no_user_found"));
	}
	else
	{
		Label = UTILS_CreateElement('span', null, null, UTILS_GetText("contact_user_found"));
		
		for (i=0; i< UserList.length; i++)
		{
			// Insert each item of the user founded list in interface
			Tr = INTERFACE_CreateUserElement(UserList[i]);
			Table.appendChild(Tr);
		}
	}

	Br = UTILS_CreateElement('br');

	// ButtonsDiv
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Button = UTILS_CreateElement('input',null,'button');
	Button.type = "button";
	Button.value = UTILS_GetText("contact_close");
	Buttons.push(Button);

	// Mount tree elements
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Button);
	
	// Main div and result div elements
	Div.appendChild(Label);
	Div.appendChild(Br);
	if (UserList != null)
	{
		ListDiv.appendChild(Table);
		Div.appendChild(ListDiv);
	}
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Sort users by nick into ascendent or descendent order
*
* @return	boolean
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_SortUserByNick()
{	
	var Tam = MainData.UserList.length;
	var ListOn, ListOff;
	var i, Item, Status;

	// TODO Expand to group
	ListOn = document.getElementById("ContactOnlineList");
	ListOff = document.getElementById("ContactOfflineList");

	// Test the current order mode
	// If ordered into ascending order, change to descending order
	if (MainData.OrderBy == "0")
	{
		MainData.OrderBy = "1";
	}
	// other modes, change to ascending order
	else
	{
		MainData.OrderBy = "0";
	}

	// Order userlist struct
	MainData.SortUserByNick();

	for(i=0; i<Tam; i++)
	{
		// Tr element 
		Item = document.getElementById("contact-"+MainData.UserList[i].Username).parentNode;
		// If user in interface
		if (Item != null)
		{
			// Take the user's status
			Status = MainData.UserList[i].Status;
			// Insert user in last position at online group
			if (Status != "offline")
			{
				ListOn.insertBefore(Item,null);
			}
			// Insert user in last position at offline group
			else
			{
				ListOff.insertBefore(Item,null);
			}
		}
	}
}
