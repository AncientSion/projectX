<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();


if (isset($_SESSION["userid"])){
	$gameid = $_GET["gameid"];
	$playerid = $_SESSION["userid"];

	$_SESSION["gameid"] = $_GET["gameid"];
	echo "<script> var gameid = ".$gameid.";</script>";
	$dbManager = DBManager::app();
	$manager = new Manager($playerid);

	$game = $dbManager->getGameDetails($gameid);
	$players = $dbManager->getPlayersInGame($gameid);
	$joined = false;

	$element = "<table style='width: 300px'>";
	$element .= "<tr>";
	$element .= "<th colSpan=2>".$game["name"]."</th>";
	$element .= "</tr>";

	$element .= "<tr>";
	$element .= "<th>Player Name</th>";
	$element .= "<th>Status</th>";
	$element .= "</tr>";

	if (!$players){
		$element .= "<tr>";
		$element .= "<td colSpan='2'>No Player ingame yet</td>";
		$element .= "</tr>";
	}
	else {
		foreach ($players as $player){
			if ($player["userid"] == $playerid) {
				$joined = true;
			}

			$element .= "<tr>";
			$element .= "<td style='border-bottom: 1px solid white'>".$player["username"]."</td>";
			$element .= "<td style='border-bottom: 1px solid white'>".$player["status"]."</td>";
			$element .= "</tr>";
		}
	}
	if ($joined){
		$element .= "<tr><td colSpan='2'>";	
		$element .= "<input id='gameId' type='button' value='Leave Game' onclick='leaveGame()'>";
		$element .= "</tr></td>";
	}
	else {
		$element .= "<tr><td colSpan='2'>";	
		$element .= "<input id='gameId' type='button' value='Join Game' onclick='joinGame()'>";
		$element .= "</tr></td>";
	}


	$element .= "<tr><td colSpan='2'>";	
	$element .= "<input id='gameId' type='button' value='START GAME' onclick='startGame()'>";
	$element .= "</tr></td>";


	$element .= "<tr><td style='padding: 10px 10px 10px 10px' colSpan='2'>";
	$element .= "<a href='lobby.php'>Return to Lobby</a>";
	$element .= "</tr></td>";
	$element .= "</table>";




}
else {
	$element = "<span>PLEASE LOGIN</span>";
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<meta content="utf-8" http-equiv="encoding">
	<link rel='stylesheet' href='style.css'/>
	<script src="jquery-2.1.1.min.js"></script>
	<script src='ajax.js'></script>
</head>
	<body>
		<div class="lobbyDiv">
			<?php echo $element; ?>
		</div>
	</body>
</html>

<script>

	function joinGame(){
		console.log("joinGame");
		ajax.joinGame(gameid, refresh);
	}

	function leaveGame(){
		console.log("leaveGame");
		ajax.leaveGame(gameid, refresh);
	}

	function startGame(){
		console.log("startGame");
		ajax.startGame(gameid, refresh);
	}

	function refresh(data){
		console.log("refresh");
		console.log(data);
		setTimeout(function(){
			window.location.reload(true);
		}, 500);
	}

</script>