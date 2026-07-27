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

        this.drawRect = drawRect

        this.drawBorder = function (){
            drawRect(0, 0, this.canvas.width, this.canvas.height);
        }
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
            }
        }
        class Grid{
            constructor(tilecount, width, height){
                // console.log(height/tilen)
                // var tilew = width/tilen;
                // var tileh = height/tilen;
                // var tiles = this.tiles = new Array()
                // for (var i=0;i<tilen;i++) {
                //     console.log("row: " + (width%(tilew*i)), "colon: " + width%tilen);
                //     tiles[i] = new Tile(width/tilen, height/tilen);
                //     //console.log(tile)
                // }

                var tilew = width/tilecount;
                var tileh = height/tilecount;
                var tiles = this.tiles = new Array()
                for (let j = 0; j < tileh; j++) {
                    tiles[j] = new Array();
                    for (let i = 0; i < tilew; i++) {
                        tiles[j][i] = new Tile(tilew, tileh, tilew*i, tileh*j)
                    }
                }
                this.tiles = tiles
                //new Array(height/tiles);
                /*this.tiles.map(column=>{
                    column = new Array(width/tiles);
                    column.map(tile=>tile = new Tile(width/tiles, height/tiles));
                    return 100;
                });*/

                //this.tiles = this.tiles.map(tile=>new Tile(width/tiles, height/tiles));
                this.draw = function () {
                    for(var index in this.tiles){
                        var tilec = tiles[index]
                        for(var tile of tilec){
                            console.log(tile)
                            //var tile = tiles[index];
                            canvas.drawRect(tile.x, tile.y, tile.x + tile.width, tile.y + tile.height)
                            //console.log("row: " + width%tiles, "colon: " + width%tiles);
                        }
                    }
                }
            }
        }
        var grid = this.grid = new Grid(tiles, width, height)
        this.start = function () {
            canvas.drawBorder();
            grid.draw();
        }
    }
}


var height = 100;
var width = 100;
canvas = document.getElementById("canvas");

fluid = new FluidSimulation(canvas, 10, width, height);
console.log(fluid);

//console.log(canvas);
fluid.start();