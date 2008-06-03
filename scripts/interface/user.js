function UserListObj(Element)
{
	var UserList = INTERFACE_CreateUserList(Element);

	this.mainDiv = UserList.MainDiv;
	this.userList = UserList.UserList;
	this.sortNick = UserList.SortNick;
	this.sortRating = UserList.SortRating;

	this.users = new Array();

	this.show = INTERFACE_ShowUserList;
	this.hide = INTERFACE_HideUserList;

	this.addUser = INTERFACE_AddUser;
	this.removeUser = INTERFACE_RemoveUser;
	this.updateUser = INTERFACE_UpdateUser;
	this.findUser = INTERFACE_FindUser;

	this.hideSort = INTERFACE_HideSort;
	this.showSort = INTERFACE_ShowSort;
	this.hideList = INTERFACE_HideList;
	this.showList = INTERFACE_ShowList;

	this.setSortUserFunction = INTERFACE_SetSortUserFunction;
	this.setSortRatingFunction = INTERFACE_SetSortRatingFunction;
}



function INTERFACE_ShowUserList()
{
	this.mainDiv.style.display = "block";
}

function INTERFACE_HideUserList()
{
	this.userList.style.display = "none";
}


function INTERFACE_AddUser(Username, Status, Rating, Type)
{
	var User;
	var UserObj = new Object();

	// Create Tr
	User = INTERFACE_CreateUser(Username, Status, Rating, Type, this.roomName);

	// Add user in room users
	UserObj.Id = Username;
	UserObj.User = User;
	this.users.push(UserObj);

	//this.userList.insertBefore(User,null);
	this.userList.appendChild(User);
}

function INTERFACE_RemoveUser(Username)
{
	var UserItem = this.findUser(Username);
	var i=0;

	
	if(UserItem == null)
	{
		return false;
	}

	this.userList.removeChild(UserItem);


	// Find user in "users" list and remove from it
	while((Username != this.users[i].Id) && (i<this.users.length))
	{
		i++;
	}

	if(i< this.users.length)
	{
		this.users.splice(i,1);
	}

	return true;
}



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



function INTERFACE_SetSortUserFunction(Func)
{
	this.sortNick.onclick = Func;
}


function INTERFACE_SetSortRatingFunction(Func)
{
	var TmpFunc = Func;

	this.sortRating.onchange = function(){
		TmpFunc(this.value);
	};
}

function INTERFACE_HideSort()
{
	this.sortNick.style.display = "none";
	this.sortRating.style.display = "none";
}

function INTERFACE_ShowSort()
{
	this.sortNick.style.display = "block";
	this.sortRating.style.display = "block";
}

function INTERFACE_HideList()
{
	this.userList.parentNode.style.display = "none";
}
function INTERFACE_ShowList()
{
	this.userList.parentNode.style.display = "block";
}

/**************************************
**** FUNCTION - CREATE HTML LIST
**************************************/

function INTERFACE_CreateUserList(Element)
{
	var MainDiv;
	var Users, Table, Tbody;
	var OrderNick, OrderRating, OrderRatingOpt;
	
	MainDiv = UTILS_CreateElement("div",null,"UserList");

	OrderNick = UTILS_CreateElement("span", "order_nick", "order_selec", UTILS_GetText("room_order_nick"));
	OrderRating = UTILS_CreateElement("select", null, "order_rating", UTILS_GetText("room_order_rating"));
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

	// Sort functions will be set in UserListObject;

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
* Create a user node
*
* @private
* @return DOM object
*/
function INTERFACE_CreateUser(Username, Status, Rating, Type)
{
	var Tr, Td1, Td2;

	Tr = UTILS_CreateElement("tr",Username);

	// Default type
	if (Type == null)
	{
		Type = "user";
	}

	// Create user and rating html elements
	Td1 = UTILS_CreateElement("td", null, Type+"_"+Status, Username);
	Td2 = UTILS_CreateElement("td", null, "rating", Rating);

	// Add onclick function to open user menu
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
	var Menu, Option, ParentNode, Pos, i;

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
		// Get Table element
		ParentNode = Obj.parentNode.parentNode.parentNode;
	}
	else
	{
		ParentNode = UTILS_GetParentDiv(ParentNode.parentNode);
	}

	Pos = UTILS_GetOffset(Obj);

	Menu.style.top = (Pos.Y+18-ParentNode.scrollTop)+"px";
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

