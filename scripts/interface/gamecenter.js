function GameCenterObj()
{
	var GameCenter = INTERFACE_CreateGameCenter();

	this.GameCenterDiv = GameCenter.GameCenter;

	this.AnnounceButton  = GameCenter.AnnounceButton;
	this.PostponeButton  = GameCenter.PostponeButton;
	this.MatchOfferButton= GameCenter.MatchOfferButton;
	this.TourneyButton   = GameCenter.TourneyButton;
	this.CurrentGameButton= GameCenter.CurrentGamesButton; 

	this.GameCenterVisible = false;

	// Attributes	
	this.Announce = new AnnounceObj;
	this.Postpone = new PostponeObj;
	this.MatchOffer = new MatchOfferObj;
	this.Tourney = null;
	this.CurrentGames = new CurrentGamesObj;;


	this.CurrentDiv = this.Announce;
	// Methods
	this.show = INTERFACE_ShowGameCenter;
	this.hide = INTERFACE_HideGameCenter;

	//Actions
	this.Announce.show(this.GameCenterDiv);
}



function INTERFACE_ShowGameCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.GameCenterDiv);
	}
	else
	{
		document.body.appendChild(this.GameCenterDiv);
	}
	
	this.GameCenterDiv.style.display = "block";
	this.GameCenterDivVisible = true;
}

function INTERFACE_HideGameCenter()
{
	this.GameCenterDiv.style.display = "none";
	this.GameCenterDivVisible = false;
}


function INTERFACE_CreateGameCenter()
{
	var Main = UTILS_CreateElement("div","GameCenter");

	var MenuDiv = UTILS_CreateElement("div","MenuDiv");
	var MenuList = UTILS_CreateElement("ul","MenuList");

	var MainCenter = UTILS_CreateElement("div");

	var AnnounceButton = UTILS_CreateElement("li","announce",null,UTILS_GetText("gamecenter_announce_title"));
	var PostponeButton = UTILS_CreateElement("li","postpone",null,UTILS_GetText("gamecenter_postpone_title"));
	var MatchOfferButton = UTILS_CreateElement("li","challenge",null,UTILS_GetText("gamecenter_match_title"));
	var TourneyButton = UTILS_CreateElement("li","tourney","disable",UTILS_GetText("gamecenter_tourneys_title"));
	var CurrentGamesButton = UTILS_CreateElement("li","current_games",null,UTILS_GetText("gamecenter_current_games_title"));

	AnnounceButton.onclick = function(){
		GAMECENTER_ShowAnnounce();
	}
	PostponeButton.onclick = function(){
		GAMECENTER_ShowPostpone();
	}
	MatchOfferButton.onclick = function(){
		GAMECENTER_ShowMatchOffer();
	}
	/*
	TourneyButton.onclick = function(){
		GAMECENTER_ShowTourney();
	}
	*/
	CurrentGamesButton.onclick = function(){
		GAMECENTER_ShowCurrentGames();
	}

	MenuList.appendChild(AnnounceButton);
	MenuList.appendChild(TourneyButton);
	MenuList.appendChild(CurrentGamesButton);
	MenuList.appendChild(PostponeButton);
	MenuList.appendChild(MatchOfferButton);

	MenuDiv.appendChild(MenuList);

	Main.appendChild(MenuDiv);
	Main.appendChild(MainCenter);


	return {GameCenter:Main, Center:MainCenter}
}

/*******************************************/
/*GAME CENTER ANNOUNCE OBJECT*/
/*******************************************/
function AnnounceObj()
{
	var Announce = INTERFACE_CreateGameCenterAnnounce();

	// Attributes	
	this.AnnounceDiv = Announce.Center;
	this.AnnounceUl = Announce.AnnounceList;
	this.NoAnnounce = Announce.NoAnnounce; 

	this.AnnounceVisible = false;
	this.AnnounceList = new Array();

	// Methods
	this.add = INTERFACE_AddAnnounce;
	this.remove= INTERFACE_RemoveAnnounce;

	this.showNoAnnounce = INTERFACE_ShowNoAnnounce;
	this.hideNoAnnounce = INTERFACE_HideNoAnnounce;

	this.show= INTERFACE_ShowAnnounceCenter;
	this.hide= INTERFACE_HideAnnounceCenter;
}


function INTERFACE_AddAnnounce(Player, Rating, Time, Inc, Category, Rated, Private, MatchId)
{
	var Item;

	var PPieceColor;
	var PName, PTime, PInc, PCategory, PRated, PPrivate, PButton;
	var PRating, PAbusive;
	var ItemObj = new Object();
	var Id = MatchId;

	Item = UTILS_CreateElement("li");

	// Random color
	PPieceColor = UTILS_CreateElement("img");

	if(Player.Color == "")	
	{
		PPieceColor.src = "images/challenge_menu/random.png";
	}
	else
	{
		PPieceColor.src = "images/challenge_menu/"+Player.Color+"_enable.png";
	}

	if(Player.Abusive == "true")
	{
		PAbusive = UTILS_CreateElement("p","abusive", null, null);
	}
	else
	{
		PAbusive = UTILS_CreateElement("p","abusive", "disable", null);
	}

	PAbusive.title = UTILS_GetText("gamecenter_abusive");

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Player.Name, 10));
	PRating = UTILS_CreateElement("p","rating", null, Rating);
	PTime = UTILS_CreateElement("p","time", null, Time+"\"");
	PInc = UTILS_CreateElement("p","inc", null, Inc+"\'");
	PCategory = UTILS_CreateElement("p","category", null, Category);

	/*// This feature is not implemented yet
	if(Private == false)
	{
		PPrivate = UTILS_CreateElement("p","private","false");
		PPrivate.title = UTILS_GetText("gamecenter_public");
	}
	else
	{
		PPrivate = UTILS_CreateElement("p","private","true");
		PPrivate.title = UTILS_GetText("gamecenter_private");
	}
	*/

	PPrivate = UTILS_CreateElement("p","private","disable", null);
	PPrivate.title = UTILS_GetText("gamecenter_public");
	
	if(Rated == "false")
	{
		PRated = UTILS_CreateElement("p","rated","disable", null);
		PRated.title = UTILS_GetText("gamecenter_not_rated_game");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated",null, null);
		PRated.title = UTILS_GetText("gamecenter_rated_game");
	}

	if(Player.Name == MainData.GetUsername())
	{
		PButton = UTILS_CreateElement("p","button","decline",UTILS_GetText("window_cancel"));
		PButton.onclick = function(){
			//ANNOUNCE_RemoveAnnounce(Id);
			ANNOUNCE_CancelAnnounce(Id);
		}
	}
	else
	{
		PButton = UTILS_CreateElement("p","button","accept",UTILS_GetText("window_play"));
		PButton.onclick = function(){
			ANNOUNCE_AcceptAnnounce(Id);
		}
	}


	Item.appendChild(PPieceColor);
	Item.appendChild(PName);
	Item.appendChild(PAbusive);
	Item.appendChild(PRating);
	Item.appendChild(PCategory)
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

function INTERFACE_ShowAnnounceCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.AnnounceDiv);
	}

	this.AnnounceDiv.style.display = "block";
	this.AnnounceVisible = true;
}


function INTERFACE_HideAnnounceCenter()
{
	this.AnnounceDiv.style.display = "none";
	this.AnnounceVisible = false;
}

function INTERFACE_ShowNoAnnounce()
{
	this.NoAnnounce.style.display = "block"; 
}

function INTERFACE_HideNoAnnounce()
{
	this.NoAnnounce.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateGameCenterAnnounce()
{
	var Center = UTILS_CreateElement("div", "CenterAnnounce");
	var CenterOptions = UTILS_CreateElement("div", "CenterOptions");
	var CenterResult = UTILS_CreateElement("div", "CenterResult");

	var ListOptions = UTILS_CreateElement("ul","ListOptions");

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var AnnouncePlayer = UTILS_CreateElement("p","player",null,UTILS_GetText("gamecenter_announcer"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("gamecenter_time"));
	var Inc = UTILS_CreateElement("p","inc",null,UTILS_GetText("gamecenter_inc"));
	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("gamecenter_category"));
	var Rating = UTILS_CreateElement("p","rating",null,UTILS_GetText("gamecenter_rating"));
	var Rated = UTILS_CreateElement("p","rated",null,UTILS_GetText("gamecenter_rated"));
	var Private = UTILS_CreateElement("p","private",null,UTILS_GetText("gamecenter_privacity"));
//	var Action = UTILS_CreateElement("p","action",null,"Acao");


	// Options list
	var AcceptRandom = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_play_now"));
	var AnnounceMatch = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_announce_match"));
//	var SeeGraphic = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_see_graphic"));
	var UpdateAnnounce = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_update"));

	// No Announce element
	var NoAnnounce = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_announce"));

	AcceptRandom.onclick = function(){
		ANNOUNCE_AcceptRandomAnnounce();
	}

	AnnounceMatch.onclick = function(){
		WINDOW_AnnounceWindow();
	}

	UpdateAnnounce.onclick = function(){
		var Offset = 0;
		var MaxAnnounce = 10;
		var MaxTime = "", MinTime = "";
		var Category = ""; //All category

		//Clear announces
		ANNOUNCE_ClearAnnounce();		

		//Get your announces and announce from others users
		CONNECTION_SendJabber(MESSAGE_GetAnnounceMatch(Offset, MaxAnnounce, MinTime, MaxTime, Category, true),MESSAGE_GetAnnounceMatch(Offset, MaxAnnounce, MinTime, MaxTime, Category, false));
	}
	
	//Disable see graphic option
	//SeeGraphic.className = "disable";
	
	ListOptions.appendChild(AcceptRandom);
	ListOptions.appendChild(AnnounceMatch);
//	ListOptions.appendChild(SeeGraphic);
	ListOptions.appendChild(UpdateAnnounce);

//	ListResultHeader.appendChild(PieceColor);
	ListResultHeader.appendChild(AnnouncePlayer);
	ListResultHeader.appendChild(Rating);
	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Rated);
	ListResultHeader.appendChild(Private);
//	ListResultHeader.appendChild(Action);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoAnnounce);

	CenterOptions.appendChild(ListOptions);
	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterOptions);
	Center.appendChild(CenterResult);

	return {Center:Center, AnnounceList:ListResult, NoAnnounce:NoAnnounce};
}

/*******************************************/
/*GAME CENTER MATCHOFFER OBJECT*/
/*******************************************/
function MatchOfferObj()
{
	var Match = INTERFACE_CreateGameCenterMatch();

	// Attributes	
	this.MatchDiv = Match.Center;
	this.MatchUl = Match.MatchList;
	this.NoMatch = Match.NoMatch; 

	this.MatchVisible = false;
	this.MatchList = new Array();

	// Methods
	this.add = INTERFACE_AddMatchOffer;
	this.remove= INTERFACE_RemoveMatchOffer;

	this.showNoMatch = INTERFACE_ShowNoMatch;
	this.hideNoMatch = INTERFACE_HideNoMatch;

	this.show= INTERFACE_ShowMatchCenter;
	this.hide= INTERFACE_HideMatchCenter;
}


function INTERFACE_AddMatchOffer(Player, Time, Inc, Category, Rated, Private, MatchId)
{
	var Item;

	var PPieceColor;
	var PName, PTime, PInc, PCategory, PRated, PPrivate, PButton;
	var PAbusive;
	var ItemObj = new Object();
	var Id = MatchId;

	Item = UTILS_CreateElement("li");

	// Random color
	PPieceColor = UTILS_CreateElement("img");

	if(Player.Color == "")	
	{
		PPieceColor.src = "images/challenge_menu/random.png";
	}
	else
	{
		PPieceColor.src = "images/challenge_menu/"+Player.Color+"_enable.png";
	}

	if(Player.Abusive == "true")
	{
		PAbusive = UTILS_CreateElement("p","abusive", null, null);
	}
	else
	{
		PAbusive = UTILS_CreateElement("p","abusive", "disable", null);
	}

	PAbusive.title = UTILS_GetText("gamecenter_abusive");

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Player.Name,10));
	PTime = UTILS_CreateElement("p","time", null, Time+"\'");
	PInc = UTILS_CreateElement("p","inc", null, Inc+"\"");
	PCategory = UTILS_CreateElement("p","category", null, Category);

	/*// This feature is not implemented yet
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

	PPrivate = UTILS_CreateElement("p","private","disable",null);
	PPrivate.title = UTILS_GetText("gamecenter_public");
	
	if(Rated == false)
	{
		PRated = UTILS_CreateElement("p","rated","disable",null);
		PRated.title = UTILS_GetText("gamecenter_rated_game");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated",null, null);
		PRated.title = UTILS_GetText("gamecenter_not_rated_game");
	}

	PButton = UTILS_CreateElement("p","action","accept",UTILS_GetText("window_cancel"));
	
	PButton.onclick = function(){
		CHALLENGE_DeclineChallenge(Id);
	}

	Item.appendChild(PPieceColor);
	Item.appendChild(PName);
	Item.appendChild(PAbusive);
	Item.appendChild(PCategory)
	Item.appendChild(PTime);
	Item.appendChild(PInc);
	Item.appendChild(PRated);
	Item.appendChild(PPrivate);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = Id;

	this.MatchList.push(ItemObj);
	this.MatchUl.appendChild(Item);

	if(this.MatchList.length == 1)
	{
		this.hideNoMatch();
	}
}

function INTERFACE_RemoveMatchOffer(MatchId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.MatchList.length)&&(this.MatchList[i].Id != MatchId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.MatchList.length)
	{
		return false;
	}

	Item = this.MatchList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.MatchList.splice(i,1);

	if(this.MatchList.length == 0)
	{
		this.showNoMatch();
	}

	return true;
}

function INTERFACE_ShowMatchCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.MatchDiv);
	}

	this.MatchDiv.style.display = "block";
	this.MatchVisible = true;
}


function INTERFACE_HideMatchCenter()
{
	this.MatchDiv.style.display = "none";
	this.MatchVisible = false;
}

function INTERFACE_ShowNoMatch()
{
	this.NoMatch.style.display = "block"; 
}

function INTERFACE_HideNoMatch()
{
	this.NoMatch.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateGameCenterMatch()
{
	var Center = UTILS_CreateElement("div", "CenterMatch");
	var CenterOptions = UTILS_CreateElement("div", "CenterOptions");
	var CenterResult = UTILS_CreateElement("div", "CenterResult");

	var ListOptions = UTILS_CreateElement("ul","ListOptions");

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var MatchPlayer = UTILS_CreateElement("p","player",null,UTILS_GetText("gamecenter_announcer"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("gamecenter_time"));
	var Inc = UTILS_CreateElement("p","inc",null,UTILS_GetText("gamecenter_inc"));
	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("gamecenter_inc"));
	var Rated = UTILS_CreateElement("p","rated",null,UTILS_GetText("gamecenter_rated"));
	var Private = UTILS_CreateElement("p","private",null,UTILS_GetText("gamecenter_privacity"));


	// No Match element
	var NoMatch = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_match"));

	var CancelMatches = UTILS_CreateElement("li",null,null, UTILS_GetText("gamecenter_cancel_matches"));

	CancelMatches.onclick = function(){
		CHALLENGE_ClearChallenges();
	}
	
	//ListResultHeader.appendChild(PieceColor);
	ListResultHeader.appendChild(MatchPlayer);
	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Rated);
	ListResultHeader.appendChild(Private);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoMatch);

	ListOptions.appendChild(CancelMatches);

	CenterOptions.appendChild(ListOptions);
	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterOptions);
	Center.appendChild(CenterResult);

	return {Center:Center, MatchList:ListResult, NoMatch:NoMatch};
}


/*******************************************/
/*GAME CENTER POSTPONE OBJECT*/
/*******************************************/
function PostponeObj()
{
	var Postpone = INTERFACE_CreateGameCenterPostpone();

	// Attributes	
	this.PostponeDiv = Postpone.Center;
	this.PostponeUl = Postpone.PostponeList;
	this.NoPostpone = Postpone.NoPostpone; 

	this.PostponeVisible = false;
	this.PostponeList = new Array();

	// Methods
	this.add = INTERFACE_AddPostpone;
	this.remove= INTERFACE_RemovePostpone;
	this.update = INTERFACE_UpdatePostpone;

	this.showNoPostpone = INTERFACE_ShowNoPostpone;
	this.hideNoPostpone = INTERFACE_HideNoPostpone;

	this.show= INTERFACE_ShowPostponeCenter;
	this.hide= INTERFACE_HidePostponeCenter;
}


function INTERFACE_AddPostpone(Player, Time, Inc, Category, Rating, Date, PostponeId)
{
	var Item;

	var PPieceColor;
	var PName, PTime, PInc, PCategory, PRating, PPrivate, PButton;
	var PDate;
	var ItemObj = new Object();
	var Id = PostponeId;
	var PAbusive;

	Item = UTILS_CreateElement("li");

	// Random color
	PPieceColor = UTILS_CreateElement("img");

	if(Player.Color == "")	
	{
		PPieceColor.src = "images/challenge_menu/random.png";
	}
	else
	{
		PPieceColor.src = "images/challenge_menu/"+Player.Color+"_enable.png";
	}

	if(Player.Abusive == "true")
	{
		PAbusive = UTILS_CreateElement("p","abusive", null, null);
	}
	else
	{
		PAbusive = UTILS_CreateElement("p","abusive", "disable", null);
	}

	PAbusive.title = UTILS_GetText("gamecenter_abusive");

	PName = UTILS_CreateElement("p","player", null, UTILS_ShortString(Player.Name,10));
	PTime = UTILS_CreateElement("p","time", null, Time+"\'");
	PInc = UTILS_CreateElement("p","inc", null, Inc+"\"");
	PCategory = UTILS_CreateElement("p","category", null, Category);
	PRating = UTILS_CreateElement("p","rating", null, Rating);

	PDate = UTILS_CreateElement("p","date",null,Date);

	//Button action is set before get opponent's presence
	PButton = UTILS_CreateElement("p","action","accept",UTILS_GetText("window_continue"));
	
	
	Item.appendChild(PPieceColor);
	Item.appendChild(PName);
	Item.appendChild(PRating);
	Item.appendChild(PCategory)
	Item.appendChild(PTime);
	Item.appendChild(PInc);
	Item.appendChild(PDate);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Id = PostponeId;
	ItemObj.OponentName = Player.Name;
	ItemObj.Button = PButton;

	this.PostponeList.push(ItemObj);
	this.PostponeUl.appendChild(Item);

	if(this.PostponeList.length == 1)
	{
		this.hideNoPostpone();
	}
}

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

	if(this.PostponeList.length == 0)
	{
		this.showNoPostpone();
	}

	return true;
}

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
			Id = this.PostponeList[i].Id;

			if(OponentStatus == "offline")
			{
				Item.className = "disable";
				Button.onclick = function(){return false;};
			}
			else
			{
				//Item.className = ItemObj.OponentColor;
				Item.className = this.PostponeList[i].OponentColor;
				Button.onclick = function(){
					CHALLENGE_SendResumeGame(Id);
				};
			}
		}
	}
}



function INTERFACE_ShowPostponeCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.PostponeDiv);
	}

	this.PostponeDiv.style.display = "block";
	this.PostponeVisible = true;
}


function INTERFACE_HidePostponeCenter()
{
	this.PostponeDiv.style.display = "none";
	this.PostponeVisible = false;
}

function INTERFACE_ShowNoPostpone()
{
	this.NoPostpone.style.display = "block"; 
}

function INTERFACE_HideNoPostpone()
{
	this.NoPostpone.style.display = "none"; 
}


/************************************************/

function INTERFACE_CreateGameCenterPostpone()
{
	var Center = UTILS_CreateElement("div", "CenterPostpone");
	var CenterOptions = UTILS_CreateElement("div", "CenterOptions");
	var CenterResult = UTILS_CreateElement("div", "CenterResult");

	var ListOptions = UTILS_CreateElement("ul","ListOptions");

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	//var PieceColor = UTILS_CreateElement("p","piece",null,"Peca");
	var PostponePlayer = UTILS_CreateElement("p","player",null,UTILS_GetText("gamecenter_opponent"));
	var Rating = UTILS_CreateElement("p","rating",null,UTILS_GetText("gamecenter_rating"));
	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("gamecenter_category"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("gamecenter_time"));
	var Inc = UTILS_CreateElement("p","inc",null,UTILS_GetText("gamecenter_inc"));
	var Date = UTILS_CreateElement("p","date",null,UTILS_GetText("gamecenter_date"));


	// No Postpone element
	var NoPostpone = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_postpone"));

	//ListResultHeader.appendChild(PieceColor);
	ListResultHeader.appendChild(PostponePlayer);
	ListResultHeader.appendChild(Rating);
	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Date);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoPostpone);

	CenterOptions.appendChild(ListOptions);
	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterOptions);
	Center.appendChild(CenterResult);

	return {Center:Center, PostponeList:ListResult, NoPostpone:NoPostpone};
}

/*******************************************/
/*GAME CENTER CURRENTGAMES OBJECT*/
/*******************************************/
function CurrentGamesObj()
{
	var CurrentGames = INTERFACE_CreateGameCenterCurrentGames();

	// Attributes
	this.CurrentGamesDiv = CurrentGames.Center
	this.CurrentGamesUl = CurrentGames.CurrentGamesList;
	this.NoCurrentGames = CurrentGames.NoCurrentGames;
	this.CurrentGamesVisible = false;
	this.CurrentGamesList = new Array();

	this.add = INTERFACE_AddCurrentGames;
	this.remove = INTERFACE_RemoveCurrentGames;

	this.showNoCurrentGames = INTERFACE_ShowNoCurrentGames;
	this.hideNoCurrentGames = INTERFACE_HideNoCurrentGames;
	this.show = INTERFACE_ShowCurrentGamesCenter;
	this.hide = INTERFACE_HideCurrentGamesCenter;

}


function INTERFACE_AddCurrentGames(WPlayer, WRating, BPlayer, BRating, Category, GameTime, Rated, Moves, CurrentGamesId)
{
	var Item;
	/*
	var PWRating, PWName, PWTime;
	var PBRating, PBName, PBTime;
	*/
	var GameCategory, PGameTime, GameMoves;
	var PRated;
	var Button;

	var Id = CurrentGamesId;
	var ItemObj = new Object();

	Item = UTILS_CreateElement("li");
/*
	PWName = UTILS_CreateElement("p","wname",null,WPlayer.Name);
	PWRating = UTILS_CreateElement("p","wrating",null,WRating);
	PWTime = UTILS_CreateElement("p","wtime",null,WTime);

	PBName = UTILS_CreateElement("p","bname",null,BPlayer.Name);
	PBRating = UTILS_CreateElement("p","brating",null,BRating);
	PBTime = UTILS_CreateElement("p","wtime",null,BTime);
*/
	var PW = UTILS_CreateElement("p","player","white",WRating+" - "+UTILS_ShortString(WPlayer.Name,10));
	var PB = UTILS_CreateElement("p","player","black",UTILS_ShortString(BPlayer.Name,10)+" - "+BRating);
	Category = UTILS_CreateElement("p","category",null,Category);
	PGameTime = UTILS_CreateElement("p","time",null,GameTime+"\"");
	GameMoves = UTILS_CreateElement("p","moves",null,Moves);

	Button = UTILS_CreateElement("p","action","inative", UTILS_GetText("gamecenter_observe"));

	if(Rated == "true")
	{
		PRated = UTILS_CreateElement("p","rated",null,null);
		PRated.title = UTILS_GetText("gamecenter_rated_game");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated","disable",null);
		PRated.title = UTILS_GetText("gamecenter_not_rated_game");
	}

	Button.onclick = function(){
		var Buffer="";
		var To;
		var CurrentGame = MainData.GetCurrentGame();
		var MyUsername = MainData.GetUsername();

		//Check if user is not playing or observe a game
		if(CurrentGame == null)
		{
			if((BPlayer.Name!= MyUsername) &&(WPlayer.Name != MyUsername))
			{
				Buffer += GAME_StartObserverGame(CurrentGamesId, WPlayer, BPlayer);
			}
			else
			{
				//Open game board and enter game in room
				Buffer += GAME_StartGame(CurrentGamesId, WPlayer, BPlayer);
				To = CurrentGamesId+"@"+MainData.GetServer()+"."+MainData.GetHost()+"/"+MyUsername;
				Buffer += MESSAGE_Presence(To)
			}
		}
		else
		{
			WINDOW_Alert(UTILS_GetText("game_observer_alert_title"), UTILS_GetText("game_observer_alert"));
		}
		CONNECTION_SendJabber(Buffer);
	}

	/*
	Item.appendChild(PWRating);
	Item.appendChild(PWName);
	Item.appendChild(PWTime);

	Item.appendChild(PBTime);
	Item.appendChild(PBName);
	Item.appendChild(PBRating);
	*/
	
	Item.appendChild(PW);
	Item.appendChild(PB);
	Item.appendChild(Category);
	Item.appendChild(PGameTime);
	Item.appendChild(PRated);
	Item.appendChild(GameMoves);

	Item.appendChild(Button);

	ItemObj.Item = Item;
	ItemObj.Button = Button;
	ItemObj.Id = CurrentGamesId;
	ItemObj.PWName = WPlayer.Name;
	ItemObj.PWColor = WPlayer.Color;
	ItemObj.PBName = BPlayer.Name;
	ItemObj.PBColor = BPlayer.Color;
	ItemObj.OponentName = WPlayer.Name;
	ItemObj.OponentColor = WPlayer.Color;

	this.CurrentGamesList.push(ItemObj);
	this.CurrentGamesUl.appendChild(Item);

	if(this.CurrentGamesList.length == 1)
	{
		this.hideNoCurrentGames();
	}
}

function INTERFACE_RemoveCurrentGames(CurrentGamesId)
{
	var i=0;
	var Item;
	
	// Find match
	while(( i < this.CurrentGamesList.length)&&(this.CurrentGamesList[i].Id != CurrentGamesId))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.CurrentGamesList.length)
	{
		return false;
	}

	Item = this.CurrentGamesList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.CurrentGamesList.splice(i,1);

	if(this.CurrentGamesList.length <= 0)
	{
		this.showNoCurrentGames();
	}

	return true;
}


function INTERFACE_ShowCurrentGamesCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.CurrentGamesDiv);
	}
	else
	{
		document.body.appendChild(this.CurrentGamesDiv);
	}
	this.CurrentGamesDiv.style.display = "block";
	this.CurrentGamesVisible = true;
}

function INTERFACE_HideCurrentGamesCenter()
{
	this.CurrentGamesDiv.style.display = "none";
	this.CurrentGamesVisible = false;
}

function INTERFACE_ShowNoCurrentGames()
{
	this.NoCurrentGames.style.display = "block";
}

function INTERFACE_HideNoCurrentGames()
{
	this.NoCurrentGames.style.display = "none";
}


/*************************************************/

function INTERFACE_CreateGameCenterCurrentGames()
{
	var Center = UTILS_CreateElement("div", "CenterCurrentGames");
	var CenterOptions = UTILS_CreateElement("div", "CenterOptions");
	var CenterResult = UTILS_CreateElement("div", "CenterResult");

	var ListOptions = UTILS_CreateElement("ul","ListOptions");

	var ListResult = UTILS_CreateElement("ul","ListResult");
	var ListResultHeaderUl = UTILS_CreateElement("ul","ListResultHeader")
	var ListResultHeader = UTILS_CreateElement("li",null,"header");

	// Result headers
	var WRating = UTILS_CreateElement("p","wrating",null,UTILS_GetText("gamecenter_rating"));
	var WPiece = UTILS_CreateElement("img","wpiece");

	var VS = UTILS_CreateElement("p","vs",null,"X");
	
	var BRating = UTILS_CreateElement("p","brating",null,UTILS_GetText("gamecenter_rating"));
	var BPiece = UTILS_CreateElement("img","bpiece");

	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("gamecenter_category"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("gamecenter_time"));
	var Moves = UTILS_CreateElement("p","moves",null,UTILS_GetText("gamecenter_moves"));
	var Rated = UTILS_CreateElement("p","rated",null,UTILS_GetText("gamecenter_rated"));

	var UpdateList = UTILS_CreateElement("li","update",null,UTILS_GetText("gamecenter_update"));
	
	// No Announce element
	var NoResult = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_current_games"));

	UpdateList.onclick = function(){
		// Remove all current games
		GAMECENTER_ClearCurrentGames();
		
		// Get current games list
		CONNECTION_SendJabber(MESSAGE_GameRoomList());
	}
	
	WPiece.src = "./images/challenge_menu/white_enable.png";
	BPiece.src = "./images/challenge_menu/black_enable.png";
	
	ListResultHeader.appendChild(WRating);
	ListResultHeader.appendChild(WPiece);
	ListResultHeader.appendChild(VS);
	ListResultHeader.appendChild(BPiece);
	ListResultHeader.appendChild(BRating);

	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Rated);
	ListResultHeader.appendChild(Moves);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoResult);

	ListOptions.appendChild(UpdateList);

	CenterOptions.appendChild(ListOptions);
	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterOptions);
	Center.appendChild(CenterResult);

	return {Center:Center, CurrentGamesList:ListResult, NoCurrentGames:NoResult};
}

