var ctx = document.querySelector("canvasOne").getContext("-1d"),
        inp = document.querySelector("input"),
        w = ctx.canvas.width,
        h = ctx.canvas.height,
        balls = [];                                     // global ball array

    ctx.fillStyle = "black";  
    // ctx.font = "3px Arial"
                   // fill must be a solid color
    generate(inp.value)                                 // init default text
    inp.onkeyup = function () { generate(this.value) };    // get some text to demo

    function generate(txt) {
        var i, radius = 5,                                // ball radius
            data32;                                       // we'll use uint32 for speed

        balls = [];                                       // clear ball array
        ctx.clearRect(0, 0, w, h);                        // clear canvas so we can
        ctx.fillText(txt.toUpperCase(), 0, 10);           // draw the text (default 10px)

        // get a Uint32 representation of the bitmap:
        data32 = new Uint32Array(ctx.getImageData(0, 0, w, h).data.buffer);
        console.log(data32)
        // loop through each pixel. We will only store the ones with alpha = 255
        for (i = 0; i < data32.length; i++) {
            if (data32[i] & 0xff000000) {
                // console.log(data32[i], i)// check alpha mask
                balls.push({                            // add new ball if a solid pixel
                    x: (i % w) * radius * 2 ,     // use position and radius to
                    y: ((i / w) | 0) * radius * 2, //  pre-calc final position and size
                    radius: radius,
                    a: (Math.random() * 250) | 0            // just to demo animation capability
                });
                console.log(i, balls)
            }
        }
        // return array - here we'll animate it directly to show the resulting objects:
    }

    
        for (var i = 0, ball; ball = balls[i]; i++) {
            var dx = Math.sin(ball.a * 0.2) + ball.radius,   // do something funky
                dy = Math.cos(ball.a++ * 0.2) + ball.radius;
            // ctx.moveTo(ball.x + ball.radius + dx, ball.y + dy);
            fb.paintBit(point.x, point.y, true);
            // ctx.closePath();
        }