import { UTILS_GetText } from 'utils/utils.js';
import { MESSAGE_GameRoomInfoList } from 'xmpp_messages/message.js';
import { GAME_StartObserverGame } from 'game/game.js';
import { WINDOW_Alert } from 'window/window.js';
import { INTERFACE_NoGamesInGameList } from 'interface/top.js';
import { MainData } from 'main_data.js';

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
*/              
          
/***
* @file		game/currentgame.js
* @brief	Current game controlle with parse and functions
*/ 

/**
* @brief	Handle game room list
*
* For each current game, send a request to get game information
*
* @param 	XML	XMPP with game rooms
* @return 	XMPP to send
* @author 	Ulysses Bomfim and Rubens Suguimoto
*/
export function CURRENTGAME_HandleGameRoomList(XML)
{
	var Items, i;
	var Jid, GameId;
	var XMPP="";
	var Consts = MainData.GetConst();

	// Get the ID 
	var ID = XML.getAttribute("id");

	// XML with all rooms games
	if (ID != Consts.IQ_ID_GetGamesList)
	{
		return XMPP;
	}


	// Get items from XML
	Items = XML.getElementsByTagName("item");

	if(Items.length == 0)
	{
		// There is no current games
		// interface/top.js
		INTERFACE_NoGamesInGameList();
	}
	else
	{
		// Get the rooms game jid's
		for (i=0; i<Items.length; i++)
		{

			Jid = Items[i].getAttribute("jid");
			GameId = Jid.split("@")[0];
			XMPP += MESSAGE_GameRoomInfoList(GameId);
		}
	}

	return XMPP;
}

/**
* @brief	Handle game room information
* 
* Get game room information and show in interface
*
* @param 	XML	XMPP with games rooms informations
* @return 	XMPP to send
* @author 	Rubens Suguimoto
*/
export function CURRENTGAME_HandleGameRoomInfoList(XML)
{
	var PW = new Object();
	var PB = new Object();

	var Game, GameType;
	var Jid, GameId;
	var Players;
	var GameCenter = MainData.GetGamecenter();
	var PWRating, PBRating;
	var Moves;
	
	var IqId = XML.getAttribute("id");
	var Consts = MainData.GetConst();
	
	var Buffer = "";
	
	Jid = XML.getAttribute("from");
	GameId = Jid.split("@")[0];

	Game = XML.getElementsByTagName("game")[0];
	GameType = Game.getAttribute("category");
	Moves = Game.getAttribute("moves");

	Players = XML.getElementsByTagName("player");

	if(Players[0].getAttribute("role") == "white")
	{
		PW.Name = Players[0].getAttribute("jid").split("@")[0];
		PW.Time = Players[0].getAttribute("time");
		PW.Color = "white";
		PW.Inc = Players[0].getAttribute("inc");

		PB.Name = Players[1].getAttribute("jid").split("@")[0];
		PB.Time = Players[1].getAttribute("time");
		PB.Color = "black";
		PB.Inc = Players[1].getAttribute("inc");
	}
	else
	{
		PW.Name = Players[1].getAttribute("jid").split("@")[0];
		PW.Time = Players[1].getAttribute("time");
		PW.Color = "white";
		PW.Inc = Players[1].getAttribute("inc");

		PB.Name = Players[0].getAttribute("jid").split("@")[0];
		PB.Time = Players[0].getAttribute("time");
		PB.Color = "black";
		PW.Inc = Players[0].getAttribute("inc");
	}

	PWRating = MainData.GetUser(PW.Name).GetRatingList().GetRatingValue(GameType);
	if(PWRating == null)
	{
		PWRating = 1500;
	}

	PBRating = MainData.GetUser(PB.Name).GetRatingList().GetRatingValue(GameType);
	if(PBRating == null)
	{
		PBRating = 1500;
	}

	// If this message is used to check a exist game
	if(IqId == Consts.IQ_ID_GameEnterRoom)
	{
		// then enter to observer
		Buffer += GAME_StartObserverGame(GameId, PW, PB);
	}
	else
	// Result of get current games info
	{
		if(GameType != "untimed")
		{
			GameCenter.CurrentGames.add(PW, PWRating, PB, PBRating, GameType, Math.floor(PW.Time/60), "false", Moves, GameId);
			MainData.AddCurrentGames(PW, PWRating, PB, PBRating, GameType, PW.Time, "false", Moves, GameId);
		}
		else
		{
			GameCenter.CurrentGames.add(PW, PWRating, PB, PBRating, GameType, "&#8734", "false", Moves, GameId);
			MainData.AddCurrentGames(PW, PWRating, PB, PBRating, GameType, 0, "false", Moves, GameId);
		}
	}

	return Buffer;
}

/**
* @brief	Handle game room information
*
* Get game room information and show in interface
*
* @param 	XML	XMPP with game room erros
* @return 	none
* @author 	Rubens Suguimoto
*/
export function CURRENTGAME_HandleGameRoomInfoError(XML)
{
	var IqId = XML.getAttribute("id");
	var Consts = MainData.GetConst();

	var GameCenter = MainData.GetGamecenter();

	var Jid = XML.getAttribute("from");
	var GameId = Jid.split("@")[0];
	if(IqId == Consts.IQ_ID_GameEnterRoom)
	{
		WINDOW_Alert(UTILS_GetText("gamecenter_game_not_found_title"), UTILS_GetText("gamecenter_game_not_found"));
		GameCenter.CurrentGames.remove(GameId);
	}
}

