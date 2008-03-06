
function IMAGE_CreateFormToEncode(form_id, action){
	var form, file;

	form = document.createElement("form");
	form.id= form_id;
	form.action = action;
	form.method = "post";
	form.name = form_id;
	form.enctype="multipart/form-data"
	file = document.createElement("input");
	file.type = "file";
	file.name = "image";
	
	form.appendChild(file);
	return form;
}


// This function is used to show image base64 in IE6
function IMAGE_ImageDecode(ImgSrc){
	return "php/base64_decode.php?"+ImgSrc.slice(5);
}

function IMAGE_ImageEncode(formId){
	var frame, body, form;
	
	frame = document.createElement("iframe");
	frame.name = "nda";
	frame.setAttribute("style","width: 0; height: 0; border: none;");
	body = document.getElementsByTagName("body")[0];
	body.appendChild(frame);
	form = document.getElementById(formId);
	form.target = frame.name;
	form.submit();



}

//if type == ""; error!!!!
function IMAGE_B64Img(Image, Type){
	var Profile;
	var Img;

	Img = "data:"+Type+";base64,"+Image;

	// Update user profile image
	Profile = MainData.GetProfile(MainData.Username+"@"+MainData.Host);
	if(Profile != null)
	{
		Profile.Profile.SetImgType(Type);
		Profile.Profile.SetImg64(Image);
		Profile.Profile.SetUserImg(Img);
	}
	
}
