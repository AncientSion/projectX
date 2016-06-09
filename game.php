<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();


$welcome = "";

if (isset($_SESSION["userid"])
	&&
	isset($_SESSION["username"])) {
	$_SESSION["gameid"] = $_GET["gameid"];
	$dbManager = DBManager::app();
	$manager = new Manager($_SESSION["userid"], $_GET["gameid"]);
	$turn = $dbManager->getCurrentTurn($_GET["gameid"]);

	$welcome .= "Welcome, " . $_SESSION["username"] . " in game: ".$_GET["gameid"] . " at turn: " . $turn;

	$elements = "";
	$elements .= "<span id='userid' class='hidden'>".$_SESSION['userid']."</span>";
	$elements .= "<span id='username' class='hidden'>".$_SESSION['username']."</span>";
	$elements .= "<span id='gameid' class='hidden'>".$_GET['gameid']."</span>";
	$elements .= "<span id='currentTurn' class='hidden'>".$turn."</span>";
}


?>

<!DOCTYPE html>
<html>
<head>
	<link rel='stylesheet' href='style.css'/>
	<script src="jquery-2.1.1.min.js"></script>
	<script src='ajax.js'></script>
	
	<script src='hexagon/script.js'></script>
	<script src='hexagon/HexagonTools.js'></script>
	<script src='hexagon/Grid.js'></script>
	<script src='hexagon/baseClasses.js'></script>
	<script src='hexagon/baseEvents.js'></script>
	<script src='hexagon/movement.js'></script>
	<script src='hexagon/transfer.js'></script>
	<script src='hexagon/admin.js'></script>
	<script src='hexagon/cam.js'></script>
	
	
</head>
	<body>
		<table>
			<tr>
				<td>
					<?php echo $elements; ?>
				</td>
			</tr>
			<tr>
				<td>
					<?php echo $welcome; ?>
				</td>
			</tr>
			<tr>
				<td>
			<a href="logout.php">LOGOUT</a>
				</td>
			</tr>
			<tr>
				<td>
			<a href="lobby.php">Return to Lobby</a>
				</td>
			</tr>			
		</table>
		
		
		<div id="interface">
			<div id="currentPos" style="color:red"></div>
	<!--		<input type="button" value="Initialisieren" onclick="init()">
			<input type="form" id="sideLength" style="width: 50px; text-align: center" value="25">
			<input type="form" id="zoom" style="width: 50px; text-align: center" value="1">
			<input type="button" value="Hexfeld" onclick="switchCanvas('hex')">
			<input type="button" value="Sprung" onclick="switchCanvas('jump')">
			<input type="button" value="Bewegung" onclick="switchCanvas('move')">
			<input type="button" value="Objekte" onclick="switchCanvas('obj')">
			<input type="button" value="Mausreaktion" onclick="switchCanvas('mouse')">    -->
			<input type="button" value="Zug Beenden (todo)" onclick="endTurn()">
			<input type="button" id="adminButton" value="Admin Modus (inaktiv)" onclick ="switchAdminMode()">
			
			<div id="adminSectors" class="disabled">
				<input type="button" id="startSectorMode" value="Start Sector Mode" onclick ="admin.startSectorMode()">
				<input type="button" id="stopSectorMode" value="End Sector Mode" class="disabled" onclick ="admin.stopSectorMode()">
				<input type="button" id="logSectors" value="log Sectors" class="disabled" onclick ="admin.logSectors()">
				<input type="button" id="commitSectors" value="COMMIT Sector Sectors" class="disabled" onclick="admin.commitSectors()">
			</div>

			<div id="adminPlanets" class="disabled">
				<input type="button" id=""value="Start Planet Mode" onclick ="admin.initiateCreatePlanet()">
				<input type="button" id="stopPlanetMode" value="End Planet Mode" class="disabled" onclick ="admin.stopCreatePlanet()">
				<input type="button" id="logPlanetsButton" value="log Planets" class="disabled" onclick ="admin.logPlanets()">
				<input type="button" id="confirmPlanetsButton" value="COMMIT PLANETS" class="disabled" onclick="admin.commitPlanets()">
			</div>

			<div id="adminGates" class="disabled">
				<input type="button" id="" value="Gate Mode" onclick ="admin.switchGateMode()">
				<input type="button" id="createGateButton" class="disabled" value="Place JumpGate" onclick ="admin.createGate()">
				<input type="button" id="destroyGateButton" class="disabled"  value="Destroy JumpGate" onclick ="admin.destroyGate()">
				<input type="button" id="confirmGateButton"  class="disabled" value="COMMIT GATES" class="disabled" onclick="admin.commitGates()">
			</div>
			
			<div id="adminLanes" class="disabled">
				<input type="button" id="startLaneMode" value="start Lane Mode" onclick ="admin.startLanes()">
				<input type="button" id="endCurrentLane" value="end current Lane" class="disabled" onclick ="admin.endCurrentLane()">
				<input type="button" id="stopLaneMode" value="end Lane MODE" class="disabled" onclick ="admin.endLaneMode()">
				<input type="button" id="logLaneButton" value="log Lanes" class="disabled" onclick ="admin.logLanes()">
				<input type="button" id="confirmLaneButton" value="COMMIT LANES/GATES" class="disabled" onclick="admin.commitLanes()">
			</div>
			
			
			<div id="adminFleets" class="disabled">
				<input type="button" id="" value="Start Fleet Mode" onclick ="admin.initiateCreateFleet()">
				<input type="button" id="stopFleetMode" value="End Fleet Mode" class="disabled" onclick ="admin.stopCreateFleet()">
				<input type="button" id="logFleetButton" value="log Fleets" class="disabled" onclick ="admin.logFleets()">
				<input type="button" id="confirmFleetButton" value="COMMIT FLEETS" class="disabled" onclick="admin.commitFleets()">
			</div>


		</div>
		<div style="margin: auto; display: block;">
			<div id="gui">
			</div>
			<canvas id="hexCanvas"></canvas>
			<canvas id="jumpCanvas"></canvas>
			<canvas id="moveCanvas"></canvas>
			<canvas id="objCanvas"></canvas>
			<canvas id="mouseCanvas"></canvas>
		</div>
	</body>
</html>

<script>
	window.onload = function(e){
		init();		
		
	//	ajaxManager.loadContent(this.hexes);
	//	ajaxManager.loadJumplanes(this.hexes);
		
		//var user = document.getElementById("username").innerHTML;
		//var game = document.getElementById("gameid").innerHTML;
		//var gamedata = ajax.getGameData(user, game);
	}
</script>
