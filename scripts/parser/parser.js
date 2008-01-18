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
* Parse XMPP received from jabber
*/


/**
* Receive and forward XML to controllers
*/
function PARSER_ParseXml(XML)
{
	var XMLTag, Body, i;
	var Buffer = "";


	MainData.SendWait = 1;
	
	// Find bind body
	try 
	{
		Body = XML.getElementsByTagName("body")[0];
	}
	catch(e)
	{
		return 0;
	}

	// Verify all tags 
	for (i=0; i < Body.childNodes.length; i++)
	{
		XMLTag = Body.childNodes[i];

		switch(XMLTag.tagName)
		{
			case "undefined": 
				break;

			case "error": 
				Buffer += PARSER_ParseError(XMLTag);
				break;

			case "presence": 
				Buffer += PARSER_ParsePresence(XMLTag);
				break;

			case "message": 
				Buffer += PARSER_ParseChat(XMLTag);
				break;

			case "iq": 
				Buffer += PARSER_ParseIq(XMLTag);
				break;

			default: break;
		}
	}
	return Buffer;
}

