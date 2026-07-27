class Canvas{
    constructor(canvas){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
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
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        this.canvas = canvas;
        var objects = this.objects = new Array();
        var fields = this.fields = new Array();

        class Vector extends Array{
            constructor(xv = 0, yv = 0){
                super(2);
                this[0] = xv;
                this[1] = yv;
                //this.vel = [xv, yv];
            }
            add(vector){
                this[0] += vector[0],
                this[1] += vector[1];
            }
        }

        class Object{
            constructor(x, y, xv, yv){
                //this.pos = {x:x, y:y},
                //this.vel = {u:xv, v:yv}
                //super(xv, yv);
                this.vel = new Vector(xv, yv);
                this.pos = new Vector(x, y),
                //this.vel = [xv, yv],
                this.mass = 1;
            }
            resolveForces(){
                for(var index in fields){
                    var field = fields[index];
                    //console.log(this.vel)
                    this.vel.add(field);
                    this.pos.add(this.vel);
                }
            }
        }

        class Ball extends Object{
            constructor(x, y, radius, xv, yv){
                super(x, y, xv, yv);
                this.rad = radius;
            }
            draw(){
                canvas.drawBall(this.pos[0], this.pos[1], this.rad);
            }
        }

        this.fields.push(new Vector(0, 1)) // gravity

        this.objects.push(new Ball(10, 10, 8, 10, 10));

        this.update = function(){
            //console.log(this)
            canvas.clear();
            canvas.drawBorder();
            for(var object of objects){
                object.resolveForces();
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

var canvas = new Canvas(document.getElementById("canvas"));
//canvas.drawBorder();
var sim = new Simulation(canvas);
window.setInterval(sim.update, 1000)