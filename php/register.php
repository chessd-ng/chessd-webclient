<?header('Content-Type: text/xml');?>

<?php

require_once("connection.php");

$username=$_POST["username"];
$mail=$_POST["mail"];
$pwd=$_POST["pwd"];

$shapwd=sha1($pwd);

$dbConn = new db();

$query = "select * from standart_register('$username', '$mail', '$shapwd', 'shiva')";
$result = $dbConn->executeData($query);

$xmlRet = "<result type='inert'>\n\t<username>$username</username><mail>$mail</mail><sql_result>$result</sql_result></result>";
echo($xmlRet);

?>
