function GAMECENTER_StartGameCenter()
{
	var GCenterObj = new GameCenterObj();
	var Center = document.getElementById("Center");
	
	GCenterObj.show(Center);
	
	MainData.SetGamecenter(GCenterObj);

	//Get your announces and announce from others users
	ANNOUNCE_GetAnnounceGames();
}

function GAMECENTER_ShowGameCenter()
{
	var GameCenterObj = MainData.GetGamecenter();
	var Center = document.getElementById("Center");

	GameCenterObj.show(Center);
}

function GAMECENTER_HideGameCenter()
{
	var GameCenterObj = MainData.GetGamecenter();
	GameCenterObj.hide();
}

function GAMECENTER_ShowAnnounce()
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

function GAMECENTER_ShowPostpone()
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

function GAMECENTER_ShowMatchOffer()
{
	var GameCenterObj = MainData.GetGamecenter();

	if(GameCenterObj.CurrentDiv != GameCenterObj.MatchOffer)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.MatchOffer.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.MatchOffer;
	}
}

function GAMECENTER_ShowTourney()
{
	var GameCenterObj = MainDataGet.Gamecenter();

	if(GameCenterObj.CurrentDiv != GameCenterObj.Torney)
	{
		GameCenterObj.CurrentDiv.hide();
		GameCenterObj.Torney.show(GameCenterObj.GameCenterDiv);

		GameCenterObj.CurrentDiv = GameCenterObj.Torney;
	}
}

function GAMECENTER_ShowCurrentGames()
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

//Temporary function to clear all current games
function GAMECENTER_ClearCurrentGames()
{
	var GameCenterObj = MainData.GetGamecenter();
	var GamesList = GameCenterObj.CurrentGames.CurrentGamesList;
	var i;

	
	for(i=GamesList.length-1; i>=0; i--)
	{
		GameCenterObj.CurrentGames.remove(GamesList[i].Id)
	}

}

//Sort functions
function GAMECENTER_AnnounceSortByUsername()
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
function GAMECENTER_AnnounceSortByCategory()
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
function GAMECENTER_AnnounceSortByRating()
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
function GAMECENTER_AnnounceSortByTime()
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
function GAMECENTER_AnnounceSortByInc()
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
function GAMECENTER_AnnounceSortByRated()
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
function GAMECENTER_AnnounceSortByPrivate()
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

////////

function GAMECENTER_PostponeSortByUsername()
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

function GAMECENTER_PostponeSortByRating()
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

function GAMECENTER_PostponeSortByCategory()
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
function GAMECENTER_PostponeSortByTime()
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
function GAMECENTER_PostponeSortByInc()
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

function GAMECENTER_PostponeSortByDate()
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
///////////////
function GAMECENTER_CurrentGamesSortByWRating()
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

function GAMECENTER_CurrentGamesSortByBRating()
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
function GAMECENTER_CurrentGamesSortByCategory()
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
function GAMECENTER_CurrentGamesSortByTime()
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
function GAMECENTER_CurrentGamesSortByMoves()
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
function GAMECENTER_CurrentGamesSortByRated()
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
////////
function GAMECENTER_MatchOfferSortByUsername()
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
function GAMECENTER_MatchOfferSortByTime()
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
function GAMECENTER_MatchOfferSortByInc()
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
function GAMECENTER_MatchOfferSortByCategory()
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
function GAMECENTER_MatchOfferSortByRating()
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
function GAMECENTER_MatchOfferSortByRated()
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
function GAMECENTER_MatchOfferSortByPrivate()
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
