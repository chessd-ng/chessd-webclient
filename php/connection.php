<?php

class db{
	

	function dbConnect(){
		$HOST="localhost";
		$DEFAULTPORT=5444;
		$USERNAME="chessd";
		$PASSWD="kct9#1";
		$DBNAME="chessd";
		$connstring = "host=".$HOST." port=".$DEFAULTPORT." dbname=".$DBNAME." user=".$USERNAME." password=".$PASSWD;
		$dbconn = pg_connect($connstring);
		return $dbconn;
	}

	function selectData($sql){

		if(!isset($this->dbconn)){
			$conn = $this->dbConnect();
		}else{
			$conn = $this->dbconn;
		}

		$result = pg_query($conn, $sql);

		return $result;

	
	}

	function executeData($sql){

		$result = "ok";

		try{
			if(!isset($this->dbconn)){
				$conn = $this->dbConnect();
			}else
				$conn = $this->dbconn;

			if(!@pg_query($conn, $sql)){
				$result = pg_last_error($conn);

			}
		}catch(Exception $e){
			$result = $e;
		}
		
		return $result;
	
	}


}

?>
