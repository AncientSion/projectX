<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();

	$server = "localhost";
	$user ="aatu";
	$pw = "Kiiski";
	//$user ="root";
	//$pw = "147147";
	$db = "projectx";	

	$connect = mysql_connect($server, $user, $pw);

	if (!$connect){
		die ("no link");
	}

/*	$sql = "CREATE DATABASE " . $db;
	if (mysql_query($sql, $connect)) {
		echo "db success</br>";
	}
	else {
		debug::log(mysql_error($connect));
	}
*/
mysql_select_db($db);



$sql = array();
	/*
	
$sql[] = "CREATE TABLE jumplanes (
			id INT (5) AUTO_INCREMENT PRIMARY KEY,
			x1 INT (3),
			y1 INT (3),
			x2 INT (3),
			y2 INT (3),
			x3 INT (3),
			y3 INT (3),
			x4 INT (3),
			y4 INT (3),
			x5 INT (3),
			y5 INT (3),
			x6 INT (3),
			y6 INT (3)
		)";
	
		
$sql[] = "CREATE TABLE planets (
			id INT (3) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			x INT (3),
			y INT (3),
			owner INT (3),
			type VARCHAR (255),
			enviroment VARCHAR (255),
			name VARCHAR (255),
			level INT (3),
			baseIncome INT (4),
			baseTrade INT (4),
			notes_1 VARCHAR (255),
			notes_2 VARCHAR (255),
			notes_3 VARCHAR (255)
			)";

$sql[] = "CREATE TABLE games (
			id INT(5) AUTO_INCREMENT PRIMARY KEY,
			name VARCHAR (255),
			status VARCHAR (255),
			turn INT (3)
		)";

$sql[] = "CREATE TABLE playerstatus (
			id INT(5) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			playerid INT (3),
			turn INT (3),
			status VARCHAR (255)
		)";

$sql[] = "CREATE TABLE fleets (
			id INT(5) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			playerid INT (3),
			name VARCHAR (255),
			tfnumber INT (5),
			x INT (3),
			y INT (3),
			elint BOOL
		)";
		

 $sql[] = "CREATE TABLE ships (
			id INT(5) AUTO_INCREMENT PRIMARY KEY,
			fleetid INT (3),
			size VARCHAR (255),
			model VARCHAR (255),
			name VARCHAR (255),
			elint BOOL,
			scanner INT (3),
			jumpdrive BOOL,
			notes VARCHAR (255)
		)";
	
	
$sql[] = "CREATE TABLE moves (
			id INT (5) AUTO_INCREMENT PRIMARY KEY,
			fleetid INT (3),
			turn INT (3),
			step INT (2),
			x INT (3),
			y INT (3),
			hmp INT (1)
			)";


$sql[] = "CREATE TABLE jumpgates (
			id INT (3) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			owner INT (3),
			x INT (3),
			y INT (3),
			turn_build INT (3),
			damage INT (3),
			useable BOOL
			)";


$sql[] = "CREATE TABLE player (
			id INT (3) AUTO_INCREMENT PRIMARY KEY,
			username VARCHAR (255),
			password VARCHAR (255),
			access INT (3)
			)";

$sql[] = "CREATE TABLE sectorspecials (
			id INT (3) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			x INT (3),
			y INT (3),
			type VARCHAR (255)
			)";


$sql[] = "ALTER TABLE jumplanes ADD gameid INT (3) AFTER id";
			*/


$sql[] = "CREATE TABLE markers (
			id INT (3) AUTO_INCREMENT PRIMARY KEY,
			gameid INT (3),
			playerid INT (3),
			x INT (3),
			y INT (3),
			notes VARCHAR (255)
		)";

	foreach ($sql as $query){
		if (mysql_query($query, $connect)) {
			echo "<br>";
			echo "success";
		}
		else {
			debug::log(mysql_error($connect));
		}
	}

	mysql_close($connect);


?>
