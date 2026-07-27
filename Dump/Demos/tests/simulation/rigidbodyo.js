class Canvas{
    constructor(canvas, width = canvas.width, height = canvas.height){
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.width = width;
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
    constructor(canvas){
        
        var canvas = this.canvas = canvas;
        var objects = this.objects = new Array();
        var fields = this.fields = new Array();

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

        class Mouse{
            constructor(x, y){
                this.pos = new Vector(x, y);
                this.mousedown = false;
            }
            update(x, y, mousedown){
                this.pos = new Vector(x, y);
                if(mousedown!=null) this.mousedown = mousedown;
            }
        }

        //var mosue = 
        this.mouse = new Mouse();
        var mouse = this.mouse;

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
            }

            applyFriction(){
                var friction = 0.6//0.95;
                this.acc.mul(friction)
                this.vel.add(this.acc)
            }

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
                //this.vel = new Vector(this.vel[0], this.pos[1]>canvas.height?-this.vel[1]:this.vel[1]);
                //this.vel.add(0, this.pos[1]>canvas.height?-this.vel[1]:this.vel[1]);
                //this.vel = new Vector(this.vel[0], this.pos[1]>canvas.height-10?-this.vel[1]:this.vel[1]);
                //this.vel.add(0, this.pos[1]>canvas.height?0:0);
                //console.log(this.pos[1], this.bounds.bottom)
                
                if(this.pos[1]>conatiner.bottom-this.radius) {
                    //console.log("shit")
                    this.vel = new Vector(0, -this.vel[1]);
                    //this.pos = new Vector(10, this.bounds.bottom);
                }
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
            }
            resolveBoundaries(conatiner){
                //if(this.pos[1]<conatiner.top||this.pos[1]>conatiner.bottom||this.pos[0]<conatiner.left||this.pos[0]>conatiner.right)this.acc = 0;
                this.vel = this.pos[1]<conatiner.top||this.pos[1]>conatiner.bottom?new Vector(0, -this.vel[1]):this.vel;
                //this.vel = this.pos[1]<conatiner.top?new Vector(0, -this.vel[1]):this.vel;
                this.vel = this.pos[0]<conatiner.left||this.pos[0]>conatiner.right?new Vector(-this.vel[0], 0):this.vel;
            }
        }

        this.fields.push(new Vector(0, 0.1)) // gravity

        this.objects.push(new Ball(10, 10, 8, 0.1, 1));

        this.update = function(){
            //console.log(this)
            canvas.clear();
            canvas.drawBorder();
            for(var object of objects){
                //console.log(mouse.mousedown)
                //if(mouse.mousedown) object.resolveForces();
                object.resolveForces();
                object.resolveBoundaries(container);
                //object.applyFriction();
                object.move();
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

var canvas = new Canvas(document.getElementById("canvas"), 200, 500);
//canvas.drawBorder();
var sim = new Simulation(canvas);
fps = 30
window.addEventListener("mousemove", event=>{sim.mouse.update(event.x, event.y)});
window.addEventListener("mousedown", event=>{sim.mouse.update(event.x, event.y, true)});
window.addEventListener("mouseup", event=>{sim.mouse.update(event.x, event.y, false)});
window.setInterval(sim.update, 1000/30)