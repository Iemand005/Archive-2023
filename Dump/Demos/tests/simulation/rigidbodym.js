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
        var objects = this.objects = new Array;
        var fields = this.fields = new Array;

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
                if(this.pos[1]-this.r<conatiner.top||this.pos[1]+this.r>conatiner.bottom||this.pos[0]-this.r<conatiner.left||this.pos[0]+this.r>conatiner.right)this.resolveCollisions();

                if(this.pos[1]-this.r<conatiner.top||this.pos[1]+this.r>conatiner.bottom) this.vel = new Vector(0, -this.vel[1]);

                if(this.pos[0]-this.r<conatiner.left||this.pos[0]+this.r>conatiner.right) this.vel = new Vector(-this.vel[0], 0);
                
                if(this.pos[0]-this.r<conatiner.left) this.pos[0] = conatiner.left + this.r
                if(this.pos[0]+this.r>conatiner.right) this.pos[0] = conatiner.right - this.r
                if(this.pos[1]-this.r<conatiner.top) this.pos[1] = conatiner.top + this.r
                if(this.pos[1]+this.r>conatiner.bottom) this.pos[1] = conatiner.bottom - this.r
            }

            resolveCollisions(){
                for (var object2 of objects) {
                    var object1 = this, circle2 = object2;
                    //if(typeof(object1) == Ball, )
                    if(object1!=object2){
                        var xdist =object2.pos[0]-object1.pos[0], ydist =object2.pos[1]-object1.pos[1];
                        
                        var distance = Math.sqrt((xdist)**2+(ydist)**2);
                        var angle = Math.atan2(ydist, xdist);
                        var toMove = (object1.r+object2.r - distance)/2;
                        var xToMove = Math.cos(angle) * toMove, yToMove = Math.sin(angle) * toMove;
                        //canvas.drawText(Math.round(xToMove) +", "+ Math.round(yToMove)+": "+angle, this.pos[0], this.pos[1]-11*index)
                        if(distance<object1.r+object2.r) object1.pos.add(new Vector(-xToMove, -yToMove)), object2.pos.add(new Vector(xToMove, yToMove))//this.vel[0] -= xToMove, this.vel[1] -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                        if(distance<object1.r+object2.r) object1.vel.add(new Vector(-xToMove, -yToMove)), object2.vel.add(new Vector(xToMove, yToMove))//this.vel[0] -= xToMove, this.vel[1] -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                        //if(distance<this.r+circle2.r) object.acc.add(new Vector(xToMove, yToMove)), this.acc.add(new Vector(-xToMove, -yToMove))//this.vel[0] -= xToMove, this.vel[1] -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                        if(distance<object1.r+object2.r) {
                            object2.acc = new Vector();
                            //this.resolveBoundaries(container)
                            //this.resolveCollisions()
                            //object.resolveBoundaries()
                            //object.resolveCollisions()
                        }
                        //if(distance<this.r+circle2.r) object.acc = new Vector(0, 0)//, object.vel = new Vector(0, 0);
                    }
                }
            }

            resolveFriction(){
                this.vel.mul(0.95);
                this.acc.mul(0.85);
            }
        }

        class Shape extends Object{
            constructor(x, y, radius, xv, yv, color){
                super(x, y, radius, xv, yv);
                this.color = color;
                this.height;
                this.width;
            }
        }

        class Ball extends Shape{
            constructor(x, y, radius, xv, yv, color){
                super(x, y, xv, yv, color);
                this.color = color;
                this.r = this.height = this.width = radius;
                this.bounds = new Container(radius, radius, radius, radius);
            }
            draw(){
                //canvas.drawText(this.color, 100, 100)
                canvas.drawBall(this.pos[0], this.pos[1], this.r, this.color);
                //canvas.drawText(Math.round(this.acc[0]) +", "+ Math.round(this.vel[0])+", "+ Math.round(this.pos[0]))
                //canvas.drawText(Math.round(this.acc[1]) +", "+ Math.round(this.vel[1])+", "+ Math.round(this.pos[1]), 0, 20)
            }
            
            


        }

        class Square extends Shape{
            constructor(x, y, height, width, xv, yv, color){
                super(x, y, xv, yv, color);
                this.height = height;
                this.width = width;
            }
            move(){

            }
            draw(){
                canvas.drawRect(this.pos[0], this.pos[1], this.pos[0], this.pos[1]);
            }
        }

        class Mouse extends Ball{
            constructor(x, y){
                super(x, y, 10, 0, 0);
                this.pos = new Vector(x, y);
                this.height = this.width = this.r = 10;
                this.mousedown = false;
            }
            update(x, y, mousedown){
                this.pos = new Vector(x, y);
                if(mousedown!=null) this.mousedown = mousedown;
            }
            move(){
                
            }
            /*draw(){
                canvas.drawRect(this.pos[0], this.pos[1], this.pos[0], this.pos[1]);
            }*/
        }

        //var mosue = 
        this.mouse = new Mouse();
        var mouse = this.mouse;

        this.fields.push(new Vector(0, 0.1)) // gravity

        //this.objects.push(new Ball(10, 10, 8, 0.1, 1));

        objects = [
            mouse,
            new Ball(10, 10, 8, 0.1, 1, "green"),
            new Ball(10, 100, 8, 0.1, 1, "orange"),
            new Ball(10, 10, 8, 0.1, 1, "red")
        ]

        this.randint = function(start, end){
            return (Math.random()*end-start)+start;
        }

        this.summonRandomBalls = function(amount){
            for (let i = 0; i < amount; i++) objects.push(new Ball(this.randint(1,10), 10, 8, 0.1, 1, "brown"));
        }

        this.summonRandomBalls(30);

        this.update = function(){
            //console.log(this)
            canvas.clear();
            canvas.drawBorder();
            for(var object of objects){
                //console.log(mouse.mousedown)
                //if(mouse.mousedown) object.resolveForces();
                object.resolveForces();
                object.resolveCollisions();
                object.resolveBoundaries(container);
                object.resolveCollisions()
                object.resolveFriction();
                //object.applyFriction();
                object.move();
                //object.resolveCollisions();
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

var canvas = new Canvas(document.getElementById("canvas"), 278, 575);
//canvas.drawBorder();
var sim = new Simulation(canvas);
fps = 60
window.addEventListener("mousemove", event=>{sim.mouse.update(event.x, event.y)});
window.addEventListener("mousedown", event=>{sim.mouse.update(event.x, event.y, true)});
window.addEventListener("mouseup", event=>{sim.mouse.update(event.x, event.y, false)});
window.setInterval(sim.update, 1000/fps)