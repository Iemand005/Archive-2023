var N = 256;
class Fluid {
    constructor(dt, diffusion, viscosity){
        
        this.size = N;
        this.dt = dt;
        this.diff = diffusion;
        this.visc = viscosity;

        this.s = new Array();
        this.density = new Array();

        this.Vx = new Array();
        this.Vy = new Array();

        this.Vx0 = new Array();
        this.Vy0 = new Array();

        this.IX = function (x, y){
            return x + y * N;
        }

        this.addDensity = function (x, y, amount){
            var index = IX(x, y);
            this.density[index] += amount;
        }

        this.addVelocity = function (x, y, amountX, amountY){
            var index = IX(x, y);
            this.Vx[index] += amountX;
            this.Vy[index] += amountY;
        }
    }
}

function lin_solve(b, x, x0, a, c) {
    var cReip = 1.0/c;
    for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
            x[IX(i, j)] =
            (x0[IX(i, j)]
            + a*(
                x[IX(i+1, j)]
                +x[IX(i-1, j)]
                +x[IX(i, j+1)]
                +x[IX(i, j-1)]
            )) * cReip;
        }
    }
}

function project(velocX, velocY, p, div) {
    for (let j = 0; j < N; j++) {
        for (let i = 0; i < N; i++) {
            div[IX(i, j)] = -0.5*(
                     velocX[IX(i+1, j)]
                    -velocX[IX(i-1, j)]
                    +velocY[IX(i, j+1)]
                    -velocY[IX(i, j-1)]
                )/N;
            p[IX(i, j)] = 0;
        }
    }
    set_bnd(0, div);
    set_bnd(0, p);
    lin_solve(0, p, div);
}

function diffuse(b, x, x0, diff, dt){
    var a = dt * diff * (N - 2) ** 2;
}

class Canvas{
    constructor(canvas){
        var canvas = this.canvas = canvas;
        var ctx = this.ctx = canvas.getContext("2d");;
        
        function drawRect(x1, y1, x2, y2){
            ctx.beginPath();
            ctx.rect(x1, y1, x2, y2);
            ctx.stroke();
        }

        function drawBorder(){
            drawRect(0, 0, canvas.width, canvas.height);
        }

        this.drawRect = drawRect;

        this.drawBorder = function (){
            drawRect(0, 0, this.canvas.width, this.canvas.height);
        }

        function drawLine(x1, y1, x2, y2, color = "red"){
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            
            ctx.stroke();
        }

        function drawVector(x, y, u, v, color = "red"){
            return drawLine(x, y, x + u, y + v, color);
        }

        function clear(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        this.clear = clear;

        this.drawLine = drawLine;

        this.drawVector = drawVector;
    }
}

class FluidSimulation{
    constructor(canvas, tiles = 100, width=100, height=100){
        canvas.width = width;
        canvas.height = height;
        var canvas = this.canvas = new Canvas(canvas);
        

        class Tile{
            constructor(width, height, x, y){
                this.width = width,
                this.height = height,
                this.x = x,
                this.y = y;
                this.vx = 0;
                this.vy = 100;
                this.vx0 = 0;
                this.vy0 = 0;
            }
        }
        class Grid{
            constructor(tilecount, width, height){
                var tilew = width/tilecount;
                var tileh = height/tilecount;
                var tiles = this.tiles = new Array()
                for (let j = 0; j < tilecount; j++) {
                    tiles[j] = new Array();
                    for (let i = 0; i < tilecount; i++) {
                        tiles[j][i] = new Tile(tilew, tileh, tilew*i+tilew/2, tileh*j+tileh/2)
                    }
                }
                this.tiles = tiles;

                this.draw = function () {
                    for(var index in this.tiles){
                        var tilec = tiles[index]
                        for(var tile of tilec){
                            canvas.drawRect(tile.x-tile.width/2, tile.y-tile.height/2, tile.x + tile.width/2, tile.y + tile.height/2)
                            canvas.drawVector(tile.x, tile.y-tile.height/2, 0, tile.vx, "red");
                            canvas.drawVector(tile.x - tile.width/2, tile.y, tile.vy, 0, "green");
                            canvas.drawVector(tile.x, tile.y + tile.height/2, 0, tile.vx0, "blue");
                            canvas.drawVector(tile.x + tile.width/2, tile.y, tile.vy0, 0, "purple");
                        }
                    }
                }

                this.equalise = function(){
                    for(var i in this.tiles){
                        for(var j in tiles[i]){
                          // var this = 
                            var diff = ( tiles[i][j].vx +tiles[i][j].vy +tiles[i][j].vx0 + tiles[i][j].vy0 ) / 4;
                            tiles[i][j].vx  -= diff//tiles[i][j].vx<0? diff: -diff;
                            tiles[i][j].vy  -= diff//tiles[i][j].vy<0? diff: -diff;
                            tiles[i][j].vx0  -= diff//tiles[i][j].vx0<0? diff: -diff;
                            tiles[i][j].vy0  -= diff//tiles[i][j].vy0<0? diff: -diff;
                        }
                    }
                }

                this.diffuse = function(){
                    for(var j in this.tiles){
                        for(var i of tiles[j]){

                        }
                    }
                }
            }
        }
        var grid = this.grid = new Grid(tiles, width, height)
        this.start = function () {
            canvas.drawBorder();
            grid.equalise();
            grid.draw();
        }

        this.renderFrame = function(){
            canvas.clear();
            canvas.drawBorder();
            grid.equalise();
            grid.draw();
        }
    }
}


var height = 400;
var width = 400;
canvas = document.getElementById("canvas");

fluid = new FluidSimulation(canvas, 5, width, height);
console.log(fluid);
window.setInterval(fluid.renderFrame, 1000)

//console.log(canvas);
fluid.start();