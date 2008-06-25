function ChallengeMenuObj()
{
	var Challenge = INTERFACE_CreateChallengeMenu();

	// Attributes	
	this.Menu = Challenge.Div;
	this.MatchOfferUl = Challenge.MatchList;
	this.AnnounceUl = Challenge.AnnounceList;
	this.PostponeUl = Challenge.PostponeList;

	this.MatchOfferList = new Array();
	this.AnnounceList = new Array();
	this.PostponeList = new Array();

	// Methods
	this.addMatch = INTERFACE_AddMatchOffer;
	this.removeMatch = INTERFACE_RemoveMatch;

	this.addAnnounce = INTERFACE_AddAnnounce;
	this.removeAnnounce = INTERFACE_RemoveAnnounce;

	this.addPostpone = INTERFACE_AddPostpone;
	this.removePostpone = INTERFACE_RemovePostpone;
	this.updatePostpone = INTERFACE_UpdatePostpone;

	this.showMenu = INTERFACE_ShowChallengeMenu;
	this.HideMenu = INTERFACE_HideChallengeMenu;

	this.showMatch = INTERFACE_ShowMatchOfferList;
	this.showAnnounce= INTERFACE_ShowAnnounceList;
	this.showPostpone = INTERFACE_ShowPostponeList;

	this.hideMatch = INTERFACE_HideMatchOfferList;
	this.hideAnnounce= INTERFACE_HideAnnounceList;
	this.hidePostpone = INTERFACE_HidePostponeList;
}

function INTERFACE_CreateChallengeMenu()
{
	var ChallengeDiv = UTILS_CreateElement("div","ChallengeMenu");
	var MatchOfferList = UTILS_CreateElement("ul");
	var AnnounceList = UTILS_CreateElement("ul");
	var PostponeList = UTILS_CreateElement("ul");

	/*
	var MatchOfferTitle = UTILS_CreateElement("span",null,"title",UTILS_GetText("match_offer_list_title"));
	var AnnounceTitle = UTILS_CreateElement("span",null,"title",UTILS_GetText("annouce_list_title"));
	var PostponeTitle = UTILS_CreateElement("span",null,"title",UTILS_GetText("postpone_title_title"));
	*/
	var MatchOfferTitle = UTILS_CreateElement("span","title",null,"Meus desafios");
	var AnnounceTitle = UTILS_CreateElement("span","title",null,"Anúncios");
	var PostponeTitle = UTILS_CreateElement("span","title",null,"Partidas adiadas");


	MatchOfferList.appendChild(MatchOfferTitle);
	AnnounceList.appendChild(AnnounceTitle);
	PostponeList.appendChild(PostponeTitle);

	ChallengeDiv.appendChild(MatchOfferList);
	ChallengeDiv.appendChild(AnnounceList);
	ChallengeDiv.appendChild(PostponeList);

	return { Div:ChallengeDiv,  MatchList:MatchOfferList, AnnounceList:AnnounceList, PostponeList:PostponeList};
}

function INTERFACE_AddMatchOffer(Oponent, Time, Inc, Rated, Private, MatchId)
{
	var Item = UTILS_CreateElement("li",null,Oponent.Color);

	var PName, PTime, PInc, PRated, PPrivate, PButton;
	var ItemObj = new Object();

	PName = UTILS_CreateElement("p","name", null, Oponent.Name);
	PTime = UTILS_CreateElement("p","time", null, Oponent.Time);
	PInc = UTILS_CreateElement("p","inc", null, Oponent.Inc);

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

	PPrivate = UTILS_CreateElement("p","private","true");
	
	if(Rated == false)
	{
		PRated = UTILS_CreateElement("p","rated","false","rating");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated","true","rating");
	}

	PButton = UTILS_CreateElement("p","button","decline");

	PButton.onclick = function(){
		//TODO -> send a decline challenge to cancel offer
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
		return "";

	}

	Item = this.MatchOfferList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.MatchOfferList.splice(i,1);
}



function INTERFACE_AddAnnounce(Player, Time, Inc, Rated, Private, MatchId)
{
	var Item = UTILS_CreateElement("li",null,Player.Color);

	var PName, PTime, PInc, PRated, PPrivate, PButton;
	var ItemObj = new Object();

	PName = UTILS_CreateElement("p","name", null, Player.Name);
	PTime = UTILS_CreateElement("p","time", null, Player.Time);
	PInc = UTILS_CreateElement("p","inc", null, Player.Inc);

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

	PPrivate = UTILS_CreateElement("p","private","true");
	
	if(Rated == false)
	{
		PRated = UTILS_CreateElement("p","rated","false","rating");
	}
	else
	{
		PRated = UTILS_CreateElement("p","rated","true","rating");
	}

	PButton = UTILS_CreateElement("p","button","decline");
	/*
	if(Player.Name == MainData.Username)
	{
		PButton = UTILS_CreateElement("p","button","decline");
		PButton.onclick = function(){
			//TODO -> send a cancel/accept to cancel offer
		}
	}
	else
	{
		PButton = UTILS_CreateElement("p","button","accept");
		PButton.onclick = function(){
			//TODO -> send a cancel/accept to cancel offer
		}
	}
	*/


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
		return "";
	}

	Item = this.AnnounceList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.AnnounceList.splice(i,1);
}



function INTERFACE_AddPostpone(Oponent, Category, Date, PostponeId)
{
	//var Item = UTILS_CreateElement("li",null,Oponent.Color);
	var Item = UTILS_CreateElement("li",null,"undefined");

	var PName, PCategory, PDate, PButton;
	var ItemObj = new Object();

	PName = UTILS_CreateElement("p","name",null,Oponent.Name);
	PCategory = UTILS_CreateElement("p","category",null,Category);
	PDate = UTILS_CreateElement("p","date",null,Date);
	PButton = UTILS_CreateElement("p","button","accept");
	PButton.onclick = function(){
		//TODO -> send a decline challenge to cancel offer
	}

	Item.appendChild(PName);
	Item.appendChild(PCategory);
	Item.appendChild(PDate);
	Item.appendChild(PButton);

	ItemObj.Item = Item;
	ItemObj.Button = PButton;
	ItemObj.Id = PostponeId;
	ItemObj.OponentName = Oponent.Name;
	ItemObj.OponentColor = Oponent.Color;

	this.PostponeList.push(ItemObj);
	this.PostponeUl.appendChild(Item);
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
		return "";
	}

	Item = this.PostponeList[i].Item;

	//Remove from interface
	Item.parentNode.removeChild(Item);

	//Remove from match list
	this.PostponeList.splice(i,1);
}

function INTERFACE_UpdatePostpone(OponentName, OponentStatus)
{
	var i=0;
	var Item, Button;
	var ItemObj;
	
	// Find match
	while(( i < this.PostponeList.length)&&(this.PostponeList[i].OponentName != OponentName))
	{
		i++;
	}

	// If not found, do nothing
	if(i == this.PostponeList.length)
	{
		return "";
	}

	Item = this.PostponeList[i].Item;
	Button = this.PostponeList[i].Button;
	ItemObj = this.PostponeList[i];

	if(OponentStatus == "offline")
	{
		Item.className = "offline";
		Button.className = "inative";
	}
	else
	{
		//Item.className = ItemObj.OponentColor;
		Item.className = "undefined";
		Button.className = "accept";
	}
}

function INTERFACE_ShowChallengeMenu(Element)
{
	if(Element != null)
	{
		Element.appendChild(this.Menu)
	}
	else
	{
		document.body.appendChild(this.Menu)
	}
	this.Menu.style.display = "block";
}

function INTERFACE_ShowMatchOfferList()
{
	this.MatchOfferUl.style.display = "block";
}

function INTERFACE_ShowAnnounceList()
{
	this.AnnounceUl.style.display = "block";
}

function INTERFACE_ShowPostponeList()
{
	this.PostponeUl.style.display = "block";
}


function INTERFACE_HideChallengeMenu()
{
	this.Menu.style.display = "hide";
}

function INTERFACE_HideMatchOfferList()
{
	this.MatchOfferUl.style.display = "hide";
}

function INTERFACE_HideAnnounceList()
{
	this.AnnounceUl.style.display = "hide";
}

function INTERFACE_HidePostponeList()
{
	this.PostponeUl.style.display = "hide";
}

