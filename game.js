/*jslint browser: true */
/*global Crafty: false */
(function () {
    "use strict";
    var currentTime, newSecond, gameWidth, gameHeight, player;

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
            }
            return false;
        };
    }());

    gameWidth = 600;
    gameHeight = 600;

    Crafty.init(gameWidth, gameHeight, document.getElementById("game"));

    Crafty.e("Generator")
        .bind("EnterFrame", function () {
            var blossom = {
                x: 0,
                y: 0,
                w: 10,
                h: 10,
                v: 2
            },
            maxX = gameWidth - blossom.w,
            maxY = gameHeight - blossom.h;

            if (newSecond()) {
                blossom.x = Math.round(Math.random() * maxX);
                Crafty.e("DOM,Color,2D")
                    .attr({
                        x: blossom.x,
                        y: blossom.y,
                        w: blossom.w,
                        h: blossom.h
                    })
                    .color("pink")
                    .bind("EnterFrame", function () {
                        if (this.y < maxY) {
                            this.y += blossom.v;
                        }
                        // TODO: delete when falls below screen
                    });
            }
        });

    Crafty.c("Jump", {
        jump: function () {
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

    player = (function () {
        var gravity = 0.001,
            velocity = {
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
                this.x += velocity.x * e.dt;
                this.y += velocity.y * e.dt + 0.5 * gravity * e.dt * e.dt;
                if (this.y >= 510) {
                    velocity.y = 0;
                    velocity.x = 0;
                    this.y = 510;
                } else {
                    velocity.y += gravity * e.dt;
                }

                if (this.x >= 540) {
                    velocity.x = 0;
                    this.x = 540;
                } else if (this.x <= 0) {
                    velocity.x = 0;
                    this.x = 0;
                }
            })
            .Jump(function (target) {
                var yDiff, apexTiming;

                if (target.y < this.y + this.h) {
                    yDiff = this.y + this.h - target.y;
                    velocity.y = -Math.sqrt(2 * gravity * yDiff);

                    apexTiming = Math.sqrt(2 * yDiff / gravity);

                    velocity.x = (target.x - (this.x + this.w / 2)) / apexTiming;
                }
            });
    }());

    Crafty.e("Mouse,2D")
        .attr({
            x: 0,
            y: 0,
            w: gameWidth,
            h: gameHeight
        })
        .bind("MouseDown", function (e) {
            player.jump({
                x: e.realX,
                y: e.realY
            });
        });
}());
