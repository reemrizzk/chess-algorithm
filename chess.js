var chessBoard = document.getElementById("chess-board");
var board = [
[2,3,4,5,6,4,3,2],
[1,1,1,1,1,1,1,1],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[7,7,7,7,7,7,7,7],
[8,9,10,11,12,10,9,8]
];
var turn = "white";

var moving = false;

var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;

// Determine the type of a piece
function pieceType(i, j, b) {
	let n = b[i][j];
	if(n == 1 || n == 7) return "p";
	else if(n == 2 || n == 8) return "r";
	else if(n == 3 || n == 9) return "n";
	else if(n == 4 || n == 10) return "b";
	else if(n == 5 || n == 11) return "q";
	else if(n == 6 || n == 12) return "k";
	else return "";
}

// Determine which player a piece belongs to
function whichPlayer(i, j, b) {
	if(b[i][j] == 0) return "";
    else return b[i][j] > 6 ? "white" : "black";
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getKingTile(player, b) {
	let kingPiece = (player == "black" ? 6 : 12);
	for(let i = 0; i < 8; i++)
	{
		for(let j = 0; j < 8; j++)
		{
			if(b[i][j] == kingPiece) return [i, j];
		}
	}
	return [0, 0];
}

function getQueenTiles(player, b) {
	let queenPiece = (player == "black" ? 5 : 11);
	let qTiles = [];
	for(let i = 0; i < 8; i++)
	{
		for(let j = 0; j < 8; j++)
		{
			if(b[i][j] == queenPiece) qTiles.push([i, j]);
		}
	}
	return qTiles;
}

function getRookTiles(player, b) {
	let rookPiece = (player == "black" ? 2 : 8);
	let rTiles = [];
	for(let i = 0; i < 8; i++)
	{
		for(let j = 0; j < 8; j++)
		{
			if(b[i][j] == rookPiece) rTiles.push([i, j]);
		}
	}
	return rTiles;
}

function isValidMove(i1, j1, i2, j2, check, b)
{
	if(b[i1][j1] == 0) return false;
	if(i1 == i2 && j1 == j2) return false;
	if(i2 < 0 || i2 > 7 || j2 < 0 || j2 > 7) return false;
	
	let player1 = whichPlayer(i1, j1, b);
	let player2 = whichPlayer(i2, j2, b);
	
	if(player1 == player2) return false;
	// TODO: Return true if castling
	
	let piece1 = pieceType(i1, j1, b);

	switch(piece1) {
		case "p":
			if(b[i2][j2] == 0 && (j1 != j2)) return false;
			if(player1 == "white")
			{
				if(b[i2][j2] == 0)
				{
					if(i2 >= i1) return false;
					if((i1 - i2) > 2) return false;
					if((i1 - i2) == 2 && i1 != 6) return false;
					if((i1 - i2) == 2 && b[i1 - 1][j2] != 0) return false;
				}
				else
				{
					if(Math.abs(j2 - j1) != 1) return false;
					if((i1 - i2) != 1) return false;
				}
			}
			else
			{
				if(b[i2][j2] == 0)
				{
					if(i2 <= i1) return false;
					if((i2 - i1) > 2) return false;
					if((i2 - i1) == 2 && i1 != 1) return false;
					if((i2 - i1) == 2 && b[i2 - 1][j2] != 0) return false;
				}
				else
				{
					if(Math.abs(j2 - j1) != 1) return false;
					if((i2 - i1) != 1) return false;
				}
			}
		break;
		case "r": 
			if((j2 - j1) != 0 && (i2 - i1) != 0) return false;
			if(i1 == i2)
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{ 
						if(b[i1][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{ 
						if(b[i1][n] != 0) return false;
					}
			}
			else if(j1 == j2)
			{ 
				if(i2 < i1)
					for(let n = (i1 - 1); n > i2; n--)
					{ 
						if(b[n][j1] != 0) return false;
					}
				else if(i2 > i1)
					for(let n = (i1 + 1); n < i2; n++)
					{ 
						if(b[n][j1] != 0) return false;
					}
			}
		break;
		case "n":
			if(!(Math.abs(i2 - i1) == 2 && Math.abs(j2 - j1) == 1) && !(Math.abs(i2 - i1) == 1 && Math.abs(j2 - j1) == 2)) return false;
		break;
		case "b":
			if(Math.abs(i2 - i1) != Math.abs(j2 - j1)) return false;
			if((i2 - i1) == (j2 - j1))
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{
						let f = (j1 - n);
						if(b[i1 - f][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{
						let f = (n - j1);
						if(b[i1 + f][n] != 0) return false;
					}
			}
			else
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{
						let f = (j1 - n);
						if(b[i1 + f][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{
						let f = (n - j1);
						if(b[i1 - f][n] != 0) return false;
					}
			}
		break;
		case "q":
			if((Math.abs(i2 - i1) != Math.abs(j2 - j1)) && ((j2 - j1) != 0 && (i2 - i1) != 0)) return false;
			if(i1 == i2)
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{ 
						if(b[i1][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{ 
						if(b[i1][n] != 0) return false;
					}
			}
			else if(j1 == j2)
			{ 
				if(i2 < i1)
					for(let n = (i1 - 1); n > i2; n--)
					{ 
						if(b[n][j1] != 0) return false;
					}
				else if(i2 > i1)
					for(let n = (i1 + 1); n < i2; n++)
					{ 
						if(b[n][j1] != 0) return false;
					}
			}
			else if((i2 - i1) == (j2 - j1))
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{
						let f = (j1 - n);
						if(b[i1 - f][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{
						let f = (n - j1);
						if(b[i1 + f][n] != 0) return false;
					}
			}
			else
			{
				if(j2 < j1)
					for(let n = (j1 - 1); n > j2; n--)
					{
						let f = (j1 - n);
						if(b[i1 + f][n] != 0) return false;
					}
				else if(j2 > j1)
					for(let n = (j1 + 1); n < j2; n++)
					{
						let f = (n - j1);
						if(b[i1 - f][n] != 0) return false;
					}
			}

		break;
		case "k":
		    if((j2 - j1) > 1 || (i2 - i1) > 1 || (j1 - j2) > 1 || (i1 - i2) > 1) return false;
		break;
	}

	// check if the king is in check after making that move, if yes, then that move is invalid
	if(check)
	{
		let tempBoard = JSON.parse(JSON.stringify(b));
		tempBoard[i2][j2] = b[i1][j1];
		tempBoard[i1][j1] = 0;
		let kingTile = getKingTile(player1, tempBoard);
		 
		if(isInCheck(kingTile[0], kingTile[1], tempBoard, false) !== false) return false;
		
		if(player1 == "black")
		{
			let queenTiles = getQueenTiles(player1, tempBoard);
			for(let q = 0; q < queenTiles.length; q++)
			{
				
				if(isInCheck(queenTiles[q][0], queenTiles[q][1], tempBoard, false) !== false)
				return "q";
			}
			let rookTiles = getRookTiles(player1, tempBoard);
			for(let q = 0; q < rookTiles.length; q++)
			{
				
				if(isInCheck(rookTiles[q][0], rookTiles[q][1], tempBoard, false) !== false)
				return "r";
			}
		}
	}
	
	return "";
}

function isInCheck(y, x, b, check)
{
	for(let i = 0; i < 8; i++)
	{
		for(let j = 0; j < 8; j++)
		{
			if(b[i][j] != 0)
			{
				if(whichPlayer(y, x, b) != whichPlayer(i, j, b))
				{
					if(isValidMove(i, j, y, x, check, b) !== false) {return [i, j];}
				}
			}
		}
	}
	return false;
}

function makeAMove() {
	var moves = [];
	var blackPieces = [];
	var whitePawns = [];
	var whiteKing = [];
	var whiteQueen = [];
	var whiteRooks = [];
	var whiteKnights = [];
	var whiteBishops = [];
	for(let i = 0; i < 8; i++)
	{
		for(let j = 0; j < 8; j++)
		{
			if(whichPlayer(i, j, board) == "black")
			{
				blackPieces.push([i, j]);
			}
			if(whichPlayer(i, j, board) == "white")
			{
				let t = pieceType(i, j, board);
				
				if(t == "k") whiteKing = [i, j];
				else if(t == "q") whiteQueen = [i, j];
				else if(t == "r") whiteRooks.push([i, j]);
				else if(t == "n") whiteKnights.push([i, j]);
				else if(t == "b") whiteBishops.push([i, j]);
				else whitePawns.push([i, j]);
			}
		}
	}
	 
	if(rand(0, 9) != 0 && whiteQueen.length == 2)
	{	let c = isInCheck(whiteQueen[0], whiteQueen[1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteQueen[0], whiteQueen[1]);
			return true;
		}
	}
	if(rand(0, 4) != 0 && whiteRooks.length == 2)
	{
		let c = isInCheck(whiteRooks[1][0], whiteRooks[1][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteRooks[1][0], whiteRooks[1][1]);
			return true;
		}

	}	
	if(rand(0, 4) != 0 && whiteRooks.length > 0)
	{
		let c = isInCheck(whiteRooks[0][0], whiteRooks[0][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteRooks[0][0], whiteRooks[0][1]);
			return true;
		}
	}	

	if(rand(0, 2) != 0 && whiteKnights.length == 2)
	{
		let c = isInCheck(whiteKnights[1][0], whiteKnights[1][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteKnights[1][0], whiteKnights[1][1]);
			return true;
		}

	}	
	if(rand(0, 2) != 0 && whiteKnights.length > 0)
	{
		let c = isInCheck(whiteKnights[0][0], whiteKnights[0][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteKnights[0][0], whiteKnights[0][1]);
			return true;
		}
	}	
	
	if(rand(0, 2) != 0 && whiteBishops.length == 2)
	{
		let c = isInCheck(whiteBishops[1][0], whiteBishops[1][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteBishops[1][0], whiteBishops[1][1]);
			return true;
		}

	}	
	if(rand(0, 2) != 0 && whiteBishops.length > 0)
	{
		let c = isInCheck(whiteBishops[0][0], whiteBishops[0][1], board, true);
		if(c !== false)
		{
			updateTiles(c[0], c[1], whiteBishops[0][0], whiteBishops[0][1]);
			return true;
		}
	}
	
	let f1 = 0; let g1 = 0;
	let f2 = 0; let g2 = 0;
	let foundAMove = false;
	
	if(rand(0, 1) == 0)
	for(let k = 0; k < blackPieces.length; k++)
	{
		for(let i = 0; i < 8; i++)
		{
			for(let j = 0; j < 8; j++)
			{
				let isValidAndCheck = isValidMove(blackPieces[k][0], blackPieces[k][1], i, j, true, board);
				if(isValidAndCheck !== false)
				{
					let rndMax = 6;
					if(isValidAndCheck == "q") rndMax = 40;
					else if(isValidAndCheck == "r") rndMax = 25;
					let rndN = rand(0, rndMax);
					if(rndN < 2)
					{
						updateTiles(blackPieces[k][0], blackPieces[k][1], i, j);
						return true;
					}
					else
					{
						f1 = blackPieces[k][0]; g1 = blackPieces[k][1];
						f2 = i; g2 = j;
						foundAMove = true;
					}
				}
			}
		}
	}
	
	else
	for(let k = (blackPieces.length - 1); k >= 0; k--)
	{
		for(let i = 0; i < 8; i++)
		{
			for(let j = 0; j < 8; j++)
			{
				let isValidAndCheck = isValidMove(blackPieces[k][0], blackPieces[k][1], i, j, true, board);
				if(isValidAndCheck !== false)
				{
					let rndMax = 6;
					if(isValidAndCheck == "q") rndMax = 40;
					else if(isValidAndCheck == "r") rndMax = 25;
					let rndN = rand(0, rndMax);
					if(rndN < 2)
					{
						updateTiles(blackPieces[k][0], blackPieces[k][1], i, j);
						return true;
					}
					else
					{
						f1 = blackPieces[k][0]; g1 = blackPieces[k][1];
						f2 = i; g2 = j;
						foundAMove = true;
					}
				}
			}
		}
	}
	

	if(foundAMove)
	{
		updateTiles(f1, g1, f2, g2);
		return true;
	}
	else
	{
		alert("Congratulations you won!");
		return false;
	}
}

function showLegalMoves()
{
	if(moving)
	{
		for(let i = 0; i < 8; i++)
		{
			for(let j = 0; j < 8; j++)
			{
				if(whichPlayer(i, j, board) != "white")
				if(isValidMove(y1, x1, i, j, true, board) !== false)
				{
					document.getElementById("tile-"+i+"-"+j).style.background = "rgba(0, 128, 255, 0.3)";					
				}
			}
		}
	}
}

function selectTiles(i, j)
{	
	if(moving)
	{
		y2 = i;
		x2 = j;
		moving = false;
		
		let elements = document.querySelectorAll(".no-piece");
  
		elements.forEach(element => {
			element.style.background = "rgba(0, 0, 0, 0)";
		});
		
		elements = document.querySelectorAll(".piece-black");
  
		elements.forEach(element => {
			element.style.background = "rgba(0, 0, 0, 0)";
		});
		
		elements = document.querySelectorAll(".piece-white");
  
		elements.forEach(element => {
			element.style.background = "rgba(0, 0, 0, 0)";
		});
  
		if(isValidMove(y1, x1, y2, x2, true, board) !== false)
		{
			updateTiles(y1, x1, y2, x2);
			setTimeout( function() { makeAMove(); }, 1200);
		}
	}
	else if(whichPlayer(i, j, board) == "white" && turn == "white" && board[i][j] != 0)
	{
		y1 = i;
		x1 = j;
		moving = true;
		document.getElementById("tile-"+y1+"-"+x1).style.background = "rgba(158, 80, 195, 0.6)";
		if(document.getElementById("showMoves").checked)
			showLegalMoves();
	}
}

function updateTiles(i1, j1, i2, j2)
{
	let player = whichPlayer(i1, j1, board);
	let pType = pieceType(i1, j1, board);
	
	let newPosition = board[i2][j2];
	if(newPosition != 0)
	{
		let removedPiecePlayer = whichPlayer(i2, j2, board);
		let removedPieceType = pieceType(i2, j2, board);
		if(removedPiecePlayer == "black")
		{
			document.getElementById("computer-removed-pieces").innerHTML += `<img alt="" src="images/${removedPieceType}-${removedPiecePlayer}.png">`;
		}
		else
		{
			document.getElementById("player-removed-pieces").innerHTML += `<img alt="" src="images/${removedPieceType}-${removedPiecePlayer}.png">`;
		}
	}
	
	//TODO: castling
	board[i2][j2] = board[i1][j1];
	board[i1][j1] = 0;
	
	if(pType == "p" && i2 == 7)
	{
		rnd = rand(0, 7);
		if(rnd < 5) {
			pType = "q";
			board[i2][j2] = 5;
		}
		else if(rnd == 5) {
			pType = "r";
			board[i2][j2] = 2;
		}
		else if(rnd == 6) {
			pType = "b";
			board[i2][j2] = 4;
		}
		else {
			pType = "n";
			board[i2][j2] = 3;
		}
	}
	
	if(pType == "p" && i2 == 0)
	{
		let typ = prompt("Choose a new piece ('r' for rook, 'n' for knight, 'b' for bishop, or 'q' for rook");
		if(typ != 'r' && typ != 'n' && typ != 'b' && typ != 'q') typ = 'q';
		pType = typ;
		if(typ == 'r')
			board[i2][j2] = 8;
		else if(typ == 'n')
			board[i2][j2] = 9;
		else if(typ == 'b')
			board[i2][j2] = 10;
		else if(typ == 'q')
			board[i2][j2] = 11;
	}
	
	let div1 = document.getElementById("tile-"+i1+"-"+j1);
	let div2 = document.getElementById("tile-"+i2+"-"+j2);
	div1.className = "";
	div1.className = "no-piece";
	div1.innerHTML = "&nbsp;";

	
	div2.className = "";
	div2.className = "piece-" + player;
	div2.innerHTML = `<img draggable="false" src="images/${pType}-${player}.png">`;
	if(turn == "white")
		turn = "black";
	else turn = "white";
}

//display the board
for(let i = 0; i < 8; i++)
{
	for(let j = 0; j < 8; j++)
	{
		if(board[i][j] == 0)
		{
			chessBoard.innerHTML +=`<div id="tile-${i}-${j}" onclick="selectTiles(${i}, ${j})" class="no-piece" style="left: ${j*75}px;top: ${i*75}px;">&nbsp;</div>`;
		continue;
		}
		
		let player = whichPlayer(i, j, board);
		let pType = pieceType(i, j, board);
		chessBoard.innerHTML +=`<div id="tile-${i}-${j}" onclick="selectTiles(${i}, ${j})" class="piece-${player}" style="left: ${j*75}px;top: ${i*75}px;"><img draggable="false" src="images/${pType}-${player}.png"></div>`;
	}
}


