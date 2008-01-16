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

/**
* Identify client web browser
*/

function UTILS_IdentifyBrowser()
{
	var BrowserValue;
	var BrowserName=navigator.appName;

        if (BrowserName.match("Netscape"))
        {
                BrowserValue = 1; //Firefox, Mozilla, Opera, etc.
        }

        else if (BrowserName.match("Microsoft Internet Explorer"))
        {
                BrowserValue = 0; //Explorer
        }

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
function UTILS_GetParam(XML, ParamName)
{
	var Node = XML.getElementsByTagName(ParamName)[0];

	//Internet Explorer
	if (MainData.Browser == "0")
	{
		return Node.text;
	}
	// Mozilla, firefox, galeon
	else
	{
		return Node.textContent;
	}
}

/**
* Get param name for any browser
*/
function UTLIS_GetNodeText(Node)
{
	//Internet Explorer
	if (MainData.Browser == "0")
	{
		return Node.text;
	}
	// Mozilla, firefox, galeon
	else
	{
		return Node.textContent;
	}
}
