import {
	MESSAGE_GameEnterRoom,
	MESSAGE_Presence,
	MESSAGE_GameRoomList,
	MESSAGE_GetAnnounceMatch,
} from 'xmpp_messages/message.js';
import {
	GAMECENTER_AnnounceSortByTime,
	GAMECENTER_MatchOfferSortByCategory,
	GAMECENTER_AnnounceSortByCategory,
	GAMECENTER_MatchOfferSortByPrivate,
	GAMECENTER_ShowCurrentGames,
	GAMECENTER_AnnounceSortByUsername,
	GAMECENTER_ClearCurrentGames,
	GAMECENTER_PostponeSortByTime,
	GAMECENTER_CurrentGamesSortByRated,
	GAMECENTER_MatchOfferSortByInc,
	GAMECENTER_AnnounceSortByRated,
	GAMECENTER_CurrentGamesSortByBRating,
	GAMECENTER_CurrentGamesSortByWRating,
	GAMECENTER_MatchOfferSortByRated,
	GAMECENTER_ShowAnnounce,
	GAMECENTER_CurrentGamesSortByCategory,
	GAMECENTER_MatchOfferSortByUsername,
	GAMECENTER_MatchOfferSortByTime,
	GAMECENTER_PostponeSortByInc,
	GAMECENTER_PostponeSortByUsername,
	GAMECENTER_AnnounceSortByInc,
	GAMECENTER_AnnounceSortByRating,
	GAMECENTER_ShowMatchOffer,
	GAMECENTER_PostponeSortByDate,
	GAMECENTER_CurrentGamesSortByMoves,
	GAMECENTER_PostponeSortByCategory,
	GAMECENTER_ShowTourney,
	GAMECENTER_MatchOfferSortByRating,
	GAMECENTER_CurrentGamesSortByTime,
	GAMECENTER_PostponeSortByRating,
	GAMECENTER_ShowPostpone,
	GAMECENTER_AnnounceSortByPrivate,
} from 'gamecenter/gamecenter.js';
import {
	UTILS_CreateElement,
	UTILS_GetText,
	UTILS_ShortString,
} from 'utils/utils.js';
import { CHALLENGE_DeclineChallenge, CHALLENGE_ClearChallenges } from 'challenge/challenge.js';
import { CHALLENGE_SendResumeGame } from 'challenge/adjourn.js';
import {
	ANNOUNCE_AcceptRandomAnnounce,
	ANNOUNCE_RemoveAnnounce,
	ANNOUNCE_ClearAnnounce,
	ANNOUNCE_AcceptAnnounce,
	ANNOUNCE_CancelAnnounce,
} from 'challenge/announce.js';
import { WINDOW_AnnounceWindow, WINDOW_Alert } from 'window/window.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { GAME_StartGame } from 'game/game.js';
import { MainData } from 'main_data.js';

import ImageChallengeMenuRandom from 'images/challenge_menu/random.png';

import ImageChallengeMenuWhiteEnable from 'images/challenge_menu/white_enable.png'
import ImageChallengeMenuBlackEnable from 'images/challenge_menu/black_enable.png'

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
* @file		interface/gamecenter.js
* @brief	Control interface game center
*/

/*
* @class	GameCenter
* @brief	Create gamecenter object
*
* @return	none
* @author	Rubens Suguimoto
*/
export function GameCenterObj()
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


/*
* @brief	Show game center object
*
* @param	element		html dom element
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Hide game center object
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideGameCenter()
{
	this.GameCenterDiv.style.display = "none";
	this.GameCenterDivVisible = false;
}

/*
* @brief	Create game center content
*
* @return	Gamecenter main Div and Gamecenter main content Div
* @author	Rubens Suguimoto
*/
function INTERFACE_CreateGameCenter()
{
	var Main = UTILS_CreateElement("div","GameCenter");

	var MenuDiv = UTILS_CreateElement("div","MenuDiv");
	var MenuList = UTILS_CreateElement("ul","MenuList");

	var MainCenter = UTILS_CreateElement("div");

	var AnnounceButton = UTILS_CreateElement("li","announce",null,UTILS_GetText("gamecenter_announce_title"));
	var PostponeButton = UTILS_CreateElement("li","postpone",null,UTILS_GetText("gamecenter_postpone_title"));
	var MatchOfferButton = UTILS_CreateElement("li","challenge",null,UTILS_GetText("gamecenter_match_title"));
	var TourneyButton = UTILS_CreateElement("li","tourney","disable",UTILS_GetText("gamecenter_tourney_title"));
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

//GAME CENTER ANNOUNCE OBJECT
/*
* @brief	Create game center interface announce object
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add announced game
*
* @param	Player		Player's object
* @param	Rating		Player's rating
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rated		Game rated flag
* @param	Private		Game private flag
* @param	MatchId		Announce game identification number
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_AddAnnounce(Player, Rating, Time, Inc, Category, Rated, Private, MatchId)
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
    PPieceColor.src = ImageChallengeMenuRandom;
	}
	else
	{
    if (Player.Color === 'white') {
      PPieceColor.src = ImageChallengeMenuWhiteEnable;
    } else {
      PPieceColor.src = ImageChallengeMenuBlackEnable;
    }
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

/*
* @brief	Remove a announced game
*
* @param	MatchId		Announced game identification number
* @return	True if removed or false if not founded
* @author	Rubens Suguimoto
*/
export function INTERFACE_RemoveAnnounce(MatchId)
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
* @brief	Show announce object
*
* @param	Element		HTML DOM Element
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowAnnounceCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.AnnounceDiv);
	}

	this.AnnounceDiv.style.display = "block";
	this.AnnounceVisible = true;
}

/*
* @brief	Hide announce object
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideAnnounceCenter()
{
	this.AnnounceDiv.style.display = "none";
	this.AnnounceVisible = false;
}

/*
* @brief	Show no announced games text
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_ShowNoAnnounce()
{
	this.NoAnnounce.style.display = "block"; 
}

/*
* @brief	Hide no announced games text
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_HideNoAnnounce()
{
	this.NoAnnounce.style.display = "none"; 
}


/*
* @brief	Create game center interface announce HTML DOM elements
*
* @return	Main center Div, main list and no announced text element
* @author	Rubens Suguimoto
*/
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
	var AnnounceMatch = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_announce_match"))
//	var SeeGraphic = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecnter_see_graphic"));
	var UpdateAnnounce = UTILS_CreateElement("li",null,null,UTILS_GetText("gamecenter_update"));

	// No Announce element
	var NoAnnounce = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_announce"));

	AnnouncePlayer.onclick = function(){
		GAMECENTER_AnnounceSortByUsername();
		AnnouncePlayer.className = "selected";
		Inc.className = "";
		Category.className = "";
		Time.className = "";
		Rating.className = "";
		Private.className = "";
		Rated.className = "";
	}
	Inc.onclick = function(){
		GAMECENTER_AnnounceSortByInc();
		AnnouncePlayer.className = "";
		Inc.className = "selected";
		Category.className = "";
		Time.className = "";
		Rating.className = "";
		Private.className = "";
		Rated.className = "";
	}
	Category.onclick = function(){
		GAMECENTER_AnnounceSortByCategory();
		AnnouncePlayer.className = "";
		Inc.className = "";
		Category.className = "selected";
		Time.className = "";
		Rating.className = "";
		Private.className = "";
		Rated.className = "";
	}

	Time.onclick = function(){
		GAMECENTER_AnnounceSortByTime();
		AnnouncePlayer.className = "";
		Inc.className = "";
		Category.className = "";
		Time.className = "selected";
		Rating.className = "";
		Private.className = "";
		Rated.className = "";
	}
	Rating.onclick = function(){
		GAMECENTER_AnnounceSortByRating();
		AnnouncePlayer.className = "";
		Inc.className = "";
		Category.className = "";
		Time.className = "";
		Rating.className = "selected";
		Private.className = "";
		Rated.className = "";
	}
	Rated.onclick = function(){
		GAMECENTER_AnnounceSortByRated();
		AnnouncePlayer.className = "";
		Inc.className = "";
		Category.className = "";
		Time.className = "";
		Rating.className = "";
		Private.className = "";
		Rated.className = "selected";
	}
	Private.onclick = function(){
		GAMECENTER_AnnounceSortByPrivate();
		AnnouncePlayer.className = "";
		Inc.className = "";
		Category.className = "";
		Time.className = "";
		Rating.className = "";
		Private.className = "selected";
		Rated.className = "";
	}

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

	ListResultHeader.appendChild(AnnouncePlayer);
	ListResultHeader.appendChild(Rating);
	ListResultHeader.appendChild(Category);
	ListResultHeader.appendChild(Time);
	ListResultHeader.appendChild(Inc);
	ListResultHeader.appendChild(Rated);
	ListResultHeader.appendChild(Private);
	
	ListResultHeaderUl.appendChild(ListResultHeader);
	ListResult.appendChild(NoAnnounce);

	CenterOptions.appendChild(ListOptions);
	CenterResult.appendChild(ListResultHeaderUl);
	CenterResult.appendChild(ListResult);

	Center.appendChild(CenterOptions);
	Center.appendChild(CenterResult);

	return {Center:Center, AnnounceList:ListResult, NoAnnounce:NoAnnounce};
}

//GAME CENTER MATCHOFFER OBJECT
/*
* @brief	Create game center interface offered match object
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add offered match
*
* @param	Player		Player's object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rated		Game rated flag
* @param	Private		Game private flag
* @param	MatchId		Offered match identification number
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_AddMatchOffer(Player, Time, Inc, Category, Rated, Private, MatchId)
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
    PPieceColor.src = ImageChallengeMenuRandom;
	}
	else
	{
    if (Player.Color === 'white') {
      PPieceColor.src = ImageChallengeMenuWhiteEnable;
    } else {
      PPieceColor.src = ImageChallengeMenuBlackEnable;
    }
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
		PPrivate.title = UTILS_GetText("gamecenter_public");
	}
	else
	{
		PPrivate = UTILS_CreateElement("p","private","true");
		PPrivate.title = UTILS_GetText("gamecenter_private");
	}
	*/

	PPrivate = UTILS_CreateElement("p","private","disable",null);
	PPrivate.title = UTILS_GetText("gamecenter_public");
	
	if(Rated == false)
	{
		PRated = UTILS_CreateElement("p","rated","disable",null);
		PRated.title = UTILS_GetText("gamecenter_not_rated_game");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated",null, null);
		PRated.title = UTILS_GetText("gamecenter_rated_game");
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

/*
* @brief	Remove a offered match
*
* @param	MatchId		Offered match identification number
* @return	True if removed or false if not founded
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Show offered match main div
*
* @param	Element		HTML DOM Element
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowMatchCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.MatchDiv);
	}

	this.MatchDiv.style.display = "block";
	this.MatchVisible = true;
}

/*
* @brief	Hide offered match main div
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideMatchCenter()
{
	this.MatchDiv.style.display = "none";
	this.MatchVisible = false;
}
/*
* @brief	Show no offered match text
*
* @return	none
* @author	Rubens Suguimoto
*/

export function INTERFACE_ShowNoMatch()
{
	this.NoMatch.style.display = "block"; 
}

/*
* @brief	Hide offered match text
*
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_HideNoMatch()
{
	this.NoMatch.style.display = "none"; 
}


/*
* @brief	Create game center interface offered match HTML DOM elements
*
* @return	Main center Div, main list and no offered match text element
* @author	Rubens Suguimoto
*/
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
	var MatchPlayer = UTILS_CreateElement("p","player",null,UTILS_GetText("gamecenter_announcer"));
	var Time = UTILS_CreateElement("p","time",null,UTILS_GetText("gamecenter_time"));
	var Inc = UTILS_CreateElement("p","inc",null,UTILS_GetText("gamecenter_inc"));
	var Category = UTILS_CreateElement("p","category",null,UTILS_GetText("gamecenter_category"));
	var Rating = UTILS_CreateElement("p","rating",null,UTILS_GetText("gamecenter_rating"));
	var Rated = UTILS_CreateElement("p","rated",null,UTILS_GetText("gamecenter_rated"));
	var Private = UTILS_CreateElement("p","private",null,UTILS_GetText("gamecenter_privacity"));


	// No Match element
	var NoMatch = UTILS_CreateElement("p",null,null, UTILS_GetText("gamecenter_no_match"));

	var CancelMatches = UTILS_CreateElement("li",null,null, UTILS_GetText("gamecenter_cancel_matches"));

	MatchPlayer.onclick = function(){
		GAMECENTER_MatchOfferSortByUsername();
		MatchPlayer.className = "selected";
		Time.className = "";
		Inc.className = "";
		Category.className = "";
		Rating.className = "";
		Rated.className = "";
		Private.className = "";		
	}
	Time.onclick = function(){
		GAMECENTER_MatchOfferSortByTime();
		MatchPlayer.className = "";
		Time.className = "selected";
		Inc.className = "";
		Category.className = "";
		Rating.className = "";
		Rated.className = "";
		Private.className = "";		
	}
	Inc.onclick = function(){
		GAMECENTER_MatchOfferSortByInc();
		MatchPlayer.className = "";
		Time.className = "";
		Inc.className = "selected";
		Category.className = "";
		Rating.className = "";
		Rated.className = "";
		Private.className = "";		
	}
	Category.onclick = function(){
		GAMECENTER_MatchOfferSortByCategory();
		MatchPlayer.className = "";
		Time.className = "";
		Inc.className = "";
		Category.className = "selected";
		Rating.className = "";
		Rated.className = "";
		Private.className = "";		
	}
	Rating.onclick = function(){
		GAMECENTER_MatchOfferSortByRating();
		MatchPlayer.className = "";
		Time.className = "";
		Inc.className = "";
		Category.className = "";
		Rating.className = "selected";
		Rated.className = "";
		Private.className = "";		
	}
	Rated.onclick = function(){
		GAMECENTER_MatchOfferSortByRated();
		MatchPlayer.className = "";
		Time.className = "";
		Inc.className = "";
		Category.className = "";
		Rating.className = "";
		Rated.className = "selected";
		Private.className = "";		
	}
	Private.onclick = function(){
		GAMECENTER_MatchOfferSortByPrivate();
		MatchPlayer.className = "";
		Time.className = "";
		Inc.className = "";
		Category.className = "";
		Rating.className = "";
		Rated.className = "";
		Private.className = "selected";		
	}

	CancelMatches.onclick = function(){
		CHALLENGE_ClearChallenges();
	}
	
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


//GAME CENTER POSTPONE OBJECT
/*
* @brief	Create game center interface postponed game object
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add announced game
*
* @param	Player		Player's object
* @param	Time		Game time
* @param	Inc		Game time increment
* @param	Category	Game category
* @param	Rating		Player's rating
* @param	Date		Postponed game date
* @param	PostponeId	Postponed game identification number
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_AddPostpone(Player, Time, Inc, Category, Rating, Date, PostponeId)
{
	var Item;

	var PPieceColor;
	var PName, PTime, PInc, PCategory, PRating, PButton;
	var PDate;
	var ItemObj = new Object();
	var Id = PostponeId;
	var PAbusive;
	var TmpTime = "";
	var TimeMin, TimeSec;

	// Set time to minutes and seconds format
	TimeMin = Math.floor(Time / 60);
	TimeSec = Time % 60;
	
	if(TimeMin != 0)
	{
		TmpTime += TimeMin+"\'";
	}

	if(TimeSec != 0)
	{
		TmpTime += TimeSec+"\"";
	}

	Item = UTILS_CreateElement("li");

	// Random color
	PPieceColor = UTILS_CreateElement("img");

	if(Player.Color == "")	
	{
    PPieceColor.src = ImageChallengeMenuRandom;
	}
	else
	{
    if (Player.Color === 'white') {
      PPieceColor.src = ImageChallengeMenuWhiteEnable;
    } else {
      PPieceColor.src = ImageChallengeMenuBlackEnable;
    }
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
	PTime = UTILS_CreateElement("p","time", null, TmpTime);
	PInc = UTILS_CreateElement("p","inc", null, Inc+"\"");
	PCategory = UTILS_CreateElement("p","category", null, Category);
	PRating = UTILS_CreateElement("p","rating", null, Rating);

	PDate = UTILS_CreateElement("p","date",null,Date);
/*
	if(Player.Name == MainData.Username)
	{
		PButton = UTILS_CreateElement("p","button","decline");
		PButton.onclick = function(){
			ANNOUNCE_RemovePostpone(Id);
		}
	}
	else
	{
		PButton = UTILS_CreateElement("p","button","accept");
		PButton.onclick = function(){
			ANNOUNCE_AcceptPostpone(Id);
		}
	}
*/
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

/*
* @brief	Remove a postponed game
*
* @param	PostponeId	Postponed game identification number
* @return	True if removed or false if not founded
* @author	Rubens Suguimoto
*/
export function INTERFACE_RemovePostpone(PostponeId)
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

/*
* @brief	Update postponed game status
*
* @param	OponentName	Oponent's name
* @param	OponentStatu	Oponent's status
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_UpdatePostpone(OponentName, OponentStatus)
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
				Item.className = this.PostponeList[i].OponentColor;
				Button.onclick = function(){
					CHALLENGE_SendResumeGame(Id);
				};
			}
		}
	}
}

/*
* @brief	Show postpone object
* 
* @param	Element		HTML DOM Element
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowPostponeCenter(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.PostponeDiv);
	}

	this.PostponeDiv.style.display = "block";
	this.PostponeVisible = true;
}

/*
* @brief	Hide postpone object
* 
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HidePostponeCenter()
{
	this.PostponeDiv.style.display = "none";
	this.PostponeVisible = false;
}

/*
* @brief	Show no postponed games text
* 
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_ShowNoPostpone()
{
	this.NoPostpone.style.display = "block"; 
}

/*
* @brief	Hide no postponed games text
* 
* @return	none
* @author	Rubens Suguimoto
*/
export function INTERFACE_HideNoPostpone()
{
	this.NoPostpone.style.display = "none"; 
}


/*
* @brief	Create game center interface postponed HTML DOM Elements
*
* @return	Main center Div, main list and no postponed games text element
* @author	Rubens Suguimoto
*/
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


	PostponePlayer.onclick = function(){
		GAMECENTER_PostponeSortByUsername();
		PostponePlayer.className = "selected";
		Rating.className = "";
		Category.className = "";
		Time.className = "";
		Inc.className = "";
		Date.className = "";
	}
	Rating.onclick = function(){
		GAMECENTER_PostponeSortByRating();
		PostponePlayer.className = "";
		Rating.className = "selected";
		Category.className = "";
		Time.className = "";
		Inc.className = "";
		Date.className = "";
	}
	Category.onclick = function(){
		GAMECENTER_PostponeSortByCategory();
		PostponePlayer.className = "";
		Rating.className = "";
		Category.className = "selected";
		Time.className = "";
		Inc.className = "";
		Date.className = "";
	}
	Time.onclick = function(){
		GAMECENTER_PostponeSortByTime();
		PostponePlayer.className = "";
		Rating.className = "";
		Category.className = "";
		Time.className = "selected";
		Inc.className = "";
		Date.className = "";
	}
	Inc.onclick = function(){
		GAMECENTER_PostponeSortByInc();
		PostponePlayer.className = "";
		Rating.className = "";
		Category.className = "";
		Time.className = "";
		Inc.className = "selected";
		Date.className = "";
	}
	Date.onclick = function(){
		GAMECENTER_PostponeSortByDate();
		PostponePlayer.className = "";
		Rating.className = "";
		Category.className = "";
		Time.className = "";
		Inc.className = "";
		Date.className = "selected";
	}

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

//GAME CENTER CURRENTGAMES OBJECT
/*
* @brief	Create game center interface current games object
*
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Add current game
*
* @param	WPlayer		White player's object
* @param	WRating		White player's rating
* @param	BPlayer		Black player's object
* @param	BRating		Black player's rating
* @param	Category	Game category
* @param	GameTime	Game time
* @param	Rated		Game rated flag
* @param	Moves		Game moves done
* @param	CurrentGamesId	Current game identification number
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_AddCurrentGames(WPlayer, WRating, BPlayer, BRating, Category, GameTime, Rated, Moves, CurrentGamesId)
{
	var Item;
	var GameCategory, PGameTime, GameMoves;
	var PRated;
	var Button;

	var Id = CurrentGamesId;
	var ItemObj = new Object();

	Item = UTILS_CreateElement("li");

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
				// Send a message to check if this game exists;
				// If exists, start game in observer mode
				// else show a error message
				Buffer += MESSAGE_GameEnterRoom(CurrentGamesId);
			}
			else
			// Continue some game -> this case should not happen
			// If you reconnect in middle of some game, when enter
			// in web interface the game will start autommatically
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

/*
* @brief	Remove a current game
*
* @param	CurrentGamesId	Current game identification number
* @return	True if removed or false if not founded
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Show current game main div
*
* @param	Element		HTML DOM Element
* @return	none
* @author	Rubens Suguimoto
*/
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

/*
* @brief	Hide current game main div
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideCurrentGamesCenter()
{
	this.CurrentGamesDiv.style.display = "none";
	this.CurrentGamesVisible = false;
}

/*
* @brief	Show no current games text
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_ShowNoCurrentGames()
{
	this.NoCurrentGames.style.display = "block";
}

/*
* @brief	Hide no current games text
*
* @return	none
* @author	Rubens Suguimoto
*/
function INTERFACE_HideNoCurrentGames()
{
	this.NoCurrentGames.style.display = "none";
}

/*
* @brief	Create game center interface postponed HTML DOM Elements
*
* @return	Main center Div, main list and no current games text element
* @author	Rubens Suguimoto
*/
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

	WRating.onclick = function (){
		GAMECENTER_CurrentGamesSortByWRating();
		WRating.className = "selected";
		BRating.className = "";
		Category.className = "";
		Time.className = "";
		Moves.className = "";
		Rated.className = "";
	}
	WPiece.onclick = function (){
		GAMECENTER_CurrentGamesSortByWRating();
		WRating.className = "selected";
		BRating.className = "";
		Category.className = "";
		Time.className = "";
		Moves.className = "";
		Rated.className = "";
	}
	BRating.onclick = function (){
		GAMECENTER_CurrentGamesSortByBRating();
		WRating.className = "";
		BRating.className = "selected";
		Category.className = "";
		Time.className = "";
		Moves.className = "";
		Rated.className = "";
	}
	BPiece.onclick = function (){
		GAMECENTER_CurrentGamesSortByBRating();
		WRating.className = "";
		BRating.className = "selected";
		Category.className = "";
		Time.className = "";
		Moves.className = "";
		Rated.className = "";
	}
	Category.onclick = function (){
		GAMECENTER_CurrentGamesSortByCategory();
		WRating.className = "";
		BRating.className = "";
		Category.className = "selected";
		Time.className = "";
		Moves.className = "";
		Rated.className = "";
	}
	Time.onclick = function (){
		GAMECENTER_CurrentGamesSortByTime();
		WRating.className = "";
		BRating.className = "";
		Category.className = "";
		Time.className = "selected";
		Moves.className = "";
		Rated.className = "";
	}
	Moves.onclick = function (){
		GAMECENTER_CurrentGamesSortByMoves();
		WRating.className = "";
		BRating.className = "";
		Category.className = "";
		Time.className = "";
		Moves.className = "selected";
		Rated.className = "";
	}
	Rated.onclick = function (){
		GAMECENTER_CurrentGamesSortByRated();
		WRating.className = "";
		BRating.className = "";
		Category.className = "";
		Time.className = "";
		Moves.className = "";
		Rated.className = "selected";
	}

	UpdateList.onclick = function(){
		// Remove all current games
		GAMECENTER_ClearCurrentGames();
		
		// Get current games list
		CONNECTION_SendJabber(MESSAGE_GameRoomList());
	}
	
  WPiece.src = ImageChallengeMenuWhiteEnable;
  BPiece.src = ImageChallengeMenuBlackEnable;
	
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

