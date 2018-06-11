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

/**
* @file		utils/utils.js
* @brief	Utils and auxiliars functions 
*/

import { MainData } from 'index.js'

/**********************************
 * FUNCTIONS - XML SEARCH
 ************************************/

/**
* @brief	Identify client web browser and return a value 
*
* @return	Browser Number (-1=Not identified,  0=IE, 1=FF2[gecko != 1.9], 2=FF3[gecko1.9])
* @author 	Rubens Suguimoto
*/
export function UTILS_IdentifyBrowser()
{
	var BrowserValue;
	var BrowserName=navigator.appName;


	// Firefox, Mozilla, Opera, etc.
	if (BrowserName.match("Netscape"))
	{
		/*
		// Code from:
		// http://www.javascriptkit.com/javatutors/navigator.shtml
		if ((/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) ||
		   (/Iceweasel[\/\s](\d+\.\d+)/.test(navigator.userAgent)))
		{
			//test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
			// capture x.x portion and store as a number
			var ffversion=new Number(RegExp.$1)
			if (ffversion>=3)
			{
				BrowserValue = 2;
			}
			else
			{
				BrowserValue = 1;
			}
		}
		// Quick fix to detect epiphany with gecko 1.9;
		else if (/Epiphany[\/\s](\d+\.\d+)/.test(navigator.userAgent)||
		        (/Galeon[\/\s](\d+\.\d+)/.test(navigator.userAgent)))
		*/ 
		if (
		   (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) ||
		   (/Iceweasel[\/\s](\d+\.\d+)/.test(navigator.userAgent))||
		   (/Epiphany[\/\s](\d+\.\d+)/.test(navigator.userAgent)) ||
		   (/Galeon[\/\s](\d+\.\d+)/.test(navigator.userAgent))
		   )
		{
			var geckoVersion;
			var UserAgent = navigator.userAgent.split(" ");
			var i=0;

			while((!UserAgent[i].match("rv:")) && ( i < UserAgent.length))
			{
				i++;
			}

			if(i != UserAgent.length)
			{
				geckoVersion = UserAgent[i].split(":")[1];
				if (geckoVersion.match("1.9"))
				{
					BrowserValue = 2;
				}
				else
				{
					BrowserValue = 1;
				}
				//alert(UserAgent[i] +"\n"+i+"\n"+geckoVersion+"\n"+BrowserValue);
			}
			else
			{
				alert("User agent without Gecko version.");
			}
		}
		else
		{
			BrowserValue = 1;
		}
			
	}
	// Internet Explorer
	else if (BrowserName.match("Microsoft Internet Explorer"))
	{
		/*
		// Check for different versions of IE
		var IEv = navigator.userAgent.split(";")[1].replace(/ /g,"");
		
		if (IEv == "MSIE6.0")
			BrowserValue = 0;
		else if (IEv == "MSIE7.0")
			BrowserValue = 3;
		else
			BrowserValue = 3;
		*/
		BrowserValue = 0;
	}
	// Other
	else
	{
		alert("Seu navegador pode não funcionar corretamente nesse site");
		BrowserValue = -1;
	}

	return BrowserValue;
}

/**
* @brief	Open a XML file, create and return XML DOM Tree
*
* @param	Url	XML file path
* @return	XML DOM tree
* @author 	Rubens Suguimoto & Danilo Yorinori
*/
export function UTILS_OpenXMLFile(Url)
{	
	var XML;
	if (window.XMLHttpRequest)
	{
		XML=new window.XMLHttpRequest();
		XML.open("GET",Url,false);
		XML.send("");
		return XML.responseXML;
	}
	// IE 5 and IE 6
	else if (ActiveXObject("Microsoft.XMLDOM"))
	{
		XML=new ActiveXObject("Microsoft.XMLDOM");
		XML.async=false;
		XML.load(Url);
		return XML;
	}
	alert('Your browser doesn\'t support XML DOM.');
	return null;
}


/**
* @brief	Find and return node in XML tree with TagName and return this node content
*
* @param	XML		XML tree
* @param	TagName 	String used to find node
* @return	Node content string
* @author 	Rubens Suguimoto
*/
export function UTILS_GetTag(XML, TagName)
{
	var Node = XML.getElementsByTagName(TagName);

	// If dont find any tag
	if (Node == null)
	{
		return null;
	}
	// Return only first match
	else
	{
		Node = Node[0];
	}

	return UTILS_GetNodeText(Node);
}


/**
* @brief	 Get text from language selected.
* If TagName was not founded in language seleted, then found in Default language text.
* We assume that default language has all tags.
*
* @param	TagName 	Text tag
* @return	Text content of node with TagName
* @author 	Rubens Suguimoto
*/
export function UTILS_GetText(TagName)
{
	var Text = UTILS_GetTag(MainData.GetText(), TagName);
	var i=0;

	if(Text == null)
	{
		Text = UTILS_GetTag(MainData.GetDefaultText(), TagName);
	}

	Text = Text.replace(/\t/g,"").replace(/\n/g,"");

	return Text;
}


/**
* @brief	Get element content in any browser
*
* @param	Node 	DOM element
* @return	Node content string
* @author 	Rubens Suguimoto
*/
export function UTILS_GetNodeText(Node)
{
	if (!Node)
		return null;

	// Internet Explorer
	if (Node.text)
	{
		return Node.text;
	}
	// Mozilla, firefox, galeon
	else
	{
		return Node.textContent;
	}
}


/**********************************
 * FUNCTIONS - ELEMENT MANIPULATION
 ************************************/

/**
* @brief	Create a DOM element
*
* @param	Element		Element tag name
* @param	Id		Element identification attribute
* @param	ClassName	Element class name attribute
* @param	Inner		Element content
* @return	New element with some attributes set up
* @author 	Pedro Rocha
*/
export function UTILS_CreateElement(Element, Id, ClassName, Inner)
{
	try
	{
		var Node = document.createElement(Element);
	}
	catch(e)
	{
		return null
	}

	if (Id != null)
		Node.id = Id;

	if (ClassName != null)
		Node.className = ClassName;

	if (Inner != null)
		Node.innerHTML = Inner;

	return Node;
}


/**********************************
 * FUNCTIONS - COOKIE MANIPULATION
 ************************************/

/**
* @brief	Create webclient cookies
*
* @param	CookieName	String
* @param	CookieValue	Data to be store in cookie
* @param	Days		Cookie expire period
* @author 	Pedro Rocha
*/
function UTILS_CreateCookie(CookieName, CookieValue, Days)
{
	var Expires, Data;

	if (Days)
	{
		Data = new Date();
		Data.setTime(Data.getTime()+(Days*24*60*60*1000));
		Expires = "; expires="+Data.toGMTString();
	}
	else 
		Expires = "";

	document.cookie = CookieName+"="+CookieValue+Expires;
}

/**
* @brief	Read webclient cookies
*
* @param	CookieName 	String
* @author 	Pedro Rocha
*/
export function UTILS_ReadCookie(CookieName)
{
	var Cookies = document.cookie.split("; ");

	for (var i=0; i<Cookies.length; i++)
	{
		if (Cookies[i].search(CookieName) != -1)
			return Cookies[i].replace(CookieName+"=","");
	}
	return "";
}

/**
* @brief	Remove webclient cookies from browser
*
* @param	CookieName	String
* @author 	Pedro Rocha
*/
function UTILS_DeleteCookie(CookieName)
{
	UTILS_CreateCookie(CookieName,"",-1);
}

/**********************************
 * FUNCTIONS - VALIDATION
 ************************************/

/**
* @brief	Check if username is a valid checking characters
*
* @param	Username 	String
* @return	True or False
* @author 	Pedro Rocha
*/
function UTILS_ValidateUsername(Username)
{
	if (Username.match(/[^0-9a-z-_.]{1,}/))
	{
		return false;
	}
	else
	{
		return true;
	}
}

/**
* @brief Capitalize a word
*
* @param	 Word 	String
* @return	 String with first character changed to upper case
* @author Danilo Kiyoshi Simizu Yorinori
*/
export function UTILS_Capitalize(Word)
{
	if (Word)
		return Word.charAt(0).toUpperCase() + Word.slice(1);
	else
		return "";
}

/**
* @brief	 Set breaklines inside texts
* Put a "<br />" tag at Obj.innerHTML if it pass the Width limit
*
* @param	 Obj 	Cell table's object
* @param	 Width 	max Base object 
* @return String
* @author Danilo Kiyoshi Simizu Yorinori
*/
function UTILS_BreakString(Obj, Width)
{
	var Text = Obj.innerHTML;
	var ObjWidth, TrWidth;
	var Broke = false;
	var Old;
	var i;

	// IE
	if (MainData.GetBrowser() == 0)
	{
		TrWidth = Width.Offset;
	}
	else // Other browsers
	{
		TrWidth = Width.Client;
	}

	if (Obj.clientWidth > TrWidth) {
		Obj.innerHMTL = "";

		for (i=0; i<=Text.length; i++)
		{
			if (Broke)
			{
				Old =Obj.innerHTML;
				Obj.innerHTML = Obj.innerHTML + Text.slice(i-1,i); 
			}
			else
			{
				Old = Obj.innerHTML;
				Obj.innerHTML = Text.slice(0,i);
			}

			if (Obj.clientWidth > TrWidth)
			{
				Obj.innerHTML = Old +"<br />" + Text.slice(i-1,i); 
				Broke = true;
			}
		}
	}
}

/**
* @brief	 Remove NumChars characteres of Word
*
* If word has more than number of characteres defined in NumChars, remove excced characters, else do nothing;
*
* @param	Word		String with some text
* @param	NumChars	Max numbers of characters
* @return	New string with words changed
* @author	Rubens Suguimoto
*/
function UTILS_ShortString(Word, NumChars)
{
	var ShortWord;
	var NumChs;

	//Check if NumChars is defined. If not, use default value;
	if(NumChars != null)
	{
		NumChs = NumChars;
	}
	else
	{
		NumChs = 5;
	}

	if(Word.length > NumChs)
	{
		ShortWord = Word.slice(0,NumChs);
		ShortWord = ShortWord + "...";
	}
	else
	{
		ShortWord = Word;
	}
	return ShortWord;
}

/**
* @brief	 Check if string has some banned words.
* If exist replace all characters to '*' and return new string.
*
* @param	Str	String with some text
* @return	New string with words changed
* @author	Rubens Suguimoto
*/
function UTILS_BannedWords(Str)
{
	var AdminCenterObj = MainData.GetAdmincenter();
	var i,j;
	var StrResult = Str;
	var Tmp, Word;
	var Expr;
	
	// Check if all words exists in string
	for(i=0; i<AdminCenterObj.Words.WordsList.length; i++)
	{
		Tmp = "";
		Word = AdminCenterObj.Words.WordsList[i].Id;

		for(j=0; j<Word.length; j++)
		{
			Tmp += "*";
		}
		
		Expr = new RegExp("\\b"+Word+"\\b","gi");
		// Replace banned word to new word with '*'
		StrResult = StrResult.replace(Expr, Tmp);
	}

	return StrResult;
}

/**********************************
 * FUNCTIONS - EVENT LISTENERS
 ************************************/

/**
* @brief	Add an event listener from element
* Return true if event has added or false if event hasn't added
* Code from: http://snipplr.com/view/561/add-event-listener/
*
* @param	Element	DOM element
* @param	Type	Event type
* @param	Expression	Function or action to add
* @param	Bubbling	Transmite event to others elements overlayed
* @return	True or false
* @author	Rubens Suguimoto
*/
export function UTILS_AddListener(Element, Type, Expression, Bubbling)
{
	Bubbling = Bubbling || false;

	if (window.addEventListener) // Standard
	{
		Element.addEventListener(Type, Expression, Bubbling);
		return true;
	} 
	else if(window.attachEvent) // IE
	{
		Element.attachEvent('on' + Type, Expression);
		Element.cancelBubble = !(Bubbling);
		return true;
	} 
	else
	{ 
		return false;
	}
}

/**
* @brief 	Remove an event listener from element
* Return true if event has removed or false if event hasn't removed
*
* @param	Element	DOM element
* @param	Type	Event type
* @param	Expression	Function or action to remove
* @param	Bubbling	Transmite event to others elements overlayed
* @return	True or false
* @author	Rubens Suguimoto
*/
function UTILS_RemoveListener(Element, Type, Expression, Bubbling)
{
	Bubbling = Bubbling || false;

	if (window.addEventListener) // Standard
	{
		Element.removeEventListener(Type, Expression, Bubbling);
		return true;
	} 
	else if(window.attachEvent) // IE
	{
		Element.detachEvent('on' + Type, Expression);
		Element.cancelBubble = !(Bubbling);
		return true;
	} 
	else
	{ 
		return false;
	}
}


/**********************************
 * FUNCTIONS - CROSS BROWSER EVENT
 ************************************/

/**
* @brief	Check web browser type and return event object
* @param	event	Javascript event
* @return	Return event according to web browser
* @author	Rubens Suguimoto
*/
function UTILS_ReturnEvent(event)
{
	if(MainData.GetBrowser() == 0) // IE
	{
		return window.event;
	}
	else //FIREFOX
	{
		return event;
	}
}

/**
* @brief Check web browser type and return event key code correctly
* @param	event Javascript event
* @return	Key code number (integer)
* @author	Rubens Suguimoto
*/
function UTILS_ReturnKeyCode(event)
{
	var KeyNum;

	if(MainData.GetBrowser() == 0) // IE
	{
		KeyNum = window.event.keyCode;
	}
	else // Netscape/Firefox/Opera
	{
		KeyNum = event.which;
	}
	return KeyNum;
}

/**********************************
 * FUNCTIONS - TIME CONVERSION
 ************************************/

/**
* @brief Convert timestamp format to new format (XXhXX).
*
* If timestamp is null, return current time.
* 
* @param	Timestamp	Timestamp integer value
* @return	Timestamp in (XXhXX) format.
* @author	Danilo Yorinori
*/
function UTILS_GetTime(Timestamp)
{
	var Offset, Time, Hour, Min, Now, NewTime;


	Now = new Date();

	if (Timestamp)
	{
		Offset = Now.getTimezoneOffset()/60;
		Time = Timestamp.split("T")[1];
		Hour = (Time.split(":")[0] - Offset + 24) % 24;
		Min = Time.split(":")[1];

		NewTime = "("+Hour+"h"+Min+")";
	}
	else
	{
		NewTime = "("+Now.getHours()+"h";

		// Insert zero before minutes < 10
		if (Now.getMinutes() < 10)
		{
			NewTime += "0"+Now.getMinutes();
		}
		else
		{
			NewTime += Now.getMinutes();
		}
		NewTime += ")";
	}
	return NewTime;
}

/**
* @brief	Return the max_timestamp from rating to format(dd-mm-yyyy)
*
* @param	TimeStamp	Timestamp integer value
* @return	String with date format in dd-mm-yyyy
* @see		PROFILE_HandleRatings()
* @author	Danilo Yorinori
*/
function UTILS_ConvertTimeStamp(TimeStamp)
{
	var DateTime = TimeStamp.split("T")[0];
	var Year = DateTime.split("-")[0];
	var Month = DateTime.split("-")[1];
	var Day = DateTime.split("-")[2];

	return Day+"/"+Month+"/"+Year;

}

/**
* @brief	Return the date-time string to search old games 
*
* @param	TimeStamp	Date string (dd/mm/yyyy)
* @param	Type		begin or end (yyyy-mm-ddTnn:nn:nnZ)
* @return	String
* @see		INTERFACE_SetSearchButton(Node)
* @author	Danilo Yorinori
*/
function UTILS_ConvertSearchDate(TimeStamp, Type)
{
	var Day, Month, Year;
	var SDate = "";

	if (TimeStamp == "") {
		return "";
	}
	else if (TimeStamp.match(/^\d{2}\/\d{2}\/\d{4}/g)==null) {
		return null;
	}

	Day = TimeStamp.split("/")[0];
	Month = TimeStamp.split("/")[1];
	Year = TimeStamp.split("/")[2];

	SDate += Year+"-"+Month+"-"+Day+"T";
	if (Type == "begin")
	{
		SDate +="00:00:00Z";
	}
	else if (Type == "end")
	{
		SDate +="23:59:59Z";
	}
	return SDate;
}

/************************************
 * FUNCTIONS - OBJECT OFFSETS       *
 ************************************/
/*
* @brief	Return object offsets (top and left)
* @param	Obj	DOM element
* @return	Tuple of X and Y (pixels) position
* @author	Pedro Rocha
*/
function UTILS_GetOffset(Obj)
{
	var Curleft, Curtop;

	if (Obj.offsetParent) 
	{
		Curleft = Obj.offsetLeft;
		Curtop = Obj.offsetTop;
		Obj = Obj.offsetParent;
		while (Obj)
		{
			Curleft += Obj.offsetLeft
			Curtop += Obj.offsetTop
			Obj = Obj.offsetParent;
		}
		return {X:Curleft, Y:Curtop};
	}
	else
	{
		return {X:0, Y:0};
	}
}

/**
* @brief	Get the first parent div in DOM tree, starting from some element
* @param	Obj	DOM element
* @return	First parent div in DOM tree
* @author	Pedro Rocha 
*/
function UTILS_GetParentDiv(Obj)
{
	do
	{
		if (Obj.tagName == "DIV")
			return Obj;
		Obj = Obj.parentNode;
	}
	while(Obj);
	return null;
}


/**
* @brief Convert horizontal board index. If param is a number convert to repesctive char else convert to respective number
* 
* @param	CharNum		Character or integer number
* @return	Character or integer number (depend of param) 
* @author Rubens Suguimoto
*/
function UTILS_HorizontalIndex(CharNum)
{
	var Row = new Array();
	var i=1;

	Row[1] = 'a';
	Row[2] = 'b';
	Row[3] = 'c';
	Row[4] = 'd';
	Row[5] = 'e';
	Row[6] = 'f';
	Row[7] = 'g';
	Row[8] = 'h';

	if(isNaN(CharNum)) //Char
	{
		while(i < 9)
		{
			if(Row[i] == CharNum)
			{
				return i;
			}
			i++;
		}
		return null;
	}
	else //number
	{
		if(( CharNum > 0) && (CharNum < 9) )
		{
			return Row[CharNum];
		}
		else
		{
			return null;
		}
	}
}


/**
* @brief Convert a string board to a array (8x8) board
* 
* @return Array x Array (8x8) of char
* @author Rubens Suguimoto
*/
function UTILS_String2Board(BoardString)
//BoardString is a array of char that contains chess board
{
        var Lin1, Lin2, Lin3, Lin4, Lin5, Lin6, Lin7, Lin8;
        var tmpArray;

        BoardString = BoardString.replace(/1/g,"-");
        BoardString = BoardString.replace(/2/g,"--");
        BoardString = BoardString.replace(/3/g,"---");
        BoardString = BoardString.replace(/4/g,"----");
        BoardString = BoardString.replace(/5/g,"-----");
        BoardString = BoardString.replace(/6/g,"------");
        BoardString = BoardString.replace(/7/g,"-------");
        BoardString = BoardString.replace(/8/g,"--------");

        tmpArray = BoardString.split("/",8);

        Lin1 = tmpArray[0];
        Lin2 = tmpArray[1];
        Lin3 = tmpArray[2];
        Lin4 = tmpArray[3];
        Lin5 = tmpArray[4];
        Lin6 = tmpArray[5];
        Lin7 = tmpArray[6];
        Lin8 = tmpArray[7];

        var Board = new Array(Lin1, Lin2, Lin3, Lin4, Lin5, Lin6, Lin7, Lin8);

        return Board;
}

/************************************
 * FUNCTIONS - CONVERT STRING       *
 ************************************/

/**
* @brief Convert a chat string to a format that can't be interpretated
*
* @param 	Str	string to be some characters replace
* @return 	string with '<' , '>', '&' and '"' replaced
* @author	Rubens Suguimoto
*/
function UTILS_ConvertChatString(Str)
{
	var StrTmp;

	StrTmp = Str.replace(/&/g,"&amp;");
	StrTmp = StrTmp.replace(/</g,"&lt;");
	StrTmp = StrTmp.replace(/>/g,"&gt;");
	StrTmp = StrTmp.replace(/"/g,"&quot;");

	return StrTmp;
}

/**
* @brief Convert default lang to jabber lang format (lower case)
*
* @param 	Default Language in web browser format (ex: pt-BR)
* @return 	Language in jabber format (ex: pt-br)
* @author	Rubens Suguimoto
*/
function UTILS_JabberLang(DefaultLang)
{
	if (DefaultLang)
		return DefaultLang.substr(0, 2)+"-"+DefaultLang.substr(3, 5).toLowerCase();
	else
		return "";
}

/*
* @brief Convert time in seconds to days, hours, minuts.
*
* @param 	time number
* @return 	time formated in string
* @author	Rubens Suguimoto
*/
function UTILS_ConvertTime(Seconds)
{
	var Day, Month, Year;
	var Sec, Min, Hour;
	var TimeFormat = "";

	Sec = Seconds % 60;
	Min = Math.floor(Seconds / 60) % 60;
	Hour  = Math.floor(Seconds / 3600) % 24;

	Day = Math.floor(Seconds / (3600*24)) % 30;
	Month = Math.floor(Seconds / (3600*24*30)) % 12;
	Year = Math.floor(Seconds / (3600*24*30*12));

	// Concat Years
	if(Year != 0)
	{
		TimeFormat += Year + UTILS_GetText("profile_year");
	}
	// Concat Months
	if(Month != 0)
	{
		TimeFormat += " "+Month + UTILS_GetText("profile_month");
	}
	// Concat Days
	if(Day != 0)
	{
		TimeFormat += " "+Day + UTILS_GetText("profile_day");
	}


	// Concat hour
	if(Hour != 0)
	{
		TimeFormat +=" ";
		if(Hour < 10)
		{
			TimeFormat += "0";
		}
		TimeFormat += Hour+":";
	}
	else
	{
		TimeFormat += " 00:" ;
	}


	// Concat minutes
	if(Min != 0)
	{
		if(Min < 10)
		{
			TimeFormat += "0";
		}
		TimeFormat += Min+":";
	}
	else
	{
		TimeFormat += "00:" ;
	}

	
	// Concat seconds
	if(Sec != 0)
	{
		if(Sec < 10)
		{
			TimeFormat += "0";
		}
		TimeFormat += Sec;
	}
	else
	{
		TimeFormat += "00" ;
	}

	return TimeFormat;
}

/*
* @brief Disable selection text inside a element
* Code from: http://ajaxcookbook.org/disable-text-selection/
*
* @param 	Element	HTML elements
* @return 	False	Aways return false to disable seletion
* @author	Rubens Suguimoto
*/
function UTILS_DisableSelection(Element)
{
	// IE disable selection method
	Element.onselectstart = function() {
		return false;
	};

	Element.unselectable = "on";
	Element.style.MozUserSelect = "none";
	Element.style.cursor = "default";
	
	return false;
}

/************************************
 * FUNCTIONS - SORT FUNCTIONS       *
 ************************************/

/**
* Use to sort Userlist into ascendent order
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortByUsernameAsc(a, b) 
{
	var x = a.Username.toLowerCase();
	var y = b.Username.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

/**
* Use to sort Userlist into descendent order
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortByUsernameDsc(a, b) 
{
	var x = a.Username.toLowerCase();
	var y = b.Username.toLowerCase();
	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

/**
* @brief Use to sort Online's userlist into descendent order by Rating
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortOnlineByRatingDsc(a, b) 
{
	var Category = MainData.GetOnlineCurrentRating();
	return UTILS_SortByRatingDsc(Category, a, b); 
}

/**
* @brief Use to sort Contact's userlist into descendent order by Rating
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortContactByRatingDsc(a, b) 
{
	var Category = MainData.GetContactCurrentRating();
	return UTILS_SortByRatingDsc(Category, a, b); 
}

/**
* @brief Use to sort Rooms's userlist into descendent order by Rating
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortRoomByRatingDsc(a, b) 
{
	var Room = MainData.GetCurrentRoom();
	var Category = Room.GetRoomCurrentRating();

	return UTILS_SortByRatingDsc(Category, a, b); 
}


/**
* @brief Use to sort Userlist into ascendent order
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortByFullnameAsc(a, b) 
{
	var x = a.Fullname.toLowerCase();
	var y = b.Fullname.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

/**
* @brief Use to sort Userlist into descendent order
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortByFullnameDsc(a, b) 
{
	var x = a.Fullname.toLowerCase();
	var y = b.Fullname.toLowerCase();
	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

/**
* @brief Use to sort Userlist into descendent order by Rating
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Danilo Yorinori
*/
function UTILS_SortByRatingDsc(Category, a, b) 
{
	var x;
	var y;
	
	x = a.Rating.GetRatingValue(Category);
	y = b.Rating.GetRatingValue(Category);

	if(x == null)
	{
		x = 0;
	}
	else
	{
		x = parseInt(x);
	}

	if(y == null)
	{
		y = 0;
	}
	else
	{
		y = parseInt(y);
	}
	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

/**
* @brief Use to sort Userlist into descendent order by WPLayer attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByWUsername(a,b)
{
	var x = a.WPlayer.toLowerCase();
	var y = b.WPlayer.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by BPLayer attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByBUsername(a,b)
{
	var x = a.BPlayer.toLowerCase();
	var y = b.BPlayer.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Category attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByCategory(a,b)
{
	var x = a.Category.toLowerCase();
	var y = b.Category.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Punish attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByPunish(a,b)
{
	var x = a.Punish.toLowerCase();
	var y = b.Punish.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Incident attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByIncident(a,b)
{
	var x = a.Incident.toLowerCase();
	var y = b.Incident.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Reason attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByReason(a,b)
{
	var x = a.Reason.toLowerCase();
	var y = b.Reason.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Period attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByPeriod(a,b)
{
	var x = a.Period.toLowerCase();
	var y = b.Period.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Level attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByLevel(a,b)
{
	var x = a.Level.toLowerCase();
	var y = b.Level.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Date attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByDate(a,b)
{
	var x = a.Date.toLowerCase();
	var y = b.Date.toLowerCase();
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Rating attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByRatingValue(a,b)
{
	var x = parseInt(a.Rating);
	var y = parseInt(b.Rating);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Time attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByTime(a,b)
{
	var x = parseInt(a.Time);
	var y = parseInt(b.Time);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Inc attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByInc(a,b)
{
	var x = parseInt(a.Inc);
	var y = parseInt(b.Inc);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Moves attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByMoves(a,b)
{
	var x = parseInt(a.Moves);
	var y = parseInt(b.Moves);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Rated attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByRated(a,b)
{
	var x = a.Rated;
	var y = b.Rated;
	return ((x != y) ? -1 : ((x == y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by Private attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByPrivate(a,b)
{
	var x = a.Private;
	var y = b.Private;
	return ((x != y) ? -1 : ((x == y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by WRating attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByWRatingValue(a,b)
{
	var x = parseInt(a.WRating);
	var y = parseInt(b.WRating);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}
/**
* @brief Use to sort Userlist into descendent order by BRAting attribute
*
* @return integer. If x < y return  1, x > y return -1, x = y return  0
* @author Rubens Suguimoto
*/
function UTILS_SortByBRatingValue(a,b)
{
	var x = parseInt(a.BRating);
	var y = parseInt(b.BRating);
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}

/************************************
 * FUNCTIONS - BROWSER LANGUAGE     *
 ************************************/
/*
 * @brief Detect browser language
 * Code from: http://www.criarweb.com/faq/conseguir_idioma_navegador_cliente.html
 *
 * @return Language string (i.e.: pt-BR, en-US, etc.)
 */
function UTILS_GetLanguage()
{
	var Lang
	
	Lang = navigator.browserLanguage;
	// Check for web browser type
	if (navigator.userAgent.indexOf("Opera")!=-1)
	{
		Lang=navigator.language;
	}
	else if (navigator.appName == "Netscape")
	{
		Lang=navigator.language;
	}
	else
	{
		Lang=navigator.browserLanguage;
	}

	switch(Lang)
	{
		case "pt-BR":
			return "pt_BR";

		case "en-US":
			return "en_US";

		case "zh-CN":
			return "zh_CN";

		default:
			return "pt_BR";
	}
}

/************************************
 * FUNCTIONS - TOURNEY              *
 ************************************/
/**
* @brief	Validate dates
*
* @param	Day	Day's number
* @param	Month	Month's number
* @param	Year	Year's number
* @param	Hour	Hour's number
* @param	Minutes	Minutes's number
* @return	integer
* @author	Danilo Yorinori
*/
function UTILS_ValidateDate(Day,Month,Year,Hour,Minutes) 
{
	var Time = new Date();

	if ((Day == "") || (isNaN(Number(Day))))
	{
		return 1; // day error
	}
	else if ((Month == "") || (isNaN(Number(Month))))
	{
		return 2; // month error
	}
	else if ((Year == "") || (isNaN(Number(Year))))
	{
		return 3; // year error
	}
	else if ((Hour == "") || (isNaN(Number(Hour))))
	{
		return 4;// hour error
	}
	else if ((Minutes == "") || (isNaN(Number(Minutes))))
	{
		return 5; // minute error
	}
	else
	{
		Time.setFullYear(Year*1, Month-1, Day*1);
		Time.setHours(Hour, Minutes, 0, 0);

		if(Time.getMinutes() == Minutes)
		{
			if(Time.getHours() == Hour)
			{
				if(Time.getDate() == Day)
				{
					if(Time.getMonth() == Month-1)
					{
						if(Time.getFullYear() == Year)
						{
							return Time.getTime(); // valid date
						}
						else
						{
							return 3 // year error
						}
					}
					else
					{
						return 2; // month error
					}
				}
				else
				{
					return 1; // day error
				}
			}
			else
			{
				return 4; // hour error
			}
		}
		else
		{
			return 5; // minute error
		}
	}
}

/**
* @brief	Validate Tourney password
*
* @param	Password	String of password
* @return	integer
* @author	Danilo Yorinori
*/
function UTILS_ValidateTourneyPassword(Password)
{
	// Password length must be between 5 and 11
	if ((Password.length > 5) && (Password.length < 11))
	{
		if (Password.match(/[^0-9a-zA-Z-_.]{1,}/))
		{
			return 0; // invalid characters
		}
		else
		{
			return 1; // valid password
		}
	}
	else
	{
		return -1; // invalid length
	}
}

/**
* @brief	Validate Tourney nme
*
* @param	Password	String of password
* @return	String
* @author	Danilo Yorinori
*/
function UTILS_ValidateTourneyName(Name)
{
	if (Name.match(/[^0-9a-zA-Z-_.]{1,}/))
	{
		return ""; // Invalid name
	}
	else
	{
		return Name; // Valid name
	}
}
