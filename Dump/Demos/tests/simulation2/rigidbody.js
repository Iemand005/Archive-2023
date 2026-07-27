class Canvas{
    constructor(canvas, width = 200, height = 200){
        if(canvas) canvas.width = width, canvas.height = height,
        this.canvas = canvas,
        this.ctx = canvas.getContext("2d"),
        this.width = width - 1,
        this.height = height - 1;
    }

    drawRect(x1, y1, x2, y2){
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2, y2);
        this.ctx.stroke();
    }

    drawBeam(x1, y1, x2, y2, color){
        this.ctx.beginPath();
        this.ctx.rect(x1, y1, x2, y2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
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

        class Vector{
            constructor(x = 0, y = 0){
                this.x = x;
                this.y = y;
            }
            add(force){
                this.x += force.x,
                this.y += force.y;
            }
            mul(multiplier){
                this.x *= multiplier,
                this.y *= multiplier;
            }
            rot(theta) {
                return new Vector(this.x * Math.cos(theta) - this.y * Math.sin(theta),
                this.y = this.x * Math.sin(theta) + this.y * Math.cos(theta));
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
                this.rot = new Vector,
                //this.vel = [xv, yv],
                this.mass = 1;
            }

            move(){
                this.pos.add(this.vel);
                //canvas.drawText(Math.round(object.pos.x)+" "+Math.round(circle1.pos.x )+" " +Math.round(xdist)+", "+Math.round(xdist), 100, 40)
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
                var top = this.pos.y-this.height<conatiner.top;
                var bottom  = this.pos.y+this.height>conatiner.bottom;
                var left = this.pos.x-this.width<conatiner.left;
                var right = this.pos.x+this.width>conatiner.right;
                if(top||bottom||left||right){
                    this.resolveCollisions();
                    this.acc = new Vector;
                }
                if(top||bottom) this.vel = new Vector;

                if(left||right) this.vel = new Vector(-this.vel.x, 0);
                
                if(left) this.pos.x = conatiner.left + this.width
                if(right) this.pos.x = conatiner.right - this.width
                if(top) this.pos.y = conatiner.top + this.height
                if(bottom) this.pos.y = conatiner.bottom - this.height
            }

            resolveCollisions(){
                for (var object2 of objects) {
                    
                    var object1 = this;
                    if(object1!=object2){
                    if(object1 instanceof Ball && object2 instanceof Ball){
                        
                            var xdist =object2.pos.x-object1.pos.x, ydist =object2.pos.y-object1.pos.y;
                            var distance = Math.sqrt((xdist)**2+(ydist)**2);
                            var angle = Math.atan2(ydist, xdist);
                            var toMove = (object1.r+object2.r - distance)/2;
                            var xToMove = Math.cos(angle) * toMove, yToMove = Math.sin(angle) * toMove;
                            if(distance<object1.r+object2.r) object1.pos.add(new Vector(-xToMove, -yToMove)), object2.pos.add(new Vector(xToMove, yToMove))//this.vel.x -= xToMove, this.vel.y -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                            if(distance<object1.r+object2.r) object1.vel.add(new Vector(-xToMove, -yToMove)), object2.vel.add(new Vector(xToMove, yToMove))//this.vel.x -= xToMove, this.vel.y -= yToMove, circle2.xv += xToMove, circle2.yv += yToMove;
                            //if(distance<object1.r+object2.r) object1.vel = new Vector;
                            if(distance<object1.r+object2.r) object1.acc = new Vector;
                        }
                    }
                }
            }

            resolveFriction(){
                this.vel.mul(0.95);
                this.acc.mul(0.85);
            }
        }

        class Shape extends Object{
            constructor(x, y, xv, yv, color){
                super(x, y, xv, yv);
                this.color = color;
                this.height;
                this.width;
            }
        }

        /*class Line extends Shape{
            constructor(x1, y1, x2, y2, xv, yv, color){
                super(x, y, xv, yv, color);

            }
        }*/

        class Line {
            constructor({x=0,y=0, dx=0, dy=0}) {
                this.origin = new Vector;
                this.direction = new Vector(dx,dy);
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
                canvas.drawBall(this.pos.x, this.pos.y, this.r, this.color);
                //canvas.drawText(Math.round(this.acc.x) +", "+ Math.round(this.vel.x)+", "+ Math.round(this.pos.x))
                //canvas.drawText(Math.round(this.acc.y) +", "+ Math.round(this.vel.y)+", "+ Math.round(this.pos.y), 0, 20)
            }
            
            


        }

        class Square extends Shape{
            constructor(x, y, height, width, xv, yv, color){
                super(x, y, xv, yv, color);
                this.height = height;
                this.width = width;
                this.bounds = new Container(width, height);
            }
            
            draw(){
                canvas.drawBeam(this.pos.x, this.pos.y, this.height, this.width, this.color);
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
                canvas.drawRect(this.pos.x, this.pos.y, this.pos.x, this.pos.y);
            }*/
        }

        //var mosue = 
        this.mouse = new Mouse();
        var mouse = this.mouse;

        this.fields.push(new Vector(0, 0.1)) // gravity

        //this.objects.push(new Ball(10, 10, 8, 0.1, 1));

        objects = [
            mouse,
            new Square(10, 10, 10, 10, 0, 0, "red"),
            new Square(15, 30, 10, 10, 0, 0, "red")
            //new Ball(10, 10, 8, 0.1, 1, "green"),
            //new Ball(10, 100, 8, 0.1, 1, "orange"),
            //new Ball(10, 10, 8, 0.1, 1, "red")
        ]

        this.randint = function(start, end){
            return (Math.random()*end-start)+start;
        }

        this.summonRandomBalls = function(amount){
            for (let i = 0; i < amount; i++) objects.push(new Ball(this.randint(1,10), 10, 8, 0.1, 1, "brown"));
        }

        //this.summonRandomBalls(300);

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

var canvas = new Canvas(document.getElementById("canvas"), 100, 100);
//canvas.drawBorder();
var sim = new Simulation(canvas);
fps = 60
window.addEventListener("mousemove", event=>{sim.mouse.update(event.x, event.y)});
window.addEventListener("mousedown", event=>{sim.mouse.update(event.x, event.y, true)});
window.addEventListener("mouseup", event=>{sim.mouse.update(event.x, event.y, false)});
window.setInterval(sim.update, 1000/fps)