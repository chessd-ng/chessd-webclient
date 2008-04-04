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
* Utils for webclient
*/


/**********************************
 * FUNCTIONS - XML SEARCH
 ************************************/

/**
* Identify client web browser
*/

function UTILS_IdentifyBrowser()
{
	var BrowserValue;
	var BrowserName=navigator.appName;


	// Firefox, Mozilla, Opera, etc.
	if (BrowserName.match("Netscape"))
	{
		BrowserValue = 1;
	}
	// Explorer
	else if (BrowserName.match("Microsoft Internet Explorer"))
	{
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
* Open a XML file and return XML DOM Tree
*/
function UTILS_OpenXMLFile(Url)
{	
	var XML, Parser;

	// Code for IE
	if (window.ActiveXObject)
	{
		XML = new ActiveXObject("Microsoft.XMLDOM");
	}
	// Code for Mozilla, Firefox, Opera, etc.
	else if (document.implementation && document.implementation.createDocument)
	{
		XML = document.implementation.createDocument("","",null);
	}
	else
	{
		alert('Seu navegador nao suporta XML DOM.');
	}

	XML.async = false;
	XML.load(Url);

	return(XML);
}


/**
* Return content of param
*/
function UTILS_GetTag(XML, TagName)
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
* Get Text for internacionalization
*/
function UTILS_GetText(TagName)
{
	return UTILS_GetTag(MainData.GetText, TagName);
}


/**
* Get param name for any browser
*/
function UTILS_GetNodeText(Node)
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

function UTILS_CreateElement(Element, Id, ClassName, Inner)
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
* Create cookies
*/
function UTILS_CreateCookie(CookieName,CookieValue,Days)
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
* Read cookies
*/
function UTILS_ReadCookie(CookieName)
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
* Erase cookies
*/
function UTILS_DeleteCookie(CookieName)
{
	UTILS_CreateCookie(CookieName,"",-1);
}

/**********************************
 * FUNCTIONS - VALIDATION
 ************************************/

/**
* Validate username
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
* Capitalize a word
*/
function UTILS_Capitalize(Word)
{
	return Word.charAt(0).toUpperCase() + Word.slice(1);
}


/**********************************
 * FUNCTIONS - EVENT LISTENERS
 ************************************/

/**
* Add a Element event listener
* SRC = http://snipplr.com/view/561/add-event-listener/
* Cross-browser implementation of Element.addEventListener()
*/
function UTILS_AddListener(Element, Type, Expression, Bubbling)
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
* Remove an event listener
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
		Element.cancelBubble = !(Bubbling); // ??? TODO -> precisa tirar isso?
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

function UTILS_ReturnEvent(event)
{
	if(MainData.Browser == 1) // Firefox
	{
		return event;
	}
	else //IE
	{
		return window.event;
	}
}

function UTILS_ReturnKeyCode(event)
{
	var KeyNum;

	if(MainData.Browser != 1) // IE
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
* Return time in format (XXhXX) from a given timestamp
* If timestamp is null, return current time
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
* Return the max_timestamp from rating to format(dd-mm-yyyy)
*
* @return	String
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

/************************************
 * FUNCTIONS - OBJECT OFFSETS       *
 ************************************/
/*
* Return object offsets (top and left)
*/
function UTILS_GetOffset(Obj)
{
	var Curleft, Curtop;

	if (Obj.offsetParent) 
	{
		Curleft = Obj.offsetLeft;
		Curtop = Obj.offsetTop;
		while (Obj = Obj.offsetParent)
		{
			Curleft += Obj.offsetLeft
			Curtop += Obj.offsetTop
		}
	return {X:Curleft, Y:Curtop};
	}
}

/**
* Get the first parent div in DOM tree
*/
function UTILS_GetParentDiv(Obj)
{
	do
	{
		if (Obj.tagName == "DIV")
			return Obj;
	}
	while(Obj = Obj.parentNode);
	return null
}


////HORIZONTAL INDEX CONVERT
//If CharNum is char return respective number
//If CharNum is number return respective char
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
* Convert a string board to a array (8x8) board
*
* @return Array x Array (8x8) of char
* @private
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
* Convert a chat string to a format that can't be interpretated
*
* @param 	str is string
* @return 	string with "<" and ">" replaced
* @author
*/
function UTILS_ConvertChatString(Str)
{
	var StrTmp;

	StrTmp = Str.replace(/</g,"&lt;");
	StrTmp = StrTmp.replace(/>/g,"&gt;");

	return StrTmp;
}

/************************************
 * FUNCTIONS - SORT FUNCTIONS       *
 ************************************/

/**
* Use to sort Userlist into ascendent order
* If x < y return -1
*    x > y return  1
*    x = y return  0
*
* @return integer	
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
* If x < y return  1
*    x > y return -1
*    x = y return  0
*
* @return integer	
* @author Danilo Yorinori
*/
function UTILS_SortByUsernameDsc(a, b) 
{
	var x = a.Username.toLowerCase();
	var y = b.Username.toLowerCase();
	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

/**
* Use to sort Userlist into descendent order by Rating
* If x < y return  1
*    x > y return -1
*    x = y return  0
*
* @return integer	
* @author Danilo Yorinori
*/
function UTILS_SortByRatingDsc(a, b) 
{
	var Type = UTILS_Capitalize(MainData.CurrentRating);
	var x;
	var y;

	if (Type == "Lightning")
	{
		if (a.Rating.Lightning != undefined)
		{
			x = parseInt(parseFloat(a.Rating.Lightning));
		}
		else
		{
			x = 0;
		}
		if (b.Rating.Lightning != undefined)
		{
			y = parseInt(parseFloat(b.Rating.Lightning));
		}
		else
		{
			y = 0;
		}
	}
	else if (Type == "Blitz")
	{
		if (a.Rating.Blitz != undefined)
		{
			x = parseInt(parseFloat(a.Rating.Blitz));
		}
		else
		{
			x = 0;
		}
		if (b.Rating.Blitz != undefined)
		{
			y = parseInt(parseFloat(b.Rating.Blitz));
		}
		else
		{
			y = 0;
		}
	}
	if (Type == "Standard")
	{
		if (a.Rating.Standard != undefined)
		{
			x = parseInt(parseFloat(a.Rating.Standard));
		}
		else
		{
			x = 0;
		}
		if (b.Rating.Standard != undefined)
		{
			y = parseInt(parseFloat(b.Rating.Standard));
		}
		else
		{
			y = 0;
		}
	}
	return ((x < y) ? 1 : ((x > y) ? -1 : 0));
}

function UTILS_GetLanguage()
{
	var Lang = navigator.browserLanguage;

	switch(Lang)
	{
		case "pt-br":
			return "pt_BR";

		case "en-us":
			return "en_US";

		case "zh-cn":
			return "zh_CN";

		default:
			return "pt_BR";
	}
}
