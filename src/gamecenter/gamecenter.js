import { MESSAGE_GameRoomList, MESSAGE_ChallengeGetAdjournList } from 'xmpp_messages/message.js';
import {
	UTILS_SortByTime,
	UTILS_SortByInc,
	UTILS_SortByRatingValue,
	UTILS_SortByUsernameAsc,
	UTILS_SortByPrivate,
	UTILS_SortByMoves,
	UTILS_SortByBRatingValue,
	UTILS_SortByDate,
	UTILS_SortByWRatingValue,
	UTILS_SortByRated,
	UTILS_SortByCategory,
} from 'utils/utils.js';
import { CONNECTION_SendJabber } from 'connection/connection.js';
import { ANNOUNCE_GetAnnounceGames } from 'challenge/announce.js';
import { CHALLENGE_PostponePresence } from 'challenge/adjourn.js';
import { GameCenterObj } from 'interface/gamecenter.js';
import { MainData } from 'start.js';

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
* @file		game/gamecenter.js
* @brief	This file has all function related to gamecenter
*/

/**
* @brief	Start game center object and show in web interface
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_StartGameCenter()
{
	var GCenterObj = new GameCenterObj();
	var Center = document.getElementById("Center");
	
	GCenterObj.show(Center);
	
	MainData.SetGamecenter(GCenterObj);

	//Get your announces and announce from others users
	ANNOUNCE_GetAnnounceGames();
}

/**
* @brief	Show game center object
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowGameCenter()
{
	var GameCenterObj = MainData.GetGamecenter();
	var Center = document.getElementById("Center");

	GameCenterObj.show(Center);
}

/**
* @brief	Hide game center object
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_HideGameCenter()
{
	var GameCenterObj = MainData.GetGamecenter();
	GameCenterObj.hide();
}

/**
* @brief	Show announced games in game center object and hide others tabs
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowAnnounce()
{
	var GameCenterObj = MainData.GetGamecenter();
	var Offset = 0;
	var MaxAnnounce = 10;
	var MaxTime = "", MinTime = "";
	var Category = ""; //All category

	if (GameCenterObj.CurrentDiv != GameCenterObj.Announce)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.Announce.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.Announce;

		//Get your announces and announce from others users
		ANNOUNCE_GetAnnounceGames();
	}
}

/**
* @brief	Show postponed games in game center object and hide others tabs
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowPostpone()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MaxPostpone = 10;
	var Offset = 0;

	if(GameCenterObj.CurrentDiv != GameCenterObj.Postpone)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.Postpone.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.Postpone;

		// Get Pospone match
		CONNECTION_SendJabber(MESSAGE_ChallengeGetAdjournList(MaxPostpone, Offset));
	}
}

/**
* @brief	Show received and send challenges in game center object and hide others tabs
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowMatchOffer()
{
	var GameCenterObj = MainData.GetGamecenter();

	if(GameCenterObj.CurrentDiv != GameCenterObj.MatchOffer)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.MatchOffer.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.MatchOffer;
	}
}

/**
* @brief	Show tourneys created in game center object and hide others tabs
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowTourney()
{
	var GameCenterObj = MainDataGet.Gamecenter();

	if(GameCenterObj.CurrentDiv != GameCenterObj.Torney)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.Torney.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.Torney;
	}
}

/**
* @brief	Show playing games in game center object and hide others tabs
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ShowCurrentGames()
{
	var GameCenterObj = MainData.GetGamecenter();

	if(GameCenterObj.CurrentDiv != GameCenterObj.CurrentGames)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.CurrentGames.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.CurrentGames;

		// Remove all current games
		GAMECENTER_ClearCurrentGames();		

		// Get all current games rooms
		CONNECTION_SendJabber(MESSAGE_GameRoomList());
	}

}

/**
* @brief	Remove all playing games in game center object
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_ClearCurrentGames()
{
	var GameCenterObj = MainData.GetGamecenter();
	var GamesList = GameCenterObj.CurrentGames.CurrentGamesList;
	var i;

	
	for(i=GamesList.length-1; i>=0; i--)
	{
		GameCenterObj.CurrentGames.remove(GamesList[i].Id)
	}

}

/**
* @brief	Sort announced games by username
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByUsername()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}

}
/**
* @brief	Sort announced games by category
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByCategory()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByCategory;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}
/**
* @brief	Sort announced games by user's rating
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByRating()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByRatingValue;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}
/**
* @brief	Sort announced games by game time
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByTime()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByTime;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}
/**
* @brief	Sort announced games by game increment
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByInc()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByInc;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}
/**
* @brief	Sort announced games by game rated
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByRated()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByRated;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}
/**
* @brief	Sort announced games by game private
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_AnnounceSortByPrivate()
{
	var GameCenterObj = MainData.GetGamecenter();
	var AnnounceList = MainData.GetAnnounceList();
	var SortMethod = UTILS_SortByPrivate;
	var i;
	var AnnounceItem;
	
	AnnounceList.sort(SortMethod);

	for(i=0; i<AnnounceList.length; i++)
	{
		AnnounceItem = AnnounceList[i];
		GameCenterObj.Announce.remove(AnnounceItem.Id);
		GameCenterObj.Announce.add(AnnounceItem.Player, AnnounceItem.Rating, (AnnounceItem.Time/60), AnnounceItem.Inc, AnnounceItem.Category, AnnounceItem.Rated, AnnounceItem.Private, AnnounceItem.Id);
	}
}

/**
* @brief	Sort postponed games by username
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByUsername()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}

}

/**
* @brief	Sort postponed games by user's rating
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByRating()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByRatingValue;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}
}

/**
* @brief	Sort postponed games by game category
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByCategory()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByCategory;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}


}
/**
* @brief	Sort postponed games by game time
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByTime()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByTime;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}
}
/**
* @brief	Sort postponed games by game increment
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByInc()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByInc;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}
}

/**
* @brief	Sort postponed games by game postpone date
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_PostponeSortByDate()
{
	var GameCenterObj = MainData.GetGamecenter();
	var PostponeList = MainData.GetPostponeList();
	var SortMethod = UTILS_SortByDate;
	var i;
	var PostponeItem;
	
	PostponeList.sort(SortMethod);

	for(i=0; i<PostponeList.length; i++)
	{
		PostponeItem = PostponeList[i];
		GameCenterObj.Postpone.remove(PostponeItem.Id);
		GameCenterObj.Postpone.add(PostponeItem.Player, PostponeItem.Time, PostponeItem.Inc, PostponeItem.Category, PostponeItem.Rating, PostponeItem.Date, PostponeItem.Id);

		CHALLENGE_PostponePresence(PostponeItem.Username, PostponeItem.Status)
	}
}

/**
* @brief	Sort current games by white player's rating
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByWRating()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByWRatingValue;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}

/**
* @brief	Sort current games by black player's rating
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByBRating()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByBRatingValue;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}
/**
* @brief	Sort current games by game category
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByCategory()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByCategory;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}
/**
* @brief	Sort current games by game time
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByTime()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByTime;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}
/**
* @brief	Sort current games by players moves done
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByMoves()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByMoves;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}
/**
* @brief	Sort current games by game rated
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_CurrentGamesSortByRated()
{
	var GameCenterObj = MainData.GetGamecenter();
	var CurrentGamesList = MainData.GetCurrentGamesList();
	var SortMethod = UTILS_SortByRated;
	var i;
	var CurrentGamesItem;
	
	CurrentGamesList.sort(SortMethod);

	for(i=0; i<CurrentGamesList.length; i++)
	{
		CurrentGamesItem = CurrentGamesList[i];
		GameCenterObj.CurrentGames.remove(CurrentGamesItem.Id);
		GameCenterObj.CurrentGames.add(CurrentGamesItem.WPlayer, CurrentGamesItem.WRating, CurrentGamesItem.BPlayer,  CurrentGamesItem.BRating, CurrentGamesItem.Category, CurrentGamesItem.Time, CurrentGamesItem.Rated, CurrentGamesItem.Moves, CurrentGamesItem.Id);
	}
}

/**
* @brief	Sort challenges by username
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByUsername()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByUsernameAsc;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
	}
}

/**
* @brief	Sort challenges by game time
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByTime()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByTime;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}

	}
}
/**
* @brief	Sort challenges by game increment
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByInc()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByInc;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}


	}
}
/**
* @brief	Sort challenges by game category
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByCategory()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByCategory;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}

	}
}
/**
* @brief	Sort challenges by user's rating
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByRating()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByRating;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}

	}
}
/**
* @brief	Sort challenges by game rated
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByRated()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByRated;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);
		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
	}
}
/**
* @brief	Sort challenges by game private
*
* @return       none
* @author       Rubens
*/
export function GAMECENTER_MatchOfferSortByPrivate()
{
	var GameCenterObj = MainData.GetGamecenter();
	var MatchOfferList = MainData.GetMatchOfferList();
	var SortMethod = UTILS_SortByPrivate;
	var i;
	var MatchOfferItem;
	
	MatchOfferList.sort(SortMethod);

	for(i=0; i<MatchOfferList.length; i++)
	{
		MatchOfferItem = MatchOfferList[i];
		GameCenterObj.MatchOffer.remove(MatchOfferItem.Id);

		if(MatchOfferItem.Category == "untimed")
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, MatchOfferItem.Time, MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
		else
		{
			GameCenterObj.MatchOffer.add(MatchOfferItem.Player, Math.floor(MatchOfferItem.Time/60), MatchOfferItem.Inc,  MatchOfferItem.Category, MatchOfferItem.Rated, MatchOfferItem.Private, MatchOfferItem.Id);
		}
	}
}
