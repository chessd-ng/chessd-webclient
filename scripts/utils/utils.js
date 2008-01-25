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


/**********************************
 * FUNCTIONS - EVENT LISTENERS
 ************************************/

/* Add a Element event listener
* SRC = http://snipplr.com/view/561/add-event-listener/
*/

// Cross-browser implementation of Element.addEventListener()
function UTILS_AddListener(Element, Type, Expression, Bubbling)
{
        Bubbling = Bubbling || false;

        if(window.addEventListener) // Standard
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
