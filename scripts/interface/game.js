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
*
* C3SL - Center for Scientific Computing and Free Software
*/

/**
* Interface functions that control game
*/ 

/***************************
** GAME BOARD OBJECT
*****************************/

function INTERFACE_GameBoardObj(PWName, PBName, PlayerColor, Size)
{
	this.game = null;
	this.board = null;
	this.timer = new Object();
	this.name = new Object();
	this.photo = new Object();
	this.moveList = null;
	this.eventButtons = null;
	
	//Constructor
	this.constructor = INTERFACE_CreateGame;
	this.constructor(PWName, PBName, PlayerColor, Size);

	//PUBLIC
	this.removePiece = INTERFACE_RemovePiece;
	this.insertPiece = INTERFACE_DisplayPiece;
	this.show = INTERFACE_ShowGame;
	this.hide = INTERFACE_HideGame;

	this.removeGame = INTERFACE_RemoveGame;

	this.updateBoard = INTERFACE_UpdateBoard;
	this.setBoard = INTERFACE_DisplayBoard;
	this.clearBoard = INTERFACE_ClearBoard

	this.setWTimer = INTERFACE_SetWTimer;
	this.setBTimer = INTERFACE_SetBTimer;

	this.setWPhoto = INTERFACE_SetWPhoto;
	this.setBPhoto = INTERFACE_SetBPhoto;

	this.addMove = INTERFACE_AddMove;
	this.removeMove = INTERFACE_RemoveMove;

}


function INTERFACE_ShowGame(Div)
{
	var Div = document.getElementById("Main");

	if (Div)
	{
		Div.appendChild(this.game);
		return true;
	}
	return false;
}

function INTERFACE_HideGame()
{
	var ParentGame = this.game.parentNode;

	ParentGame.removeChild(this.game);
}

function INTERFACE_RemoveGame()
{
	var ParentGame = this.game.parentNode;
	ParentGame.removeChild(this.game);

	delete(this);
}

function INTERFACE_SetWTimer(TimeSec)
{
	var min, sec;
	var minStr, secStr;

	min = Math.round(TimeSec / 60);
	sec = TimeSec % 60;

	if(min < 10)
	{
		minStr = "0"+min;
	}
	else
	{
		minStr = min;
	}

	if(sec < 10)
	{
		secStr = "0"+sec;
	}
	else
	{
		secStr = sec;
	}

	this.timer.wtimer.innerHTML = minStr+":"+secStr;
}

function INTERFACE_SetBTimer(TimeSec)
{
	var min, sec;
	var minStr, secStr;

	min = Math.round(TimeSec / 60);
	sec = TimeSec % 60;

	if(min < 10)
	{
		minStr = "0"+min;
	}
	else
	{
		minStr = min;
	}

	if(sec < 10)
	{
		secStr = "0"+sec;
	}
	else
	{
		secStr = sec;
	}

	this.timer.btimer.innerHTML = minStr+":"+secStr;
}

function INTERFACE_SetWPhoto(PhotoType, PhotoStr)
{
	this.photo.wphoto.src = "data:"+PhotoType+";base64,"+PhotoStr;
}

function INTERFACE_SetBPhoto(PhotoType, PhotoStr)
{
	this.photo.bphoto.src = "data:"+PhotoType+";base64,"+PhotoStr;
}

function INTERFACE_AddMove(NumTurn, Move, WTime, BTime)
{
	
	var Item;
	if(NumTurn % 2)
	{
		Item = UTILS_CreateElement("li",null,"black",null);
	}
	else
	{
		Item = UTILS_CreateElement("li",null,"white",null);
	}

	var Num = UTILS_CreateElement("span", null, null, NumTurn+".");

	var WTimeMin = Math.round(WTime / 60);
	var WTimeMinStr;
	if(WTimeMin < 10)
	{
		WTimeMinStr = "0"+WTimeMin;
	}
	else
	{
		WTimeMinStr = WTimeMin;
	}

	var WTimeSec = WTime % 60;
	var WTimeSecStr;
	if(WTimeSec < 10)
	{
		WTimeSecStr = "0"+WTimeSec;
	}
	else
	{
		WTimeSecStr = WTimeSec;
	}

	var BTimeMin = Math.round(BTime / 60);
	var BTimeMinStr;
	if(BTimeMin < 10)
	{
		BTimeMinStr = "0"+BTimeMin;
	}
	else
	{
		BTimeMinStr = BTimeMin;
	}

	var BTimeSec = BTime % 60;
	var BTimeSecStr;
	if(BTimeSec < 10)
	{
		BTimeSecStr = "0"+BTimeSec;
	}
	else
	{
		BTimeSecStr = BTimeSec;
	}

	var MoveSpan = UTILS_CreateElement("span", null, null, Move);
	var WTimerSpan = UTILS_CreateElement("span",null,null, WTimeMinStr+":"+WTimeSecStr);
	var BTimerSpan = UTILS_CreateElement("span",null,null, BTimeMinStr+":"+BTimeSecStr);

	Item.appendChild(Num);
	Item.appendChild(MoveSpan);
	Item.appendChild(WTimerSpan);
	Item.appendChild(BTimerSpan);

	this.moveList.appendChild(Item);
}

function INTERFACE_RemoveMove()
{
	this.moveList.removeChild(this.moveList.lastChild);
}

/***************************
** CONSTRUCTOR
*****************************/
//PUBLIC
function INTERFACE_CreateGame(PWName, PBName, PlayerColor,Size)
{
	if(Size == null)
	{
		Size = 38;
	}

	var GameDiv = UTILS_CreateElement("div","GameDiv",null,null);
	GameDiv.style.width = (Size*8) + 195 + 20 + "px";
	//Size*8 = board width
	//+195 = GameInfo width
	//+20  = limit margin to "float:left" style works

	var GameInfo = UTILS_CreateElement("div","GameInfoDiv",null,null);
	var GameTab = UTILS_CreateElement("div","GameInfoTab",null,null);
	
	var Board = UTILS_CreateElement("div","TBoard",null,null);

	var BoardBlocks = INTERFACE_CreateBoard(PlayerColor,Size);
	
	//Div, BTimer, WTimer
	var Timer = INTERFACE_CreateTimer();

	//Div, ButtonList
	var Options = INTERFACE_CreateGameOptions();
	
	//Div, List
	var MoveList =INTERFACE_CreateMoveList();

	//Div, WPhoto, BPhoto, WName, BName
	var Photo = INTERFACE_CreatePhoto(PWName,PBName);

	Board.appendChild(BoardBlocks);
	Board.appendChild(INTERFACE_CreateVerticalIndex(PlayerColor,Size));
	Board.appendChild(INTERFACE_CreateHorizontalIndex(PlayerColor,Size));
	GameDiv.appendChild(Board);

	GameInfo.appendChild(Photo.Div);
	GameInfo.appendChild(Timer.Div);
	GameTab.appendChild(INTERFACE_CreateTab(Options.Div, MoveList.Div));
	GameInfo.appendChild(GameTab);

	GameDiv.appendChild(GameInfo);

	//return {GameDiv:GameDiv, Board:BoardBlock, WTimer:Timer.WTimer, BTimer:Timer.BTimer, WPhoto:Photo.WPhoto, BPhoto:Photo.BPhoto, MoveList:MoveList.List};
	//
	//SET ATTRIBUTES
	this.game = GameDiv;
	this.board = BoardBlocks;
	this.timer.wtimer = Timer.WTimer;
	this.timer.btimer = Timer.BTimer;
	this.photo.wphoto = Photo.WPhoto;
	this.photo.bphoto = Photo.BPhoto;
	this.moveList = MoveList.List;
	this.eventButtons = Options.ButtonList;//{draw, resign, finish, stop, givetime, promoQ, promoR, promoB, promoN}

}

//Private
function INTERFACE_CreateBoard(Color, Size)
{
	var Board = UTILS_CreateElement("div","Board",null,null);
	var x,y;
	var casa,color;

	var lin,col;

	var TamBlock;

	if(Size == null)
	{
		TamBlock = 38;
	}
	else
	{
		TamBlock = Size;
	}

	Board.style.width = (TamBlock*8)+"px";
	Board.style.height= (TamBlock*8)+"px";

	for (y = 0; y < 8; y++)
	{
		for (x = 0; x < 8; x++)
		{
			casa = document.createElement("div");

			casa.style.height = TamBlock+"px";
			casa.style.width = TamBlock+"px";

			//Atribui cor nas casas
			if ((x+y) % 2 == 1)
			{
				casa.className = "black";
			}
			else
			{
				casa.className = "white";
			}

			if(Color == "w")
			{
				col = 7-x;
				lin = 7-y;
			}
			else
			{
				col = x;
				lin = y;
			}
			casa.id = UTILS_HorizontalIndex(col+1)+""+(lin+1);

			Board.appendChild(casa);
		}
	}
	return Board;
}

//Private
function INTERFACE_CreateVerticalIndex(Color, Size)
{
	var IndexV = document.createElement("ul");
	var IndexItem;
	var i;

	var SizeBlock;

	if(Size == null)
	{
		SizeBlock = 38;
	}
	else
	{
		SizeBlock = Size;
	}

	IndexV.className = "IndexV";
	IndexV.id = "IndexV";

	for (i=8; i>=1; i--)
	{
		IndexItem = document.createElement("li");
		// Indexa de acordo com a cor
		//if (Color=='w')
		if (Color=='b')
			IndexItem.innerHTML = i;
		else
			IndexItem.innerHTML = 9-i;
		IndexItem.className = "IndexVItem";
		IndexItem.style.width = SizeBlock+"px";
		IndexItem.style.height = SizeBlock+"px";
		IndexV.appendChild(IndexItem);

	}

	return IndexV;
}

//Private
function INTERFACE_CreateHorizontalIndex(Color, Size)
{
/*	var Col = new Array(8); // Vetor com posicoes horizontais
		Col[1] = 'h';
		Col[2] = 'g';
		Col[3] = 'f';
		Col[4] = 'e';
		Col[5] = 'd';
		Col[6] = 'c';
		Col[7] = 'b';
		Col[8] = 'a';
*/
	// Criando os indices do tabuleiro
	/* 
	var IndexH = document.createElement("ul");
	IndexH.className = "IndexH";
	IndexH.id = "IndexH";
	*/

	var IndexH = UTILS_CreateElement("ul", "IndexH", "IndexH", null)

	var IndexItem;
	var i;

	var SizeBlock;
	if(Size == null)
	{
		SizeBlock = 38;
	}
	else
	{
		SizeBlock = Size;
	}

	for (i=8; i>=1; i--)
	{
		/*
		IndexItem = document.createElement("li");
		IndexItem.className = "IndexHItem";
		*/

		var IndexItem = UTILS_CreateElement("li", null, "IndexHItem", null);
		if (Color=='b')
			IndexItem.innerHTML = UTILS_HorizontalIndex(i);
		else
			IndexItem.innerHTML = UTILS_HorizontalIndex(9-i);

		IndexItem.style.width = SizeBlock+"px";
		IndexItem.style.height = SizeBlock+"px";

		IndexH.appendChild(IndexItem);
	}
	return IndexH;
}

//Private
function INTERFACE_CreatePhoto(PWName, PBName)
{
	var PhotoDiv = UTILS_CreateElement("div", "PhotoDiv", null, null);
	var PWPhoto = UTILS_CreateElement("img", "PWPhoto", null, null);
	var PBPhoto = UTILS_CreateElement("img", "PBPhoto", null, null);
	var VS = UTILS_CreateElement("span", "vs", null, "x");
	var PWName = UTILS_CreateElement("span", "PWName", null, PWName);
	var PBName = UTILS_CreateElement("span", "PBName", null, PBName);

	var PWPawn = UTILS_CreateElement("div", "PWPawn", null, null);
	var PBPawn = UTILS_CreateElement("div", "PBPawn", null, null);
	
	
	PhotoDiv.appendChild(PWPhoto);
	PhotoDiv.appendChild(VS);
	PhotoDiv.appendChild(PBPhoto);
	PhotoDiv.appendChild(PWPawn);
	PhotoDiv.appendChild(PBPawn);
	PhotoDiv.appendChild(PWName);
	PhotoDiv.appendChild(PBName);
	
	return {Div:PhotoDiv, WPhoto:PWPhoto, BPhoto:PBPhoto, WName:PWName, BName:PBName};
}



//Private
function INTERFACE_CreateTimer()
{
	var TimerDiv = UTILS_CreateElement("div", "TimerDiv", null, null);
	var PWTimer = UTILS_CreateElement("span", "PWTimer", null, "00:00");
	var PBTimer = UTILS_CreateElement("span", "PBTimer", null, "00:00");
	
	TimerDiv.appendChild(PWTimer);
	TimerDiv.appendChild(PBTimer);

	return {Div:TimerDiv, WTimer:PWTimer, BTimer:PBTimer};
}



//Private
function INTERFACE_CreateGameOptions()
{
	/*
	var GameOptionsDiv = document.createElement("div");
	GameOptionsDiv.id = "GameOptionsDiv";
	*/


	//TODO MODIFICAR OS INNERHTML NO FORMATO INTERNACIONALIZADO
	var GameOptionDiv = UTILS_CreateElement("div", "GameOptionDiv", null, null);

	var OptionList = UTILS_CreateElement("ul","GameOptionList", null,null);
	var OptionDraw = UTILS_CreateElement("li","GameOptionDraw", null,"Empatar");
	var OptionResign = UTILS_CreateElement("li","GameOptionResign", null,"Desistir");
	var OptionFinish = UTILS_CreateElement("li","GameOptionFinish", null,"Encerrar");
	var OptionStop = UTILS_CreateElement("li","GameOptionStop", null,"Pausar/adiar");
	var OptionGiveTime = UTILS_CreateElement("li","GameOptionGiveTime", null,"Dar tempo ao adversário");
	var OptionPromotion = UTILS_CreateElement("li","GameOptionPromotion", "promotion","Promoção do Peão");

	var OptionSelectPromotion = UTILS_CreateElement("select", "GameSelectPromotion", null,null);
	var OptionSelectQ = UTILS_CreateElement("option", "GameSelectQ", null,"Rainha");
	var OptionSelectR = UTILS_CreateElement("option", "GameSelectT", null,"Torre");
	var OptionSelectB = UTILS_CreateElement("option", "GameSelectB", null,"Bispo");
	var OptionSelectN = UTILS_CreateElement("option", "GameSelectN", null,"Cavalo");

	var ButtonList = new Array();
	ButtonList.push(OptionDraw);
	ButtonList.push(OptionResign);
	ButtonList.push(OptionFinish);
	ButtonList.push(OptionStop);
	ButtonList.push(OptionGiveTime);
	ButtonList.push(OptionSelectQ);
	ButtonList.push(OptionSelectR);
	ButtonList.push(OptionSelectB);
	ButtonList.push(OptionSelectN);

	OptionSelectPromotion.appendChild(OptionSelectQ);
	OptionSelectPromotion.appendChild(OptionSelectR);
	OptionSelectPromotion.appendChild(OptionSelectB);
	OptionSelectPromotion.appendChild(OptionSelectN);


	OptionList.appendChild(OptionDraw);
	OptionList.appendChild(OptionResign);
	OptionList.appendChild(OptionFinish);
	OptionList.appendChild(OptionStop);
	OptionList.appendChild(OptionGiveTime);

	OptionPromotion.appendChild(OptionSelectPromotion);
	OptionList.appendChild(OptionPromotion);
	

	GameOptionDiv.appendChild(OptionList);

	return {Div:GameOptionDiv, ButtonList:ButtonList};

}

//Private
function INTERFACE_CreateMoveList()
{
	/*
	var MoveListDiv = document.createElement("Div");
	MoveListDiv.id = "MoveListDiv";
	*/

	var MoveListDiv = UTILS_CreateElement("div", "MoveListDiv", null, null);

	var MoveList = UTILS_CreateElement("ul", "MoveList", null, null);
	
	MoveListDiv.appendChild(MoveList);

	return {Div:MoveListDiv, List:MoveList};
}

//Private
function INTERFACE_CreateTab(Div1, Div2)
{
	var Tab = UTILS_CreateElement("div", "InfoTab", null, null);

	var Tab1 = UTILS_CreateElement("span", "InfoTab1", "active", "Opções");
	var Tab2 = UTILS_CreateElement("span", "InfoTab2", null, "Lances");

	Div2.style.visibility = "hidden";

	UTILS_AddListener(Tab1, "click", function(){Tab1.className="active"; Tab2.className=""; Div1.style.visibility = "visible"; Div2.style.visibility = "hidden" },false);
	UTILS_AddListener(Tab2, "click", function(){Tab1.className=""; Tab2.className="active"; Div1.style.visibility = "hidden"; Div2.style.visibility = "visible" },false);


	Tab.appendChild(Tab1);
	Tab.appendChild(Tab2);

	Tab.appendChild(Div1);
	Tab.appendChild(Div2);

	return Tab;
}


/**************************************
** PIECES FUNCTION
****************************************/

//Private
function INTERFACE_NewPiece(Piece, PlayerColor, Size)
{
	var PieceImg;
	var PieceName, PieceTitle;
	var DragPieceW, DrawPieceB;
	var PieceDir = "images/pieces";

	if(PlayerColor == "w")
	{
		DragPieceW = function(event){ UTILS_StartDragPiece(this, Size); return false;};
		DragPieceB = function(){return false;};
	}
	else
	{
		DragPieceW = function(){return false;};
		DragPieceB = function(event){ UTILS_StartDragPiece(this, Size); return false;};
	}

/*
	if(Size == null)
	{
		PieceDir += 38;
	}
	else
	{
		PieceDir = Size;
	}
*/
	//TODO Mudar as strings do PieceTitle para o formato internacionalizado
	PieceImg = UTILS_CreateElement("img",null, null, null);
	switch(Piece)
	{
                case 'R':
	                PieceImg.src = PieceDir+"/wtower.png";
        	        PieceImg.title = "Torre Branca";
                        PieceImg.onmousedown = DragPieceW;
                        break;
                //Cavalos
                case 'N':
        	        PieceImg.src = PieceDir+"/wknight.png";
	                PieceImg.title = "Cavalo Branco";
                        PieceImg.onmousedown = DragPieceW;
                        break;
                //Bispos        
                case 'B':
                        PieceImg.src = PieceDir+"/wbishop.png";
        	        PieceImg.title = "Bispo Branco";
                        PieceImg.onmousedown = DragPieceW;
                        break;
                //Dama
                case 'Q':
                        PieceImg.src = PieceDir+"/wqueen.png";
	                PieceImg.title = "Rainha Branca";
                        PieceImg.onmousedown = DragPieceW;
                        break;
                //Rei
                case 'K':
                        PieceImg.src = PieceDir+"/wking.png";
        	        PieceImg.title = "Rei Branco";
                        PieceImg.onmousedown = DragPieceW;
                        break;
                //Peoes
                case 'P':
                        PieceImg.src = PieceDir+"/wpawn.png";
	                PieceImg.title = "Peão Branco";
                        PieceImg.onmousedown = DragPieceW;
                        break;

                //PRETAS
                //Torres
                case 'r':
                        PieceImg.src = PieceDir+"/btower.png";
              		PieceImg.title = "Torre Preta";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                //Cavalos
                case 'n':
                        PieceImg.src = PieceDir+"/bknight.png";
                	PieceImg.title = "Cavalo Preto";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                //Bispos
                case 'b':
                        PieceImg.src = PieceDir+"/bbishop.png";
                	PieceImg.title = "Bispo Preto";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                //Rei
                case 'q':
                        PieceImg.src = PieceDir+"/bqueen.png";
                	PieceImg.title = "Rei Preto";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                //Damas
                case 'k':
                        PieceImg.src = PieceDir+"/bking.png";
                	PieceImg.title = "Rainha Preta";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                //Peoes
                case 'p':
                        PieceImg.src = PieceDir+"/bpawn.png";
                	PieceImg.title = "Peão Preto";
                        PieceImg.onmousedown = DragPieceB;
                        break;
                default:
                        break;

	}

	PieceImg.style.position = "absolute";

	PieceImg.style.width = Size+"px";
	PieceImg.style.height = Size+"px";

	return PieceImg;
}

//Private
function INTERFACE_FindPiece(BoardDiv, Id)
{
	var BoardList = BoardDiv.getElementsByTagName("img");
	var i=0;

	while(i<BoardList.length)
	{
		if(BoardList[i].getAttribute("id") == Id)
		{
			return BoardList[i]
		}
		i++;
	}
	return null;
}

//Public
function INTERFACE_RemovePiece(Line, Col)
{
	var Board = this.board; 
	var Piece = INTERFACE_FindPiece(Board, UTILS_HorizontalIndex(Col+1)+(Line+1));

	if(Piece != null)
	{
		Board.removeChild(Piece);
		return Piece;
	}
}

//Public
function INTERFACE_DisplayPiece(Piece, Line, Col, PlayerColor, Size)
{
	var Board = this.board; 
	var BorderOffSet = 3;

	var PieceImg = INTERFACE_NewPiece(Piece, PlayerColor, Size);

	if(PlayerColor == "w")
	{
		PieceImg.style.left = (Col*Size + BorderOffSet)+"px";
		PieceImg.style.top = ((Line)*Size + BorderOffSet)+"px";
	}
	else
	{
		PieceImg.style.left = ((7*Size) - (Line*Size) + BorderOffSet)+"px";
		PieceImg.style.top  = ((7*Size) - (Col*Size) + BorderOffSet)+"px";
	}

	PieceImg.id = UTILS_HorizontalIndex(Col+1)+(Line+1);
	
	Board.appendChild(PieceImg);
}

//Public
function INTERFACE_UpdateBoard(OldBoard, NewBoard, PlayerColor, Size)
{
        var i,j;
        var Piece;

	for(i=0 ; i<8 ; i++)
	{
		for(j=0 ; j<8 ; j++)
		{
			if(OldBoard[i].charAt(j) != NewBoard[i].charAt(j))
			{
				Piece = NewBoard[i].charAt(j);
				if(Piece == '-')
				{
					this.removePiece(i,j);
				}
				else
				{
					//Remover a peça no tauleiro anterior
					if(OldBoard[i].charAt(j)!= "-")
					{
						this.removePiece(i,j);
					}
					this.insertPiece(Piece, i,j, PlayerColor, Size);
				}
			}	
		}
	}
}

//Public
function INTERFACE_ClearBoard()
{
	var i,j;

	for(i=0 ; i<8 ; i++)
	{
		for(j=0 ; j<8 ; j++)
		{
			this.removePiece(i,j);
		}
	}
}

//Public
function INTERFACE_DisplayBoard(BoardArray, PlayerColor, Size)
{
        var i,j;
        var Piece;

	this.clearBoard();

	for(i=0 ; i<8 ; i++)
	{
		for(j=0 ; j<8 ; j++)
		{
			Piece = BoardArray[i].charAt(j);
			if(Piece != "-")
			{
				this.insertPiece(Piece, i,j, PlayerColor, Size);
			}
		}
	}
}

/*****************************
*	FUNCTIONS - WINDOW
******************************/

/**
*	Create elements of draw game request window and return div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_DrawGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowDrawGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'DrawDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_draw_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of resign window and return div
*
* @param	User	User's nickname that resigned the game
* @return	Div; Array
* @see		WINDOW_ResignGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowResignGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'ResignDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_resign_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of adjourn game request window and returns div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_PauseGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowAdjournGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'AdjournDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_adjourn_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of abort game request window and returns div
*
* @param	User	User's nickname that sent the request
* @return	Div; Array
* @see		WINDOW_AbortGame();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowAbortGameWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Accept, Decline;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'AbortDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_abort_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');
	Accept = UTILS_CreateElement('input',null,'button');
	Accept.type = "button";
	Accept.value = UTILS_GetText("game_accept");
	Buttons.push(Accept);

	Decline = UTILS_CreateElement('input',null,'button');
	Decline.type = "button";
	Decline.value = UTILS_GetText("game_decline");
	Buttons.push(Decline);

	ButtonsDiv.appendChild(Accept);
	ButtonsDiv.appendChild(Decline);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of checkmate winner window and return div
*
* @param	User	User's nickname that won the game by checkmate
* @return	Div; Array
* @see		WINDOW_CheckmateWin();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCheckmateWinWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CheckmateDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_checkmatew_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of checkmate looser window and return duv
*
* @param	User	User's nickname that lost the game by checkmate
* @return	Div; Array
* @see		WINDOW_CheckmateLose();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowCheckmateLoseWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'CheckmateDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_checkmatel_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of time winner window and return div
*
* @param	User	User's nickname that won the game by time
* @return	Div; Array
* @see		WINDOW_TimeWin();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowTimeWinWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'TimeDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_timew_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}

/**
*	Create elements of time looser window and return duv
*
* @param	User	User's nickname that lost the game by time
* @return	Div; Array
* @see		WINDOW_TimeLose();
* @author Danilo Kiyoshi Simizu Yorinori
*/
function INTERFACE_ShowTimeLoseWindow(User)
{
	var Div;

	var TextDiv, Label;

	var ButtonsDiv, Ok;

	var Buttons = new Array();

	Div = UTILS_CreateElement('div', 'TimeDiv');

	TextDiv = UTILS_CreateElement('div', 'TextDiv');

	Label = UTILS_CreateElement('span', null, null, UTILS_GetText("game_timel_text").replace(/%s/,UTILS_Capitalize(User)));

	ButtonsDiv = UTILS_CreateElement('div','ButtonsDiv');

	Ok = UTILS_CreateElement('input',null,'button');
	Ok.type = "button";
	Ok.value = UTILS_GetText("game_ok");
	Buttons.push(Ok);

	ButtonsDiv.appendChild(Ok);
	
	TextDiv.appendChild(Label);

	Div.appendChild(TextDiv);
	Div.appendChild(ButtonsDiv);

	return {Div:Div, Buttons:Buttons};
}
