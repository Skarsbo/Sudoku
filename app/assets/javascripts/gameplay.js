
function SudokuMain(clues) {
	
	var svgns = "http://www.w3.org/2000/svg";
	var cells;
	var selectedCell = -1;
	
	console.log(clues);
	createSudokuBoard(clues);
	setInterval(blinkCursor, 1000/30);

	document.onkeydown = function(event) {
		if(selectedCell < 0) return;
		let val = parseInt(event.key);
		if(event.key === "Delete") val = 0;
		else if(event.key === "Escape") {
			selectedCell = -1;
			redrawBoard();
			return;
		}
		if(isNaN(val)) return;
		cells[selectedCell].value = val;
		redrawBoard();
		if(isNaN(val) || val == 0) return;
		selectedCell = -1;
	}

	function blinkCursor() {
		if(selectedCell >= 0) {
			var rect = document.getElementById(selectedCell);
			var v = new Date().getMilliseconds();
			v = Math.sin(v/500*Math.PI)*64 +192;
			rect.setAttribute("fill", "rgb("+v+","+v+","+v+")");
		}
	}

	function Cell(index) {
		this.index = index;
		this.value = 0;
		this.isClue = false;
		this.isLocked = (Math.random() > 0.9)? true : false;
		this.notes = [];
		this.select = function() {
			if (this.isClue || this.isLocked) return;
			selectedCell = this.index;
		}
		this.getColor = function() {
			if		(this.isClue) 	return "#ded";
			else if	(this.isLocked) return "#ddd";
			else 					return "white";
		}
		this.x = function() { return index%9; }
		this.y = function() { return Math.floor(index/9); }
		this.box = function() {
			return Math.floor(index/27)*3
				+ Math.floor((index%9)/3);
		}
		this.isConflicted = function() {
		}
	}

	function createSudokuBoard(clues) {
		cells = createCells(clues);
		
		function createCells(clues) {
			var c = new Array();
			for(var i = 0; i < 81; i++) {
				var cell = new Cell(i);
				cell.value = clues[i];
				if (cell.value != 0) cell.isClue = true;
				c.push(cell);
			}
			return c;
		}

		var board = document.getElementById("board");
		initializeBoard(board, cells);
		
		function initializeBoard(board, cells) {
			board.setAttribute("viewBox", "0 0 100 100");
			board.setAttribute("style", "background: black;");
			var border1 = 0.2; // width of thin borders (as % of board width)
			var border2 = 0.6; // further width added to thick borders
			var cellWidth = (100 -border1*10 -border2*4) /9;
			for(i in cells) {
				var cell = cells[i];
				var posX = getCellPos(cell.x());
				var posY = getCellPos(cell.y());
				var rec = document.createElementNS(svgns, "rect");
				rec.setAttribute("width", cellWidth);
				rec.setAttribute("height", cellWidth);
				rec.setAttribute("x", posX);
				rec.setAttribute("y", posY);
				rec.setAttribute("class", "cells");
				rec.setAttribute("id", i);
				rec.setAttribute("fill", cell.getColor());
				rec.onmousedown  = function(event) {
					redrawBoard();
					var i = parseInt(event.target.getAttribute("id"));
					cells[i].select();
				}
				rec.onmouseover = function(event) {
					event.target.setAttribute("fill", "orange");
				}
				rec.onmouseout = function(event) {
					var i = parseInt(event.target.getAttribute("id"));
					event.target.setAttribute(
						"fill",
						cells[i].getColor()
					);
				}
				
				board.appendChild(rec);
				var t = document.createElementNS(svgns, "text");
				t.setAttribute("x", posX +cellWidth/2);
				t.setAttribute("y", posY +cellWidth/2);
				t.setAttribute("class", "numbers");
				t.setAttribute("id", "t"+i);
				t.setAttribute("fill", "black");
				t.setAttribute("font-size", "10");
				t.setAttribute("text-anchor", "middle");
				t.setAttribute("dominant-baseline", "central");
				t.setAttribute("pointer-events", "none");
				t.innerHTML = cell.value;
				board.appendChild(t);
				if(cell.value > 0) {
				}
			}

			function getCellPos(index) {
				return index*cellWidth
					+(index+1)*border1
					+(Math.floor((index)/3)+1)*border2;
			}
		}
		
		redrawBoard();
	}

	function redrawBoard() {
		for(var i = 0; i < 81; i++) {
			cells[i].isSelected = false;
		}
		var recs = document.getElementsByClassName("cells");
		var nums = document.getElementsByClassName("numbers");
		for(var i = 0; i < 81; i++) {
			recs[i].setAttribute("fill", cells[i].getColor());
			if(cells[i].value == 0)
				nums[i].setAttribute("visibility", "hidden");
			else 
				nums[i].setAttribute("visibility", "visible");
				nums[i].innerHTML = cells[i].value;
		}
	}

}

