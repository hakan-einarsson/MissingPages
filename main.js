let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let playing = false;
let targetPosition = {'x':1,'y':1};
let direction={'x':1,'y':0};
//let moving=false;
let currentScene=0
let cells = [];
let newTarget=null;
let circle = drawGradientCircle(50,50,1,50);
let playerPath=[];
let obstaclesCoords=[];
let obstacles=[];
let enemies=[];
let playerProjectiles=[];
let projectiles=[];
let keys = {'ArrowUp':0,'ArrowDown':0,'ArrowLeft':0,'ArrowRight':0};
let sec = 0;
let explosions=[];
let playerHealth=5;
let doors = {'left':["0,7","0,6"], //"0,7","0,6","19,7","19,6","10,0","9,0","10,13","9,13",
            'right':["19,7","19,6"],
            'up': ["10,0","9,0"],
            'down':["10,13","9,13"]};
let emptyTemplate=["0,0", "0,1", "0,2", "0,3", "0,4", "0,5", "0,6", "0,7", "0,8", "0,9", "0,10", "0,11", "0,12", "0,13", "1,0", "1,13", "2,0", "2,13", "3,0", "3,13", "4,0", "4,13", "5,0", "5,13", "6,0", "6,13", "7,0", "7,13", "8,0", "8,13", "9,0", "9,13", "10,0", "10,13", "11,0", "11,13", "12,0", "12,13", "13,0", "13,13", "14,0", "14,13", "15,0", "15,13", "16,0", "16,13", "17,0", "17,13", "18,0", "18,13", "19,0", "19,1", "19,2", "19,3", "19,4", "19,5", "19,6", "19,7", "19,8", "19,9", "19,10", "19,11", "19,12", "19,13"]
let templates=[
    ["5,1", "14,1", "5,2", "14,2", "5,3", "14,3", "5,4", "14,4", "1,5", "2,5", "3,5", "4,5", "5,5", "14,5", "15,5", "16,5", "17,5", "18,5", "20,5", "1,8", "2,8", "3,8", "4,8", "5,8", "14,8", "15,8", "16,8", "17,8", "18,8", "20,8", "5,9", "14,9", "5,10", "14,10", "5,11", "14,11", "5,12", "14,12", "5,14", "14,14", "5,13", "14,13", "19,5", "19,8", "19,14", "19,15"], // 4 yttre kvardater
    ["3,3", "4,3", "3,4", "4,4", "15,4", "15,3", "16,4", "16,3", "3,9", "3,10", "4,9", "4,10", "16,9", "16,10", "15,9", "15,10"], // 4 inner kvadrater
    [], //Tom
    ["9,1", "10,1", "9,2", "10,2", "9,5", "10,5", "9,6", "10,6", "9,7", "10,7", "9,8", "10,8", "9,11", "10,11", "9,12", "10,12", "9,14", "10,14"], //Mitten
    ["7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7", "7,8", "7,9", "7,10", "7,11", "7,12", "7,14", "7,13"] //Delad vänster
];
enemies.push(createTank(150,300,[[150,300],[450,300],[450,120],[150,120]]));
enemies.push(createTank(150,210,[[150,300],[450,300],[450,120],[150,120]]));
enemies.push(createTank(300,300,[[150,300],[450,300],[450,120],[150,120]]));
enemies.push(createTank(450,300,[[450,300],[450,120],[150,120],[150,300]]));
enemies.push(createTank(450,210,[[450,300],[450,120],[150,120],[150,300]]));
enemies.push(createTank(450,120,[[450,120],[150,120],[150,300],[450,300]]));
enemies.push(createTank(150,120,[[150,120],[150,300],[450,300],[450,120]]));
enemies.push(createTank(300,120,[[150,120],[150,300],[450,300],[450,120]]));

for (i=0;i<5;i++){
    enemies.push(smallRobot((i+1)*100,100))
    }

let stage1 = [
    createScene(2,[doors.left,doors.right],[1,null,4,null],"179,250,255","89,125,128",enemies), //entrence 0
    createScene(1,[doors.up,doors.right],[null,2,0,null],"179,250,255","89,125,128"), //first left 1
    createScene(0,[doors.up,doors.down],[null,3,null,1],"179,250,255","89,125,128"), //up from first left 2
    createScene(2,[doors.right,doors.down],[null,null,7,2],"179,250,255","89,125,128"), // continue up 3 
    createScene(1,[doors.left,doors.up],[0,5,null,null],"179,250,255","89,125,128"), // first right from entrance 4
    createScene(2,[doors.up,doors.down],[null,6,null,4],"179,250,255","89,125,128"), // up from first right 5
    createScene(0,[doors.left,doors.down],[7,null,null,5],"179,250,255","89,125,128"), // continue up 6
    createScene(4,[doors.left,doors.up,doors.right],[3,8,6,null],"179,250,255","89,125,128"), // upp middle 7
    createScene(2,[doors.down],[null,null,null,7],"179,250,255","89,125,128") // boss 8
]
let ui = createUi(20,20,playerHealth,playerHealth,80,25);
for (y=0; y < canvas.height; y+=30){
    for (x=0; x < canvas.width; x+=30){
        cells.push(createCell([x,y]));
    }
}


/*let scene = createScene(templates[1],[doors.left],[0,1],"179,250,255","89,125,128",enemies);
scene.draw();*/
stage1[currentScene].draw()
stage1[currentScene].enemies.forEach(e => e.draw())
//----------------ritar upp banan
//let cO=[]
/*ys=[0,3,4,9,10]
for (y=1;y < 15;y++){
    for (x=1;x < 21;x++){
        //if (x == canvas.width/30/2 && !ys.includes(y)|| x == canvas.width/30/2-1 &&  !ys.includes(y)) obstaclesCoords.push(x.toString()+","+y.toString());
        console.log(canvas.width/30)
        if ( x == 5 && y < 6 || x == 5 && y > 7 ||  y == 5 && x < 5 || y == 8 && x < 5 || x == 14 && y < 6 || x == 14 && y > 7 ||  y == 5 && x > 13 || y == 8 && x > 13 )
        {
            obstaclesCoords.push(x.toString()+","+y.toString());
            console.log("händer");
        }
    }
}*/

//document.getElementById("str").innerHTML=JSON.stringify(obstaclesCoords,null)

/*for (x=0;x<canvas.width/30;x++){
    for(y=0;y<canvas.height/30;y++){
        if (x==0 || y ==0 || x==canvas.width/30-1 || y==canvas.height/30-1) obstaclesCoords.push(x.toString()+","+y.toString());
    }
}*/

/*console.log(obstaclesCoords);
templates.forEach(function (e,index){
    emptyTemplate.forEach(p => {
        if (e.includes(p)) templates[index].splice(e.indexOf(p),1);
    })
});
templates.forEach(e =>{
    console.log(e);
})
//door left "0,7","0,6" door right "19,7","19,6" door up "10,0","9,0" dorr down "10,13", "9,13"
/*cells.forEach(element => {
    if (obstaclesCoords.includes(element.name)){
        drawCell(element.x,element.y,scene.cD);
        obstacles.push(element);
    } else {
        drawCell(element.x,element.y,scene.cB); 
        }
    });*/
let trueFps=0;
startAnimating(30);
function createCell(position){
        return {'width':30,
                'height':30,
                'x':position[0],
                'y':position[1],
                'name':position[0]/30+","+position[1]/30,
                'p': {'x':position[0]+30/2,'y':position[1]+30/2},
                'd': {'x':0,'y':0},
                'speed':0

            };
}
//------------------------
function createScene(template,doors,exits=[0,0,0,0],colorB,colorD,enemies=[]){
    let tmpl=JSON.parse(JSON.stringify(emptyTemplate))
    templates[template].forEach(e => tmpl.push(e))
    //console.log(doors)
    //console.log(template.indexOf(doors[0]))
    doors.forEach(i =>{
        i.forEach(e =>{
            tmpl.splice(tmpl.indexOf(e),1);

        });
    });
    return {
        'tpl':tmpl,
        'cB':colorB,
        'cD':colorD,
        'enemies':enemies,
        'leftScene':exits[0],
        'upScene':exits[1],
        'rightScene':exits[2],
        'downScene':exits[3],
        'draw':function(){
            cells.forEach(element => {
            if (this.tpl.includes(element.name)){
                drawCell(element.x,element.y,this.cD);
                obstacles.push(element);
            } else {
                drawCell(element.x,element.y,this.cB); 
                }
            });
        }
    }
}
explosionTest(450,200,20)
canvas.addEventListener('mousedown', function(e) {
    let x = getCursorPosition(canvas, e)
    player.shoot(getDirectionTo(player.p,[x.x,x.y]));
});

window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      e.gamepad.index, e.gamepad.id,
      e.gamepad.buttons.length, e.gamepad.axes.length);
  });
  
window.addEventListener('keydown',function(e){
    console.log(e)
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') keys[e.key]=1;
    if (e.key == 'Control') player.shoot(player.d); 
});
window.addEventListener('keyup', function(e) {
    if (e.key == 'ArrowUp' || e.key == 'ArrowDown' || e.key == 'ArrowLeft' || e.key == 'ArrowRight') keys[e.key]=0;
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
function isColliding(circle,rect){
    try {
        var distX = Math.abs(circle.p.x - rect.p.x)-Math.abs(circle.d.x*circle.speed)-Math.abs(rect.d.x*rect.speed); 
        var distY = Math.abs(circle.p.y - rect.p.y)-Math.abs(circle.d.y*circle.speed)-Math.abs(rect.d.y*rect.speed);
        //if (!distX) console.log("not distX")
        if (distX > (rect.width/2 + circle.r)) { return false; } 
        if (distY > (rect.height/2 + circle.r)) { return false; }
        if (distX <= (rect.width/2) + (circle.r)) {
            if (rect.x+rect.width < circle.p.x && circle.d.x*circle.speed > 0) return false;
            if (rect.x > circle.p.x && circle.d.x*circle.speed < 0) return false;
            if (rect.y+rect.height < circle.p.y && circle.d.y*circle.speed > 0) return false;
            if (rect.y > circle.p.y && circle.d.y*circle.speed < 0) return false;
            return true; 
        }
return false;
    } catch (e){
        console.log(circle)
        console.log(rect)
        console.log(e)
    }
}
function isCollidingC(c1,c2){
    return Math.abs((c1.p.x - c2.p.x) * (c1.p.x - c2.p.x) + (c1.p.y - c2.p.y) * (c1.p.y - c2.p.y)) < (c1.r + c2.r) * (c1.r + c2.r);
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
        'width':28,
        'height':22,
        'p':{'x':x,'y':y},
        'd':{'x':1,'y':0},
        'm':false,
        'speed':3,
        'radius':15,
        'h':5,
        'r':7,
        'name':'player',
        'counter':{'cd':0,
                    'anim':0},
        'entered':'center',
        'dead':false,
        'draw':function(){
            if (!this.dead){
                this.counter.anim++;
                if (this.counter.cd > 0) this.counter.cd++;
                if (this.counter.cd > 10) this.counter.cd=0;
                let x = this.p.x;
                let y = this.p.y;
                let leftCorner=[x-this.d.x*this.height+this.d.x*this.r+this.d.y*this.width/2,
                    y-this.d.y*this.height+this.d.y*this.r-this.d.x*this.width/2];
                let rightCorner=[x-this.d.x*this.height+this.d.x*this.r-this.d.y*this.width/2,
                        y-this.d.y*this.height+this.d.y*this.r+this.d.x*this.width/2];
                let middle=[this.p.x-this.d.x*this.height/2,this.p.y-this.d.y*this.height/2];
                if (this.counter.anim % 12 < 3 && this.m){
                    leftCorner[0]+=this.d.y*this.r/2;
                    leftCorner[1]+=this.d.x*this.r/2;
                }
                if (this.counter.anim % 12 < 9 && this.counter.anim % 12 > 5 && this.m){
                    //console.log("right")
                    rightCorner[0]-=this.d.y*this.r/2;
                    rightCorner[1]-=this.d.x*this.r/2;
                }
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
                if (this.counter.anim % 12 > 8 && this.m){ 
                    drawCircle(this.p.x+this.d.y*1,this.p.y+this.d.x*1,this.r,true,"#575756",true);
                    drawCircle(this.p.x-1+this.d.y*1,this.p.y+1+this.d.x*1,this.r-1);
                } else if (this.counter.anim % 12 < 4 && this.m) {
                    drawCircle(this.p.x-this.d.y*1,this.p.y-this.d.x*1,this.r,true,"#575756",true);
                    drawCircle(this.p.x-1-this.d.y*1,this.p.y+1-this.d.x*1,this.r-1);
                }
                else { 
                    drawCircle(this.p.x,this.p.y,this.r,true,"#575756",true);
                    drawCircle(this.p.x-1,this.p.y+1,this.r-1);
                }
            } else {
                togglePlaying();
            }
        },
        'shoot':function(aim){
            if (this.counter.cd == 0){
                this.counter.cd = 1;
                playerProjectiles.push(createProjectile(this.p.x,this.p.y,aim,"#c77600",15));
            }
        },'move':function(){
            this.p.x+=this.d.x*this.speed;
            this.p.y+=this.d.y*this.speed;
        },'takeDamage':function(dmg){
            //console.log("taking: ",dmg," in dmg");
            this.h-=dmg;
            //console.log("health: ",this.h)
        },'death':function(){
            //console.log("death");
            this.dead=true;
        }
    }
}
player = createPlayer(canvas.width/1.5,canvas.height/1.5);
player.draw();
ui.draw();



function drawCircle(x,y,r,fill=true,cFill="black",stroke=false,cStroke="black",w=1,obj="null"){
    ctx.beginPath();
    ctx.lineWidth=w
    ctx.arc(x, y,r, 0, Math.PI * 2, true);
    if (fill) ctx.fillStyle=cFill;
    if (stroke) ctx.strokeStyle=cStroke
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
    ctx.closePath();
}

function drawRect(x,y,w,h,fill=true,cFill="black",stroke=false,cStroke="black",lw=1){
    ctx.beginPath();
    ctx.lineWidth=lw
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
        if (player.dead) playing=false;
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
            'h':3,
            'path':path,
            'pathPart':1,
            'name':'tank',
            'cd':0,
            'move':function(){
                if (this.pathPart+1 > this.path.length){
                    this.pathPart=0;
                }
                this.cd++;
                if (this.cd > 50) {
                    this.fireProjectile();
                    this.cd=0;
                }
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
                this.setDirection();

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
                this.aimD=getDirectionTo({'x':this.p.x,'y':this.p.y},[player.p.x,player.p.y]);
            },
            'fireProjectile':function(){
                projectiles.push(createProjectile(this.p.x+this.aimD.x*30,this.p.y+this.aimD.y*30,this.aimD,"red",10));
            },
            'takeDamage':function(dmg){
                this.h-=dmg;
            }
        }
}

function smallRobot(x,y){
    return {
        'p': {'x':x,'y':y},
        'width':25,
        'height':18,
        'speed':1,
        'r':10,
        'd':{'x':1,'y':0},
        'aim':{'x':1,'y':0},
        'name':"smallRobot",
        'h':3,
        'counter':0,
        'colliding':false,
        'draw':function(){
            if(this.d.x !=0) drawRect(this.p.x-this.height/2,this.p.y-this.width/2,this.height,this.width,true,"#505050",true,"#151515",2);
            else drawRect(this.p.x-this.width/2,this.p.y-this.height/2,this.width,this.height,true,"#505050",true,"#151515",2);
            drawCircle(this.p.x,this.p.y,7,true,"black");
            drawCircle(this.p.x,this.p.y,5,true,"rgb(200,0,0)");
            drawCircle(this.p.x+2,this.p.y-3,3,true,"rgb(255,150,150)");
            drawCircle(this.p.x,this.p.y,10,true,"rgba(25,25,25,0.5)",true,"white");

        },
        'move':function(){
            this.counter++;
            if(this.counter > 25) {
                this.setDirection();
                this.counter=0;
            }
            if(this.counter == 10){ 
                if(Math.random() > 0.5){ 
                    this.shoot();
                }
            }
            
            if (!this.colliding) {
                this.p.x+=this.d.x*this.speed;
                this.p.y+=this.d.y*this.speed;
            } else this.setDirection();
            
            this.colliding=false
        },
        'setDirection':function() {
            let ds=[{'x':0,'y':1},{'x':0,'y':-1},{'x':1,'y':0},{'x':-1,'y':0}];
            this.d=ds[Math.floor(Math.random()*10)%4];
            this.aim=ds[Math.floor(Math.random()*10)%4];
            this.speed=Math.floor(Math.random()*10)%3+1;

        },
        'shoot':function(){
            projectiles.push(createProjectile(this.p.x+this.aim.x*30,this.p.y+this.aim.y*30,this.aim,"red",10));
        },
        'takeDamage':function(dmg){
            this.h-=dmg;
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

function createProjectile(x,y,d,c,s){
    return {
        'p':{'x':x,'y':y},
        'r':6,
        'd':d,
        'speed':s,
        'c':c,
        'l':0,
        'name':'projectile',
        'draw':function(){
            this.l++;
            drawCircle(this.p.x,this.p.y,this.r,true,c);
            drawCircle(this.p.x+this.r/3,this.p.y-this.r/3,this.r/4,true,"white");
        },
        'move':function(){
            this.p.x+=this.speed*this.d.x;
            this.p.y+=this.speed*this.d.y;
        }
    }
}

function explosionTest(x,y,r){
    let exp = [];
    for (i=0;i<5;i++){
        exp.push(createExplosion(x,y,r,"255,0,0"));
    }

    return exp;
}

function createExplosion(x,y,r,c){
    return {
        'x':x,
        'y':y,
        'r':r,
        'c':"rgb("+c+")",
        'counter':1,
        'desc':false,
        'draw':function(){
            drawCircle(x+Math.random()*100*1/r*2,
                        y+Math.random()*100*1/r*2,
                        (this.counter/this.r)*(r/3),true,
                        this.c,true,"yellow",1,"exp");
            //}
            if (this.counter >= this.r*2) this.desc = true;
            if(!this.desc) this.counter+=5;
            else this.counter-=5;
            
        }
    }
}

function createUi(x,y,fh,ch,w,h){
    return{
        'x':x,
        'y':y,
        'fh':fh,
        'ch': ch,
        'w': w,
        'h':h,
        'c':"green",
        'draw':function(){
            this.ch=player.h;
            if (this.ch <= this.fh*2/3) this.c="orange";
            if (this.ch <= this.fh*1/3) this.c="red";

            drawRect(this.x,this.y,this.w,this.h,true,"rgba(0,0,0,0.5)",true,"black",2);
            drawRect(this.x,this.y,this.ch/this.fh*this.w,this.h,true,this.c);
            drawRect(this.x,this.y,this.w,this.h,false,"",true,"black",2);
        }
    }
}

function newScene(){ //måste veta vilken scen som kommer. Det borde finnas en left/right/up/down
    
    if (player.entered=="left"){
        currentScene=stage1[currentScene].leftScene
        player.p.x=canvas.width-10;
    } else if (player.entered=="right"){
        currentScene=stage1[currentScene].rightScene
        player.p.x=10;
    } else if (player.entered=="up"){
        currentScene=stage1[currentScene].upScene
        player.p.y=canvas.height-10;
    } else if (player.entered == "down"){
        currentScene=stage1[currentScene].downScene
        player.p.y=10;
    } else {
        player.p.x=canvas.width/2;
        player.p.y=canvas.height/2;
    }
    
    
}

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
            
            stage1[currentScene].draw();

            stage1[currentScene].enemies.forEach(function (e,index) {
                obstacles.forEach(o =>{
                    if (e.name=="smallRobot" && isColliding(e,o)){ 
                        e.colliding=true;
                    }
                });
                e.move();
                e.draw();
                if (playerProjectiles.length > 0){
                    for (i=0;i<playerProjectiles.length;i++)
                    if (isColliding(playerProjectiles[i],e)){ 
                        e.takeDamage(1);
                        if (e.h <=0) {
                            enemies.splice(index,1);
                            explosions.push(explosionTest(e.p.x,e.p.y,20))
                        }
                        playerProjectiles.splice(i,1);
                    }
                }
                
            });
            projectiles.forEach(function (e,index) {
                for(i=0;i < obstacles.length;i++){
                    if (isColliding(e,obstacles[i])){
                        projectiles.splice(index,1);
                    }
                }
                    if (isCollidingC(e,player)){
                        projectiles.splice(index,1);
                        player.takeDamage(1);
                        if (player.h <= 0) player.death();
                        explosionTest(player.p.x,player.p.y,20);
                    }
                

                e.move();
                e.draw();
            });
            playerProjectiles.forEach(function (e,index) {
                for(i=0;i < obstacles.length;i++){
                    if (isColliding(e,obstacles[i])){
                        playerProjectiles.splice(index,1);
                    }
                }
                e.move();
                e.draw();
            });
            if (keys.ArrowRight-keys.ArrowLeft != 0 || keys.ArrowDown-keys.ArrowUp !=0){ //check if moving
                player.m=true;
                player.d=getDirection({'x':keys.ArrowRight-keys.ArrowLeft,'y':keys.ArrowDown-keys.ArrowUp});
                player.height=31;
                player.radius=15 ;    
            } else {
                player.m=false;
                player.height=21;
                player.radius=12;
            }
            
            player.draw(); 

            if (explosions.length > 0){
                explosions.forEach(function(i,index){
                    if (i.length < 1) explosions.splice(index,1);
                    i.forEach(function(e,ind){
                        
                        if(e.counter==1 && e.desc){
                            //console.log("splicing")
                            explosions[index].splice(ind,1);
                            //console.log("explosion ends")
                        } 
                        else {
                            e.draw();
                        }
                    });
                })
            }    
            colliding=false;
            for (i=0;i<obstacles.length;i++){
                if (isColliding(player,obstacles[i])){
                    colliding=["wall"];
                    }
                }
            for (i=0;i<stage1[currentScene].enemies.length;i++){
                if (isColliding(player,enemies[i])){
                    colliding=["Enemy",enemies[i]];
                    }
                }
            
            if (!colliding && player.m){
                player.move();
                checkPlayerPosition();
            if (colliding[0]=="Enemy"){
                if(player.m){
                    player.takeDamage(1);
                    player.p.x+=-direction.x*player.speed*2;
                    player.p.y+=-direction.y*player.speed*2;
                } else {
                    player.takeDamage(1);
                    player.p.x+=colliding[1].d.x*player.speed*2;
                    player.p.y+=colliding[1].d.y*player.speed*2;
                    }
                }
            }
        ui.draw();
        }
    }
}

function checkPlayerPosition(){
    if (player.p.x < 0){ player.entered="left"; newScene(); obstacles=[]}
    if (player.p.x > canvas.width) { player.entered="right"; newScene(); obstacles=[]}
    if (player.p.y < 0) { player.entered="up"; newScene(); obstacles=[]}
    if (player.p.y > canvas.height) { player.entered="down"; newScene(); obstacles=[]}
    
}