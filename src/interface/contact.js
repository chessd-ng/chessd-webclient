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
* @file		interface/contact.js
* @brief	Control interface contact list
*/

/*******************************************
 ******* FUNCTIONS - CONTACT OBJECT
 * ***************************************/
/*
* @brief	Create contact interface object
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add a group in contact list
*
* @param	GroupName	Group's name
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Create group HTML DOM elements
*
* @param	GroupName	Group's name
* @return	Group HTML DOM elements
* @author	Rubens Suguimoto
*/
function INTERFACE_CreateGroup(GroupName)
{
	var GroupDiv;
	var GroupTitle;
	var GroupOnline, GroupOffline;

	GroupDiv = UTILS_CreateElement("div",null,"GroupDiv");

	if(GroupName != "default")
	{
		GroupTitle = UTILS_CreateElement("label",null,null,GroupName);
	}
	else
	{
		GroupTitle = UTILS_CreateElement("label",null,null,UTILS_GetText("contact_default_group"));
	}

	GroupOnline = UTILS_CreateElement("div",null,"OnlineGroup");
	GroupOffline = UTILS_CreateElement("div",null,"OfflineGroup");

	GroupDiv.appendChild(GroupTitle);
	GroupDiv.appendChild(GroupOnline);
	GroupDiv.appendChild(GroupOffline);

	return {GroupDiv:GroupDiv, Online:GroupOnline, Offline:GroupOffline, Title:GroupTitle };
}

/*
* @brief	Remove group in contact list
*
* @param	GroupName	Group's name
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_RemoveContactGroup(GroupName)
{
	var GroupPos = this.findGroup(GroupName);
	var Group = this.getGroup(GroupName);

	//Remove group from interface
	Group.remove();

	this.groups.splice(GroupPos,1);

}

/*
* @brief	Find a group in contact list
*
* @param	GroupName	Group's name
* @return	Group position number in group list or null (if not found)
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Get a group in contact list
*
* @param	GroupName	Group's name
* @return	Group item
* @author	Rubens Suguimoto
*/
function INTERFACE_GetContactGroup(GroupName)
{
	var GroupPos = this.findGroup(GroupName);
	return this.groups[GroupPos];
}

/*
* @brief	Find group by username
*
* @param	UserName	User's name
* @return	Group item or null (if not found)
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add a contact user
*
* @param	GroupName	Group's name
* @param	UserName	User's name
* @param	Status		User's status
* @param	Rating		User's rating
* @param	Type		User's type
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddContactUser(GroupName, UserName, Status, Rating, Type)
{
	var Group = this.getGroup(GroupName);

	if(Group == null)
	{
		this.addGroup(GroupName);
		Group = this.getGroup(GroupName);
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

/*
* @brief	Remove some user from contact list
*
* @param	UserName	User's name
* @return	Removed user's name
* @author	Rubens Suguimoto
*/
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

	return UserName;
}

/*
* @brief	Update information of some user in contact list
*
* @param	UserName	User's name
* @param	Status		User's status
* @param	Rating		User's rating
* @param	Type		User's type
* @return	Username or null (if user was not founded)
* @author	Rubens Suguimoto
*/
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
		else
		{
			Group.offline.updateUser(UserName, Status, Rating, Type);
		}
	}
	return UserName;	
}


/*
* @brief	Show contact list HTML DOM Div
*
* @param	GroupName	Group's name
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowContactList()
{
	var ParentTmp;

	// The code above is used in specific case of this interface.
	// Contact list should be in "Contact" div.
//	ParentTmp = document.getElementById("Contact");
	ParentTmp = document.getElementById("UserLists");
	if(this.div.parentNode != ParentTmp)
	{
		ParentTmp.appendChild(this.div);
	}

	this.div.style.display = "block";
}

/*
* @brief	Hide contact list HTML DOM Div
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideContactList()
{
	this.div.style.display = "none";
}

/*
* @brief	Show contact list loading text
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowContactLoading()
{
	this.loadingDiv.style.display = "block";
}

/*
* @brief	Hide contact list loading text
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideContactLoading()
{
	this.loadingDiv.style.display = "none";
}


/*******************************************
 ******* FUNCTIONS - CONTACT ONLINE OBJECT
 * ***************************************/

/*
* @brief	Create contact online interface object
*
* @return	none
* @author	Rubens Suguimoto
*/
function ContactOnlineObj()
{
	var ContactOnline = INTERFACE_CreateOnlineContent();
	this.div = ContactOnline.Div;
	this.loadingDiv = ContactOnline.LoadingDiv;

	this.userList = new UserListObj(this.div);
	this.userList.show();
	this.userList.setSortUserFunction(ONLINE_SortUserByNick);
	this.userList.setSortRatingFunction(ONLINE_SortUserByRating);

	this.show = INTERFACE_ShowOnlineList;
	this.hide = INTERFACE_HideOnlineList;

	this.showLoading = INTERFACE_ShowContactLoading;
	this.hideLoading = INTERFACE_HideContactLoading;
}

/*
* @brief	Show contact online HTML DOM Div
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowOnlineList()
{
	var ParentTmp;

	// The code above is used in specific case of this interface.
	// Contact list should be in "Contact" div.
//	ParentTmp = document.getElementById("Contact");
	ParentTmp = document.getElementById("UserLists");
	if(this.div.parentNode != ParentTmp)
	{
		ParentTmp.appendChild(this.div);
	}

	this.div.style.display = "block";
}

/*
* @brief	Hide contact online HTML DOM Div
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideOnlineList()
{
	this.div.style.display = "none";
}


/**
* @brief	Show or hide contact groups
*
* @param	Obj	HTML DOM element
* @param	Id 	Group identification field
* @return	True or False (if group not founded)
* @author 	Rubens Suguimoto
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
	return true;
}


/**
* @brief	Create contact and online HTML DOM div
*
* @return	HTML DOM Div
* @author	Rubens Suguimoto
*/
function INTERFACE_CreateContact()
{
	var ContactDiv, ContactTitle;
	var ContactTitleOnline, ContactTitleContacts;
	var ContactTitleOnlineSpan, ContactTitleContactsSpan;
	var ContactTitleOnlineNumber, ContactTitleContactsNumber;
	var Lists;

	// Main div
	ContactDiv = UTILS_CreateElement("div", "Contact");

	// Contact change bar
	ContactTitle = UTILS_CreateElement("ul", "ContactTitle");
	ContactTitleContacts = UTILS_CreateElement("li");

	ContactTitleOnline = UTILS_CreateElement("li", null, "contact_selec");

	ContactTitleContactsSpan = UTILS_CreateElement("span", null, 'bold', UTILS_GetText("contact_contacts"));
	ContactTitleContactsNumber = UTILS_CreateElement("span",'ContactNumber',null," (0)");
	ContactTitleOnlineSpan = UTILS_CreateElement("span", null, 'bold', UTILS_GetText("contact_online"));
	ContactTitleOnlineNumber = UTILS_CreateElement("span",'OnlineNumber',null," (0)");

	ContactTitleContacts.onclick = function(){
		var ContactObj = MainData.GetContactObj();
		var OnlineObj = MainData.GetOnlineObj();

		ContactTitleContacts.className = "contact_selec";
		ContactTitleOnline.className = "";

		ContactObj.show();
		OnlineObj.hide();
	};
	ContactTitleOnline.onclick = function(){
		var ContactObj = MainData.GetContactObj();
		var OnlineObj = MainData.GetOnlineObj();

		ContactTitleContacts.className = "";
		ContactTitleOnline.className = "contact_selec";

		ContactObj.hide();
		OnlineObj.show();
	};

	Lists = UTILS_CreateElement("div","UserLists");

	// Creating DOM tree
	ContactTitleOnline.appendChild(ContactTitleOnlineSpan);
	ContactTitleOnline.appendChild(ContactTitleOnlineNumber);
	ContactTitleContacts.appendChild(ContactTitleContactsSpan);
	ContactTitleContacts.appendChild(ContactTitleContactsNumber);
	ContactTitle.appendChild(ContactTitleOnline);
	ContactTitle.appendChild(ContactTitleContacts);

	ContactDiv.appendChild(ContactTitle);
	ContactDiv.appendChild(Lists);

	return ContactDiv;
}

/*
* @brief	Create contact list content
*
* @return	Contact Div, Contact list and Loading element
* @author	Rubens Suguimoto
*/
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

	// Search user
	SearchP = UTILS_CreateElement("p",null,"contact_search_user_p");
	SearchS = UTILS_CreateElement("span","contact_search_user", null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(SearchP, "click", function() { WINDOW_SearchUser(); }, "false");
	SearchP.appendChild(SearchS);
	Hr = UTILS_CreateElement("hr");

	LoadingDiv = INTERFACE_CreateLoadingBox("contact_loading",UTILS_GetText("contact_loading"));

	// Creating DOM tree
	ContactInside.appendChild(ListDiv);
	ContactInside.appendChild(Hr);
	ContactInside.appendChild(SearchP);
	ContactInside.appendChild(LoadingDiv);

	//HIDE CONTACT DIV
	ContactInside.style.display = "none";

	return { MainDiv:ContactInside, ListDiv:ListDiv, LoadingDiv:LoadingDiv};
}


/**
* @brief	Create contact online list
*
* @return	Contact online Div and Loading element
* @author	Rubens Suguimoto
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


	// Search user
	SearchP = UTILS_CreateElement("p",null,"contact_search_user_p");
	SearchS = UTILS_CreateElement("span","contact_search_user", null, UTILS_GetText("menu_search_user"));
	UTILS_AddListener(SearchP, "click", function() { WINDOW_SearchUser(); }, "false");
	SearchP.appendChild(SearchS);
	Hr = UTILS_CreateElement("hr");

	LoadingDiv = INTERFACE_CreateLoadingBox("contact_online_loading",UTILS_GetText("contact_online_loading"));
	
	// Creating DOM tree
	ContactInside.appendChild(Hr);
	ContactInside.appendChild(SearchP);
	ContactInside.appendChild(LoadingDiv);

	//HIDE CONTACT DIV
	//ContactInside.style.display = "none";

	return { Div:ContactInside, LoadingDiv:LoadingDiv};
}

/*
* @brief	Refresh contact online users number
*
* @return	none
* @author	Danilo Yorinori
*/
function INTERFACE_RefreshContactOnlineNumber()
{
	var N_Occupants=0;
	var ListLength, i;
	var Node;
	var UserList = MainData.GetContactUserList();

	Node = document.getElementById("ContactNumber");

	ListLength = UserList.length;
	for (i=0; i<ListLength; i++)
	{
		if (UserList[i].Status != "offline")
		{
			N_Occupants++;
		}
	}

	if(Node)
	{	
		Node.innerHTML = " ("+N_Occupants+")";
	}
}
