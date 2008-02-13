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
function INTERFACE_AddContact(Username, Status, Rating)
{
	var Node = document.getElementById("ContactOnlineList");
	var Contact;

	if (!Node)
	{
		return false;
	}
	
	Contact = INTERFACE_CreateContact(Username, Status, Rating)
	Node.appendChild(Contact);

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
	if ((User.className == "offline") && (NewStatus != "offline"))
	{
		List = document.getElementById("ContactOnlineList");

		if (!List)
		{
			return false;
		}
		// Updating status
		User.className = NewStatus;

		// Up to 'tr'
		User = User.parentNode;

		// Remove from offline list
		User.parentNode.removeChild(User);

		// Add inonline list
		List.appendChild(User);
	}
	// User disconnected
	else if ((User.className != "offline") && (NewStatus == "offline"))
	{
		List = document.getElementById("ContactOfflineList");

		if (!List)
		{
			return false;
		}
		// Updating status
		User.className = NewStatus;

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
		User.className = NewStatus;
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
function INTERFACE_CreateContact(Username, Status, Rating, RoomName)
{
	var Tr, Td1, Td2;

	Tr = UTILS_CreateElement("tr");

	if (RoomName == null)
	{
		Td1 = UTILS_CreateElement("td", "contact-"+Username, Status, Username);
	}
	else
	{
		Td1 = UTILS_CreateElement("td", RoomName+"_"+Username, Status, Username);
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
		Node.style.display = "table-row-group";
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
			ContactsOnline = INTERFACE_CreateContact(MainData.UserList[i].Username, MainData.UserList[i].Status);
			OnlineTbody.appendChild(ContactsOnline);
		}
		else
		{
			ContactsOffline = INTERFACE_CreateContact(MainData.UserList[i].Username, MainData.UserList[i].Status);
			OfflineTbody.appendChild(ContactsOffline);
		}
	}

	// Search user
	Search = UTILS_CreateElement("a", null, null, UTILS_GetText("menu_search_user"));
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
