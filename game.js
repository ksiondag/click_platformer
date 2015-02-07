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
        var gravity = 0.5;
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
                this.x += velocity.x/2;
                this.y += velocity.y/2;
                if (this.y >= 510) {
                    velocity.y = 0;
                    velocity.x = 0;
                    this.y = 510;
                } else {
                    velocity.y += gravity;
                }
                this.x += velocity.x/2;
                this.y += velocity.y/2;
            })
            .Jump(function (target) {
                var y_diff;

                if (target.y < this.y) {
                    y_diff = this.y - target.y;
                    velocity.y = -Math.sqrt(2 * gravity * y_diff);
                    this.y -= 1;

                    velocity.x = (target.x - this.x)/30;
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
