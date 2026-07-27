class Canvas{
    constructor(canvas, width = 200, height = 200){
        if(canvas) canvas.width = width, canvas.height = height,
        this.canvas = canvas,
        this.ctx = canvas.getContext("2d"),
        this.width = width,
        this.height = height;
    }
    drawRect(x1, y1, x2, y2){
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2, y2);
        this.ctx.stroke();
    }

    drawBorder(){
        this.drawRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLine(x1, y1, x2, y2, color = "red"){
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawVector(x, y, u, v, color = "red"){
            this.drawLine(x, y, x + u, y + v, color);
        }

    drawText(text, x=1, y=10){
            this.ctx.strokeText(text, x, y);
        }

    drawBall(x, y, radius, color = "black"){
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = color;
            this.ctx.fill();
    }
}

class Simulation{
    
    //objects 
    
    lol = class{

    }
    hey = function(){

    }

    resolveCollisions(circle1, circle2){
        if(circle2!=circle1){
            var friction = 2;
            var xdist =circle2.x-circle1.x, ydist =circle2.y-circle1.y;
            var distance = Math.sqrt((xdist)**2+(ydist)**2);
            var angle = Math.atan2(ydist, xdist);
            var toMove = ((circle2.radius+circle1.radius - distance)/2)/friction;
            var xToMove = Math.cos(angle) * toMove, yToMove = Math.sin(angle) * toMove;
            if(distance<circle1.radius+circle2.radius)circle1.xv -= xToMove, circle1.yv -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
            //circle1.xv = 0, circle1.yv = 0;
        }
    }


    constructor(canvas){
        var canvas = this.canvas = canvas;
        var objects = this.objects = new Array();
        var fields = this.fields = new Array();


        

        class Colosion{
            constructor(){
                
                //class Circle()
                function circleVSCircle(){
                    if(circle2!=circle1){
                        var friction = 2;
                        var xdist =circle2.x-circle1.x, ydist =circle2.y-circle1.y;
                        var distance = Math.sqrt((xdist)**2+(ydist)**2);
                        var angle = Math.atan2(ydist, xdist);
                        var toMove = ((circle2.radius+circle1.radius - distance)/2)/friction;
                        var xToMove = Math.cos(angle) * toMove, yToMove = Math.sin(angle) * toMove;
                        if(distance<circle1.radius+circle2.radius)circle1.xv -= xToMove, circle1.yv -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                        //circle1.xv = 0, circle1.yv = 0;
                    }
                }
            }
        }

        class Vector extends Array{
            constructor(xv = 0, yv = 0){
                super(2);
                this[0] = xv;
                this[1] = yv;
                //this.vel = [xv, yv];
            }
            add(force){
                this[0] += force[0],
                this[1] += force[1];
            }
            mul(multiplier){
                this[0] *= multiplier,
                this[1] *= multiplier;
            }
        }

        

        class Container{
            constructor(right, bottom, left = 0, top = 0){
                this.top=top, this.left=left, this.right=right, this.bottom=bottom;
            }
            // constructor(right = 0, bottom = 0){
            //     this.top=top, this.left=left, this.right=right, this.bottom=bottom;
            // }
        }

        var container = this.conatiner = new Container(canvas.width, canvas.height);

        class Object{
            constructor(x, y, xv, yv){
                //this.pos = {x:x, y:y},
                //this.vel = {u:xv, v:yv}
                //super(xv, yv);
                //this.bounds ={top:0, left:0, right:canvas.width, bottom:canvas.height};
                this.acc = new Vector(xv, yv);
                this.vel = new Vector(xv, yv);
                this.pos = new Vector(x, y),
                //this.vel = [xv, yv],
                this.mass = 1;
            }

            move(){
                this.pos.add(this.vel);
                //canvas.drawText(Math.round(object.pos[0])+" "+Math.round(circle1.pos[0] )+" " +Math.round(xdist)+", "+Math.round(xdist), 100, 40)
            }

            /*applyFriction(){
                var friction = 0.6//0.95;
                this.acc.mul(friction)
                this.vel.add(this.acc)
            }*/

            resolveForces(){
                for(var index in fields){
                    var field = fields[index];
                    //console.log(this.vel)
                    this.acc.add(field);
                    this.vel.add(this.acc);
                    //console.log(this.acc, this.vel )
                }
            }

            resolveBoundaries(conatiner){
                if(this.pos[1]>conatiner.bottom-this.radius) {
                    var friction = new Vector(0, 1);
                    this.acc = new Vector(0, 0);
                    this.vel = new Vector(0, -this.vel[1]);
                    this.add(friction)
                    //this.pos = new Vector(10, this.bounds.bottom);
                }
            }

            resolveCollisions(){
                for (var object of objects) {
                    var circle1 = this, circle2 = object;
                    if(object!=circle1){
                        var xdist =object.pos[0]-circle1.pos[0], ydist =object.pos[1]-circle1.pos[1];
                        canvas.drawText(Math.round(object.pos[1])+" "+Math.round(circle1.pos[1] )+" " +Math.round(xdist)+", "+Math.round(xdist), 100, 20)
                        //canvas.drawText(Math.round(object.pos[0])+" "+Math.round(circle1.pos[1] )+" " +Math.round(xdist)+", "+Math.round(xdist), 100, 40)

                        var distance = Math.sqrt((xdist)**2+(ydist)**2);
                        var angle = Math.atan2(ydist, xdist);
                        var toMove = (object.r+circle1.r - distance)/2;
                        var xToMove = Math.cos(angle) * toMove, yToMove = Math.sin(angle) * toMove;
                        //if(distance<circle1.r+object.r) circle1.vel.add(-xToMove, -yToMove), object.vel.add(xToMove, yToMove);
                        
                        //circle1.xv = 0, circle1.yv = 0;
                    }
                }
            }

            resolveFriction(){
                this.vel.mul(0.95);
                this.acc.mul(0.85);
            }
        }

        class Ball extends Object{
            constructor(x, y, radius, xv, yv){
                super(x, y, xv, yv);
                this.r = radius;
                this.bounds = new Container(radius, radius, radius, radius);
            }
            draw(){
                
                canvas.drawBall(this.pos[0], this.pos[1], this.r);
                canvas.drawText(Math.round(this.acc[0]) +", "+ Math.round(this.vel[0])+", "+ Math.round(this.pos[0]))
                canvas.drawText(Math.round(this.acc[1]) +", "+ Math.round(this.vel[1])+", "+ Math.round(this.pos[1]), 0, 20)
            }
            resolveBoundaries(conatiner){
                //if(this.pos[1]<conatiner.top||this.pos[1]>conatiner.bottom||this.pos[0]<conatiner.left||this.pos[0]>conatiner.right)this.acc = new Vector(0, 0);
                this.vel = this.pos[1]-this.r<conatiner.top||this.pos[1]+this.r>conatiner.bottom?new Vector(0, -this.vel[1]):this.vel;

                //this.vel = this.pos[1]<conatiner.top?new Vector(0, -this.vel[1]):this.vel;
                this.vel = this.pos[0]-this.r<conatiner.left||this.pos[0]+this.r>conatiner.right?new Vector(-this.vel[0], 0):this.vel;

            }
            


        }

        class Mouse extends Ball{
            constructor(x, y){
                super(x, y, 10, 0, 0);
                this.pos = new Vector(x, y);
                this.mousedown = false;
            }
            update(x, y, mousedown){
                this.pos = new Vector(x, y);
                if(mousedown!=null) this.mousedown = mousedown;
            }
            move(){
                
            }
            /*draw(){
                canvas.drawBall(this.pos[0], this.pos[1], this.r);
            }*/
        }

        //var mosue = 
        this.mouse = new Mouse();
        var mouse = this.mouse;

        this.fields.push(new Vector(0, 0.1)) // gravity

        //this.objects.push(new Ball(10, 10, 8, 0.1, 1));

        objects = [
            mouse,
            new Ball(10, 10, 8, 0.1, 1),
            new Ball(10, 100, 8, 0.1, 1)
            //new Ball(10, 10, 8, 0.1, 1)
        ]

        this.update = function(){
            //console.log(this)
            canvas.clear();
            canvas.drawBorder();
            for(var object of objects){
                //console.log(mouse.mousedown)
                //if(mouse.mousedown) object.resolveForces();
                object.resolveForces();
                object.resolveBoundaries(container);
                object.resolveCollisions();
                object.resolveFriction();
                //object.applyFriction();
                object.move();
                object.resolveCollisions();
                object.draw();
            }
            
        }
    }

    



    updatee(){
        console.log(this)
        for(var object of this.objects){
            object.draw();
        }
    }
}

var canvas = new Canvas(document.getElementById("canvas"), 200, 200);
//canvas.drawBorder();
var sim = new Simulation(canvas);
fps = 10
window.addEventListener("mousemove", event=>{sim.mouse.update(event.x, event.y)});
window.addEventListener("mousedown", event=>{sim.mouse.update(event.x, event.y, true)});
window.addEventListener("mouseup", event=>{sim.mouse.update(event.x, event.y, false)});
window.setInterval(sim.update, 1000/fps)