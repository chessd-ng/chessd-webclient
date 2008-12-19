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
