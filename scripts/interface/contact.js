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
function INTERFACE_AddContact(Username, Status, Rating, Type)
{
	var Node = document.getElementById("ContactOnlineList");
	var Search = document.getElementById("contact-"+Username);
	var Contact;

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


	Contact = INTERFACE_CreateContact(Username, Status, Rating, Type)
	Node.appendChild(Contact);

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

		// Remove from offline list
		User.parentNode.removeChild(User);

		// Add inonline list
		List.appendChild(User);
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

		// Remove from offline list
		User.parentNode.removeChild(User);

		// Add inonline list
		List.appendChild(User);

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
* Set type of user in interface
*
* @public
*/
function INTERFACE_SetUserType(Username, NewType)
{
	var User = document.getElementById("contact-"+Username);
	var List;


	if (!User)
	{
		return false;
	}

	// Updating user's type
	User.className = User.className.replace(/.*_/, NewType+"_");

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
	}
	else
	{
		Td1 = UTILS_CreateElement("td", RoomName+"_"+Username, Type+"_"+Status, Username);
	}
	Td1.onclick = function () { CONTACT_ShowUserMenu(this, Username); };
	Td2 = UTILS_CreateElement("td", null, "rating", Rating);
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
	var Menu, Option, Pos, i;

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
	Pos = UTILS_GetOffset(Obj);

	Menu.style.top = (Pos.Y+18)+"px";
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
	var ContactDiv, ContactsDiv, ContactTitle, ContactInside, ContactOnline, ContactOffline;
	var ContactsOnline, ContactsOffline;
	var OnlineTable, OnlineTbody;
	var OfflineTable, OfflineTbody;
	var OrderNick, OrderRating, Search, Hr, i;

	// Main div
	ContactDiv = UTILS_CreateElement("div", "Contact");
	ContactTitle = UTILS_CreateElement("h3", null, "title", UTILS_GetText("contact_contacts"));
	ContactInside = UTILS_CreateElement("div", "ContactInside");

	// Order buttons
	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("contact_order_nick"));
	OrderRating = UTILS_CreateElement("span", "order_rating", null, UTILS_GetText("contact_order_rating"));

	// Group labels
	ContactsDiv = UTILS_CreateElement("div", "Contacts");
	ContactOnline = UTILS_CreateElement("label", null, null, "- "+UTILS_GetText("contact_online"));
	ContactOnline.onclick = function () { INTERFACE_ChangeGroupVisibility(this, "ContactOnlineList"); };
	ContactOffline = UTILS_CreateElement("label", null, null, "- "+UTILS_GetText("contact_offline"));
	ContactOffline.onclick = function () { INTERFACE_ChangeGroupVisibility(this, "ContactOfflineList"); };

	// User tables
	OnlineTable = UTILS_CreateElement("table");
	OnlineTbody = UTILS_CreateElement("tbody", "ContactOnlineList");
	OfflineTable = UTILS_CreateElement("table");
	OfflineTbody = UTILS_CreateElement("tbody", "ContactOfflineList");

	// Loading user list
	for (i=0; i < MainData.UserList.length; i++)
	{
		if (MainData.UserList[i].Status != "offline")
		{
			ContactsOnline = INTERFACE_CreateContact(	MainData.UserList[i].Username, 
														MainData.UserList[i].Status,
														MainData.UserList[i].RatingBlitz,
														MainData.UserList[i].Type
													);
			OnlineTbody.appendChild(ContactsOnline);
		}
		else
		{
			ContactsOffline = INTERFACE_CreateContact(	MainData.UserList[i].Username, 
														MainData.UserList[i].Status,
														MainData.UserList[i].RatingBlitz,
														MainData.UserList[i].Type
													);
			OfflineTbody.appendChild(ContactsOffline);
		}
	}

	// Search user
	Search = UTILS_CreateElement("a", null, null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(Search,"click",function() { WINDOW_SearchUser(); }, "false");
	Hr = UTILS_CreateElement("hr");
	
	// Creating DOM tree
	OnlineTable.appendChild(OnlineTbody);
	OfflineTable.appendChild(OfflineTbody);

	ContactsDiv.appendChild(ContactOnline);
	ContactsDiv.appendChild(OnlineTable);
	ContactsDiv.appendChild(ContactOffline);
	ContactsDiv.appendChild(OfflineTable);
	
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
*	Create elements of invite window and returns div
*
* @param	User	User's nickname that sent the invitation
* @return	Div; Array
* @see		WINDOW_Invite();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowInviteWindow(User)
{
	// Variables
	var Div;

	var TextDiv, Username, Label;

	var ButtonsDiv, Auth, Decline;

	var Buttons = new Array();

	// Main Div
	Div = UTILS_CreateElement('div', 'InviteDiv');

	// Text Div Elements
	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Username = UTILS_CreateElement('span',null,'username',UTILS_Capitalize(User));
	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("contact_invite_text"));

	// Buttons Div Elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Auth = UTILS_CreateElement('input',null,'button');
	Auth.type = "button";
	Auth.value = UTILS_GetText("contact_auth");
	Buttons.push(Auth);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("contact_decline");
	Buttons.push(Decline);

	// Mount elements tree
	// ButtonsDiv elements
	ButtonsDiv.appendChild(Auth);
	ButtonsDiv.appendChild(Decline);
	
	// TextDiv elements
	TextDiv.appendChild(Username);
	TextDiv.appendChild(Label);

	// Main div elements
	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

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

	var FormDiv, Username, Nickname, Input, Br;

	var ButtonsDiv, Search, Cancel;

	var Buttons = new Array();
	var Item = 1; // Option choose (1 - name, 2 - username)

	// Main div
	Div = UTILS_CreateElement('div', 'SearchUserDiv');

	// FormDiv elements
	FormDiv = UTILS_CreateElement('div', 'FormDiv');

	Username = UTILS_CreateElement('span', null, 'option_marked', UTILS_GetText("contact_search_name"));
	Username.onclick = function() {
		Username.className = 'option_marked';
		Nickname.className = 'option';
		Item = 1;
	}
	Nickname = UTILS_CreateElement('span', null, 'option', UTILS_GetText("contact_search_nick"));
	Nickname.onclick = function() {
		Nickname.className = 'option_marked';
		Username.className = 'option';
		Item = 2;
	}
	Br = UTILS_CreateElement('br');
	Input = UTILS_CreateElement('input', "SearchUserInput");
	Input.size = "23";

	// ButtonsDiv elements
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Search = UTILS_CreateElement('input',null,'button');
	Search.type = "button";
	Search.value = UTILS_GetText("contact_search");
	Search.onclick = function() {
		if (Item == 1)
		{
			CONNECTION_SendJabber(MESSAGE_SearchUser(Input.value,null));
		}
		else if (Item == 2)
		{
			CONNECTION_SendJabber(MESSAGE_SearchUser(null,Input.value));
		}
	}
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
	FormDiv.appendChild(Nickname);
	FormDiv.appendChild(Br);
	FormDiv.appendChild(Input);

	// Main div elements
	Div.appendChild(FormDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
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
			Tr = UTILS_CreateElement('tr');

			Item = UTILS_CreateElement('td',null,null,UserList[i]);
			Tr.appendChild(Item);

			Table.appendChild(Tr);
		}
	}

	Br = UTILS_CreateElement('br');

	// ButtonsDiv
	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Button = UTILS_CreateElement('input',null,'button');
	Button.type = "button";
	if (UserList != null)
	{
		Button.value = UTILS_GetText("contact_add");
	}
	else
	{
		Button.value = UTILS_GetText("contact_close");
	}
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
