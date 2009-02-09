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
* @file admincenter.js
* @brief 
*
* Create window content object to admin tools
*/

/**
 * @brief Create admin center window
 *
 * Create temporary admin tools window content.
 *
 * @author 	Rubens Suguimoto
 * @see 	WINDOW_CreateAdminCenter()
 */
function INTERFACE_ShowCreateAdminCenterWindow()
{
	var Div;
	var Buttons = new Array();
	var Elements = new Object();
	
	var ACenterObj = MainData.GetAdmincenter();

	var Input;

	var ButtonsDiv;
	var CloseButton;


	Div = UTILS_CreateElement("div","AdminCenterWindowDiv");
	
	ButtonsDiv = UTILS_CreateElement("div","ButtonsDiv");

	CloseButton = UTILS_CreateElement("input",null,"button");
	CloseButton.type = "button";
	CloseButton.value= "Fechar";

	Buttons.push(CloseButton);

	ButtonsDiv.appendChild(CloseButton);

	// Show admin center object
	ACenterObj.show(Div);

	Div.appendChild(ButtonsDiv);

	Elements.CloseButton = CloseButton;

	return{Div:Div, Buttons:Buttons, Elements:Elements}

}

function AdminCenterObj()
{
	var AdminCenter = INTERFACE_CreateAdminCenter();

	this.AdminCenterDiv = AdminCenter.AdminCenter;

	this.PunishButton  = AdminCenter.PunishButton;
	this.LevelButton  = AdminCenter.PostponeButton;
	this.AdminLevelButton= AdminCenter.MatchOfferButton;
	this.AdjournButton   = AdminCenter.TourneyButton;
	this.WordsButton= AdminCenter.AdjournButton; 

	this.AdminCenterVisible = false;

	// Attributes	
	this.Punish = new PunishObj;
	this.AdminLevel = new AdminLevelObj;
	this.Level = new LevelObj;
	this.Adjourn = new AdjournObj;
	this.Words = new WordsObj;;

	this.CurrentDiv = this.Punish;

	// Methods
	this.show = INTERFACE_ShowAdminCenter;
	this.hide = INTERFACE_HideAdminCenter;

	//Actions
	this.Punish.show(this.AdminCenterDiv);
}



function INTERFACE_ShowAdminCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.AdminCenterDiv);
	}
	else
	{
		document.body.appendChild(this.AdminCenterDiv);
	}
	
	this.AdminCenterDiv.style.display = "block";
	this.AdminCenterDivVisible = true;
}

function INTERFACE_HideAdminCenter()
{
	this.AdminCenterDiv.style.display = "none";
	this.AdminCenterDivVisible = false;
}


function INTERFACE_CreateAdminCenter()
{
	var Main = UTILS_CreateElement("div","AdminCenter");

	var MenuDiv = UTILS_CreateElement("div","MenuDiv");
	var MenuList = UTILS_CreateElement("ul","MenuList");

	var MainCenter = UTILS_CreateElement("div", "Center");

	var PunishButton = UTILS_CreateElement("li","punish",null,UTILS_GetText("admincenter_punish_button"));
	var LevelButton = UTILS_CreateElement("li","level",null,UTILS_GetText("admincenter_level_button"));
	var AdminLvlButton = UTILS_CreateElement("li","adminlvl",null,UTILS_GetText("admincenter_adminlevel_button"));
	var AdjournButton = UTILS_CreateElement("li","adjourn",null,UTILS_GetText("admincenter_adjourn_button"));
	var WordsButton = UTILS_CreateElement("li","words",null,UTILS_GetText("admincenter_words_button"));

	PunishButton.onclick = function(){
		ADMINCENTER_ShowPunish();
	}
	AdminLvlButton.onclick = function(){
		ADMINCENTER_ShowAdminLevel();
	}
	LevelButton.onclick = function(){
		ADMINCENTER_ShowLevel();
	}
	AdjournButton.onclick = function(){
		ADMINCENTER_ShowAdjourn();
	}
	WordsButton.onclick = function(){
		ADMINCENTER_ShowWords();
		ADMINCENTER_ClearBannedWordsList();
		ADMIN_GetBannedWords();
	}

	MenuList.appendChild(PunishButton);
	MenuList.appendChild(AdminLvlButton);
	MenuList.appendChild(LevelButton);
	MenuList.appendChild(AdjournButton);
	MenuList.appendChild(WordsButton);

	MenuDiv.appendChild(MenuList);

	Main.appendChild(MenuDiv);
	Main.appendChild(MainCenter);


	return {AdminCenter:Main, Center:MainCenter}
}


/*******************************************/
/*ADMIN CENTER PUNISH OBJECT*/
/*******************************************/
function PunishObj()
{
	var Punish = INTERFACE_CreateAdminCenterPunish();

	// Attributes	
	this.PunishDiv = Punish.Center;
	this.PunishUl = Punish.PunishList;
	this.NoPunish = Punish.NoPunish; 

	this.PunishVisible = false;
	this.PunishList = new Array();

	// Methods
	this.add = INTERFACE_AddPunish;
	this.remove= INTERFACE_RemovePunish;

	this.showNoPunish = INTERFACE_ShowNoPunish;
	this.hideNoPunish = INTERFACE_HideNoPunish;

	this.show= INTERFACE_ShowPunishCenter;
	this.hide= INTERFACE_HidePunishCenter;
}


function INTERFACE_AddPunish(Name, Punish, Incident, Date, Period, Reason)
{
	var Item;
	var ItemObj = new Object();
	
	var PPunish, PInc, PDate, PPeriod, PReason;

	Item = UTILS_CreateElement("li");

	// Random color

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Name, 10));
	PPunish = UTILS_CreateElement("p","punish", null, Punish);
	PInc = UTILS_CreateElement("p","incidence", null, Incident);
	PDate = UTILS_CreateElement("p","date", null, Date);
	PPeriod = UTILS_CreateElement("p","period", null, Period);
	PReason = UTILS_CreateElement("p","reason", null, Reason);


/*
	// This feature is not implemented yet
	if(Private == false)
	{
		PPrivate = UTILS_CreateElement("p","private","false");
		PPrivate.title = "Publico";
	}
	else
	{
		PPrivate = UTILS_CreateElement("p","private","true");
		PPrivate.title = "Privado";
	}
	*/
/*
	if(Player.Name == MainData.Username)
	{
		PButton = UTILS_CreateElement("p","button","decline");
		PButton.onclick = function(){
			ANNOUNCE_RemovePunish(Id);
		}
	}
	else
	{
		PButton = UTILS_CreateElement("p","button","accept");
		PButton.onclick = function(){
			ANNOUNCE_AcceptPunish(Id);
		}
	}
*/
	PButton = UTILS_CreateElement("p","action","accept",UTILS_GetText("admincenter_acquit"));


	Item.appendChild(PName);
	Item.appendChild(PPunish);
	Item.appendChild(PInc);
	Item.appendChild(PDate)
	Item.appendChild(PPeriod);
	Item.appendChild(PReason);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = Name;

	this.PunishList.push(ItemObj);
	this.PunishUl.appendChild(Item);

	if(this.PunishList.length == 1)
	{
		this.hideNoPunish();
	}
}

function INTERFACE_RemovePunish(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.PunishList.length)&&(this.PunishList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.PunishList.length)
	{
		return false;
	}

	Item = this.PunishList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.PunishList.splice(i,1);

	if(this.PunishList.length == 0)
	{
		this.showNoPunish();
	}

	return true;
}

function INTERFACE_ShowPunishCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.PunishDiv);
	}

	this.PunishDiv.style.display = "block";
	this.PunishVisible = true;
}


function INTERFACE_HidePunishCenter()
{
	this.PunishDiv.style.display = "none";
	this.PunishVisible = false;
}

function INTERFACE_ShowNoPunish()
{
	this.NoPunish.style.display = "block"; 
}

function INTERFACE_HideNoPunish()
{
	this.NoPunish.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateAdminCenterPunish()
{
	var Center = UTILS_CreateElement("div", "CenterPunish");
	var CenterResult = UTILS_CreateElement("div", "CenterAdminResult");


	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var PunishedPlayer = UTILS_CreateElement("p","player",null,UTILS_GetText("admincenter_name"));
	var Punish = UTILS_CreateElement("p","punish",null,UTILS_GetText("admincenter_punish"));
	var Inc = UTILS_CreateElement("p","incidence",null,UTILS_GetText("admincenter_incident"));
	var Date = UTILS_CreateElement("p","date",null,UTILS_GetText("admincenter_date"));
	var Period = UTILS_CreateElement("p","period",null,UTILS_GetText("admincenter_period"));
	var Reason = UTILS_CreateElement("p","reason",null,UTILS_GetText("admincenter_reason"));


	// No Punish element
	var NoPunish = UTILS_CreateElement("p",null,null, UTILS_GetText("admincenter_no_punish"));
	

	ListResultHeader.appendChild(PunishedPlayer);
	ListResultHeader.appendChild(Punish);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Date);
	ListResultHeader.appendChild(Period);
	ListResultHeader.appendChild(Reason);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoPunish);

	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterResult);

	return {Center:Center, PunishList:ListResult, NoPunish:NoPunish};
}



/*******************************************/
/*ADMIN CENTER ADMINLEVEL OBJECT*/
/*******************************************/
function AdminLevelObj()
{
	var AdminLevel = INTERFACE_CreateAdminCenterAdminLevel();

	// Attributes	
	this.AdminLevelDiv = AdminLevel.Center;
	this.AdminLevelUl = AdminLevel.AdminLevelList;
	this.NoAdminLevel = AdminLevel.NoAdminLevel; 

	this.AdminLevelVisible = false;
	this.AdminLevelList = new Array();

	// Methods
	this.add = INTERFACE_AddAdminLevel;
	this.remove= INTERFACE_RemoveAdminLevel;

	this.showNoAdminLevel = INTERFACE_ShowNoAdminLevel;
	this.hideNoAdminLevel = INTERFACE_HideNoAdminLevel;

	this.show= INTERFACE_ShowAdminLevelCenter;
	this.hide= INTERFACE_HideAdminLevelCenter;
}


function INTERFACE_AddAdminLevel(Name, AdminLevel)
{
	var Item;
	var ItemObj = new Object();
	
	var PAdminLevel, PName;

	Item = UTILS_CreateElement("li");

	// Random color

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Name, 10));
	PAdminLevel = UTILS_CreateElement("p","level", null, AdminLevel);

	PButton = UTILS_CreateElement("p","action","accept",UTILS_GetText("admincenter_edit"));


	Item.appendChild(PName);
	Item.appendChild(PAdminLevel);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = Name;

	this.AdminLevelList.push(ItemObj);
	this.AdminLevelUl.appendChild(Item);

	if(this.AdminLevelList.length == 1)
	{
		this.hideNoAdminLevel();
	}
}

function INTERFACE_RemoveAdminLevel(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.AdminLevelList.length)&&(this.AdminLevelList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.AdminLevelList.length)
	{
		return false;
	}

	Item = this.AdminLevelList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.AdminLevelList.splice(i,1);

	if(this.AdminLevelList.length == 0)
	{
		this.showNoAdminLevel();
	}

	return true;
}

function INTERFACE_ShowAdminLevelCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.AdminLevelDiv);
	}

	this.AdminLevelDiv.style.display = "block";
	this.AdminLevelVisible = true;
}


function INTERFACE_HideAdminLevelCenter()
{
	this.AdminLevelDiv.style.display = "none";
	this.AdminLevelVisible = false;
}

function INTERFACE_ShowNoAdminLevel()
{
	this.NoAdminLevel.style.display = "block"; 
}

function INTERFACE_HideNoAdminLevel()
{
	this.NoAdminLevel.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateAdminCenterAdminLevel()
{
	var Center = UTILS_CreateElement("div", "CenterAdminLevel");
	var CenterResult = UTILS_CreateElement("div", "CenterAdminResult");


	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var Player = UTILS_CreateElement("p","player",null,UTILS_GetText("admincenter_name"));
	var AdminLevel = UTILS_CreateElement("p","level",null,UTILS_GetText("admincenter_adminlevel"));

	// No AdminLevel element
	var NoAdminLevel = UTILS_CreateElement("p",null,null, UTILS_GetText("admincenter_no_adminlevel"));
	

	ListResultHeader.appendChild(Player);
	ListResultHeader.appendChild(AdminLevel);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoAdminLevel);

	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterResult);

	return {Center:Center, AdminLevelList:ListResult, NoAdminLevel:NoAdminLevel};
}

/*******************************************/
/*ADMIN CENTER LEVEL OBJECT*/
/*******************************************/
function LevelObj()
{
	var Level = INTERFACE_CreateAdminCenterLevel();

	// Attributes	
	this.LevelDiv = Level.Center;
	this.LevelUl = Level.LevelList;
	this.NoLevel = Level.NoLevel; 

	this.LevelVisible = false;
	this.LevelList = new Array();

	// Methods
	this.add = INTERFACE_AddLevel;
	this.remove= INTERFACE_RemoveLevel;

	this.showNoLevel = INTERFACE_ShowNoLevel;
	this.hideNoLevel = INTERFACE_HideNoLevel;

	this.show= INTERFACE_ShowLevelCenter;
	this.hide= INTERFACE_HideLevelCenter;
}


function INTERFACE_AddLevel(Name, Level)
{
	var Item;
	var ItemObj = new Object();
	
	var PLevel, PName;

	Item = UTILS_CreateElement("li");

	// Random color

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Name, 10));
	PLevel = UTILS_CreateElement("p","level", null, Level);


	PButton = UTILS_CreateElement("p","action","accept",UTILS_GetText("admincenter_edit"));


	Item.appendChild(PName);
	Item.appendChild(PLevel);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = Name;

	this.LevelList.push(ItemObj);
	this.LevelUl.appendChild(Item);

	if(this.LevelList.length == 1)
	{
		this.hideNoLevel();
	}
}

function INTERFACE_RemoveLevel(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.LevelList.length)&&(this.LevelList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.LevelList.length)
	{
		return false;
	}

	Item = this.LevelList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.LevelList.splice(i,1);

	if(this.LevelList.length == 0)
	{
		this.showNoLevel();
	}

	return true;
}

function INTERFACE_ShowLevelCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.LevelDiv);
	}

	this.LevelDiv.style.display = "block";
	this.LevelVisible = true;
}


function INTERFACE_HideLevelCenter()
{
	this.LevelDiv.style.display = "none";
	this.LevelVisible = false;
}

function INTERFACE_ShowNoLevel()
{
	this.NoLevel.style.display = "block"; 
}

function INTERFACE_HideNoLevel()
{
	this.NoLevel.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateAdminCenterLevel()
{
	var Center = UTILS_CreateElement("div", "CenterLevel");
	var CenterResult = UTILS_CreateElement("div", "CenterAdminResult");


	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var Player = UTILS_CreateElement("p","player",null,UTILS_GetText("admincenter_name"));
	var Level = UTILS_CreateElement("p","level",null,UTILS_GetText("admincenter_level"));

	// No Level element
	var NoLevel = UTILS_CreateElement("p",null,null, UTILS_GetText("admincenter_no_level"));
	

	ListResultHeader.appendChild(Player);
	ListResultHeader.appendChild(Level);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoLevel);

	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterResult);

	return {Center:Center, LevelList:ListResult, NoLevel:NoLevel};
}

/*******************************************/
/*ADMIN CENTER ADJOURN OBJECT*/
/*******************************************/
function AdjournObj()
{
	var Adjourn = INTERFACE_CreateAdminCenterAdjourn();

	// Attributes
	this.AdjournDiv = Adjourn.Center
	this.AdjournUl = Adjourn.AdjournList;
	this.NoAdjourn = Adjourn.NoAdjourn;
	this.AdjournVisible = false;
	this.AdjournList = new Array();

	this.add = INTERFACE_AddAdjourn;
	this.remove = INTERFACE_RemoveAdjourn;

	this.showNoAdjourn = INTERFACE_ShowNoAdjourn;
	this.hideNoAdjourn = INTERFACE_HideNoAdjourn;
	this.show = INTERFACE_ShowAdjournCenter;
	this.hide = INTERFACE_HideAdjournCenter;

}


function INTERFACE_AddAdjourn(WPlayerName, WRating, BPlayerName, BRating, Category, GameTime, Inc, Rated, AdjournId)
{
	var Item = UTILS_CreateElement("li");
	var GameCategory, GameTime, GameInc, GameMoves;
	var PRated;
	var Button;

	var Id = AdjournId;
	var ItemObj = new Object();


	var PW = UTILS_CreateElement("p","player","white",WRating+" - "+UTILS_ShortString(WPlayerName,10));
	var PB = UTILS_CreateElement("p","player","black",UTILS_ShortString(BPlayerName,10)+" - "+BRating);
	Category = UTILS_CreateElement("p","category",null,Category);
	GameTime = UTILS_CreateElement("p","time",null,(GameTime/60)+"\"");
	GameInc = UTILS_CreateElement("p","inc",null,Inc);

	Button = UTILS_CreateElement("p","action","inative", UTILS_GetText("admincenter_observer"));

	if(Rated == "true")
	{
		PRated = UTILS_CreateElement("p","rated",null,null);
		PRated.title = UTILS_GetText("admincenter_rated");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated","disable",null);
		PRated.title = UTILS_GetText("admincenter_not_rated");
	}

	/*
	PButton.onclick = function(){
		CHALLENGE_SendResumeGame(AdjournId);
	}
	*/

	Item.appendChild(PW);
	Item.appendChild(PB);
	Item.appendChild(Category);
	Item.appendChild(GameTime);
	Item.appendChild(GameInc);
	Item.appendChild(PRated);

	Item.appendChild(Button);

	ItemObj.Item = Item;
	ItemObj.Button = Button;
	ItemObj.Id = Id;
	ItemObj.PWName = WPlayerName;
	ItemObj.PWColor = "white";
	ItemObj.PBName = BPlayerName;
	ItemObj.PBColor = "black";

	this.AdjournList.push(ItemObj);
	this.AdjournUl.appendChild(Item);

	if(this.AdjournList.length == 1)
	{
		this.hideNoAdjourn();
	}
}

function INTERFACE_RemoveAdjourn(AdjournId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.AdjournList.length)&&(this.AdjournList[i].Id != AdjournId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.AdjournList.length)
	{
		return false;
	}

	Item = this.AdjournList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.AdjournList.splice(i,1);

	if(this.AdjournList.length <= 0)
	{
		this.showNoAdjourn();
	}

	return true;
}


function INTERFACE_ShowAdjournCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.AdjournDiv);
	}
	else
	{
		document.body.appendChild(this.AdjournDiv);
	}
	this.AdjournDiv.style.display = "block";
	this.AdjournVisible = true;
}

function INTERFACE_HideAdjournCenter()
{
	this.AdjournDiv.style.display = "none";
	this.AdjournVisible = false;
}

function INTERFACE_ShowNoAdjourn()
{
	this.NoAdjourn.style.display = "block";
}

function INTERFACE_HideNoAdjourn()
{
	this.NoAdjourn.style.display = "none";
}


/*************************************************/

function INTERFACE_CreateAdminCenterAdjourn()
{
	var Center = UTILS_CreateElement("div", "CenterAdjourn");
	var CenterResult = UTILS_CreateElement("div", "CenterAdminResult");

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	var WRating = UTILS_CreateElement("p","wrating",null,UTILS_GetText("admincenter_rating"));
	var WPiece = UTILS_CreateElement("img","wpiece");

	var VS = UTILS_CreateElement("p","vs",null,"X");
	
	var BRating = UTILS_CreateElement("p","brating",null,UTILS_GetText("admincenter_rating"));
	var BPiece = UTILS_CreateElement("img","bpiece");

	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("admincenter_category"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("admincenter_time"));
	var Inc = UTILS_CreateElement("p","Inc",null,UTILS_GetText("admincenter_increment"));
	var Rated = UTILS_CreateElement("p","rated",null,UTILS_GetText("admincenter_rated_header"));

//	var Action = UTILS_CreateElement("p","action",null,"Observar");


	// No Announce element
	var NoResult = UTILS_CreateElement("p",null,null, UTILS_GetText("admincenter_no_adjourn"));

	WPiece.src = "./images/challenge_menu/white_enable.png";
	BPiece.src = "./images/challenge_menu/black_enable.png";
	
	ListResultHeader.appendChild(WRating);
	ListResultHeader.appendChild(WPiece);
	ListResultHeader.appendChild(VS);
	ListResultHeader.appendChild(BPiece);
	ListResultHeader.appendChild(BRating);

	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Rated);
//	ListResultHeader.appendChild(Action);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoResult);

	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterResult);

	return {Center:Center, AdjournList:ListResult, NoAdjourn:NoResult};
}

/*******************************************/
/*ADMIN CENTER WORDS OBJECT*/
/*******************************************/
function WordsObj()
{
	var Words = INTERFACE_CreateAdminCenterWords();

	// Attributes	
	this.WordsDiv = Words.Center;
	this.WordsUl = Words.WordsList;
	this.NoWords = Words.NoWords; 

	this.WordsVisible = false;
	this.WordsList = new Array();

	// Methods
	this.add = INTERFACE_AddWords;
	this.remove= INTERFACE_RemoveWords;

	this.showNoWords = INTERFACE_ShowNoWords;
	this.hideNoWords = INTERFACE_HideNoWords;

	this.show= INTERFACE_ShowWordsCenter;
	this.hide= INTERFACE_HideWordsCenter;
}


function INTERFACE_AddWords(Word)
{
	var Item;
	var ItemObj = new Object();
	
	var PWord;

	Item = UTILS_CreateElement("li");

	// Random color

	PWord = UTILS_CreateElement("p","word", null, Word);

	PButton = UTILS_CreateElement("p","action",null,UTILS_GetText("admincenter_remove_word"));

	PButton.onclick = function(){
		ADMIN_RemoveBannedWord(Word);
	}

	Item.appendChild(PWord);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = Word;

	this.WordsList.push(ItemObj);
	this.WordsUl.appendChild(Item);

	if(this.WordsList.length == 1)
	{
		this.hideNoWords();
	}
}

function INTERFACE_RemoveWords(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.WordsList.length)&&(this.WordsList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.WordsList.length)
	{
		return false;
	}

	Item = this.WordsList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.WordsList.splice(i,1);

	if(this.WordsList.length == 0)
	{
		this.showNoWords();
	}

	return true;
}

function INTERFACE_ShowWordsCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.WordsDiv);
	}

	this.WordsDiv.style.display = "block";
	this.WordsVisible = true;
}


function INTERFACE_HideWordsCenter()
{
	this.WordsDiv.style.display = "none";
	this.WordsVisible = false;
}

function INTERFACE_ShowNoWords()
{
	this.NoWords.style.display = "block"; 
}

function INTERFACE_HideNoWords()
{
	this.NoWords.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateAdminCenterWords()
{
	var Center = UTILS_CreateElement("div", "CenterWords");
	var CenterResult = UTILS_CreateElement("div", "CenterResultWords");

	var InputDiv = UTILS_CreateElement("div", "InputDiv");
	var InputLabel = UTILS_CreateElement("p","InputLabel",null,UTILS_GetText("admincenter_word"));
	var InputBox = UTILS_CreateElement("input","InputBox");
	var InputButton = UTILS_CreateElement("div","InputButton",null,UTILS_GetText("admincenter_add_word"));

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var Words = UTILS_CreateElement("p","words",null,UTILS_GetText("admincenter_banned_words"));

	// No Words element
	var NoWords = UTILS_CreateElement("p",null,null, UTILS_GetText("admincenter_no_banned_words"));
	

	InputButton.onclick = function() {
		ADMIN_BanWord(InputBox.value);
	}

	InputDiv.appendChild(InputLabel);
	InputDiv.appendChild(InputBox);
	InputDiv.appendChild(InputButton);

	ListResultHeader.appendChild(Words);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoWords);

	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(InputDiv);
	Center.appendChild(CenterResult);

	return {Center:Center, WordsList:ListResult, NoWords:NoWords};
}


