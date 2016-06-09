function Transfer(){
	this.selected = [];
	this.ships = [];
	this.shipActions = [];
	this.fleetActions = [];
	this.targetFleet = null;
	this.active = false;

	this.addShip = function (data){
		this.active = true;
		this.selected.push(data);
		document.getElementById("fleetTransfer").className = "fleetTable";
	}

	this.removeShip = function (data){
		for (var i = 0; i < this.selected.length; i++){
			if (this.selected[i].shipid == data.shipid){
				this.selected.splice(i, 1);
			}
		}
		if (this.selected.length == 0){
			this.active = false;
			document.getElementById("fleetTransfer").className = "fleetTable disabled";
		}
	}

	this.checkTransfer = function(){
		var ele = document.getElementById("fleetTransferTarget");		
		var name = ele.options[ele.selectedIndex].text;

			for (var i = 0; i < selectedHex.contains.length; i++){
				if (selectedHex.contains[i] instanceof Fleet){
					if (selectedHex.contains[i].name == name){
						this.targetFleet = selectedHex.contains[i].id;
						break;
					}
				}
			}

			for (var i = 0; i < this.selected.length; i++){
				if (this.selected[i].fleetid == this.targetFleet){
					alert ("error");
					return false;
				}
			}

			this.doTransfer();
	}

	this.showFleetCreationDialog = function(){
		console.log("ding");
		var topDiv = document.createElement("div");
			topDiv.id = "fleetCreationDiv";
			
			var table = document.createElement("table");
				table.id = "fleetCreationTable";
			
			var tr = document.createElement("tr");
			var td = document.createElement("td");
				td.innerHTML = "Create a new fleet";
			tr.appendChild(td);
			table.appendChild(tr);					
			
			var tr = document.createElement("tr");
			var td = document.createElement("td");				
				
				var input = document.createElement("input");
					input.placeholder = "Name your new Fleet here";
					input.id = "createFleetName";	

			td.appendChild(input);
			tr.appendChild(td);
			table.appendChild(tr);

			var tr = document.createElement("tr");
			var td = document.createElement("td");				
					
				var input = document.createElement("input");
					input.type = "button";
					input.value = "CONFIRM";
					input.style.width = "70px";
					input.addEventListener("click", function(){
						transfer.createNewFleet();
					})

			td.appendChild(input);			
					
				var input = document.createElement("input");
					input.type = "button";
					input.value = "CANCEL";
					input.style.width = "70px";
					input.addEventListener("click", function(){
						$("#fleetCreationDiv").remove();
					})

			td.appendChild(input);
			tr.appendChild(td);
			table.appendChild(tr);

			topDiv.appendChild(table);
			document.body.appendChild(topDiv);	
	}

	this.createNewFleet = function(){
		var name = document.getElementById("createFleetName").value;

		if (name != ""){
			var fleet = new Fleet(999, selectedHex.id, name);
				fleet.gameid = gameid;
				fleet.playerid = userid;

			ajax.createNewFleet(fleet);
		}
		else {
			alert("enter fleet name");
		}
	}

	this.finishNewFleetCreation = function(id, item){
		$("#fleetCreationDiv").remove();

		item = JSON.parse(item);
		var fleet = new Fleet(id, item.location, item.name);

		selectedHex.contains.push(fleet);
		this.selected = [];
		this.ships = [];
		updateGUI(selectedHex);
	}

	this.deleteFleet = function(){

		console.log("ding");
		for (var i = 0; i < selectedHex.contains.length; i++){
			if (selectedHex.contains[i] instanceof Fleet){
				if (selectedHex.contains[i].id == selectedFleet.id ){

					ajax.deleteEmptyFleet(selectedFleet);
					selectedFleet = null;
					selectedHex.contains.splice(i, 1);
					break;
				}
			}
		}

		updateGUI(selectedHex);
	}

	this.doTransfer = function(){

		for (var i = 0; i < this.selected.length; i++){
			var ship = this.selected[i];

			for (var j = 0; j < selectedHex.contains.length;j++){
				if (selectedHex.contains[j] instanceof Fleet){
					var fleet = selectedHex.contains[j];

					if (fleet.id == ship.fleetid){
						for (var k = 0; k < fleet.ships.length; k++){
							if (fleet.ships[k].id == ship.shipid){
								this.ships.push(fleet.ships[k]);
								fleet.ships.splice(k, 1);
							}
						}
					}
				}
			}
		}

		for (var i = 0; i < selectedHex.contains.length; i++){
			if (selectedHex.contains[i] instanceof Fleet){
				if (selectedHex.contains[i].id == this.targetFleet){
					for (var j = 0; j < this.ships.length; j++){
						var replaced = false;
						for (var k = 0; k < this.shipActions.length; k++){
							if (this.ships[j].id == this.shipActions[k].shipid){
								this.shipActions[k].to = this.targetFleet;
								replaced = true;
							}
						}
						if (! replaced){
							var item = {
								shipid: this.ships[j].id,
								from: this.ships[j].fleetid,
								to: this.targetFleet
							}

							this.shipActions.push(item);
						}
						
						selectedHex.contains[i].ships.push(this.ships[j]);
					}
				}
			}
		}

		var validActions = [];

		for (var i = 0; i < this.shipActions.length; i++){
			var act = this.shipActions[i];
			if (act.from != act.to){
				validActions.push(act)
			}
		}


		ajax.shipTransfer(validActions);

		this.shipActions = [];
		this.selected = [];
		this.ships = [];
		this.targetFleet = null;
		this.active = false;
		updateGUI(selectedHex);
	}
}