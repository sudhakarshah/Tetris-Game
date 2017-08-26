
const canvas = document.getElementById("tetris");
const context = canvas.getContext('2d');

context.scale(20,20);


function createPiece(type){

	var newMatrix;
	if (type=='1'){
		return [
		[0,0,0,0],
		[1,1,1,1],
		[0,0,0,0],
 				[0,0,0,0],
 				];
 	}

	if (type=='2'){


		newMatrix= [[1,1],
 				[1,1],
 				];


	}
	if (type=='3'){
		newMatrix= [[1,0,0],
 				[1,1,1],
 				[0,0,0],
 				];

	}
	if (type=='4'){
		newMatrix= [[0,0,1],
 				[1,1,1],
 				[0,0,0],
 				];

	}
	if (type=='5'){
		newMatrix= [[0,1,1],
 				[1,1,0],
 				[0,0,0],
 				];

	}
	if (type=='6'){
		newMatrix= [[0,0,0],
 				[1,1,1],
 				[0,1,0],
 				];

	}
	if (type=='7'){
		newMatrix= [[1,1,0],
 				[0,1,1],
 				[0,0,0],
 				];

	};
	

	return newMatrix;
};





// Creates New pieces of random shape
function resetPiece(){
	const pieceType="1234567";
	var rand=Math.floor(Math.random() * 7) ;
	pos.x=w/2;
	pos.y=0;

	colour=rand;

	 // in case the new block fills the screen in its starting position
	return createPiece(pieceType[rand]);
}


// Checks whether the matrix reaches 
function checkFull(){
	
	for (var i=0;i<w;i++){
		if (screenMatrix[0][i]==1){
			return true;
		}
	};
	return false;
};


function rotate (){
	var transposeMatrix=[];
	for (var i=0;i<matrix.length;i++){
			transposeMatrix[i]=[];
		for (var j=0;j<matrix.length;j++){
			transposeMatrix[i][j]=matrix[j][i]
		};
	};
	var rotatedMatrix=[]
	//Adds the number of required row 
	for (var i=0;i<matrix.length;i++)
		rotatedMatrix[i]=[];

	for (var i=0;i<matrix.length;i++){
		for (var j=0;j<matrix.length;j++){
			rotatedMatrix[j][i]=transposeMatrix[j][matrix.length-i-1];
		};

	};
	return rotatedMatrix;
};


function createScreenMatrix(){
	var screenMatrix=[];
	for(var i = 0; i < h; i++) {
        screenMatrix.push(new Array(w).fill(0));
    };
	return screenMatrix;
};




function checkDownCollision(){

	for (var y=matrix.length-1;y>=0;y--){
		for (var x=0;x<matrix.length;x++){
			if (y+pos.y+1<h){      // checking so that screenmatrix doent go out of range. Find an altenative.
				if ((matrix[y][x]===1) && (screenMatrix[y+pos.y+1][x+pos.x]===1)){
					return true;
				};
			};
		};
	};

	return false;
};


function checkSideCollision(){

	for (var y=0;y<matrix.length;y++){
		for (var x=0;x<matrix.length;x++){
			if ((matrix[y][x]===1) && (screenMatrix[y+pos.y][x+pos.x]===1)){
				return true;
			};
		};
	};
	return false;
};


function checkWithinScreen(direction){
	if ((pos.x+distInside(direction)<0))   
		return false;
	if ((pos.x+distInside(direction)>=w))
		return false;

	return true;
};


function removeRow(){

	for (var y=screenMatrix.length-1;y>=0;y--){
		var sum=0;
		for (var x=0;x<screenMatrix.length;x++){
			if (screenMatrix[y][x]==1){
				sum++;
			};
		};
		if (sum==screenMatrix[0].length){
			score++;
			document.getElementById("score").innerHTML="The Score is "+ score;			
			return y;
		};
	};
	return ("-1");
};

function shiftDown(){

	var row= removeRow();
	while (row!="-1"){
		for (var i=row;i>0;i--){
			screenMatrix[i]=screenMatrix[i-1];
			screenColourMatrix[i]=screenColourMatrix[i-1];
		};
		row=removeRow();
	};
};


function dropBlock(){
	pos.y++;
	fillScreenMatrix();

};

function fillScreenMatrix(){

	if ((pos.y+distInside("down")+1>=h) || (checkDownCollision())){
		for (var y=distInside("down"); y>=0;y--){
			for (var x=0; x<matrix.length;x++){
				if (matrix[y][x]===1){
					screenMatrix[pos.y+y][pos.x+x]=1;
				};
			};
		};

		drawPlayArea();
		shiftDown();
		if (checkFull()){
			screenMatrix=createScreenMatrix();
			screenColourMatrix=createScreenMatrix();
			gamePlay="Pause";
		}
		else{
			matrix=resetPiece();
			fillScreenMatrix();
		};
	};

}






function drawPlayArea(){
	 context.fillStyle= "#000";
	 context.fillRect(0,0,canvas.width,canvas.height);

	 drawScreen(screenMatrix);  // Fallen blocks visible
	 drawPiece(matrix,pos);
}




function drawScreen(matrix){
	for (var y=0; y<matrix.length;y++){
		for (var x=0; x<matrix[y].length;x++){
			if (matrix[y][x]){
				if (screenColourMatrix[y][x]==0){
					screenColourMatrix[y][x]=colourList[colour];
				};
				context.fillStyle=screenColourMatrix[y][x];
				context.fillRect(x,y,1,1);
				context.lineWidth=0.1;
				context.strokeStyle="white";
				context.strokeRect(x,y,1,1);
				
			};
		};
	};
}

function drawPiece(matrix,pos){
	for (var y=0; y<matrix.length;y++){
		for (var x=0; x<matrix[y].length;x++){
			if (matrix[y][x]){
				context.fillStyle=colourList[colour];
				context.fillRect(x+pos.x,y+pos.y,1,1);
				context.lineWidth=0.1;
				context.strokeStyle="white";
				context.strokeRect(x+pos.x,y+pos.y,1,1);
			};
		};
	};
}


function updateGame(){

	if (animation){
		cancelAnimationFrame(animation);
	};
	count++;
	if (count>fixed){
		dropBlock();
		count=0;
	};

	drawPlayArea();
	
	if (gamePlay==="Play")
		animation=requestAnimationFrame(updateGame);


};



function distInside(move){
	if (move=="left"){
		for (var x=0;x<matrix.length;x++){
			for (var y=0;y<matrix.length;y++){
				if (matrix[y][x]==1){

					return x;
				};

			};
		};
	}
	else if (move=="right"){
		for (var x=matrix.length-1;x>-1;x--){
			for (var y=0;y<matrix.length;y++){
				if (matrix[y][x]==1){
		
					return x;
				};

			};
		};
	}

	else if (move=="down"){
		for (var y=matrix.length-1;y>-1;y--){
			for (var x=0;x<matrix.length;x++){
				if (matrix[y][x]==1){
		
					return (y);
				};

			};
		};
	};

};


function moveTetris(event){
	if (event.keyCode===37){
		pos.x--;
		if ((checkSideCollision())||(!checkWithinScreen("left"))){
			pos.x++;

		};
    }
	else if (event.keyCode===39){
		pos.x++;
		if ((checkSideCollision())||(!checkWithinScreen("right")))
			pos.x--;
	}
	else if (event.keyCode===40){
		dropBlock();
	}

	else if (event.keyCode===82){

		
		matrix=rotate();
		
		
		while (!checkWithinScreen("left")){
			pos.x++;
		};
		while (!checkWithinScreen("right")){
			pos.x--;
		};
		
		if ((checkSideCollision())||(checkDownCollision())){
			for (var i=0;i<matrix.length;i++)
				matrix=rotate(matrix);

		};

	};

	fillScreenMatrix();
};


function resetGame(){
	screenMatrix= createScreenMatrix();
	screenColourMatrix= createScreenMatrix();
	count=0;
	matrix= resetPiece();
	score=0;
	fillScreenMatrix();
};


var w=canvas.width/20;
var h=canvas.height/20;
var pos={x:w/2,y:0};
var colourList=["red","green","blue","yellow","brown","magenta","pink","red"];
var colour =0;
var count;
var fixed=8;
var screenMatrix;
var screenColourMatrix;
var matrix=[];
var gamePlay="Pause";
var animation;
var score=0;
document.getElementById("score").innerHTML="The Score is "+ score;	
resetGame();

// pause the animation on #pause click
$('#pause').on('click',function(){
  	gamePlay="Pause";
  	console.log("Pause");
});

// continue the animation on #continue click
$('#continue').on('click',function(){
  	gamePlay="Play";
  	updateGame();
  	console.log("Play");
});

// start/restart the animation on #start click
$('#start').on('click',function(){
	resetGame();
  	gamePlay="Play";
  	updateGame();
	console.log("Play");
});






document.addEventListener("keydown", this.moveTetris,false);

updateGame();




