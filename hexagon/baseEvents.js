
function mouseCanvasMouseMove(e){
	if (grid){
		var rect = this.getBoundingClientRect();		
		var pos = new Point(e.clientX - rect.left, e.clientY - rect.top);
		
	//	document.getElementById("currentPos").innerHTML = pos.x + " / " + pos.y;
	
		var hex = grid.getHexAtPos(pos);
		if (hex){
			if (! activeHover){
				if (hex.markers.length){
					if (! hex.hover){
						hex.createHoverDiv(pos);
						hex.showHoverDiv();
					}
					else if (activeHover && activeHover != hex.id){
						grid.getHexById(activeHover).hideHoverDiv();
						if (hex.markers.length){
							if (! hex.hover){
								hex.createHoverDiv(pos);
								hex.showHoverDiv();
							}
							else if (activeHover != hex.id){
								grid.getHexById(activeHover).hideHoverDiv();
							}
							else {
								hex.showHoverDiv();
							}
						}
					}
					else {
						hex.showHoverDiv();
					}
				}
			}
			else if (activeHover != hex.id){
				grid.getHexById(activeHover).hideHoverDiv();
				if (hex.markers.length){
					if (! hex.hover){
						hex.createHoverDiv(pos);
						hex.showHoverDiv();
					}
					else if (activeHover != hex.id){
						grid.getHexById(activeHover).hideHoverDiv();
					}
				}				
			}
			


	//		document.getElementById("currentPos").innerHTML += "___" + hex.id;

		}
	}	
};



function mouseCanvasDblClick(e){
	e.stopPropagation();
	console.log("ding")
	if (popup){
		return;
	}

	if (grid){
		var rect = this.getBoundingClientRect();		
		var pos = new Point(e.clientX - rect.left, e.clientY - rect.top);
		
		var hex = grid.getHexAtPos(pos);
		
		if (hex){
			var div = document.createElement("div");
				div.id = "markerCreationDiv";
				div.style.marginLeft = pos.x + "px";
				div.style.marginTop = pos.y + "px";

			var table = document.createElement("table");
			var content = [];

			content.push("Add Global Map Marker");
			content.push("Hex: " + hex.id);
			content.push("<input placeholder='Enter Notes Here'>");
			content.push("<input type='button' value='confirm' onclick='createMarker(this.parentNode.parentNode.parentNode.parentNode)'>");
			content.push("<input type='button' value='cancel' onclick='cancelMarker(this.parentNode.parentNode.parentNode.parentNode)'>");


			for (var i = 0; i < content.length; i++){
				var tr = document.createElement("tr");
				var td = document.createElement("td");
					td.innerHTML = content[i];

				tr.appendChild(td);
				table.appendChild(tr);
			}

			var input = table.getElementsByTagName("input")[0];
				$(input).data("loc", hex.id);

			div.appendChild(table);
			document.body.appendChild(div);
		}
	}
}

function createMarker(div){
	var inputs = document.getElementById("markerCreationDiv").getElementsByTagName("input");
	var note = inputs[0].value;
	var loc = $(inputs[0]).data("loc"); 
	if (note.length){
		ajax.createMarker(note, loc);
		grid.getHexById(loc).markers.push({notes: note});
		div.parentNode.removeChild(div);
	}
	else {
		alert ("invalid notes given");
	}



}

function cancelMarker(div){
	div.parentNode.removeChild(div);
}




function mouseCanvasClick(e){
	if (popup){
		return;
	}

	if (grid){
		var rect = this.getBoundingClientRect();		
		var pos = new Point(e.clientX - rect.left, e.clientY - rect.top);
		
		var hex = grid.getHexAtPos(pos);
		
		if (hex){
			console.log(hex);
			
			if (admin.active){
				if (admin.inSectorMode){
					admin.showSectorCreation(hex);
				}
				else if (admin.inLaneMode){
					admin.addHexToRoute(hex);
				}
				else if (admin.inPlanetMode){
					if (! admin.activePopUp){
						admin.showPlanetCreation(hex);
					}
				}
				else if (admin.inFleetMode){
					if (! admin.activePopUp){
						admin.showFleetCreation(hex);
					}
				}
				else if (admin.inGateMode){
					if (! admin.activePopUp){
						if (admin.killGateMode){
							admin.showGateSelect(hex);
						}
						else {
							admin.showGateCreation(hex);
						}
					}
				}
			}
			else if (!moveManager.activeFleet && !transfer.active){
				if (selectedHex == null){
					hex.selected = true;
					selectedHex = hex;
					updateGUI(hex);
				}
				else if (selectedHex.id != hex.id){
					selectedHex.selected = false;
					selectedHex.draw(hexCtx);
					selectedFleet = false;
					
					emptyGUI();			
								
					hex.selected = true;
					selectedHex = hex;
					updateGUI(hex);
				}
				
				hex.draw(hexCtx);
				hex.drawContent(objCtx);
				hex.drawLanes(jumpCtx);
				
			}
			else if (moveManager.activeFleet){
				mouseCanvasClickAddMove(hex);
			}
		}
	}
};

function mouseCanvasClickAddMove(hex){
	if (!isEqual(hex.id, moveManager.origin.id)){
		if (hex.hasJumpgate){
			hex.drawLanes(jumpCtx);
		}
	}
	moveManager.checkForValidMove(hex);
}

function mouseCanvasZoom(e){
	e.preventDefault();	
	if (grid){
			if (! moveManager.activeFleet){
		//	var rect = this.getBoundingClientRect();		
		//	var pos = new Point(e.clientX - rect.left, e.clientY - rect.top);
		//	var hex = grid.getHexAtPos(pos);
		
			cam.adjustZoom(e);
			cam.undoScroll();
			unDraw();
			drawCenter();
			grid.update();
			cam.doScroll(grid.getHexById(cam.focus.id));
			
			if (selectedHex){
				selectedHex = grid.getHexById(selectedHex.id);
				selectedHex.drawLanes(jumpCtx);
			}
			
			drawHexGrid();
			moveManager.drawCurrentOrders(moveCtx);
			
		}
	}	
}

function mouseCanvasScroll(e){
	e.preventDefault();
	
	if (grid){
		var rect = this.getBoundingClientRect();		
		var pos = new Point(e.clientX - rect.left, e.clientY - rect.top);
		var hex = grid.getHexAtPos(pos);
		
		if (hex){
			cam.undoScroll();
			cam.doScroll(hex);
			unDraw();			
			drawCenter();
			drawHexGrid();
			
			if (selectedHex){
				selectedHex = grid.getHexById(selectedHex.id);
				selectedHex.drawLanes(jumpCtx);
			}			
		}
	}
}

function moveorderClick(e){
	e.stopPropagation();
	if (selectedFleet){
		if (this.id.substr(9) == selectedFleet.id){
			if (this.innerHTML == "Plan Movement"){
				moveManager.initiateMovement();
				this.innerHTML = "Order planned Movement";
			}
			else if (this.innerHTML = "Order planned Movement"){
				moveManager.confirmCurrentMovementPlan()
			}
		}
	}
}

			
function fleetTableClick(e){
	if (transfer.active == false){
		if (!selectedFleet){
			//console.log("1");
			selectedFleet = selectedHex.getFleetById(this.id.substr(5));
			document.getElementById("fleet" + selectedFleet.id).className = "fleetTable fleetSelected";
			document.getElementById("moveFleet" + selectedFleet.id).className = "";

		}
		else if (selectedFleet.id == this.id.substr(5)){
			if (moveManager.activeFleet){
				return;
			}
			else {
			//	console.log("2");
				document.getElementById("fleet" + selectedFleet.id).className = "fleetTable fleetNormal";
				document.getElementById("moveFleet" + selectedFleet.id).className = "disabled";
				selectedFleet = false;
			}
		}
		else if (!moveManager.activeFleet){
		//	console.log("3");
			document.getElementById("fleet" + selectedFleet.id).className = "fleetTable fleetNormal";
			document.getElementById("moveFleet" + selectedFleet.id).className = "disabled";
			selectedFleet = false;
			
			selectedFleet = selectedHex.getFleetById(this.id.substr(5));
			document.getElementById("fleet" + selectedFleet.id).className = "fleetTable fleetSelected";
			document.getElementById("moveFleet" + selectedFleet.id).className = "";
		}


		if (selectedFleet && selectedFleet.ships.length == 0){
			document.getElementById("disbandFleet").className = "";
		}
		else {
			document.getElementById("disbandFleet").className = "disabled";
		}
	}
}

