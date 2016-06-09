<?php

error_reporting(E_ALL); ini_set('display_errors', '1');
require_once("dbManager.php");
require_once("gameManager.php");
require_once("debug.php");

session_start();

var_export($_SESSION);

if (isset($_SESSION["userid"])
	&&
	isset($_SESSION["username"])) {
		$dbManager = DBManager::app();
		$manager = new Manager($_SESSION["userid"], $_GET["gameid"]);
	//	$turn = $dbManager->getCurrentTurn($_GET["gameid"]);
		
		$fleetsInfo = $dbManager->getFleetInfoForTurnProcession($_GET["gameid"]);
		$currentSubTick = $manager->getSubTickForGame($_GET["gameid"])["subtick"];

		echo "<script> var fleetsInfo = ".json_encode($fleetsInfo, JSON_NUMERIC_CHECK)."</script>";
		echo "<script> var currentSubTick = ".json_encode(Intval($currentSubTick, JSON_NUMERIC_CHECK))."</script>";
	
}




?>

<!DOCTYPE html>
<html>
<head>
	<link rel='stylesheet' href='style.css'/>
	<script src="jquery-2.1.1.min.js"></script>	
</head>
	<body>	
		<a style="margin: auto" href="lobby.php">Return to Lobby</a>
		<div class="lobbyDiv" style="display: block; width: 200px; font-size: 15px; padding: 3px;">
			<span>Current Subtick:</span>
			<?php
				echo "<span id='curSubTick' style='color:red; font-size: 20px;'>".$currentSubTick."</span>";
				echo "<span style='font-size: 20px;'> / 24</span>";
			 ?>	
			<input id ="advanceButton" style="width: 150;" value="advance 1 subtick" onclick="advance()">
		</div>

		<!--	<div class="lobbyDiv" style="width: 120px; background-color: red">
				<form method="post">
					<input type="submit" value="Process This Turn" name="requestProcess"></input>
				</form>
			</div>-->
			</br>
	</body>
</html>

<script>

	window.onload = function(e){

		var keys = ["F-ID", "O-ID", "Name", "X", "Y", "Moves", "Treshold"];
		
		var tables = [];
		
		
		for (var i in fleetsInfo){

			var fleet = fleetsInfo[i];
				fleet.movesDone = 0;
			var counter = 0;

			var table = document.createElement("table");
				$(table).data("fleetid", fleet["id"]);
				table.className = "processTable";
				
			var tr = document.createElement("tr");

			for (var i = 0; i < keys.length; i++){
				var th = document.createElement("th");
					th.innerHTML = keys[i];
					th.style.border = "1px solid white";

					tr.appendChild(th);
			}

			table.appendChild(tr);			

			var tr = document.createElement("tr");
				tr.style.borderTop = "1px solid white";
				tr.innerHTML += "<td width=10%>" + fleet["id"] + "</td>";
				tr.innerHTML += "<td width=10%>" + fleet["playerid"] + "</td>";
				tr.innerHTML += "<td width=35%>" + fleet["name"] + "</td>";
				tr.innerHTML += "<td width=5% style='color:red'>" + fleet["x"] + "</td>";
				tr.innerHTML += "<td width=5% style='color:red'>" + fleet["y"] + "</td>";
				tr.innerHTML += "<td width=15% ><td width=15% >";
				tr.innerHTML += "</td></td>";

			table.appendChild(tr);

			for (var j = 0; j < fleet.moves.length; j++){

				var move = fleet.moves[j];
				counter += Math.floor(move["hmp"]);

				var tr = document.createElement("tr");
					tr.innerHTML += "<td><td><td><td><td>";
					tr.innerHTML += "</td></td></td></td></td>";

					tr.innerHTML += "<td>" + move["x"] + ":" + move["y"] + " @ " + move["hmp"] + "</td>";
					tr.innerHTML += "<td>" + counter + "</td>";

					table.appendChild(tr);

			}
			
			tables.push(table);
		}
		
		var currentID = 1;
		var toAppend = [];
		
		for (var i = 0; i < tables.length; i++){		
		
			if (tables[i].childNodes[1].childNodes[1].innerHTML == currentID){
				toAppend.push(tables[i]);
			}
			else {				
				var wrapper = document.createElement("div");
					wrapper.className = "processTableWrapper";
					
				for (var j = 0; j < toAppend.length; j++){
					wrapper.appendChild(toAppend[j]);
					
					if (j == toAppend.length-1){
						document.body.appendChild(wrapper);
					}
				}
				
				currentID++;
				toAppend = [];
			}
			
			
			if (i == tables.length-1){
				var wrapper = document.createElement("div");
					wrapper.className = "processTableWrapper";
					
				for (var j = 0; j < toAppend.length; j++){
					wrapper.appendChild(toAppend[j]);
					
					if (j == toAppend.length-1){
						document.body.appendChild(wrapper);
					}
				}
			}
		}
	}


	function advance(){
		var cur = document.getElementById("curSubTick");

		if (currentSubTick < 24){
			currentSubTick += 1;
			cur.innerHTML = Math.floor(currentSubTick)
		}

		var tables = document.getElementsByClassName("processTable");

		for (var i = 0; i < tables.length; i++){

			var fleetid = $(tables[i]).data("fleetid");
			for (var k in fleetsInfo){
				if (fleetsInfo[k].id == fleetid){
					var fleet = fleetsInfo[k];
					break;
				}
			}

			if (fleet.stopped){
				continue;
			}

			for (var j = 2; j < tables[i].childNodes.length; j++){
				var row = tables[i].childNodes[j];

				if (row.childNodes[6].style.color != "red"){
					if (Math.floor(row.childNodes[6].innerHTML) <= currentSubTick){
						row.childNodes[5].style.color = "red";
						row.childNodes[6].style.color = "red";

						fleet.movesDone++;
						fleet.x = fleet.moves[j-2].x
						fleet.y = fleet.moves[j-2].y;


					}
					else {
						break;
					}
				}
			}
		}

		for (var i = 0; i < fleetsInfo.length; i++){
			if (! fleetsInfo[i].stopped){
				for (var j = 0; j < fleetsInfo.length; j++){
					if (! fleetsInfo[j].stopped){
						if (fleetsInfo[i].id != fleetsInfo[j].id){
							if (fleetsInfo[i].x == fleetsInfo[j].x && fleetsInfo[i].y == fleetsInfo[j].y){

								fleetsInfo[i].stopped = true;
								fleetsInfo[j].stopped = true;

								console.log("fleet #" + fleetsInfo[i].id + " has found fleet #" + fleetsInfo[j].id);

								for (var k = 0; k < tables.length; k++){
									var fleetid = $(tables[k]).data("fleetid");

									if (fleetid == fleetsInfo[i].id){
										$(tables[k].childNodes[0]).css("background-color", "red");
										$(tables[k]).data("contactid", fleetsInfo[j].id);
										tables[k].addEventListener("mouseenter", function(){
											var table = getFleetTableById($(this).data("contactid"));
												table.style.backgroundColor = "red";
										});
										tables[k].addEventListener("mouseleave", function(){
											var table = getFleetTableById($(this).data("contactid"));
												table.style.backgroundColor = "black";
										});
									}
									else if (fleetid == fleetsInfo[j].id){
										$(tables[k].childNodes[0]).css("background-color", "red");
										$(tables[k]).data("contactid", fleetsInfo[i].id);
										tables[k].addEventListener("mouseenter", function(){
											var table = getFleetTableById($(this).data("contactid"));
												table.style.backgroundColor = "red";
										});
										tables[k].addEventListener("mouseleave", function(){
											var table = getFleetTableById($(this).data("contactid"));
												table.style.backgroundColor = "black";
										});
									}
								}
							}
						}
					}
				}
			}
		}
		
		for (var i in fleetsInfo){
		//	console.log(fleetsInfo[i]);
		}
		
		if (currentSubTick == 10){
			document.getElementById("advanceButton").style.backgroundColor = "red";
			document.getElementById("advanceButton").value = "PROCESS SERVER";
		//	document.getElementById("advanceButton").setAttribute("onClick", "javascript: process()");
			document.getElementById("advanceButton").onclick = function(){process()};
		}
	}
	
	
	function getFleetTableById(toFind){
		var all = document.getElementsByClassName("processTable");
		
		for (var i = 0; i < all.length; i++){
			var id = $(all[i]).data("fleetid");
			
			if (id == toFind){
				return all[i];
			}
		}
	}
	
	function process(){
		$.ajax({
			type: "POST",
			url: "doProcess.php",
			datatype: "json",
			data: {
				type: "process"
				},		
			success: function(ret){console.log(JSON.parse(ret));}
		});
	}

</script>
