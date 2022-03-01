// <reference path="node_modules/@types/p5/index.d.ts" />
// <reference types="p5" />
var w = 600;
var h = 800;
var nBalls = 5;
var startX = 100;
var spacing = 100;
var balls = [];
var ctx = null;
var drawE = function (ctx, ball) {
    if (ball.y < ctx.h - (ctx.d + 1)) {
        ball.y += (1 * ((ctx.h - ball.y) / ctx.h)) * ball.vel;
    }
    // p.background(0);
    ctx.p.fill(250);
    ctx.p.ellipse(ball.x, ball.y, ctx.d, ctx.d);
    return ball.y;
};
var sketch = function (p) {
    p.setup = function () {
        p.createCanvas(w, h);
        for (var i = 0; i < nBalls; i++) {
            var x = startX + i * spacing;
            balls.push({ x: x, y: 50, vel: 1.0 * ((i + 1) / nBalls) });
        }
        ctx = { p: p, w: w, h: h, d: 50 };
    };
    p.draw = function () {
        for (var i = 0; i < nBalls; i++) {
            drawE(ctx, balls[i]);
        }
    };
};
var s1 = new p5(sketch, "d1");
