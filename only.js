var requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();// RequestAnimFrame for a smoother Animation and Better RAM performance

var c = document.createElement("canvas");
var ctx = c.getContext("2d");
c.width = 1000;
c.height = 500;
document.body.appendChild(c);//Canvas attached to HTML page 
c.style.border = "1px solid black";

var res = [];//Holds all resources
var arrowind,bowind,targetind;//Indices for every resource as you have no cue which will load faster
//Should've put all these in a set, My Bad.
var bowx,bowy,boww,bowh,bowv;//Attributes fro Bow image
var arrx,arry,arrw,arrh,arrv;//Attricutes for Arrow Image
var tarx,tary,tarw,tarh,tarv;//Attributes for Target Image
var j = 0;
var score = 0;
//CallBack function for preLoad()
function loadImg(){	
	j++;
	if(j==3){

		main();
	}

}
//Function to preload Images
function preLoad(){					
	var img1 = new Image();
	img1.src = "resources/bow.jpg";
	img1.onload = function(){
		res.push({
			name:"bow", img:img1,src:img1.src
		});
		loadImg();
	}
	img1.onerror = function(){
		console.log("Bow cannot Load");
	}
	var img2 = new Image();
	img2.src = "resources/arrow.png";
	img2.onload = function(){
		res.push({
			name:"arrow", img:img2,src:img2.src
		});
		loadImg();
	}
	img2.onerror = function(){
		console.log("Arrow cannot Load");
	}
	var img3 = new Image();
	img3.src = "resources/target.png";
	img3.onload = function(){
		res.push({
			name:"target", img:img3, src:img3.src
		});
		loadImg();
	}
}

function scan(){
	for(var i=0;i<3;i++){
		if(res[i].name=="bow"){
			bowind = i;
		}
		else if(res[i].name=="arrow"){
			arrowind = i;
		}
		else{
			targetind = i;
		}
	}
}
//Call back function for LoadImg() and the main Game starter
function main(){
	scan();
	initialize();
	setInterval(game,16);
}

//Main Game Function which repeats over time
function game(){	
	render();
	update();
}
//Function to render at every cycle
function render(){
	ctx.clearRect(0,0,c.width,c.height);
	ctx.scale(-1,1);
	ctx.drawImage(res[bowind].img,bowx,bowy,boww,bowh);
	ctx.scale(-1,1);
	ctx.drawImage(res[targetind].img,tarx,tary,tarw,tarh);
	ctx.drawImage(res[arrowind].img,arrx,arry,arrw,arrh);
	ctx.beginPath();
	ctx.moveTo(bowx+90,bowy+30);
	if(arrx+10<90){
		ctx.lineTo(bowx+arrx+10,bowy+103);
	}
	else{
		ctx.lineTo(bowx+90,bowy+103);
	}	
	ctx.lineTo(bowx+90,bowy+177);
	ctx.stroke();
	ctx.font = "20px Georgia";
	ctx.fillText("Score: "+score.toString(),900,490);
	if(status==0){
		ctx.fillText("Press 'SPACE' to Shoot",0,490);
	}
	else if(status==3){
		ctx.fillText("Press 'SPACE' to Reload",0,490);
	}
}
//Function to initialize the position and sizes for each element
function initialize(){
	bowx = 0;
	bowy = 0;
	boww = -200;
	bowh = 200;
	bowv = 4;
	arrx = 0;
	arry = 80;
	arrw = 180;
	arrh = 50;
	arrv = 15;
	tarx = c.width-50;
	tary = 0;
	tarw = 50;
	tarh = 150;
	tarv = 2;
}
var lastFire = 0;
function update(){
	updateTarget();
	updateBow();
	updateArrow();
	updateScore();
}

function updateTarget(){
	if((tary+tarh)==c.height){
		tarv = -2;
	}
	else if(tary<0){
		tarv = 2;
	}
		tary+=tarv;
}
var status = 0;
function updateBow(){
	if((input.isDown('UP')||input.isDown('w'))&&bowy>=0){
		bowy-=bowv;
	}
	if((input.isDown('DOWN')||input.isDown('s'))&&(bowy+bowh)<=c.height){
		bowy+=bowv;
	}
	if(input.isDown('SPACE')&&status==0&&(Date.now()-lastFire>500)){
		status = 1;
		lastFire = Date.now();
	}
	if(input.isDown('SPACE')&&status==3&&(Date.now()-lastFire>500)){
		status = 0;
		arrx = 0;
		arry = bowy+80;
		lastFire = Date.now();
	}
}

function updateArrow(){
	if(status==0){
		arry = bowy+80;
	}
	else if(status==1){
		if(arrx+arrw<(c.width-tarw/2)){
			arrx = arrx+arrv;
			
		}
		else{
			if((arry)<(tary+tarh-20)&&(arry)>tary-20)
				status = 2;
			else{
				status = 4;
			}
		}
	}
	else if(status==2||status==3){
		arry = arry+tarv;
	}
	else if(status==4){
		if(arrx<c.width){
			arrx = arrx+arrv;
		}
		else{
			status = 0;
			arrx = 0;
			arry = bowy+80;
		}	
	}
}

function updateScore(){
	if(status==2){
		if((arry-tary)>=68-22&&(arry-tary)<=83-22){
			score+=100;
		}	
		else if((arry-tary)>=56-22&&(arry-tary)<=98-22){
			score+=50;
		}
		else if((arry-tary)>=37-22&&(arry-tary)<=113-22){
			score+=20;
		}
		else if((arry-tary)>=23-22&&(arry-tary)<=127-22){
			score+=10;
		}
		else if((arry-tary)>=8-22&&(arry-tary)<=143-22){
			score+=5;
		}
		status = 3;
	}
}
preLoad();

