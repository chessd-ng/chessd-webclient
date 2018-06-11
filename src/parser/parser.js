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
* @file		parser/parser.js
* @brief	Parse XMPP received from jabber
*/

/**
* @brief	Receive and forward XML to controllers
*
* @param	XML	XMPP message
* @return	XMPP to send
* @author	Ulysses Bomfim
*/
function PARSER_ParseXml(XML)
{
	var XMLTag, Body, i;
	var Buffer = "";


	// Find bind body
	if (XML.getElementsByTagName("body") != null)
	{
		Body = XML.getElementsByTagName("body")[0];
	}
	else 
	{
		return 0;
	}

	// If bind return a invalid sid
	if (Body.childNodes.length == 0)
	{
		if (Body.getAttribute("type") == "terminate")
		{
			//MainData.ConnectionStatus = -1;
			MainData.SetConnectionStatus(-1);
			LOGIN_Disconnected();
			alert(UTILS_GetText("error_disconnected"));

			START_Restart();
		}
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

