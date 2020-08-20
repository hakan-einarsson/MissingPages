var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var playing = false;
var targetPosition = {'x':1,'y':1};
var direction={'x':1,'y':0};
var moving=false;
var cells = [];
let newTarget=null;
let circle = drawGradientCircle(50,50,1,50);
//circle.draw();
let playerPath=[];
let obstaclesCoords=[];
let obstacles=[];

for (x=0;x<canvas.width/30;x++){
    for(y=0;y<canvas.height/30;y++){
        if (x==0 || y ==0 || x==canvas.width/30-1 || y==canvas.height/30-1) obstaclesCoords.push(x.toString()+","+y.toString());
    }
}

for (y=0; y < canvas.height; y+=30){
    for (x=0; x < canvas.width; x+=30){
        cells.push(createCell([x,y]));
        
    }
}

cells.forEach(element => {
    if (obstaclesCoords.includes(element.name)){
        drawCell(element.x,element.y,"89,125,128");
        obstacles.push(element);
    } else {
        drawCell(element.x,element.y,"179,250,255"); 
        }
    });



function createCell(position){

    return {'width':30,
            'height':30,
            'x':position[0],
            'y':position[1],
            'name':position[0]/30+","+position[1]/30,
            'position': {'x':position[0]+30/2,'y':position[1]+30/2}
        };
}

canvas.addEventListener('mousedown', function(e) {
    targetPosition=getCursorPosition(canvas, e);
    movement();
});

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    /*for (i=0;i<cells.length;i++){
        console.log(cells[i].x <= x,x < cells[i].x+cells[i].width,cells[i].y < y,y < cells[i].y+cells[i].height)
        console.log(cells[i].x,x,cells[i].x+cells[i].width,cells[i].y,y,cells[i].y+cells[i].height)
        if (cells[i].x <= x && x < cells[i].x+cells[i].width &&
            cells[i].y <= y && y < cells[i].y+cells[i].height){
                console.log(cells[i].name)
                return cells[i].position;
            } 
    };*/
    return {'x':x,"y":y};
    //console.log("x: " + x + " y: " + y)
}

function startAnimating(fps) {
    playing=true;
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
} 

function movement(){
    let dx = targetPosition.x-player.position.x;
    let dy = targetPosition.y-player.position.y;
    let distance=Math.sqrt(dx*dx+dy*dy)
    if (distance != 0) direction = {'x': dx/distance,'y':dy/distance};
}

// return true if the rectangle and circle are colliding
function isColliding(rect){

    var distX = Math.abs(player.position.x - rect.position.x) - Math.abs(m.x)*2;
    var distY = Math.abs(player.position.y - rect.position.y) - Math.abs(m.y)*2;

    if (distX > (rect.width/2 + player.circleR)) { return false; }
    if (distY > (rect.height/2 + player.circleR)) { return false; }

    if (distX <= (rect.with/2)) { return true; }
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(player.circleR*player.circleR));
}

function animate() {
    if (playing){
        requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            
            cells.forEach(element => {
                if (obstaclesCoords.includes(element.name)){
                    drawCell(element.x,element.y,"89,125,128")
                } else {
                    drawCell(element.x,element.y,"179,250,255");   
                    }
            });
                
            if (moving){
                player.height=22
                player.radius=15    
            } else {
                player.height=15;
                player.radius=12;
            }
            player.draw(); 
            if (circle.position.x < canvas.width - 50 ){
                circle.position.x++;
            }
            circle.draw();
                

                
            if (player.position != targetPosition){
                moving=true;
                if (Math.abs(targetPosition.x-player.position.x) < player.speed && Math.abs(targetPosition.y-player.position.y) < player.speed){
                    console.log(targetPosition);
                    player.position=targetPosition;
                    moving=false;
                } else {
                    /*if (false) console.log("."); //for if in cell position = minus radius direction to cell
                    else{*/
                    colliding=false
                    for (i=0;i<obstacles.length;i++){
                        if (isColliding({'x':direction.x*player.speed,'y':direction.y*player.speed},obstacles[i])){
                            colliding=true;
                        }
                    }
                    if (!colliding){
                        player.position.x+=direction.x*player.speed;
                        player.position.y+=direction.y*player.speed;
                    }

                }
            }
        }
    }
}

function drawGradientCircle(x,y,r1,r2){
    let gradientCircle = {
        'position':{'x':x,'y':y},
         'radius1':r1,
         'radius2':r2,
         'draw': function(){
            let grd = ctx.createRadialGradient(this.position.x,
                this.position.y,
                this.radius1,
                this.position.x,
                this.position.y,
                this.radius2);
            for (i=0.1;i < 1; i+=0.1){

                grd.addColorStop(i,"rgba(255,255,0,"+(0.5-i/2)+")");
            }
            ctx.beginPath();
            ctx.fillStyle=grd;
            ctx.arc(this.position.x,this.position.y,this.radius1+this.radius2,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
            //console.log(this.position.x,this.position.y,this.radius1)
         },
         'checkCollision':function(position,r){
            return Math.abs((this.position.x - position.x) * (this.position.x - position.x) + (this.position.y - position.y) * (this.position.y - position.y)) < (this.radius2 + r) * (this.radius2 + r);
         }
    }

    return gradientCircle;
}

let player= {
    'width':20,
    'height':22,
    'position':{'x':150,'y':100},
    'speed':2,
    'radius':15,
    'circleR':5,
    'draw':function(){
        let x = this.position.x;
        let y = this.position.y;
        let leftCorner=[x-direction.x*this.height+direction.y*this.width/2,
            y-direction.y*this.height-direction.x*this.width/2];
        let rightCorner=[x-direction.x*this.height-direction.y*this.width/2,
                y-direction.y*this.height+direction.x*this.width/2];
        let middle=[this.position.x-direction.x*this.height/2,this.position.y-direction.y*this.height/2];
        ctx.beginPath();
        ctx.fillStyle="#575756";
        ctx.strokeStyle="black";
        ctx.lineWidth="1";
        ctx.moveTo(x,y);
        ctx.lineTo(leftCorner[0],leftCorner[1]);
        ctx.arcTo(middle[0],middle[1],rightCorner[0],rightCorner[1],this.radius);
        ctx.lineTo(rightCorner[0],rightCorner[1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.beginPath();
        ctx.fillStyle="#575756";
        ctx.arc(x-direction.x*5/2, y-direction.y*5/2, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x-direction.x*5/2-1, y-direction.y*5/2+1,4, 0, Math.PI * 2, true);
        ctx.fillStyle="black";
        ctx.closePath();
        ctx.fill();
    }

}

function drawCell(x,y,color){
    clr="rgba("+color
    ctx.lineWidth="2"
    ctx.beginPath();
    ctx.moveTo(x+29,y+29);
    ctx.lineTo(x+29,y+1);
    ctx.lineTo(x+1,y+1);
    ctx.strokeStyle=clr+",1)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(x+1,y+1);
    ctx.lineTo(x+1,y+29);
    ctx.lineTo(x+29,y+29);
    ctx.strokeStyle=clr+",0.2)";
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(x+2,y+2,26,26);
    ctx.fillStyle=clr+",0.6)";
    ctx.fill();
    ctx.closePath();
}

function togglePlaying() {
    if (playing){
        playing=true;
    } else startAnimating(120);

}

player.draw();
