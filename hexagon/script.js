

$(document).ready(function(){

	moveManager = new MovementManager();
	admin = new Admin();
	cam = new Cam();
	transfer = new Transfer();
	
	var canvas = document.getElementsByTagName("canvas");
	for (var i = 0; i < canvas.length; i++){
		canvas[i].width = width;
		canvas[i].height = height;
	}
	
	
	
	hexCanvas = document.getElementById("hexCanvas");
	hexCtx = hexCanvas.getContext("2d");
	objCanvas = document.getElementById("objCanvas");
	objCtx = objCanvas.getContext("2d");
	jumpCanvas = document.getElementById("jumpCanvas");
	
	jumpCtx	= jumpCanvas.getContext("2d");
	moveCanvas = document.getElementById("moveCanvas");
	moveCtx	= moveCanvas.getContext("2d");
	mouseCanvas = document.getElementById("mouseCanvas");
	mouseCtx = mouseCanvas.getContext("2d");
		
	$("#mouseCanvas").mousedown(function(e){e.preventDefault(); }, false);

	$("#mouseCanvas").mousemove(mouseCanvasMouseMove);
	$("#mouseCanvas").click(mouseCanvasClick);
	$("#mouseCanvas").dblclick(mouseCanvasDblClick);
	
	$("#mouseCanvas").bind('mousewheel DOMMouseScroll', mouseCanvasZoom)
	$("#mouseCanvas").bind('contextmenu', mouseCanvasScroll)

});

var grid = false;
var hexCanvas;
var hexCtx;
var objCanvas;
var objCtx;
var jumpCanvas;
var jumpCtx;
var moveCanvas;
var moveCtx;
var mouseCanvas;
var mouseCtx;
var selectedHex = null;
var names = [];
var selectedFleet = null;
var moveManager;
var width = "1200";
var height = "800";
var id = 0;
var adminMode = false;
var admin;
var cam;
var count = 0;
var currentTurn
var gamedata = {};
var popup = false;
var activeHover = false

var userid;
var gameid;


var background_icon = new Image();
	background_icon.src = "img/background.jpg";
var jumpgate_icon = new Image();
	jumpgate_icon.src = "img/jumpgate.png";


var types = ["fertile", "wet", "water", "swamp", "ice", "arid", "barren", "radiated", "toxic"];
var planet_icons = [];

for (var i = 0; i < types.length; i++){
	var image = new Image();
		image.src = "img/" + types[i] + "_planet.png";
		image.type = types[i];

	planet_icons.push(image);
}

var types = ["large", "medium", "small"];
var asteroid_icons = [];

for (var i = 0; i < types.length; i++){
	var image = new Image();
		image.src = "img/" + types[i] + "_asteroid_field.png";
		image.type = types[i];

	asteroid_icons.push(image);
}

var types = ["blackhole", "nebula", "supernova", "radiationcloud", "vortex", "hyperspacewaveforms"];
var special_icons = [];

for (var i = 0; i < types.length; i++){
	var image = new Image();
		image.src = "img/" + types[i] + ".png";
		image.type = types[i];

	special_icons.push(image);
}


function updateGUI(hex){
	var fleetFound = false;
	var gateFound = false;

	var div = document.getElementById("gui");
		div.innerHTML = "";

	
	var table = document.createElement("table");
		table.style.border = "none";
	var tr = document.createElement("tr");
		tr.style.border = "none";
	var th = document.createElement("th");
		th.innerHTML = "System: " + hex.id;

		tr.appendChild(th);
		table.appendChild(tr);

	if (hex.specials.length > 0){
		var tr = document.createElement("tr");
		var td = document.createElement("td");
			td.style.border = "none";
			td.innerHTML = "<font color = 'red'>" + hex.specials[0].type + "</font>";
	
		tr.appendChild(td);
		table.appendChild(tr);
	}

	div.appendChild(table);
		
	for (var i = 0; i < hex.contains.length; i++){

		if (hex.contains[i] instanceof Jumpgate){			
			if (!gateFound){
				gateFound = true;
				var table = document.createElement("table");
					table.id = hex.contains[i].id + "jumpgate";
					table.className = "jumpgateTable";
					
				var tr = document.createElement("tr");				
					var th = document.createElement("th");
						th.colSpan = 2;
						th.innerHTML = "Jumpgate" + "(id: " + hex.contains[i].id + ")";
					tr.appendChild(th);
				table.appendChild(tr);
					
				var tr = document.createElement("tr");
					tr.className = "centerText" 
					tr.innerHTML = "<td>Connected to:</td>";
					
				table.appendChild(tr);					
				
				for (var j = 0; j < hex.lanes.length; j++){
					var target = hex.lanes[j].target[0] + ", " + hex.lanes[j].target[1];
					
					var tr = document.createElement("tr");
						$(tr).data("targetX", hex.lanes[j].target[0]);
						$(tr).data("targetY", hex.lanes[j].target[1]);
						tr.addEventListener("mouseenter", function(){
							var goal = grid.getHexById([$(this).data("targetX"), $(this).data("targetY")]);
								goal.checkHighlight();
						});
						
						tr.addEventListener("mouseleave", function(){
							var goal = grid.getHexById([$(this).data("targetX"), $(this).data("targetY")]);
								goal.checkHighlight();
						});
						
						tr.className = "centerText";
						tr.innerHTML = "<td>" + target + " (id: " + hex.lanes[j].id + ")</td>";
						
						table.appendChild(tr);
				}
			}
		}
		if (hex.contains[i] instanceof Planet){

			var icon = hex.contains[i].icon;
			var type = hex.contains[i].type;

			if (type == "Large Planet"){
				icon.style.height = "100px";
			}
			else if (type == "Planet"){
				icon.style.height = "80px";
			}
			else if (type == "Large Moon"){
				icon.style.height = "55px";
			}
			else if (type == "Moon"){
				icon.style.height = "35px";
			}
			else {
				icon.style.height = "100px";
			}

			var table = document.createElement("table");
				table.id = "planet" + hex.contains[i].id;
				table.className = "planetTable";	

			var tr = document.createElement("tr");				
			var th = document.createElement("th");
				th.colSpan = 2;

			if (hex.contains[i].name != "undefined"){
				th.innerHTML = "Planet " + hex.contains[i].name + " (" + "id: " + hex.contains[i].id + ")";
				$(th).data("id", hex.contains[i].id);
				th.addEventListener("contextmenu", function(e){
					e.preventDefault();
					createRenameElement(e, "planet", $(this).data("id"))
				});

				tr.appendChild(th);
				table.appendChild(tr);

				var tr = document.createElement("tr");
					tr.style.height = "150px";
				var td = document.createElement("td");
					td.colSpan = 2;
					td.appendChild(icon);
					tr.appendChild(td);
					
					table.appendChild(tr);
					
				var tr = document.createElement("tr");		
				var td = document.createElement("td");
					td.innerHTML = "Owner:";	
					tr.appendChild(td);
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].owner + " (id)";	
					tr.appendChild(td);
					
					table.appendChild(tr);


				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Object Type:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].type;				
					tr.appendChild(td);		
				
				table.appendChild(tr);

					
				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Enviroment:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].enviroment;				
					tr.appendChild(td);		
				
				table.appendChild(tr);
					
					
				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Level:";				
					tr.appendChild(td);		
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].level;				
					tr.appendChild(td);		
					
					table.appendChild(tr);
					
					
				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Base Income:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].baseIncome;				
					tr.appendChild(td);		
				
				table.appendChild(tr);

					
				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Base Trade Value:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].baseTrade;				
					tr.appendChild(td);		
				
				table.appendChild(tr);

				if (hex.contains[i].notes.length > 0){
					var tr = document.createElement("tr");				
						var th = document.createElement("th");
							th.colSpan = 2;
							th.style.borderTop = "1px solid white";
							th.innerHTML ="SPECIALS / NOTES";
						tr.appendChild(th);		
					
					table.appendChild(tr);

					for (var j = 0; j < hex.contains[i].notes.length; j++){
						var tr = document.createElement("tr");				
						var td = document.createElement("td");
							td.colSpan = 2;
							td.innerHTML = hex.contains[i].notes[j];				
							tr.appendChild(td);					
						table.appendChild(tr);
					}					
				}
			}
			else {
				th.innerHTML = "Uncolonized System";
				tr.appendChild(th);
				table.appendChild(tr);
				
				var tr = document.createElement("tr");	
					tr.style.height = "150px";	
				var td = document.createElement("td");
					td.colSpan = 2;
					td.appendChild(icon);		
					tr.appendChild(td);	
					
					table.appendChild(tr);	

				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Object Type:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].type;				
					tr.appendChild(td);		
				
				table.appendChild(tr);

					
				var tr = document.createElement("tr");				
				var td = document.createElement("td");
					td.innerHTML = "Enviroment:";				
					tr.appendChild(td);	
					
				var td = document.createElement("td");
					td.innerHTML = hex.contains[i].enviroment;				
					tr.appendChild(td);		
				
				table.appendChild(tr);

				if (hex.contains[i].notes.length > 0){
					var tr = document.createElement("tr");				
						var th = document.createElement("th");
							th.colSpan = 2;
							th.style.borderTop = "1px solid white";
							th.innerHTML ="SPECIALS / NOTES";
						tr.appendChild(th);		
					
					table.appendChild(tr);

					for (var j = 0; j < hex.contains[i].notes.length; j++){
						var tr = document.createElement("tr");				
						var td = document.createElement("td");
							td.colSpan = 2;
							td.innerHTML = hex.contains[i].notes[j];				
							tr.appendChild(td);					
						table.appendChild(tr);
					}					
				}
			}	
		}
		if (hex.contains[i] instanceof Fleet){
			fleetFound = true;
			var keys = ["size", "model", "name", "elint", "scanner", "jumpdrive"];


			var table = document.createElement("table");
				table.id = "fleet" + hex.contains[i].id;
				table.className = "fleetTable";
				
			var tr = document.createElement("tr");
			
			var th = document.createElement("th");
				th.colSpan = keys.length+1;
				th.innerHTML = "Fleet: " + hex.contains[i].name + " (id: " + hex.contains[i].id + ")";
				$(th).data("id", hex.contains[i].id);
				th.addEventListener("contextmenu", function(e){
					e.preventDefault();
					createRenameElement(e, "fleet", $(this).data("id"));
				})
			tr.appendChild(th);
			table.appendChild(tr);


			var tr = document.createElement("tr");

			for (var l = 0; l < keys.length; l++){
				var td = document.createElement("td");
					td.style.borderBottom = "1px solid white";
					td.innerHTML = keys[l].toUpperCase(0, 1);

				tr.appendChild(td);
			}
			table.appendChild(tr);

						
			for (var j = 0; j < hex.contains[i].ships.length; j++){
				var tr = document.createElement("tr");
					$(tr).data("shipid", hex.contains[i].ships[j].id);
					$(tr).data("fleetid", hex.contains[i].id);

					tr.addEventListener("click", function(e){
						e.stopPropagation();
						if (! selectedFleet){
						//	console.log($(this).data());
							if ( $(this).hasClass("shipSelected") ){
								$(this).removeClass("shipSelected");
								transfer.removeShip($(this).data());
							}
							else {
								$(this).addClass("shipSelected");
								transfer.addShip($(this).data());
							}
						}
					});
					tr.addEventListener("contextmenu", function(e){
						e.stopPropagation();
						e.preventDefault();
						createRenameElement(e, "ship", $(this).data("shipid"));
					});


				for (var l = 0; l < keys.length; l++){
					var td = document.createElement("td");
						td.innerHTML = hex.contains[i].ships[j][keys[l]];

					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			
			var tr = document.createElement("tr");
			
			var td = document.createElement("td");
				td.className = "disabled";
				td.colSpan = keys.length+1
				td.style.backgroundColor = "red"
				td.id = "moveFleet" + hex.contains[i].id;
				td.style.cursor = "pointer";
				td.style.textAlign = "center";
				td.innerHTML = "Plan Movement";
				td.addEventListener("click", moveorderClick);
				
			tr.appendChild(td);
			table.appendChild(tr);
			
			for (var k = 0; k < moveManager.orders.length; k++){
				if (hex.contains[i].id == moveManager.orders[k].fleetId){
					if (moveManager.orders[k].moves[0] == hex.id){
						continue;
					}

					var tr = document.createElement("tr");
					var td = document.createElement("td");
						$(td).data("targetX", moveManager.orders[k].moves[moveManager.orders[k].moves.length-1][0]);
						$(td).data("targetY", moveManager.orders[k].moves[moveManager.orders[k].moves.length-1][1]);
						td.addEventListener("mouseenter", function(){
							var goal = grid.getHexById([$(this).data("targetX"), $(this).data("targetY")]);
								goal.checkHighlight();
						});
						
						td.addEventListener("mouseleave", function(){
							var goal = grid.getHexById([$(this).data("targetX"), $(this).data("targetY")]);
								goal.checkHighlight();
						});
					
						td.className = "centerText";
						td.colSpan = 6;

						var html = moveManager.orders[k].moves[moveManager.orders[k].moves.length-1];	

						td.innerHTML = "<font color = 'red'> Moving to: " + html + "</font>";
						
						tr.appendChild(td);
						table.appendChild(tr);
					
					
					var tr = document.createElement("tr");
					var td = document.createElement("td");						
						td.className = "centerText";
						td.colSpan = 6;

						var html = moveManager.orders[k].getTotalHMP();

						td.innerHTML = "<font color = 'red'>Required HMP: " + html + "</font>";						
						tr.appendChild(td);
						table.appendChild(tr);
				}
			}
			table.addEventListener("click", fleetTableClick);
		}	
		
		div.appendChild(table);
	}


	if (fleetFound){
		var table = document.createElement("table");
			table.id = "fleetTransfer";
			table.className = "fleetTable disabled";
			
		var tr = document.createElement("tr");		
		var th = document.createElement("th");
			th.innerHTML = "Ship Transfer";
		tr.appendChild(th);
		table.appendChild(tr);

		var tr = document.createElement("tr");		
		var td = document.createElement("th");
			td.innerHTML = "Transfer all selected Ships to:";
		tr.appendChild(td);
		table.appendChild(tr);

		var tr = document.createElement("tr");	
		var td = document.createElement("th");
		var select = document.createElement("select")
			select.id = "fleetTransferTarget";

		for (var i = 0; i < hex.contains.length; i++){
			if (hex.contains[i] instanceof Fleet){
				var option = document.createElement("option");
					option.innerHTML = hex.contains[i].name;
				select.appendChild(option);
			}
		}

		td.appendChild(select);
		tr.appendChild(td);
		table.appendChild(tr);

		var tr = document.createElement("tr");	
		var td = document.createElement("th");
		var input = document.createElement("input");
			input.type = "button";
			input.value = "CONFIRM SELECTION";
			input.onclick = function(){
				transfer.checkTransfer();
			}

		td.appendChild(input);
		tr.appendChild(td);
		table.appendChild(tr);

		div.appendChild(table)

	// Fleet creation/disband

		var table = document.createElement("table");
			table.id = "fleetCreationDisband";
			
		var tr = document.createElement("tr");		
		var th = document.createElement("th");
			th.innerHTML = "Fleet Administration";
		tr.appendChild(th);
		table.appendChild(tr);

		var tr = document.createElement("tr");		
		var td = document.createElement("th");
		var input = document.createElement("input");
			input.type = "button";
			input.value = "Create New Fleet";
			input.addEventListener("click", transfer.showFleetCreationDialog);

			td.appendChild(input);
			tr.appendChild(td);
			table.appendChild(tr);


		var tr = document.createElement("tr");
			tr.id = "disbandFleet"
			tr.className = "disabled";
		var td = document.createElement("th");
		var input = document.createElement("input");
			input.type = "button";
			input.value = "Disband Selected Fleet";
			input.addEventListener("click", function(){
				transfer.deleteFleet();
			});

			td.appendChild(input);
			tr.appendChild(td);
			table.appendChild(tr);
			div.appendChild(table)
	}
}

function emptyGUI(){
	document.getElementById("gui").innerHTML = "";
}

function init(){
		
		
	userid = Math.floor(document.getElementById("userid").innerHTML);
	gameid = Math.floor(document.getElementById("gameid").innerHTML);
	currentTurn = Math.floor(document.getElementById("currentTurn").innerHTML);


	unDraw();
	drawCenter();
	createHexGrid();

	ajax.getGameData(userid, gameid);
}

function unDraw(){
	if (grid){
		var canvas = document.getElementsByTagName("canvas");
		for (var i = 0; i < canvas.length; i++){
			var ctx = canvas[i].getContext("2d");
				ctx.clearRect(0, 0, width, height);
		}
	}
}

function drawCenter(){
/*	mouseCtx.beginPath();
	mouseCtx.moveTo(0, mouseCanvas.height/2);
	mouseCtx.lineTo(mouseCanvas.width, mouseCanvas.height/2);
	mouseCtx.moveTo(mouseCanvas.width/2, 0);
	mouseCtx.lineTo(mouseCanvas.width/2, mouseCanvas.height);
	mouseCtx.closePath();
	mouseCtx.strokeStyle = "red";
	mouseCtx.stroke();
	*/
}

function createHexGrid(){
	
	if (!grid){
		grid = new Grid(hexCanvas.width, hexCanvas.height);
	}
}

function drawHexGrid(){
	
	// console.log("draw with offset: " + cam.offSet.x + " / " + cam.offSet.y + ", zoom: " + cam.zoom);
	
	for (var h in grid.hexes){
		grid.hexes[h].draw(hexCtx);
		grid.hexes[h].drawContent(objCtx);
	}
			
	moveManager.drawCurrentOrders(moveCtx);
}



function drawHex(hex){
	hex.draw(ctx)
}
	
function endTurn(){
	if (gamedata.canCommit){
		var moves = [];
			
		for (var i = 0; i < moveManager.orders.length; i++){
			var move = moveManager.orders[i];
			moves.push(move);
		}
		
		ajax.commitMoves(moves);
	}
	else {
		alert("you cant do dis bra");
	}
}

function switchAdminMode(){
	if (grid){
		if (admin.active){
			admin.active = false;
			document.getElementById("adminButton").value = "Admin Modus AN";
			document.getElementById("adminSectors").className = "disabled";
			document.getElementById("adminPlanets").className = "disabled";
			document.getElementById("adminLanes").className = "disabled";
			document.getElementById("adminFleets").className = "disabled";
			document.getElementById("adminGates").className = "disabled";
		}
		else {
			admin.active = true;
			document.getElementById("adminButton").value = "Admin Modus AUS";
			document.getElementById("adminSectors").className = "";
			document.getElementById("adminPlanets").className = "";
			document.getElementById("adminLanes").className = "";
			document.getElementById("adminFleets").className = "";
			document.getElementById("adminGates").className = "";
		}
	}
}

function switchCanvas(id){
	var ele = document.getElementById(id + "Canvas");
	
	if (ele.className == "disabled"){
		ele.className = "";
	}
	else {
		ele.className = "disabled";
	}
}

function isEqual(a, b){
	if (a[0] == b[0] && a[1] == b[1]){
		return true;
	}
}


function createRenameElement(e, type, id){

	if (popup){
		return;
	}
	else {

		popup = true;

		var div = document.createElement("table");
			div.id = "renameDiv";
			div.style.margin = "auto";

		var span = document.createElement("span");
			span.innerHTML = "Rename this " + type + " to:";
			div.appendChild(span);

		var input = document.createElement("input");
			input.placeholder = "Enter New Name here";
			$(input).data("id", id);
			$(input).data("type", type);
			div.appendChild(input);

		var input = document.createElement("input");
			input.type = "button";
			input.style.width = "70px";
			input.value = "Confirm";
			input.addEventListener("click", function(e){
				var input = this.parentNode.getElementsByTagName("input")[0];
				var id = $(input).data("id");
				var type = $(input).data("type");
				var name = input.value;

				if (name != ""){					
					popup = false;

					if (type == "planet"){
						for (var i = 0; i < selectedHex.contains.length; i++){
							if (selectedHex.contains[i].id == id) {
								if (selectedHex.contains[i] instanceof Planet){
									selectedHex.contains[i].name = name;
									ajax.changeElementName(type, id, name);
									break;
								}
							}
						}
					}
					else if (type == "fleet"){
						for (var i = 0; i < selectedHex.contains.length; i++){
							if (selectedHex.contains[i].id == id) {
								if (selectedHex.contains[i] instanceof Fleet){
									selectedHex.contains[i].name = name;
									ajax.changeElementName(type, id, name);
									break;
								}
							}
						}
					}
					else if (type == "ship"){
						for (var i = 0; i < selectedHex.contains.length; i++){
							if (selectedHex.contains[i] instanceof Fleet){
								for (var j = 0; j < selectedHex.contains[i].ships.length; j++){
									if (selectedHex.contains[i].ships[j].id == id){
										selectedHex.contains[i].ships[j].name = name;
										ajax.changeElementName(type, id, name);
										break;
									}
								}
							}
						}
					}


				$("#renameDiv").remove();
				updateGUI(selectedHex);

				}
				else {
					alert("invalid name given");
				}
			});

			div.appendChild(input);

		var input = document.createElement("input");
			input.type = "button";
			input.style.width = "70px"
			input.value = "Cancel";;
			input.addEventListener("click", function(e){
				popup = false;
				$("#renameDiv").remove();
			});
			div.appendChild(input);

			document.body.appendChild(div);
	}
}