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
* @file		interface/challengemenu.js
* @brief	Create a interface challenge menu object
* @deprecated
*/

/*
* @brief	Create Challenge menu object
*
* @return	none
* @author	Rubens Suguimoto
*/
function ChallengeMenuObj()
{
	var Challenge = INTERFACE_CreateChallengeMenu();

	// Attributes	
	this.Menu = Challenge.Div;
	this.MatchOfferUl = Challenge.MatchList;
	this.AnnounceUl = Challenge.AnnounceList;
	this.PostponeUl = Challenge.PostponeList;

	this.NoMatch = Challenge.NoMatch;
	this.NoAnnounce = Challenge.NoAnnounce; 
	this.NoPostpone = Challenge.NoPostpone;

	this.LoadingAnnounce = Challenge.LoadingAnnounce;

	this.MenuVisible = false;
	this.MatchVisible = false;
	this.AnnounceVisible = false;
	this.PostponeVisible = false;

	this.MatchOfferList = new Array();
	this.AnnounceList = new Array();
	this.PostponeList = new Array();

	// Methods
	this.addMatch = INTERFACE_AddMatchOffer;
	this.removeMatch = INTERFACE_RemoveMatch;
	this.showNoMatch = INTERFACE_ShowNoMatch;
	this.hideNoMatch = INTERFACE_HideNoMatch;

	this.addAnnounce = INTERFACE_AddAnnounce;
	this.removeAnnounce = INTERFACE_RemoveAnnounce;
	this.showNoAnnounce = INTERFACE_ShowNoAnnounce;
	this.hideNoAnnounce = INTERFACE_HideNoAnnounce;
	this.showLoadingAnnounce = INTERFACE_ShowLoadingAnnounce;
	this.hideLoadingAnnounce = INTERFACE_HideLoadingAnnounce;

	this.addPostpone = INTERFACE_AddPostpone;
	this.removePostpone = INTERFACE_RemovePostpone;
	this.updatePostpone = INTERFACE_UpdatePostpone;
	this.showNoPostpone = INTERFACE_ShowNoPostpone;
	this.hideNoPostpone = INTERFACE_HideNoPostpone;

	this.showMenu = INTERFACE_ShowChallengeMenu;
	this.hideMenu = INTERFACE_HideChallengeMenu;

	this.showMatch = INTERFACE_ShowMatchOfferList;
	this.showAnnounce= INTERFACE_ShowAnnounceList;
	this.showPostpone = INTERFACE_ShowPostponeList;

	this.hideMatch = INTERFACE_HideMatchOfferList;
	this.hideAnnounce= INTERFACE_HideAnnounceList;
	this.hidePostpone = INTERFACE_HidePostponeList;

	//Action
	this.hideLoadingAnnounce();
}

/*
* @brief	Create Challenge menu HTML DOM elements
*
* @return	Challenge menu HTML DOM Div, Challenges HTML DOM Lists and Texts HTML DOM texts
* @author	Rubens Suguimoto
*/
function INTERFACE_CreateChallengeMenu()
{
	var ChallengeDiv = UTILS_CreateElement("div","ChallengeMenu");
	var MatchOfferList = UTILS_CreateElement("ul");
	var AnnounceList = UTILS_CreateElement("ul");
	var PostponeList = UTILS_CreateElement("ul");

	var MatchOfferTitle = UTILS_CreateElement("span","title",null,UTILS_GetText("challenge_menu_match_title"));
	var AnnounceTitle = UTILS_CreateElement("span","title",null,UTILS_GetText("challenge_menu_announce_title"));
	var PostponeTitle = UTILS_CreateElement("span","title",null,UTILS_GetText("challenge_menu_postpone_title"));

	var AnnounceLine = UTILS_CreateElement("span", null,null," - ");
	var AnnounceButton = UTILS_CreateElement("span", "announce",null,UTILS_GetText("challenge_menu_announce"));

	var NoMatch = UTILS_CreateElement("li",null,"text",UTILS_GetText("challenge_menu_no_match"));
	var NoAnnounce = UTILS_CreateElement("li",null,"text",UTILS_GetText("challenge_menu_no_announce"));
	var NoPostpone = UTILS_CreateElement("li",null,"text",UTILS_GetText("challenge_menu_no_postpone"));

	var LoadingAnnounce = UTILS_CreateElement("li",null,"text",UTILS_GetText("challenge_menu_loading_announce"));

	AnnounceButton.onmousedown = function(){
		WINDOW_AnnounceWindow();
	}

	MatchOfferList.appendChild(MatchOfferTitle);
	MatchOfferList.appendChild(NoMatch);
	AnnounceList.appendChild(AnnounceTitle);
	AnnounceList.appendChild(AnnounceLine);
	AnnounceList.appendChild(AnnounceButton);
	AnnounceList.appendChild(NoAnnounce);
	AnnounceList.appendChild(LoadingAnnounce);
	PostponeList.appendChild(PostponeTitle);
	PostponeList.appendChild(NoPostpone);

	ChallengeDiv.appendChild(MatchOfferList);
	ChallengeDiv.appendChild(AnnounceList);
	ChallengeDiv.appendChild(PostponeList);

	return { Div:ChallengeDiv,  MatchList:MatchOfferList, AnnounceList:AnnounceList, PostponeList:PostponeList, NoMatch:NoMatch, NoAnnounce:NoAnnounce, NoPostpone:NoPostpone, LoadingAnnounce:LoadingAnnounce};
}


/*
* @brief	Add a match offer
*
* @param	Oponent		Oponent player object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Rated		Game rated flag
* @param	Private		Game private flag
* @param	MatchId		Match offer identification number
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddMatchOffer(Oponent, Time, Inc, Rated, Private, MatchId)
{
	var Item;

	var PName, PTime, PInc, PRated, PPrivate, PButton, Button;
	var ItemObj = new Object();

	// Random color
	if(Oponent.Color == "")
	{
		Item = UTILS_CreateElement("li",null,"random");
	}
	else
	{
		Item = UTILS_CreateElement("li",null,Oponent.Color);
	}

	if (Oponent.Name.length > 9)
	{
		PName = UTILS_CreateElement("p","name", null, UTILS_ShortString(Oponent.Name,7));
		PName.onmouseover = function() { INTERFACE_ShowFullName(this, Oponent.Name); }
		PName.onmouseout = function() { INTERFACE_CloseFullName(); }
	}
	else
	{
		PName = UTILS_CreateElement("p","name", null, Oponent.Name);
	}

	PTime = UTILS_CreateElement("p","time", null, Time+"'");
	PTime.title = UTILS_GetText("challenge_time");

	PInc = UTILS_CreateElement("p","inc", null, Inc+'"');
	PInc.title = UTILS_GetText("challenge_inc");

	/*// This feature is not implemented yet
	if(Private == false)
	{
		Private = UTILS_CreateElement("p","private","false");
	}
	else
	{
		Private = UTILS_CreateElement("p","private","true");
	}
	*/

	PPrivate = UTILS_CreateElement("p","private","false");
	PPrivate.title = UTILS_GetText("challenge_public");

	if(Rated == "true")
	{
		PRated = UTILS_CreateElement('p','rated','true','rating');
		PRated.title = UTILS_GetText("challenge_rated");
	}
	else
	{
		PRated = UTILS_CreateElement('p','rated','false','rating');
		PRated.title = UTILS_GetText("challenge_unrated");
	}

	PButton = UTILS_CreateElement("p");
	Button = UTILS_CreateElement('span',"button","active",UTILS_GetText("window_cancel"));
	Button.onmouseover = function() { this.style.color = "#FFA200"; this.style.borderBottom = "1px solid #FFA200"; }
	Button.onmouseout = function() { this.style.color = "#216778"; this.style.borderBottom = "1px solid #216778"; }
	PButton.appendChild(Button);

	PButton.onmousedown = function(){
		CHALLENGE_DeclineChallenge(MatchId);
	}



	Item.appendChild(PName);
	Item.appendChild(PTime);
	Item.appendChild(PInc);
	Item.appendChild(PRated);
	Item.appendChild(PPrivate);
	Item.appendChild(PButton);

	/*
	ItemObj.Name = PName;
	ItemObj.Time = PTime;
	ItemObj.Inc = PInc;
	ItemObj.Rated = PRated;
	ItemObj.Private = PPrivate;
	ItemObj.PButton = PButton;
	*/
	ItemObj.Item = Item;
	ItemObj.Id = MatchId;

	this.MatchOfferList.push(ItemObj);
	this.MatchOfferUl.appendChild(Item);

	if(this.MatchOfferList.length == 1)
	{
		this.hideNoMatch();
	}
}

function INTERFACE_RemoveMatch(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.MatchOfferList.length)&&(this.MatchOfferList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.MatchOfferList.length)
	{
		return false;

	}

	Item = this.MatchOfferList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.MatchOfferList.splice(i,1);

	if(this.MatchOfferList.length <= 0)
	{
		this.showNoMatch();
	}

	return true;
}


/*
* @brief	Add a announced challenge
*
* @param	Player		Player object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Rated		Game rated flag
* @param	Private		Game private flag
* @param	MatchId		Announce identification number
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddAnnounce(Player, Time, Inc, Rated, Private, MatchId)
{
	var Item;

	var PName, PTime, PInc, PRated, PPrivate, PButton, Button;
	var ItemObj = new Object();
	var Id = MatchId;

	var MyUsername = MainData.GetUsername();

	// Random color
	if(Player.Color == "")
	{
		Item = UTILS_CreateElement("li",null,"random");
	}
	else
	{
		Item = UTILS_CreateElement("li",null,Player.Color);
	}

	if (Player.Name.length > 9)
	{
		PName = UTILS_CreateElement("p","name", null, UTILS_ShortString(Player.Name,6));
		PName.onmouseover = function() { INTERFACE_ShowFullName(this, Player.Name); }
		PName.onmouseout = function() { INTERFACE_CloseFullName(); }
	}
	else
	{
		PName = UTILS_CreateElement("p","name", null, Player.Name);
	}
	PTime = UTILS_CreateElement("p","time", null, Time+"\'");
	PTime.title = UTILS_GetText("challenge_time");
	PInc = UTILS_CreateElement("p","inc", null, Inc+"\"");
	PInc.title = UTILS_GetText("challenge_inc");


	/*// This feature is not implemented yet
	if(Private == false)
	{
		Private = UTILS_CreateElement("p","private","false");
	}
	else
	{
		Private = UTILS_CreateElement("p","private","true");
	}
	*/

	PPrivate = UTILS_CreateElement("p","private","false");
	PPrivate.title = UTILS_GetText("challenge_public");
	
	if(Rated == "false")
	{
		PRated = UTILS_CreateElement("p","rated","false","rating");
		PRated.title = UTILS_GetText("challenge_unrated");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated","true","rating");
		PRated.title = UTILS_GetText("challenge_rated");
	}

	if(Player.Name == MyUsername)
	{
		PButton = UTILS_CreateElement("p");
		Button = UTILS_CreateElement('span',"button","active",UTILS_GetText("window_cancel"));
		Button.onmouseover = function() { this.style.color = "#FFA200"; this.style.borderBottom = "1px solid #FFA200"; }
		Button.onmouseout = function() { this.style.color = "#216778"; this.style.borderBottom = "1px solid #216778"; }
		Button.onmousedown = function(){
			ANNOUNCE_CancelAnnounce(Id);
		}
		PButton.appendChild(Button);
	}
	else
	{
		PButton = UTILS_CreateElement("p");
		Button = UTILS_CreateElement('span',"button","active",UTILS_GetText("window_play"));
		Button.onmouseover = function() { this.style.color = "#FFA200"; this.style.borderBottom = "1px solid #FFA200"; }
		Button.onmouseout = function() { this.style.color = "#216778"; this.style.borderBottom = "1px solid #216778"; }
		Button.onmousedown = function(){
			ANNOUNCE_AcceptAnnounce(Id);
		}
		PButton.appendChild(Button);
	}

	Item.appendChild(PName);
	Item.appendChild(PTime);
	Item.appendChild(PInc);
	Item.appendChild(PRated);
	Item.appendChild(PPrivate);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = MatchId;

	this.AnnounceList.push(ItemObj);
	this.AnnounceUl.appendChild(Item);
	
	if(this.AnnounceList.length == 1)
	{
		this.hideNoAnnounce();
	}
}

/*
* @brief	Remove announce
*
* @param	MatchId		Match offer identification number
* @return	True if removed, false if not found
* @author	Rubens Suguimoto
*/
function INTERFACE_RemoveAnnounce(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.AnnounceList.length)&&(this.AnnounceList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.AnnounceList.length)
	{
		return false;
	}

	Item = this.AnnounceList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.AnnounceList.splice(i,1);

	if(this.AnnounceList.length == 0)
	{
		this.showNoAnnounce();
	}

	return true;
}


/*
* @brief	Add a postponed game
*
* @param	Oponent		Oponent player object
* @param	Category	Game category
* @param	Date		Postponed game date
* @param	PostponeId	Postpone identification number
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddPostpone(Oponent, Category, Date, PostponeId)
{
	var Item;
	var PName, PCategory, PDate, PButton, Button;
	var Id = PostponeId;
	var ItemObj = new Object();

	Item = UTILS_CreateElement("li",null,Oponent.Color);
	if (Oponent.Name.length > 9)
	{
		PName = UTILS_CreateElement("p","name", null, UTILS_ShortString(Oponent.Name,6));
		PName.onmouseover = function() { INTERFACE_ShowFullName(this, Oponent.Name); }
		PName.onmouseout = function() { INTERFACE_CloseFullName(); }
	}
	else
	{
		PName = UTILS_CreateElement("p","name", null, Oponent.Name);
	}
	PCategory = UTILS_CreateElement("p","category",null,Category);
	PDate = UTILS_CreateElement("p","date",null,Date);
	PButton = UTILS_CreateElement("p");
	Button = UTILS_CreateElement('span',"button","inactive",UTILS_GetText("window_continue"));
	Button.onmouseover = function() { this.className = "inactive"; }
	Button.onmouseout = function() { this.className = "inactive"; }
	Button.onmousedown = function() { return false; }
	PButton.appendChild(Button);

	/*
	PButton.onmousedown = function(){
		CHALLENGE_SendResumeGame(PostponeId);
	}
	*/

	Item.appendChild(PName);
	Item.appendChild(PCategory);
	Item.appendChild(PDate);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Button = Button;
	ItemObj.Id = Id;
	ItemObj.OponentName = Oponent.Name;
	ItemObj.OponentColor = Oponent.Color;

	this.PostponeList.push(ItemObj);
	this.PostponeUl.appendChild(Item);

	if(this.PostponeList.length == 1)
	{
		this.hideNoPostpone();
	}
}

/*
* @brief	Remove postponed game
*
* @param	PostponeId	Postponed game identification number
* @return	True if removed, false if not found
* @author	Rubens Suguimoto
*/
function INTERFACE_RemovePostpone(PostponeId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.PostponeList.length)&&(this.PostponeList[i].Id != PostponeId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.PostponeList.length)
	{
		return false;
	}

	Item = this.PostponeList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.PostponeList.splice(i,1);

	if(this.PostponeList.length <= 0)
	{
		this.showNoPostpone();
	}

	return true;
}

/*
* @brief	Update a postponed game status
*
* @param	OponentName	Oponent's name
* @param	OponentStatus	Oponent's presence status
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_UpdatePostpone(OponentName, OponentStatus)
{
	var i=0;
	var Item, Button;
	var ItemObj;
	var Id;

	for(i=0; i< this.PostponeList.length; i++)
	{
		if(this.PostponeList[i].OponentName == OponentName)
		{
			Item = this.PostponeList[i].Item;
			Button = this.PostponeList[i].Button;
			ItemObj = this.PostponeList[i];
			Id = parseInt(this.PostponeList[i].Id);

			if(OponentStatus == "offline")
			{
				Item.className = "offline";
				Button.className = "inactive";
				Button.onmouseover = function() { this.className = "inactive"; }
				Button.onmouseout = function() { this.className = "inactive"; }
				Button.onmousedown = function() { return false; }
			}
			else
			{
				//Item.className = ItemObj.OponentColor;
				Item.className = this.PostponeList[i].OponentColor;
				Button.className = "active";
				Button.onmouseover = function() { this.className = "over"; }
				Button.onmouseout = function() { this.className = "out"; }
				/*
				Button.onmousedown = function() {
					CHALLENGE_SendResumeGame(Id);
				}
				*/
				// This function is used because Id is the
				// same to all Postpone item when click to
				// resume
				INTERFACE_UpdatePostponeItem(Button,Id);
			}
		}
	}
}

/*
* @brief	Update a postpone game action button status
*
* @param	Button		HTML DOM button
* @param	AdjournId	Postponed game identification number
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_UpdatePostponeItem(Button, AdjournId)
{
	Button.onmousedown = function() {
		CHALLENGE_SendResumeGame(AdjournId);
	}	
}

/*
* @brief	Show challenge menu in interface
*
* @param	Left	Left position in pixels
* @param	Top	Top position in pixels
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowChallengeMenu(Left, Top)
{
	if(this.Menu.parentNode != document.body)
	{
		document.body.appendChild(this.Menu);
	}
	
	if((Left == null)|| (Top == null))
	{
		this.Menu.style.left = 0+"px";
		this.Menu.style.top = 0+"px";
	}
	else
	{
		this.Menu.style.left = Left+"px";
		// Quick fix for IE
		if (MainData.GetBrowser() == 0)
		{
			this.Menu.style.top = "80px";
		}
		else
		{
			this.Menu.style.top = Top+"px";
		}
	}

	this.Menu.style.display = "block";
	this.MenuVisible = true;
}

/*
* @brief	Show offered matches list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowMatchOfferList()
{
	this.MatchOfferUl.style.display = "block";
	this.MatchVisible = true;
}

/*
* @brief	Show announced games list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowAnnounceList()
{
	this.AnnounceUl.style.display = "block";
	this.AnnounceVisible = true;
}

/*
* @brief	Show postponed games list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowPostponeList()
{
	this.PostponeUl.style.display = "block";
	this.PostponeVisible = true;
}

/*
* @brief	Hide challenge menu
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideChallengeMenu()
{
	this.Menu.style.display = "none";
	this.MenuVisible = false;
}

/*
* @brief	Hide offered matches list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideMatchOfferList()
{
	this.MatchOfferUl.style.display = "none";
	this.MatchVisible = false;
}

/*
* @brief	Hide announced games list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideAnnounceList()
{
	this.AnnounceUl.style.display = "none";
	this.AnnounceVisible = false;
}

/*
* @brief	Hide postponed games list
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HidePostponeList()
{
	this.PostponeUl.style.display = "none";
	this.PostponeVisible = false;
}


/*
* @brief	Hide no offered matches
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowNoMatch()
{
	this.NoMatch.style.display = "block";
}

/*
* @brief	Hide no offered matches
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideNoMatch()
{
	this.NoMatch.style.display = "none";
}

/*
* @brief	Show no announced games
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowNoAnnounce()
{
	this.NoAnnounce.style.display = "block"; 
}

/*
* @brief	Hide no announced games
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideNoAnnounce()
{
	this.NoAnnounce.style.display = "none"; 
}

/*
* @brief	Show no postponed games
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowNoPostpone()
{
	this.NoPostpone.style.display = "block";
}

/*
* @brief	Hide no postoned games
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideNoPostpone()
{
	this.NoPostpone.style.display = "none";
}

/*
* @brief	Show loading announces
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowLoadingAnnounce()
{
	this.LoadingAnnounce.style.display = "block";
}

/*
* @brief	Hide loading announces
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideLoadingAnnounce()
{
	this.LoadingAnnounce.style.display = "none";
}
