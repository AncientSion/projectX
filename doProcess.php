<?php

error_reporting(E_ALL); 
ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();

if (isset($_POST["type"]) && $_POST["type"] == "process"){

	echo json_encode( array(4, 3, 1) );
}