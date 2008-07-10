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

/*******************************************
 ******* FUNCTIONS - CONTACT OBJECT
 * ***************************************/

function ContactObj()
{
	var ContactContent = INTERFACE_CreateContactContent();
	// Attributes
	this.div = ContactContent.MainDiv;
	this.listDiv = ContactContent.ListDiv;
	this.loadingDiv = ContactContent.LoadingDiv;

	this.groups = new Array();
	
	//Create sort options
	this.sort = new UserListObj(this.div);
	this.sort.show();
	this.sort.hideList();
	this.sort.setSortUserFunction(CONTACT_SortUsersByNick);
	this.sort.setSortRatingFunction(CONTACT_SortUsersByRating);

	// Methods
	this.addGroup = INTERFACE_AddContactGroup;
	this.removeGroup = INTERFACE_RemoveContactGroup;
	this.findGroup = INTERFACE_FindContactGroup;
	this.getGroup = INTERFACE_GetContactGroup;
	this.findUserGroup = INTERFACE_FindContactUserGroup;

	this.addUser = INTERFACE_AddContactUser;
	this.removeUser = INTERFACE_RemoveContactUser;
	this.updateUser = INTERFACE_UpdateContactUser;

	this.show = INTERFACE_ShowContactList;
	this.hide = INTERFACE_HideContactList;

	this.showLoading = INTERFACE_ShowContactLoading;
	this.hideLoading = INTERFACE_HideContactLoading;
}

function INTERFACE_AddContactGroup(GroupName)
{
	//TODO -> Create contact Group object in other file
	var Group = new Object();
	var GroupInterface = INTERFACE_CreateGroup(GroupName);

	Group.mainDiv = GroupInterface.GroupDiv;
	Group.onlineDiv = GroupInterface.Online;
	Group.offlineDiv = GroupInterface.Offline;
	Group.title = GroupInterface.Title;
	Group.name = GroupName;

	Group.online = new UserListObj(Group.onlineDiv);
	Group.online.show();
	Group.online.hideSort();

	Group.offline = new UserListObj(Group.offlineDiv);
	Group.offline.show();
	Group.offline.hideSort();

	Group.display = "block";
	Group.show = function (){
		if(this.display == "none")
		{
			this.display = "block";
			this.online.showList();
			this.offline.showList();
			this.title.onclick = function() { Group.hide() };
		}
	}
	Group.hide = function() {
		if(this.display == "block")
		{
			this.display = "none";
			this.online.hideList();
			this.offline.hideList();
			this.title.onclick = function() { Group.show() };
		}
	}

	Group.remove = function(){
		this.mainDiv.parentNode.removeChild(this.mainDiv);
	};

	Group.title.onclick = function() { Group.hide() }

	this.groups.push(Group);
	this.listDiv.appendChild(GroupInterface.GroupDiv);
}

function INTERFACE_CreateGroup(GroupName)
{
	var GroupDiv;
	var GroupTitle;
	var GroupOnline, GroupOffline;

	GroupDiv = UTILS_CreateElement("div",null,"GroupDiv");

	GroupTitle = UTILS_CreateElement("label",null,null,GroupName);
	GroupOnline = UTILS_CreateElement("div",null,"OnlineGroup");
	GroupOffline = UTILS_CreateElement("div",null,"OfflineGroup");

	GroupDiv.appendChild(GroupTitle);
	GroupDiv.appendChild(GroupOnline);
	GroupDiv.appendChild(GroupOffline);

	return {GroupDiv:GroupDiv, Online:GroupOnline, Offline:GroupOffline, Title:GroupTitle };
}

function INTERFACE_RemoveContactGroup(GroupName)
{
	var GroupPos = this.findGroup(GroupName);
	var Group = this.getGroup(GroupName);

	//Remove group from interface
	Group.remove();

	this.groups.splice(GroupPos,1);

}

function INTERFACE_FindContactGroup(GroupName)
{
	var i=0;

	while((i<this.groups.length) && (GroupName != this.groups[i].name))
	{
		i++;
	}
	
	if(i<this.groups.length)
	{
		return i;
	}
	else
	{
		return null;
	}
}

function INTERFACE_GetContactGroup(GroupName)
{
	var GroupPos = this.findGroup(GroupName);
	return this.groups[GroupPos];
}


function INTERFACE_FindContactUserGroup(UserName)
{
	var i=0;
	var GroupTmp;

	while(i<this.groups.length)
	{
		GroupTmp = this.groups[i];
		if(GroupTmp.online.findUser(UserName) != null)
		{
			return GroupTmp;
		}

		if(GroupTmp.offline.findUser(UserName) != null)
		{
			return GroupTmp;
		}
		i++;
	}
	return null;
}


function INTERFACE_AddContactUser(GroupName, UserName, Status, Rating, Type)
{
	var Group = this.getGroup(GroupName);

	if(Group == null)
	{
		return "";
	}

	if(Status != "offline")
	{
		Group.online.addUser(UserName, Status, Rating, Type);
	}
	else
	{
		Group.offline.addUser(UserName, Status, Rating, Type);
	}
}

function INTERFACE_RemoveContactUser(UserName)
{
	var Group = this.findUserGroup(UserName);

	// User not founded
	if(Group == null)
	{
		return null;
	}

	if(Group.online.findUser(UserName) != null)
	{
		Group.online.removeUser(UserName);
	}
	else 
	{
		Group.offline.removeUser(UserName);
	}
}

function INTERFACE_UpdateContactUser(UserName, Status, Rating, Type)
{
	var Group = this.findUserGroup(UserName);

	// Group not founded
	if(Group == null)
	{
		return null;
	}

	// if user is in online list
	if(Group.online.findUser(UserName) != null)
	{
		// if this online user status turn to offline... 
		if(Status == "offline")
		{	
			//Remove from online list and insert in offline;
			this.removeUser(UserName);
			this.addUser(Group.name, UserName, Status, Rating, Type);
		}
		// update user state
		else 
		{
			Group.online.updateUser(UserName, Status, Rating, Type);
		}
	}
	// if user is in offline list
	else 
	{
		if(Status != "offline")
		{
			//Remove from offline list and insert in online;
			this.removeUser(UserName);
			this.addUser(Group.name, UserName, Status, Rating, Type);
		}
	}
	
}



function INTERFACE_ShowContactList()
{
	var ParentTmp;

	// The code above is used in specific case of this interface.
	// Contact list should be in "Contact" div.
	ParentTmp = document.getElementById("Contact");
	if(this.div.parentNode != ParentTmp)
	{
		ParentTmp.appendChild(this.div);
	}

	this.div.style.display = "block";
}

function INTERFACE_HideContactList()
{
	this.div.style.display = "none";
}

function INTERFACE_ShowContactLoading()
{
	this.loadingDiv.style.display = "block";
}

function INTERFACE_HideContactLoading()
{
	this.loadingDiv.style.display = "none";
}


/*******************************************
 ******* FUNCTIONS - CONTACT ONLINE OBJECT
 * ***************************************/

// Contact Online Object
function ContactOnlineObj()
{
	var ContactOnline = INTERFACE_CreateOnlineContent();
	this.div = ContactOnline.Div;
	this.loadingDiv = ContactOnline.LoadingDiv;

	this.userList = new UserListObj(this.div);
	this.userList.show();
	this.userList.setSortUserFunction(CONTACT_OnlineSortUserByNick);
	this.userList.setSortRatingFunction(CONTACT_OnlineSortUserByRating);

	this.show = INTERFACE_ShowOnlineList;
	this.hide = INTERFACE_HideOnlineList;

	this.showLoading = INTERFACE_ShowContactLoading;
	this.hideLoading = INTERFACE_HideContactLoading;
}


function INTERFACE_ShowOnlineList()
{
	var ParentTmp;

	// The code above is used in specific case of this interface.
	// Contact list should be in "Contact" div.
	ParentTmp = document.getElementById("Contact");
	if(this.div.parentNode != ParentTmp)
	{
		ParentTmp.appendChild(this.div);
	}

	this.div.style.display = "block";
}

function INTERFACE_HideOnlineList()
{
	this.div.style.display = "none";
}



/**
* Add user in contact list
*
* @public
*/
/*
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
*/
/**
* Remove user in contact list
*
* @public
*/
/*
function INTERFACE_RemoveContact(Username)
{
	var Node = document.getElementById("contact-"+Username);
	var List;

	if (!Node)
	{
		return false;
	}
	
	// Remove node
	Node = Node.parentNode; // tr
	List = Node.parentNode; // tbody
	List.removeChild(Node);
//	Node.parentNode.removeChild(Node);

	return true;
}
*/
/**
* Set status of user in interface
*
* @public
*/
/*
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
		User.className = User.className.replace(/_.*/
		/*"_"+NewStatus);

		// Up to 'tr'
		User = User.parentNode;

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
		User.className = User.className.replace(/_.*/
		/*, "_"+NewStatus);

		// Up to 'tr'
		User = User.parentNode;

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
		User.className = User.className.replace(/_.*/
		/*, "_"+NewStatus);
	}

	return true;
}
*/
/**
* Set rating of user in interface
*
* @public
*/
/*
function INTERFACE_SetUserRating(Username, Category, Rating)
{
	var User = document.getElementById("contact-"+Username+"-rating");
	var List, Node, i;

	// Updating user's rating
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
*/
/**
* Change current rating type showed in interface
*
* @public
*/
/*
function INTERFACE_ChangeCurrentRating(Type)
{
	var Node, NewRating, Div;
	var i, j;

	// Update current rating in the sctructure
	MainData.CurrentRating = Type;

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

	// Changing rating select of contact list
	Node = document.getElementById("order_rating-contact");
	if (Node)
	{	
		for (j=0; j<Node.childNodes.length; j++)
		{
			if (Node.childNodes[j].value == Type)
			{
				Node.selectedIndex = j;
				Node.childNodes[j].className = 'option_selected';
			}	
			else
			{
				Node.childNodes[j].className = 'option_not_selected';
			}
		}
	}
	INTERFACE_SortUserByRating();

	// Changing style
	document.getElementById("order_nick").className = null;
	document.getElementById("order_rating-contact").className = 'order_rating_selec';
}
*/
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
/*
function INTERFACE_CreateContact(Username, Status, Rating, Type, RoomName)
{
	var Tr, Td1, Td2;

	Tr = UTILS_CreateElement("tr",Username);

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
*/

/**
* Show user menu
*
* @private
*/
/*
function INTERFACE_ShowUserMenu(Obj, Options)
{
	var Menu, Option, ParentNode, Pos, i, Offset;

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
	if (ParentNode.id.match("Room") != null)
	{
		// Parent Div is RoomUsers
		Offset = 8;
	}
	else
	{
		ParentNode = UTILS_GetParentDiv(ParentNode.parentNode);
		Offset = -1;
	}

	Pos = UTILS_GetOffset(Obj);

	Menu.style.top = (Pos.Y+18-ParentNode.scrollTop-Offset)+"px";
	Menu.style.left = Pos.X+"px";

	document.body.appendChild(Menu);
}
*/

/**
* Hide user menu from screen
*
* @private
*/
/*
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
*/

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
function INTERFACE_CreateContact()
{
	var ContactDiv, ContactTitle;
	var ContactTitleOnline, ContactTitleContacts;
	var ContactTitleOnlineSpan, ContactTitleContactsSpan;

	// Main div
	ContactDiv = UTILS_CreateElement("div", "Contact");

	// Contact change bar
	ContactTitle = UTILS_CreateElement("ul", "ContactTitle");
	ContactTitleContacts = UTILS_CreateElement("li");

	ContactTitleOnline = UTILS_CreateElement("li", null, "contact_selec");

	ContactTitleContactsSpan = UTILS_CreateElement("span", null, null, UTILS_GetText("contact_contacts"));
	ContactTitleOnlineSpan = UTILS_CreateElement("span", null, null, UTILS_GetText("contact_online"));

	ContactTitleContacts.onclick = function(){
		ContactTitleContacts.className = "contact_selec";
		ContactTitleOnline.className = "";

		MainData.Contact.show();
		MainData.ContactOnline.hide();
	};
	ContactTitleOnline.onclick = function(){
		ContactTitleContacts.className = "";
		ContactTitleOnline.className = "contact_selec";

		MainData.Contact.hide();
		MainData.ContactOnline.show();
	};

	// Creating DOM tree
	ContactTitleOnline.appendChild(ContactTitleOnlineSpan);
	ContactTitleContacts.appendChild(ContactTitleContactsSpan);
	ContactTitle.appendChild(ContactTitleOnline);
	ContactTitle.appendChild(ContactTitleContacts);

	ContactDiv.appendChild(ContactTitle);
//	ContactDiv.appendChild(INTERFACE_CreateContactContent());

	return ContactDiv;
}

function INTERFACE_CreateContactContent()
{
	var ContactDiv, ContactsDiv, ContactTitle, ContactInside, ContactOnlineDiv, ContactOfflineDiv, ContactOnline, ContactOffline;
	var OrderNick, OrderRating, OrderRatingOpt, Search;
	var Hr;
	var SearchP, SearchS;
	var ListDiv;
	var LoadingDiv;

	//Contact content
	ContactInside = UTILS_CreateElement("div", "ContactInside");
	ListDiv = UTILS_CreateElement("div", "ListDiv");

	// Group labels
	/*
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
	*/

	// Search user
//	Search = UTILS_CreateElement("a", null, null, UTILS_GetText("menu_search_user"));
	SearchP = UTILS_CreateElement("p",null,"contact_search_user_p");
	SearchS = UTILS_CreateElement("span","contact_search_user", null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(SearchP, "click", function() { WINDOW_SearchUser(); }, "false");
	SearchP.appendChild(SearchS);
	Hr = UTILS_CreateElement("hr");

	/*
	OnlineTable.appendChild(OnlineTbody);
	OfflineTable.appendChild(OfflineTbody);

	ContactOnlineDiv.appendChild(ContactOnline);
	ContactOnlineDiv.appendChild(OnlineTable);
	ContactOfflineDiv.appendChild(ContactOffline);
	ContactOfflineDiv.appendChild(OfflineTable);
	ContactsDiv.appendChild(ContactOnlineDiv);
	ContactsDiv.appendChild(ContactOfflineDiv);
	ContactInside.appendChild(ContactsDiv);
	*/
	LoadingDiv = INTERFACE_CreateLoadingBox("contact_loading","Carregando lista de contatos...");

	ContactInside.appendChild(ListDiv);
	ContactInside.appendChild(Hr);
	ContactInside.appendChild(SearchP);
	ContactInside.appendChild(LoadingDiv);

	//HIDE CONTACT DIV
	ContactInside.style.display = "none";

	return { MainDiv:ContactInside, ListDiv:ListDiv, LoadingDiv:LoadingDiv};
}


/**
* Create contact online list
*
* @private
*/
function INTERFACE_CreateOnlineContent()
{
	var ContactDiv, ContactsDiv, ContactTitle, ContactInside, ContactOnlineDiv, ContactOfflineDiv, ContactOnline, ContactOffline;
	var ContactsOnline, ContactsOffline;
	var OnlineTable, OnlineTbody;
	var OfflineTable, OfflineTbody;
	var OrderNick, OrderRating, OrderRatingOpt, Search;
	var Hr;
	var SearchP, SearchS;
	var LoadingDiv;

	//Contact content
	ContactInside = UTILS_CreateElement("div", "ContactOnline");


	// Order buttons
	/*
	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("contact_order_nick"));
	OrderNick.onclick = function() { INTERFACE_SortUserByNick(); }; 

	OrderRating = UTILS_CreateElement("select", "order_rating-contact", "order_rating", UTILS_GetText("contact_order_rating"));
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
	*/
	// Search user
	SearchP = UTILS_CreateElement("p",null,"contact_search_user_p");
	SearchS = UTILS_CreateElement("span","contact_search_user", null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(SearchP, "click", function() { WINDOW_SearchUser(); }, "false");
	SearchP.appendChild(SearchS);
	Hr = UTILS_CreateElement("hr");

	/*
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
	*/

	LoadingDiv = INTERFACE_CreateLoadingBox("contact_online_loading","Carregando lista de usuários online...");
	
	ContactInside.appendChild(Hr);
	ContactInside.appendChild(SearchP);
	ContactInside.appendChild(LoadingDiv);

	//HIDE CONTACT DIV
	//ContactInside.style.display = "none";

	return { Div:ContactInside, LoadingDiv:LoadingDiv};
}


/*****************************
*	FUNCTIONS - WINDOW
******************************/


/**
*	Sort users by nick into ascendent or descendent order
*
* @return	boolean
* @author Danilo Kiyoshi Simizu Yorinori
*/
/*
function INTERFACE_SortUserByNick()
{	
	var Tam = MainData.UserList.length;
	var ListOn, ListOff;
	var i, Item, Status;
	var Node;

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

	// Changing style
	
	// Nick style
	document.getElementById("order_nick").className = 'order_selec';

	// Contact list's select
	Node = document.getElementById("order_rating-contact");
	Node.className = 'order_rating';
	if (Node)
	{	
		for (j=0; j<Node.childNodes.length; j++)
		{
			Node.childNodes[j].className = 'option_not_selected';
		}
	}
}
*/
/**
*	Sort users by nick into ascendent or descendent order
*
* @return	boolean
* @author Danilo Kiyoshi Simizu Yorinori
*/
/*
function INTERFACE_SortUserByRating()
{	
	var Tam = MainData.UserList.length;
	var ListOn, ListOff;
	var i, Item, Status;

	// TODO Expand to group
	ListOn = document.getElementById("ContactOnlineList");
	ListOff = document.getElementById("ContactOfflineList");

	MainData.OrderBy = "2";

	// Order userlist struct
	MainData.SortUserByRating();

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
*/
