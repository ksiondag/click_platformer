/*jslint browser: true */
/*global Crafty: false */
(function () {
    "use strict";
    var currentTime, newSecond;

    currentTime = function () {
        return new Date();
    };

    newSecond = (function () {
        var savedTime = currentTime();
        return function () {
            var newTime = currentTime();
            if (newTime.getSeconds() !== savedTime.getSeconds()) {
                savedTime = newTime;
                return true;
            } else {
                return false;
            }
        };
    }());
    
    Crafty.init(600, 600, document.getElementById("game"));

    Crafty.e("Generator")
        .bind("EnterFrame", function () {
            if (newSecond()) {
                Crafty.e("DOM,Color,2D")
                    .attr({
                        x: Math.round(Math.random() * 590),
                        y: 0,
                        w: 10,
                        h: 10
                    })
                    .color("pink")
                    .bind("EnterFrame", function () {
                        if (this.y < 590) {
                            this.y += 2;
                        }
                        // TODO: delete when falls below screen
                    });
            }
        });

    Crafty.c("Jump", {
        jump: function (target) {
            // Do nothing
            return;
        },
        init: function () {
            this.requires("2D");
        },
        Jump: function (func) {
            this.jump = func;
            return this;
        }
    });

    var player = (function () {
        var gravity = 0.001;
        var velocity = {
            x: 0,
            y: 0
        };

        return Crafty.e("DOM,Color,2D,Jump")
            .attr({
                x: 0,
                y: 0,
                w: 60,
                h: 90
            })
            .color("red")
            .bind("EnterFrame", function (e) {
                this.x += velocity.x*e.dt;
                this.y += velocity.y*e.dt+0.5*gravity*e.dt*e.dt;
                if (this.y >= 510) {
                    velocity.y = 0;
                    velocity.x = 0;
                    this.y = 510;
                } else {
                    velocity.y += gravity*e.dt;
                }
            })
            .Jump(function (target) {
                var yDiff, apexTiming;

                if (target.y < this.y) {
                    this.y -= 0.01;
                    yDiff = this.y + this.h - target.y;
                    velocity.y = -Math.sqrt(2 * gravity * yDiff);

                    apexTiming = Math.sqrt(2*yDiff/gravity);

                    velocity.x = (target.x - (this.x + this.w/2))/apexTiming;
                }
            });
    }());

    Crafty.e("Mouse,2D")
        .attr({
            x:0,
            y:0,
            w:600,
            h:600
        })
        .bind("MouseDown", function (e) {
            player.jump( {x: e.x, y: e.y} );
        });
}());
