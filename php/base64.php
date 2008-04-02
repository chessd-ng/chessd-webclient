<?
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
* Load images, scripts and css used in the interface
* from server
*/

/**
* Show load screen to user, and begin to load scripts
*/

?>

<?php

define("MAXSIZE", 10000);
$image = $_FILES["image"];
$result = 0;
$type = "";

//Regular expression to validate file type
if(eregi("^image\/(jpeg|jpg|png|gif)$", $image["type"])){
	//Validate image max size
	if($image['size'] < MAXSIZE){
		//Upload image to temp file
		if(is_uploaded_file($_FILES["image"]["tmp_name"])){
		
			$type = $image["type"];
			//Open temporary file
			$fd = fopen($image['tmp_name'], "rb");
			$convert=fread($fd, $image['size'] );
			//Convert binary file to printable caracteres
			$convert = base64_encode($convert);
			$size=strlen($convert);
			fclose($fd);

		}else{ 
			$result = 1;
			$convert="Error: Invalid file";
		}
	}else{
		$result = 2;
		$convert="Error: Invalid file size ".$image['size'];
	}
}else{
	$result = 3;
	$convert="Error: Invalid file type ".$image['type'];
}

?>

<HTML>
<script>
	//Call this function on create page
	imageResult();

	/*This function recive PHP results and call 
	* the function IMAGE_B64Img with parameter basead in PHP request
	* @parm 
	* @return
	* @author Fabiano Kuss
	*/
	function imageResult(){
		if(!<?=$result?>)
			parent.IMAGE_B64Img("<?=$convert?>", "<?=$type?>", <?=$result?>);
		else
			parent.IMAGE_B64Img("<?=$convert?>", "", <?=$result?>);
		
	}
</script>

</HTML>

