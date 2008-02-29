<?php
/*
Convert base64 to image
@base64
@return image
*/

	$data = split(";", $_SERVER["QUERY_STRING"]);
	$type = $data[0];
	$data = split(",", $data[1]);
	header("Content-type: ".$type);
	echo base64_decode($data[1]);
?>
