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
* Generic class to preload elements
*/

function Preloader(SrcArray, TypeNode, CallBack)
{
	var i;

	// Attributes
	this.SrcArray = SrcArray;
	this.Total = this.SrcArray.length;
	this.Complete = 0;

	// Setting methods
	this.Loaded = Loaded;
	this.CallBack = CallBack;

	// What element to load?
	switch(TypeNode)
	{
		case("script"):
			this.Load = LoadScript;
			break;

		case("image"):
			this.Load = LoadImage;
			break;

		default:
			this.Load = LoadScript;
			break;
	}

	// Load each element
	for (i=0; i<this.Total; i++)
	{
		this.Load(this.SrcArray[i]);
	}

	this.Timer = setTimeout(this.CallBack, 5000);
}

function LoadScript(Src)
{
	var Node = document.createElement("script");
	var Head = document.getElementsByTagName("head")[0];

	Node.src = Src+"?"+NoCache;
	Node.type = "text/javascript";

	// Assign pointer back
	Node.Preloader = this;

	// Add listeners
	Node.onload = this.Loaded;
	Node.onerror = this.Loaded;
	Node.onabort = this.Loaded;

	Head.appendChild(Node);
}

function LoadImage(Src)
{
	var Img = new Image();

	// Assign pointer back
	Img.Preloader = this;

	// Add listeners
	Img.onload = this.Loaded;
	Img.onerror = this.Loaded;
	Img.onabort = this.Loaded;

	Img.src = Src;
}

function Loaded()
{
	this.Preloader.Complete++;
	
	if (this.Preloader.Complete >= this.Preloader.Total)
	{
		clearTimeout(this.Preloader.Timer);
		this.Preloader.CallBack();
	}
}


/*
function Preloader(Sources, TypeNOde, CallBack)
{
	var i;

	// Store the call-back
	this.CallBack = CallBack;

	// Initialize internal state.
	this.nLoaded = 0;
	this.nProcessed = 0;
	this.aImages = new Array();

	// Record the number of images.
	this.Total = Sources.length;

	// for each image, call preload()
	for (i=0; i<this.Total; i++)
	{
		this.Preload(Sources[i]);
	}
}

Preloader.prototype.Preload = function(Source)
{
	// create new Image object and add to array
	var Node = document.createElement("script");
	var Head = document.getElementsByTagName("head")[0];

	this.aImages.push(Node);

	Node.type = "text/javascript";

	// set up event handlers for the Image object
	Node.onload = Preloader.prototype.onload;
	Node.onerror = Preloader.prototype.onerror;
	Node.onabort = Preloader.prototype.onabort;
 
	// assign pointer back to this.
	Node.oImagePreloader = this;
	Node.bLoaded = false;

	// assign the .src property of the Image object
	Node.src = Source;
	Head.appendChild(Node);
}

Preloader.prototype.onComplete = function()
{
   this.nProcessed++;
   if ( this.nProcessed == this.nImages )
   {
      this.callback(this.aImages, this.nLoaded);
   }
}

Preloader.prototype.onload = function()
{
   this.bLoaded = true;
   this.oImagePreloader.nLoaded++;
   this.oImagePreloader.onComplete();
}

Preloader.prototype.onerror = function()
{
   this.bError = true;
   this.oImagePreloader.onComplete();
}

Preloader.prototype.onabort = function()
{
   this.bAbort = true;
   this.oImagePreloader.onComplete();
}
*/
