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
* Parse Iq's received from jabber
*/
function PARSER_ParseIq(XML)
{
	var Type = XML.getAttribute("type");
	var ID = XML.getAttribute("id");


	switch (Type)
	{
		case "result":
			switch (ID)
			{
				// Receive user list
				case MainData.Const.IQ_ID_GetUserList:
					CONTACT_HandleUserList(XML);
					break;
					
				/*
				case IQ_ID_GetRooms:
					ROOM_ParseRooms(XML);
					break;

				case IQ_ID_Rating:
					CONTACT_HandleRating(XML);
					break;

				case IQ_ID_CreateRoom:
					ROOM_HandleCreateRoom(XML);
					break;

				case IQ_ID_Match:
					CHALLENGE_HandleMatch(XML);
					break;

				case IQ_ID_Match_Error:
					CHALLENGE_MatchError(XML);
					break;

				case IQ_ID_Game:
					GAME_HandleGame(XML);
					break;

				case IQ_ID_Profile:
					PROFILE_ReceiveProfile(XML);
					break;

				case IQ_ID_Ongames:
					ONGAME_HandleOngames(XML);
					break;

				case IQ_ID_SearchUserGet:
					INTERFACE_GetUserName();
					break;
				
				case IQ_ID_Oldgame:
					OLDGAME_HandleOldGame(XML);
					break;
			
				// Reconecta no ChessD
				case IQ_ID_ChessdDisconnected:
		//			INTERFACE_ShowInformation("Reconectando ao servidor de xadrez...");
					// TODO -> Se o usuario estiver jogando?
					PARSER_SendXml(MAKER_MakeChessdPresence(1));
					break;

				case IQ_ID_SearchUserSet:
					SEARCH_HandleSearchUser(XML);
					// TODO Se for fazer buscar por Jabber, criar funcao pra mostrar resultado
					break;

				case IQ_ID_KickUser:
					// TODO mostrar mensagem que usuario foi kickado com sucesso
					break;

				case IQ_ID_NEWS:
					NEWS_Parser(XML);
					break;

				case IQ_ID_MoveToGroup:
			//		INTERFACE_ShowInformation("Usuário(s) movido(s) com sucesso!");
					break;

				case "sess_1":
					//alert("Sessao aberta!");
					break;
				
				case "bind_1":
					//alert("Bind ok!");
					break;

				default: break;
				*/
			}
			break;
		/*
		case "response":
			// Nome da sala de jogo criada
			RoomName = tmp.getElementsByTagName("room")[0];
			if (RoomName)
				GAME_StartGame(XML);
			break;


		case "set":
			switch(IQ_ID)
			{
		
				case IQ_ID_Invite:
					//CONTACT_HandleGroup(XML);
					CONTACT_HandleSubs(XML);
					break;
		
				case IQ_ID_Match:
					CHALLENGE_HandleMatch(XML);
					break;
			
				case IQ_ID_CHESS_ONLINE:
		//			INTERFACE_ShowInformation("Logado no servidor de Xadrez");
					break;

				case IQ_ID_CHESS_OFFLINE:
		//			INTERFACE_ShowInformation("Não está logado no servidor de Xadrez");
					break;

				default: break;
			}
			break;

		
		case "get":
			break;


		case "error":
			switch(IQ_ID)
			{
				case IQ_ID_CreateRoom:
					ROOM_HandleCreateRoom(XML);
					break;
		
				case IQ_ID_KickUser:
		//			INTERFACE_ShowInformation("Você não é dono da sala ou não possui os privilégios para kickar um usuário desta sala");
					break;
			
				default: break;
			}
			break;*/
		    
		default: break;
	}
}
