import { WINDOW_Alert } from 'window/window.js';
import { UTILS_GetText } from 'utils/utils.js';

import { MainData } from 'main_data.js';

/*
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
* @file		utils/images.js
* @brief	This file contais all function used to decode/encode images to base64
*/


/**
* @brief 	Create input file to user
*
* @param        FormId is Form identificator
* @param 	Action is script source
* @return       Form HTML element
* @author       Fabiano Kuss and Rubens Suguimoto
*/
export function IMAGE_CreateFormToEncode(FormId, Action){
	var Form, File;

	Form = document.createElement("Form");
	Form.id= FormId;
	Form.action = Action;
	Form.method = "post";
	Form.name = FormId;
	Form.enctype="multipart/Form-data";
	File = document.createElement("input");
	File.type = "file";
	File.name = "image";
  File.id = 'file_upload';
	var Width = document.createElement("input");
	Width.type = "hidden";
	Width.name = "width";
	Width.value = "50";
	var Height = document.createElement("input");
	Height.type = "hidden";
	Height.name = "height";
	Height.value = "50";

	Form.appendChild(Height);
	Form.appendChild(Width);
	Form.appendChild(File);
	return Form;
}


/**
* @brief	This function is used to show image base64 in IE6
*
* @param 	ImgSrc is the image source in base64 Firefox standart
* @return       Image base64 in IE Format
* @author       Fabiano Kuss and Rubens Suguimoto
*/
export function IMAGE_ImageDecode(ImgSrc){
  return ImgSrc;
}

/**
* @brief	This function get image and convert to base64
*
* @param        FormId is Form identificator
* @return       void
* @author       Fabiano Kuss and Rubens Suguimoto
*/
export function IMAGE_ImageEncode() {
  var el = document.getElementById('file_upload');
  if (!el) {
    console.log('No file_upload element');
    return;
  }
  var files = document.getElementById('file_upload').files;
  if (files.length === 0) {
    return;
  }

  var file = files[0];

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    var m = reader.result.match(/data:(.*);base64,(.*)/);
    if (!m || m.length < 3) {
      console.log('Failed to parse date URI: ', m);
      return;
    }
    IMAGE_B64Img(m[2], m[1]);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

/**
* @brief	When image is loaded this function is called 
*
* @param        Image is the image base 64
* @param        Type is the image type
* @return       void
* @author       Fabiano Kuss and Rubens Suguimoto
*/
export function IMAGE_B64Img(Image, Type){
	var Profile;
	var Img;

	var MyUsername = MainData.GetUsername();
	var MyUser;
	
	//if type == ""; error!!!!
	if(Type == "")
	{
		WINDOW_Alert(UTILS_GetText("profile_load_error"), UTILS_GetText("profile_load_error_title"));
		return false;
	}
	Img = "data:"+Type+";base64,"+Image;

	MyUser = MainData.GetUser(MyUsername);
	// Update user profile image
	//Profile = MainData.GetProfile(MyUsername+"@"+MainData.GetHost());
	if(MyUser != null)
	{
		Profile = MyUser.GetProfileObj();
		if(Profile != null)
		{
			// Update in profile window
			Profile.SetImgType(Type);
			Profile.SetImg64(Image);
			Profile.SetUserImg(Img);
		}
	}
	return true;
}
