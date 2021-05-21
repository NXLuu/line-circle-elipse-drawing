// const { default: functionPlot } = require("function-plot");

// const { brotliDecompressSync } = require("node:zlib");



var fb;
fb = new FatBits("canvasOne");
let selectFunction = Bresenham;
let isline = true;

function canvasApp() {


    fb = new FatBits("canvasOne");
    fb.clear();

    //     var ctx = document.getElementById('canvas').getContext("2d"),
    //         inp = document.querySelector("#input"),
    //         w = ctx.canvas.width,
    //         h = ctx.canvas.height,
    //         balls = [];                                     // global ball array

    //     ctx.fillStyle = "black";
    //     ctx.font = "5px Arial"
    //     // fill must be a solid color
    //     generate(inp.value)                                 // init default text
    //     inp.onkeyup = function () { generate(this.value) };    // get some text to demo

    //     function generate(txt) {
    //         var i, radius = 0.1,                                // ball radius
    //             data32;                                       // we'll use uint32 for speed

    //         balls = [];                                       // clear ball array
    //         ctx.clearRect(0, 0, w, h);                        // clear canvas so we can
    //         ctx.fillText(txt.toUpperCase(), 0, 5);           // draw the text (default 10px)

    //         fb.clear();
    //         // get a Uint32 representation of the bitmap:
    //         data32 = new Uint32Array(ctx.getImageData(0, 0, w, h).data.buffer);
    //         console.log(data32)
    //         // loop through each pixel. We will only store the ones with alpha = 255
    //         for (i = 0; i < data32.length; i++) {
    //             if (data32[i] & 0xff000000) {
    //                 // console.log(data32[i], i)// check alpha mask
    //                 balls.push({                            // add new ball if a solid pixel
    //                     x: (i % w) ,     // use position and radius to
    //                     y: ((i / w) | 0), //  pre-calc final position and size
    //                     radius: radius,
    //                     a: (Math.random() * 250) | 0            // just to demo animation capability
    //                 });
    //                 console.log(i, balls)
    //             }
    //         }
    //  for (var i = 0, ball; ball = balls[i]; i++) {
    //             var dx = Math.sin(ball.a * 0.1) ,   // do something funky
    //                 dy = Math.cos(ball.a++ * 0.1) ;
    //             // ctx.moveTo(ball.x + ball.radius + dx, ball.y + dy);
    //             // console
    //             fb.paintBit(ball.x+dx, ball.y+dy, true);
    //             // ctx.closePath();
    //         }
    //         // return array - here we'll animate it directly to show the resulting objects:
    //     }


}


function FatBits(canvasID) {
    this.theCanvas = document.getElementById(canvasID);
    if (!this.theCanvas) {
        alert("Cannot find the canvas with ID=" + canvasID);
        return;
    }
    this.context = this.theCanvas.getContext("2d");

    this.BitOffColor = "#ffffff40";
    this.BitOnColor = "#ffffff";
    this.BitBetweenColor = "#301f52";

    this.BitSize = 0;
    this.BitAlley = 0;

    this.clear = function () {
        // debugger
        this.context.fillStyle = this.BitBetweenColor;
        this.context.fillRect(0, 0, this.theCanvas.width, this.theCanvas.height);
        // console.log(this.Max_x, this.Max_y)
        for (var row = 0; row <= this.Max_x; ++row) {
            for (var col = 0; col <= this.Max_y; ++col) {
                this.paintBit(row, col, false);
            }
        }

    }

    this.setBitSize = function (width, alley) {
        // debugger
        this.BitSize = width;
        this.BitAlley = alley;
        var half = Math.floor(width / 2);
        this.Max_x = Math.ceil((this.theCanvas.width) / (width + alley));
        this.Max_y = Math.ceil((this.theCanvas.height) / (width + alley));
    }


    this.paintBit = function (x, y, on_off) {
        var xcenter = x * (this.BitSize + this.BitAlley);
        var half = Math.floor(this.BitSize / 2);
        var ycenter = y * (this.BitSize + this.BitAlley);
        this.context.fillStyle = on_off ? this.BitOnColor : this.BitOffColor;
        this.context.fillRect(xcenter - half, ycenter - half, this.BitSize, this.BitSize);
    }

    this.drawLine = function (x1, y1, x2, y2, color) {
        this.context.strokeStyle = color;
        this.context.lineWidth = 2;
        this.context.beginPath();
        var block = this.BitSize + this.BitAlley;
        this.context.moveTo(x1 * block, y1 * block);
        this.context.lineTo(x2 * block, y2 * block);
        this.context.stroke();
        this.context.closePath();
    }

    this.setBitSize(15, 2);
}


var isDrawing = false;
var overLine = null;
var drawingDelay = 0;
var drawingBits = [];
var drawingNext = 0;

function startDrawing(bitList, isDrawingLine) {
    if (bitList == null || bitList.length == 0) return;

    if (isDrawingLine) {
        var first = bitList[0];
        var last = bitList[bitList.length - 1];
        overLine = { x1: first.x, y1: first.y, x2: last.x, y2: last.y, color: "#00ff00" };
    } else overLine = null;


    var secs = document.getElementById("seconds");
    var nsecs = parseInt(secs.options[secs.selectedIndex].value);
    drawingDelay = Math.floor(nsecs * 1000 / (bitList.length - 2));

    drawingBits = bitList;
    drawingNext = 0;
    isDrawing = true;

    bitDrawing();
}

function bitDrawing() {
    if (!isDrawing || drawingNext >= drawingBits.length) return;
    var point = drawingBits[drawingNext];
    fb.paintBit(point.x, point.y, true);
    if (overLine)
        fb.drawLine(overLine.x1, overLine.y1, overLine.x2, overLine.y2, overLine.color);
    drawingNext += 1;
    if (drawingNext < drawingBits.length) {
        setTimeout(bitDrawing, drawingDelay);
    } else {
        isDrawing = false;
    }
}


// ============================ Mouse Control ===============================
var bit1 = null;
var bit2 = null;
let bit3 = null;

function test() {
    fb.clear();
    var theBits = [{ x: 1, y: 2 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 4 }];
    fb.paintBit(theBits[theBits.length - 1].x, theBits[theBits.length - 1].y, true);
    startDrawing(theBits, true);
}

function redraw() {
    var sel = document.getElementById("npixels");
    var npixels = parseInt(sel.options[sel.selectedIndex].value);
    fb.setBitSize(npixels, 1);
    fb.clear();
}

function mouseClick(event, f) {
    var xy = bitCoords(event);
    isDrawing = false;
    if (isline == false) {
        fb.clear();
        let r = +document.getElementById('radius').value;
        console.log(r);
        if (selectFunction == Mid_ellipse) {
            let a = +document.getElementById('a-elipse').value;
            let b = +document.getElementById('b-elipse').value;
            fb.drawLine(xy.x, xy.y - b, xy.x, xy.y + b, "#04ff00");
            fb.drawLine(xy.x - a, xy.y, xy.x + a, xy.y, "#04ff00");
            drawingBits = f(xy, a, b);
            plotElipse(a, b, config2)
            setText('showPoint', `Tâm: ${xy.x} , ${xy.y}`);
        } else {
            drawingBits = f(xy, r);
            fb.drawLine(xy.x, xy.y - r, xy.x, xy.y + r, "#04ff00");
            fb.drawLine(xy.x - r, xy.y, xy.x + r, xy.y, "#04ff00");
            plotCircle(r, config2)
            setText('showPoint', `Tâm: ${xy.x} , ${xy.y}
             <br> Bán kính: ${r}`);
        }
        startDrawing(drawingBits, false);
    }
    else if ((bit1 == null && bit2 == null) || (bit1 != null && bit2 != null)) {	// w
        fb.clear();
        fb.paintBit(xy.x, xy.y, true);
        bit1 = xy;
        bit2 = null;
    }
    else {
        if (xy.x != bit1.x || xy.y != bit1.y) {
            bit2 = xy;
            fb.paintBit(xy.x, xy.y, true);
            fb.drawLine(bit1.x, bit1.y, bit2.x, bit2.y, "green");
            drawingBits = f(bit1, bit2);
            plotLine(bit1, bit2, config)
            setText('showPoint', `Điểm đầu: ${bit1.x} , ${bit1.y}
             <br> Điểm cuối: ${bit2.x} , ${bit2.y}`);
            startDrawing(drawingBits, true);
        }
    }
}

function bitCoords(event) {
    var bitx, bity;
    var xy = relMouseCoords(event);
    var block = fb.BitSize + fb.BitAlley;
    var origin = Math.floor(fb.BitSize / 2) + fb.BitAlley;
    if (xy.x < origin)
        bitx = 0;
    else
        bitx = Math.floor((xy.x - origin) / block) + 1;
    if (xy.y < origin)
        bity = 0;
    else
        bity = Math.floor((xy.y - origin) / block) + 1;
    return { x: bitx, y: bity }
}

function relMouseCoords(event) {
    // debugger;
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = fb.theCanvas;
    var coordinates = currentElement.getBoundingClientRect();
    // totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
    // totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;

    totalOffsetX += coordinates.left + window.pageXOffset;
    totalOffsetY += coordinates.top + window.pageYOffset;
    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    // console.log(event.clientY - currentElement.offsetTop + window.pageYOffset);
    return { x: canvasX, y: canvasY }
}

function Bresenham(point1, point2) {
    var list = new Array();
    var x0 = point1.x;
    var y0 = point1.y;
    var x1 = point2.x;
    var y1 = point2.y;
    var dx = x1 - x0;
    var dy = y1 - y0;

    var inc_x = (dx >= 0) ? +1 : -1;
    var inc_y = (dy >= 0) ? +1 : -1;

    dx = (dx < 0) ? -dx : dx;
    dy = (dy < 0) ? -dy : dy;

    if (dx >= dy) {

        var d = 2 * dy - dx
        var delta_A = 2 * dy
        var delta_B = 2 * dy - 2 * dx

        var x = 0;
        var y = 0;
        for (i = 0; i <= dx; i++) {
            list.push({ x: x + x0, y: y + y0 });
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            }
            else {
                d += delta_A;
                x += inc_x;
            }
        }
    }
    else {
        var d = 2 * dx - dy
        var delta_A = 2 * dx
        var delta_B = 2 * dx - 2 * dy

        var x = 0;
        var y = 0;
        for (i = 0; i <= dy; i++) {
            list.push({ x: x + x0, y: y + y0 });
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            }
            else {
                d += delta_A;
                y += inc_y;
            }
        }
    }
    return list;
}

function Midpoint(point1, point2) {
    var list = new Array();
    var x0 = point1.x;
    var y0 = point1.y;
    var x1 = point2.x;
    var y1 = point2.y;
    var dx = x1 - x0;
    var dy = y1 - y0;

    var inc_x = (dx >= 0) ? +1 : -1;
    var inc_y = (dy >= 0) ? +1 : -1;

    dx = (dx < 0) ? -dx : dx;
    dy = (dy < 0) ? -dy : dy;

    if (dx >= dy) {
        var d = dy - dx / 2
        var delta_A = dy
        var delta_B = dy - dx

        var x = 0;
        var y = 0;
        for (i = 0; i <= dx; i++) {
            list.push({ x: x + x0, y: y + y0 });
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            }
            else {
                d += delta_A;
                x += inc_x;
            }
        }
    }
    else {
        var d = dx - dy / 2
        var delta_A = dx
        var delta_B = dx - dy

        var x = 0;
        var y = 0;
        for (i = 0; i <= dy; i++) {

            list.push({ x: x + x0, y: y + y0 });
            if (d > 0) {
                d += delta_B;
                x += inc_x;
                y += inc_y;
            }
            else {
                d += delta_A;
                y += inc_y;
            }
        }
    }
    return list;
}


/*---------------Circle-------------------- */
function pc(xc, yc, x, y, list) {
    list.push({ x: xc + x, y: yc + y });
    list.push({ x: xc + y, y: yc + x });
    list.push({ x: xc + y, y: yc - x });
    list.push({ x: xc + x, y: yc - y });
    list.push({ x: xc - x, y: yc - y });
    list.push({ x: xc - y, y: yc - x });
    list.push({ x: xc - y, y: yc + x });
    list.push({ x: xc - x, y: yc + y });
}

function pc4(xc, yc, x, y, list) {
    list.push({ x: xc + x, y: yc + y });
    list.push({ x: xc - x, y: yc - y });
    list.push({ x: xc - y, y: yc + x });
    list.push({ x: xc + y, y: yc - x });
}
function elipse_pc4(xc, yc, x, y, list) {
    list.push({ x: xc + x, y: yc + y });
    list.push({ x: xc - x, y: yc + y });
    list.push({ x: xc + x, y: yc - y });
    list.push({ x: xc - x, y: yc - y });
}

function Mid_ellipse(point, a, b) {
    let list = new Array();
    let xc = point.x;
    let yc = point.y;
    let x = 0;
    let y = b;
    let a2 = a * a;
    let b2 = b * b;
    let fx = 0;
    let fy = 2 * a2 * y;
    elipse_pc4(xc, yc, x, y, list);
    let p = b2 - (a2 * b) + (0.25 * a);
    while (fx < fy) {
        x++;
        fx += 2 * b2;
        if (p < 0)
            p += b2 * (2 * x + 1);
        else {
            y--;
            p += b2 * (2 * x + 1) + a2 * (-2 * y);
            fy -= 2 * a2;
        }
        elipse_pc4(xc, yc, x, y, list)

    }
    p = b2 * (x + 0.5) * (x + 0.5) + a2 * (y - 1) * (y - 1) - a2 * b2 + 1 / 2;
    while (y > 0) {
        y--;
        fy -= 2 * a2;
        if (p >= 0)
            p += a2 * (1 - 2 * y);
        else {
            x++;
            fx += 2 * b2;
            p += b2 * (2 * x + 2) + a2 * (-2 * y + 1);
        }
        elipse_pc4(xc, yc, x, y, list)
    }
    return list;
}

function Circle_Midpoint(point, r) {
    var list = new Array();
    var x0 = point.x;
    var y0 = point.y;
    var p = 5 / 4 - r;

    var x = 0;
    var y = r;

    pc(x0, y0, x, y, list)
    while (x < y) {
        if (p < 0) {
            p += 2 * x + 3;
        } else {
            p += 2 * (x - y) + 5;
            y--;
        }
        x++;
        pc(x0, y0, x, y, list);
    }
    return list;

}

function Circle_Bresenham(point, r) {
    var list = new Array();
    var x0 = point.x;
    var y0 = point.y;
    var p = 3 - 2 * r;

    var x = 0;
    var y = r;


    pc4(x0, y0, r, 0, list)
    while (x < y) {
        if (p < 0) {
            p += 4 * x + 6;
        } else {
            p += 4 * (x - y) + 10;
            y--;
        }
        x++;
        pc4(x0, y0, x, y, list);
        pc4(x0, y0, y, x, list);
    }

    return list;
}


function removeEnable() {
    let list = document.getElementById('selectItem').children;
    // console.log(list);
    Array.from(list).forEach(element => {
        element.classList.remove('enable');
    });
}
function addEnable(index) {
    document.getElementById('selectItem').children[index].classList.add('enable');
}

document.querySelector('.control').addEventListener('click', function (e) {
    let target = e.target;
    switch (target.id) {
        case 'line':
            isline = true;
            document.getElementById('hr1').style.marginLeft = "0px";
            removeEnable();
            addEnable(0);
            selectFunction = Bresenham;
            insertCode("", "Bresenham Line")
            fb.clear();
            break;
        case 'round':
            isline = false;
            document.getElementById('hr1').style.marginLeft = "139px";
            removeEnable();
            addEnable(1);
            selectFunction = Circle_Bresenham;
            insertCode(pc4 + "\n", "Bresenham Circle");
            fb.clear();
            break;
        case 'elip':
            isline = false;
            document.getElementById('hr1').style.marginLeft = "276px";
            removeEnable();
            addEnable(2);
            selectFunction = Mid_ellipse;
            insertCode(elipse_pc4 + "\n", "Midpoint Elipse")
            fb.clear();
            break;
        default:
            return;
    }
})

function setText(id, str) {
    let item = document.getElementById(id);
    item.innerHTML = '';
    item.innerHTML = str;
}

document.querySelector('.item1').addEventListener('change', function (e) {
    if (e.target.value == "Bresenham") {
        selectFunction = Bresenham;
        insertCode("", "Bresenham Line");
    }
    else {
        selectFunction = Midpoint;
        insertCode("", "Midpoint Line");
    }
    fb.clear();
})

document.querySelector('.item2').addEventListener('change', function (e) {
    // console.log(e.target.value)
    if (e.target.value == "Bresenham") {
        selectFunction = Circle_Bresenham;
        insertCode(pc4 + "\n", "Bresenham Circle");
    }
    else {
        selectFunction = Circle_Midpoint;
        insertCode(pc4 + "\n", "Midpoint Circle");
    }
    fb.clear();
})

document.getElementById('canvasOne').addEventListener('mousemove', function(e) {
    // console.log(bitCoords(e).x, bitCoords(e).y);
    document.getElementById('cordidates').innerHTML = '[' + bitCoords(e).x + " "+ bitCoords(e).y +']';
})

/*---------- Function Plot */

var config = {
    target: "#root",
    width: 350,
    height: 350,
    yAxis: { domain: [-9, 9] },
    xAxis: { domain: [-9, 9] },
    grid: true,
    disableZoom: false,
    data: [
        {
            fn: "x",
        }

    ],

}
let config2 = {
    target: "#root",
    width: 350,
    height: 350,
    yAxis: { domain: [-9, 9] },
    xAxis: { domain: [-9, 9] },
    grid: true,
    disableZoom: false,
    data: [
        {
            fn: "x",
        }

    ]
}
// config.data[0].fn = "5x + 3";
function plotLine(point1, point2, config) {
    document.getElementById('root').remove();
    let item = document.createElement('div');
    item.id = 'root';
    document.getElementsByClassName('side-right')[0].append(item);
    let xmax = Math.max(point1.x, point2.x);
    let xmin = Math.min(point1.x, point2.x);
    let ymax = Math.max(point1.y, point2.y);
    let ymin = Math.min(point1.y, point2.y);

    config.xAxis.domain = [-300, 300];
    config.yAxis.domain = [-300, 300];
    let a, b, fn;
    if (point2.x == point1.x) {
        let b = point1.y - point2.y;
        fn =  "x=1";
        config.title = "Vô Nghiệm";
    } else {
        a = (point2.y - point1.y) / (point2.x - point1.x);
        b = point1.y - a * point1.x;
        fn = "" + a + "x + " + b;
        config.title = "y = " + a.toFixed(2) + " * x + " + b.toFixed(2);
    } 

    config.data[0].fn = fn;
    functionPlot(config);
}
function plotCircle(r, config) {


    config.xAxis.domain = [-r - 1, r + 1];
    config.yAxis.domain = [-r - 1, r + 1];


    let fn = "sqrt(" + r * r + " - x * x)";
    let fn2 = "-sqrt(" + r * r + " - x * x)";
    // console.log(fn, fn2)
    config.data[0].fn = fn;
    if (config.data[1] == undefined)
        config.data.push({ fn: fn2 })
    else config.data[1].fn = fn2;
    config.title = "x² + y² = " + r + "²";
    functionPlot(config);
}
function plotElipse(a, b, config) {

    let max = Math.max(a, b);
    max += 1;

    config.xAxis.domain = [-max, max];
    config.yAxis.domain = [-max, max];


    let fn = "sqrt(" + a * a * b * b + "-" + b * b + "*x * x)" + "/" + a;
    let fn2 = "-sqrt(" + a * a * b * b + "-" + b * b + "*x * x)" + "/" + a;
    let title = "x²/" + a + "² + y²/" + b + "² = 1";
    config.title = title;
    // console.log(fn, fn2)
    config.data[0].fn = fn;
    if (config.data[1] == undefined)
        config.data.push({ fn: fn2 })
    else config.data[1].fn = fn2;
    functionPlot(config);
}

functionPlot(config);


/* Insert Code in to HTML */

function insertCode(supportFunction, title) {
    let codeDiv = document.getElementById('code');
    let titleCode = document.getElementById('code-title');
    titleCode.innerHTML = title;
    let text = supportFunction + "" + selectFunction;
    codeDiv.innerHTML = text;
    hljs.highlightAll()
}

insertCode("", "Bresenham Line");
