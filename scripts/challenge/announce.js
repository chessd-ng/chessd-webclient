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
 * @file 	challenge/announce.js
 * @brief	Functions to parse announces offered and receive
 *
 * See interface announce window (scripts/interface/announce.js), data
 * methods to announce list (scripts/data/data.js) and window announce
 * (scripts/window/window.js).
 */

/**
 * @brief 	Parse XML with announced games list and show in interface
 *
 * @param	XML	XML with adjourned games
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_HandleAnnounce(XML)
{
	var i;
	var Id = XML.getAttribute("id");
	var Category;
	var AutoFlag;
	var AnnounceId;
	var Rated;

	var PlayerTag;
	var Username, Color, Time, Inc;
	var Announces;

	var Buffer = "";

	var Consts =  MainData.GetConst();
//	var ChallengeMenu = MainData.GetChallengeMenu();
	var GameCenter = MainData.GetGamecenter();

	// Get Announce list
	if(Id == Consts.IQ_ID_GetAnnounceMatch)
	{
		Announces = XML.getElementsByTagName("announcement");
		
		
		// There is no announced match
/*
		if(Announces.length == 0)
		{
			// Remove loading message
			//ANNOUNCE_HideLoadingAnnounce();
			//GameCenter.Announce.showNoAnnounce();
		}
		else
		{
*/
			for(i=0; i< Announces.length ; i++)
			{
				Category = Announces[i].getAttribute("category");
				AutoFlag = Announces[i].getAttribute("autoflag");
				AnnounceId = parseInt(Announces[i].getAttribute("id"));
				Rated = Announces[i].getAttribute("rated");

				PlayerTag = Announces[i].getElementsByTagName("player")[0];
				Username = PlayerTag.getAttribute("jid").split("@")[0];
				Color = PlayerTag.getAttribute("color");
				Time = parseInt(PlayerTag.getAttribute("time"));
				Inc = parseInt(PlayerTag.getAttribute("inc"));

				if(Color == null)
				{
					Color = "";
				}

				ANNOUNCE_AddAnnounce(Username, Color, Time, Inc, Category, Rated, "false", AnnounceId);

				// Hide loading and no announce message
				//ANNOUNCE_HideLoadingAnnounce();
				//ANNOUNCE_HideNoAnnounce();
				GameCenter.Announce.hideNoAnnounce();
			}
//		}
	}

	// Quick Fix - Show No Announce message
	//if (ChallengeMenu.AnnounceList.length == 0)
	if (GameCenter.Announce.AnnounceList.length == 0)
	{
		//ANNOUNCE_ShowNoAnnounce();
		GameCenter.Announce.showNoAnnounce();
	}
	// Accepted announce
	/*
	else if(Id == Consts.IQ_ID_AcceptAnnounceMatch)
	{
		WINDOW_Alert("Announce accept","Announce accepted, start game!")
	}
	else if(Id == Consts.IQ_ID_RemoveAnnounceMatch)
	{
		Announces = XML.getElementsByTagName("announcement");

		AnnounceId = Announces[0].getAttribute("id");

		ANNOUNCE_RemoveAnnounce(AnnounceId);
	}
	*/
	return Buffer;
}

/**
 * @brief 	Parse XML with start announced game 
 *
 * Parse XML with announced game and start game with some player
 *
 * @param	XML	XML with start announced game
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_HandleAnnounceGame(XML)
{
	var Id = XML.getAttribute("id");

	var GameRoomTag, Room;
	var GameRoom;
	var Buffer = "";
	var MyUsername = MainData.GetUsername();

	// Accepted announce, start game
	GameRoom = XML.getElementsByTagName("game_room")[0];

	Room = GameRoom.getAttribute("jid");
	Room += "/"+MyUsername;

	Buffer += CONTACT_ChangeStatus("playing", false);
	Buffer += MESSAGE_Presence(Room);

	return Buffer;
}
/**
 * @brief 	Parse XML with announces errors
 *
 * @param	XML	XML with announce errors
 * @return	Buffer with other XMPP to send
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_HandleAnnounceError(XML)
{
	var Id = XML.getAttribute("id");
	var Error;
	var Type;
	var AnnounceId, Announces;

	var Consts = MainData.GetConst();

	if(Id == Consts.IQ_ID_AcceptAnnounceMatch)
	{
		Error = XML.getElementsByTagName("error")[0];
		Type = Error.getAttribute("type");

		Announces = XML.getElementsByTagName("announcement");
		AnnounceId = Announces[0].getAttribute("id");

		switch(Type)
		{
			case "modify":
				WINDOW_Alert(UTILS_GetText("announce_accept_error"),UTILS_GetText("announce_non_exist"));
				// Remove announce
				ANNOUNCE_RemoveAnnounce(AnnounceId);
				break;
		}
	}
}

/*
 * @brief	Send a message to create a announce with players parameters
 * @param	Username	Username string
 * @param	Color		Player Color (white, black or random)
 * @param	Time		Game time in minutes
 * @param	Inc		Game increment time in seconds
 * @param	Rated		Flag to set rated game
 * @param	Min		Minimun rating interval
 * @param	Max		Maximun rating interval
 * @return	Boolean		True and false
 * @author	Rubens Suguimoto
*/
function ANNOUNCE_SendAnnounce(Username, Color, Time, Inc, Category, Rated, Min, Max)
{
	var Autoflag = "true";
	var Player = new Object();

	Player.Name = Username;
	Player.Color = Color;
	Player.Inc = Inc;

	if(Category != "untimed")
	{
		Player.Time = Time*60;
	}
	else
	{
		Player.Time = "untimed";
	}

	if (!Min.match(/^\d*$/))
	{
		WINDOW_Alert(UTILS_GetText("announce_error_title"),UTILS_GetText("announce_invalid_min_rating"));
		return false;
	}
	if (!Max.match(/^\d*$/))
	{
		WINDOW_Alert(UTILS_GetText("announce_error_title"),UTILS_GetText("announce_invalid_min_rating"));
		return false;
	}
	if (parseInt(Min) > parseInt(Max))
	{
		WINDOW_Alert(UTILS_GetText("announce_error_title"),UTILS_GetText("announce_invalid_interval"));
		return false;
	}
	
	CONNECTION_SendJabber(MESSAGE_AnnounceMatch(Player, Rated, Category, Min, Max, Autoflag));
	return true;
}

/*
 * @brief	Send a message to get announced games
 * @return	none
 * @author	Rubens Suguimoto
*/

function ANNOUNCE_GetAnnounceGames()
{
	var XMPP = "";

	var Offset = 0;
	var NumResult = 10;
	var MinTime = "";
	var MaxTime = "";
	var Category = "";
	var User = true;

	XMPP += MESSAGE_GetAnnounceMatch(Offset, NumResult, MinTime, MaxTime, Category, User);
	User = false;
	XMPP += MESSAGE_GetAnnounceMatch(Offset, NumResult, MinTime, MaxTime, Category, User);

	CONNECTION_SendJabber(XMPP);
}

/*
 * @brief	Add a announce in data struct and show in challenge menu
 * @param	Username	Username string
 * @param	Color		Player Color (white, black or random)
 * @param	Time		Game time in minutes
 * @param	Inc		Game increment time in seconds
 * @param	Rated		Flag to set rated game
 * @param	Private		Flag to set private game
 * @param	AnnounceId	Announce identification number (integer)
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_AddAnnounce(Username, Color, Time, Inc, Category, Rated, Private, AnnounceId)
{
	var Player = new Object();
	var GameCenter = MainData.GetGamecenter();
	var Rating;

	if(MainData.FindAnnounce(AnnounceId) == null)
	{
		Player.Name = Username;
		Player.Color = Color;
		Player.Inc = Inc;
		Player.Time = Time;
		
		// Get user rating by category
		Rating = MainData.GetUser(Username).GetRatingList().GetRatingValue(Category);
		if(Rating == null)
		{
			Rating = 1500;
		}
	
		MainData.AddAnnounce(Player, Rating, Time, Inc, Category, Rated, Private, AnnounceId)
		if(Category != "untimed")
		{
			GameCenter.Announce.add(Player, Rating, Time/60, Inc, Category, Rated, Private, AnnounceId);
		}
		else
		{
			// Infinit symbol
			GameCenter.Announce.add(Player, Rating, "&#8734", Inc, Category, Rated, Private, AnnounceId);
		}

	}
}

/*
 * @brief Remove a announce from interface
 *
 * Remomve announce from interface using announce id but don't send a message to cancel announce in the server
 *
 * @param	Id	Announce identification number (integer)
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_RemoveAnnounce(Id)
{
	var GameCenter = MainData.GetGamecenter();

	MainData.RemoveAnnounce(Id);
	GameCenter.Announce.remove(Id);
}

/*
 * @brief	Remove announce from interface and send a message to cancel announce
 *
 * @param	Id	Announce identification number (integer)
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_CancelAnnounce(Id)
{
	var XMPP = "";
	
	ANNOUNCE_RemoveAnnounce(Id);

	XMPP += MESSAGE_RemoveAnnounceMatch(Id);

	CONNECTION_SendJabber(XMPP);
}

/*
 * @brief	Send a message to accept some announce using announce id
 * @param	Id	Announce identification number (integer)
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_AcceptAnnounce(Id)
{
	var XMPP = "";
	
	XMPP += MESSAGE_AcceptAnnounceMatch(Id);

	CONNECTION_SendJabber(XMPP);
}

/**
 * @brief	Remove all announces from main data and interface
 * 
 * Don't send a message to cancel all announce
 *
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_ClearAnnounce()
{
	var i;
	var AnnounceId;
	var AnnounceList = MainData.GetAnnounceList();

	// Remove all announce from challenge menu and data struct
	for(i=AnnounceList.length-1;i>= 0; i--)
	{
		AnnounceId = AnnounceList[i].Id;
		//ChallengeWindow = AnnounceList[i].Window;

		if(AnnounceId != null)
		{	
			// Remove without send message to cancel announce
			ANNOUNCE_RemoveAnnounce(AnnounceId);
		}

	}
}

/**
 * @brief	Cancel all announces made by you
 * @return	none
 * @author	Rubens Suguimoto
 */
function ANNOUNCE_CancelAllAnnounce()
{
	var i;
	var AnnounceId;
	var AnnounceList = MainData.GetAnnounceList();

	// Cancel all announces from interface
	for(i=AnnounceList.length-1;i>= 0; i--)
	{
		AnnounceId = AnnounceList[i].Id;

		if(AnnounceId != null)
		{
			// Remove and send a message to cancel announce
			ANNOUNCE_CancelAnnounce(AnnounceId);
		}

	}
}

/*
 * @brief	Accept a random announced game to play
 * 
 * @return	none
 * @author	Rubens Suguimoto
*/
function ANNOUNCE_AcceptRandomAnnounce()
{
	var AnnounceList = MainData.GetAnnounceList();
	var i;
	var MyUsername = MainData.GetUsername();
	var TmpAnnounceList = new Array();
	
	// Get all others players announces in announce list
	// This is necessary because your announce and others players
	// announce are put in the same array
	i=0;
	for(i=0; i<AnnounceList.length ; i++)
	{
		if(AnnounceList[i].Player.Name != MyUsername)
		{
			TmpAnnounceList.push(AnnounceList[i]);
		}
	}

	// Check if exists some announce
	if( TmpAnnounceList.length == 0)
	{
		WINDOW_Alert(UTILS_GetText("gamecenter_no_announce"),UTILS_GetText("gamecenter_no_announce"));
	}
	else
	{
		i = (Math.floor(Math.random()*10) % TmpAnnounceList.length)
		while(TmpAnnounceList[i].Player.Name == MyUsername)
		{
			i = (Math.floor(Math.random()*10) % TmpAnnounceList.length)
		}
		//TODO -> set language XML here
		WINDOW_Alert(i, "Iniciando jogo com: "+TmpAnnounceList[i].Player.Name);
		ANNOUNCE_AcceptAnnounce(TmpAnnounceList[i].Id)
	}
}
