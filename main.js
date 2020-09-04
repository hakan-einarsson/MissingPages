var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var playing = false;
var targetPosition = {'x':1,'y':1};
var direction={'x':1,'y':0};
var moving=false;
var cells = [];
let newTarget=null;
let circle = drawGradientCircle(50,50,1,50);
let playerPath=[];
let obstaclesCoords=[];
let obstacles=[];
let enemies=[];
let projectiles=[];
let keys = {'w':0,'s':0,'a':0,'d':0};
let sec = 0;



let cO=[]
ys=[0,3,4,9,10]
for (y=1;y < 15;y++){
    for (x=1;x < 21;x++){
        if (x == canvas.width/30/2 && !ys.includes(y)|| x == canvas.width/30/2-1 &&  !ys.includes(y)) obstaclesCoords.push(x.toString()+","+y.toString());
    }
}

for (x=0;x<canvas.width/30;x++){
    for(y=0;y<canvas.height/30;y++){
        if (x==0 || y ==0 || x==canvas.width/30-1 || y==canvas.height/30-1) obstaclesCoords.push(x.toString()+","+y.toString());
    }
}

obstaclesCoords.splice(obstaclesCoords.indexOf("0,7"),1);

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

enemies.forEach(e => {
        e.draw();
    });


function createCell(position){
    return {'width':30,
            'height':30,
            'x':position[0],
            'y':position[1],
            'name':position[0]/30+","+position[1]/30,
            'p': {'x':position[0]+30/2,'y':position[1]+30/2}
        };
}

/*canvas.addEventListener('mousemove', function(e) {
    targetPosition=getCursorPosition(canvas, e);
    console.log(targetPosition);
    movement();
});*/

window.addEventListener('keydown',function(e){
    if (e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd') keys[e.key]=1;
});

window.addEventListener('keyup', function(e) {
    if (e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd') keys[e.key]=0;
})

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return {'x':x,"y":y};
}

function startAnimating(fps) {
    playing=true;
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
} 

function getDirection(p){ //denna ska bort och getDirectionTo ska göras om så funkar även för detta.
    let distance=Math.sqrt(p.x*p.x+p.y*p.y);
    if (distance != 0) return {'x': p.x/distance,'y':p.y/distance};
}

function getDirectionTo(p,toP){
    let dx = toP[0]-p.x;
    let dy = toP[1]-p.y;
    let distance=Math.sqrt(dx*dx+dy*dy);
    if (distance != 0) return {'x': dx/distance,'y':dy/distance,'d':distance};
}


function isColliding(v,rect){
    var distX = Math.abs(player.position.x - rect.p.x)-Math.abs(v.x); //mäter upp avstånd inkl v för nästa steg
    var distY = Math.abs(player.position.y - rect.p.y)-Math.abs(v.y);
    if (distX > (rect.width/2 + player.r)) { return false; } //kollar om avstånd är längre än mitt på rect till mitt på cirkel
    if (distY > (rect.height/2 + player.r)) { return false; }
    if (distX <= (rect.width/2) + (player.r)) {
        console.log("first true")
        if (rect.x+rect.width < player.position.x && v.x > 0) return false;
        if (rect.x > player.position.x && v.x < 0) return false;
        if (rect.y+rect.height < player.position.y && v.y > 0) return false;
        if (rect.y > player.position.y && v.y < 0) return false;
        return true; 
    }
    return false;
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

function createPlayer(x,y){
    return {
        'width':20,
        'height':22,
        'position':{'x':x,'y':y},
        'speed':3,
        'radius':15,
        'r':5,
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
            drawCircle(x,y,this.r,true,"#575756",true);
            drawCircle(x-1,y+1,this.r-1);
        }
    }
}
player = createPlayer(70,70);
player.draw();

enemies.push(createTank(150,300,[[150,300],[450,300],[450,120],[150,120]]));
enemies.push(createTank(450,300,[[450,300],[450,120],[150,120],[150,300]]));
enemies.push(createTank(450,120,[[450,120],[150,120],[150,300],[450,300]]));
enemies.push(createTank(150,120,[[150,120],[150,300],[450,300],[450,120]]));

/*let test=createProjectile(300,210,{'x':0.7,'y':0.7});
test.draw();*/

function drawCircle(x,y,r,fill=true,cFill="black",stroke=false,cStroke="black"){
    ctx.beginPath();
    ctx.arc(x, y,r, 0, Math.PI * 2, true);
    if (fill) ctx.fillStyle=cFill;
    if (stroke) ctx.strokeStyle=cStroke
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
    ctx.closePath();
}

function drawRect(x,y,w,h,fill=true,cFill="black",stroke=false,cStroke="black"){
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    if (fill) ctx.fillStyle=cFill;
    if (stroke) ctx.strokeStyle=cStroke
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

function drawLine(x,y,tx,ty,c="black",w="1",lines=false,array=[]){
    ctx.beginPath();
    ctx.lineWidth=w;
    ctx.strokeStyle=c;
    ctx.moveTo(x,y);
    ctx.lineTo(tx,ty);
    if (lines){
        array.forEach(e => {
            ctx.lineTo(e[0],e[1]);
        })
    } 
    ctx.stroke();
    ctx.closePath();
}

function drawTriangle(x1,y1,x2,y2,x3,y3,c,fill=true,stroke=false,sC="black"){
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x3,y3);
    ctx.closePath();

    ctx.fillStyle=c;
    ctx.fill();

}

function drawCell(x,y,color){
    drawLine(x+28,y+28,x+28,y+2,"rgba("+color+",1)","2",true,[[x+2,y+2]]);
    drawLine(x+2,y+2,x+2,y+28,"rgba("+color+",0.2)","2",true,[[x+28,y+28]]);
    drawRect(x+3,y+3,24,24,true,"rgba("+color+",0.6)");
}

function togglePlaying() {
    if (playing){
        playing=true;
    } else startAnimating(30);

}

function createTank(x,y,path){
    return {'width':40,
            'height':40,
            'p': {'x':x,'y':y},
            'r':20,
            'speed':2,
            'd':{'x':0.7,'y':-0.7},
            'aimD':{'x':1,'y':0},
            'c': "202,173,247",
            'path':path,
            'pathPart':1,
            'cd':0,
            'move':function(){
                if (this.pathPart+1 > this.path.length){
                    this.pathPart=0;
                }
                this.cd++;
                this.d = getDirectionTo(this.p,this.path[this.pathPart]);
                if (Math.abs(this.path[this.pathPart][0]-this.p.x) < this.speed && Math.abs(this.path[this.pathPart][1]-this.p.y) < this.speed){
                    this.p.x=this.path[this.pathPart][0];
                    this.p.y=this.path[this.pathPart][1];
                    this.pathPart++;
                }
                else {
                    this.p.x+=this.d.x*this.speed;
                    this.p.y+=this.d.y*this.speed;
                }
            },
            'draw': function(){
                drawRect(this.p.x-this.r,this.p.y-this.r,this.r*2,this.r*2,true,"#000000");
                drawTriangle(this.p.x,this.p.y,this.p.x+this.r,this.p.y-this.r,this.p.x-this.r,this.p.y-this.r,"rgba("+this.c+",0.9)",true);//upp
                drawTriangle(this.p.x,this.p.y,this.p.x+this.r,this.p.y-this.r,this.p.x+this.r,this.p.y+this.r,"rgba("+this.c+",0.7)",true);//höger
                drawTriangle(this.p.x,this.p.y,this.p.x-this.r,this.p.y-this.r,this.p.x-this.r,this.p.y+this.r,"rgba("+this.c+",0.5)",true);//vänster
                drawTriangle(this.p.x,this.p.y,this.p.x+this.r,this.p.y+this.r,this.p.x-this.r,this.p.y+this.r,"rgba("+this.c+",0.3)",true);//ner
                drawRect(this.p.x-this.r,this.p.y-this.r,this.r*2,this.r*2,false,"",true);
                drawLine(this.p.x,this.p.y,this.p.x+this.aimD.x*30,this.p.y+this.aimD.y*30,"#252525",10);
                drawCircle(this.p.x,this.p.y,this.r/1.5,true,"#000000");
                drawCircle(this.p.x,this.p.y,this.r/1.5,true,"rgba("+this.c+",0.7)");
                drawCircle(this.p.x-1,this.p.y+1,this.r/1.5-2,true,"#000000");
                drawCircle(this.p.x-1,this.p.y+1,this.r/1.5-2,true,"rgba("+this.c+",0.6)");
            },
            'setDirection':function(){
                this.aimD=getDirectionTo({'x':this.p.x,'y':this.p.y},[player.position.x,player.position.y]);
            },
            'fireProjectile':function(){
                projectiles.push(createProjectile(this.p.x+this.aimD.x*30,this.p.y+this.aimD.y*30,this.aimD));
            }
        }
}

function enemyRobot(x,y,path=[]){
    let rob = {
        'w':38,
        'h':25,
        'p':{'x':x,'y':y},
        'speed':2,
        'pathPart':1,
        'path':path,
        'd':{'x':0,'y':1},
        'move':function(){
            if (this.pathPart+1 > this.path.length){
                this.pathPart=0;
            }
            this.d = getDirectionTo(this.p,this.path[this.pathPart]);
            if (Math.abs(this.path[this.pathPart][0]-this.p.x) < this.speed && Math.abs(this.path[this.pathPart][1]-this.p.y) < this.speed){
                this.p.x=this.path[this.pathPart][0]
                this.p.y=this.path[this.pathPart][1]
                this.pathPart++
            }
            else {
                this.p.x+=this.d.x*this.speed
                this.p.y+=this.d.y*this.speed
            }
        },
        'draw':function(){
            drawRect(this.p.x-this.w/2,this.p.y-this.h/2,this.w/2+this.w/2*this.d.x,this.h/2+this.h/2*this.d.y,true,"rgb(99,57,99)",true);
            drawRect(this.p.x-this.w/2+1,this.p.y-this.h/2+3,this.w-4,this.h-3,true,"rgb(56,31,55)");
            drawRect(this.p.x-10,this.p.y-10,20,20,true,"rgb(99,57,99)",true);
            drawRect(this.p.x-9,this.p.y-7,16,16,true,"rgb(56,31,55)");
            drawLine(this.p.x-this.d.y*10,
                    this.p.y+this.d.y*10,
                    this.p.x+this.d.y*10,
                    this.p.y+this.d.y*10,
                "red");
        },
    }
    return rob;
}

function createProjectile(x,y,d){
    return {
        'p':{'x':x,'y':y},
        'r':4,
        'd':d,
        's':5,
        'draw':function(){
            drawCircle(this.p.x,this.p.y,this.r,true,"red");
            drawCircle(this.p.x+this.r/3,this.p.y-this.r/3,this.r/4,true,"white");
        },
        'move':function(){
            this.p.x+=this.s*this.d.x;
            this.p.y+=this.s*this.d.y;
        }
    }
}
let trueFps=0;
function animate() {
    if (playing){
        requestAnimationFrame(animate);
        now = Date.now();
        elapsed = now - then;
        sec+=elapsed;
        trueFps++;
        if (sec >= 1000) {
            sec = 0;
            document.getElementById("fps").innerHTML=trueFps;
            trueFps=0
        }
        if (elapsed > fpsInterval) {

            then = now - (elapsed % fpsInterval);
            ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            
            cells.forEach(element => {
                if (obstaclesCoords.includes(element.name)){
                    drawCell(element.x,element.y,"89,125,128");
                } else {
                    drawCell(element.x,element.y,"179,250,255");   
                    }
            });
            enemies.forEach(e => {
                e.move();
                e.setDirection();
                if (e.cd > 50) {
                    e.fireProjectile();
                    e.cd=0;
                }
                e.draw();
            });
            projectiles.forEach(e => {
                e.move();
                e.draw();
            })
            if (keys.d-keys.a != 0 || keys.s-keys.w !=0){ //check if moving
                moving=true;
                direction=getDirection({'x':keys.d-keys.a,'y':keys.s-keys.w});
                player.height=22;
                player.radius=15 ;    
            } else {
                moving=false;
                player.height=15;
                player.radius=12;
            }

            player.draw(); 
            /*if (circle.position.x < canvas.width - 50 ){
                circle.position.x++;
            }
            circle.draw();*/
            colliding=false;
            for (i=0;i<obstacles.length;i++){
                if (isColliding({'x':direction.x*player.speed,'y':direction.y*player.speed},obstacles[i])){
                    colliding=["wall"];
                    }
                }
            for (i=0;i<enemies.length;i++){
                if (isColliding({'x':direction.x*player.speed,'y':direction.y*player.speed},enemies[i])){
                    colliding=["Enemy",enemies[i]];
                    }
                }
            
            if (!colliding && moving){
                player.position.x+=direction.x*player.speed;
                player.position.y+=direction.y*player.speed;

                }
            if (colliding[0]=="Enemy"){
                if(moving){
                    player.position.x+=-direction.x*player.speed*2;
                    player.position.y+=-direction.y*player.speed*2;
                } else {
                    player.position.x+=colliding[1].d.x*player.speed*2;
                    player.position.y+=colliding[1].d.y*player.speed*2;
                }
            }
        }
    }
}