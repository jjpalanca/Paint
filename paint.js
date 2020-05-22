/*
    Author: Jessmer John Palanca
    Section: CSC337 Web Programming SPRING2019, Homework 9
    Filename: paint.js
    Description: The js file for the paint.html
*/

'use strict';

(function() {
    /** -initializing global variables
      * -mousePressed tracks when the mouse is pressed or not
      * -lastXPos and lastYPos tracks the last coordinate position of the mouse
      * -penSize tracks the size of the pen, sets initially to 1
      * -penColor tracks the color of the pen that the user selected, sets initially to 'black'
      * -mode tracks which pen mode the user selected, sets initially to 'penMode'
    */
    let mousePressed = false;
    let lastXPos = 0;
    let lastYPos = 0;
    let penSize = 1;
    let penColor = "black";
    let mode = 'penMode';

    window.onload=function(){
        start();
        colorPickerCanvas();
        penSizeCanvas();
        choseColor();
        choseMode();
        chosePenSize();
        checkMouseEventOutsideCanvas();
    };
    
    /** This function checks and tracks the mouse events on the 'workAreCanvas' canvas.
    */
    function start(){
        let canvas = document.getElementById("workAreCanvas");
        let rect = canvas.getBoundingClientRect();
        // when mouse is pressed but not moved, sets the mousePressed to true but not
        // draw anything on the canvas.
        canvas.onmousedown = function(event){
            mousePressed = true;
            drawOnCanvas(event.clientX - rect.left, event.clientY - rect.top, false, mode);
        };
        // when the mouse is pressed and moved/dragged, it starts drawing on the canvas
        canvas.onmousemove = function(event){
            if(mousePressed){
                drawOnCanvas(event.clientX - rect.left, event.clientY - rect.top, true, mode);
            }
        };
        // if mouse is not pressed, sets the mousePressed back to false
        canvas.onmouseup = function(){
            mousePressed = false;
        };
        // if the mouse is hovered over, sets the last x and y-coordinates of the mouse
        // inside the canvas
        canvas.onmouseover = function(event){
            lastXPos = event.clientX - rect.left;
            lastYPos = event.clientY - rect.top;
        };
    }

    /** This function get called when the mouse is inside the workAreCanvas, the mouse is
      * pressed and moved/dragged, then starts drawing on the canvas.
    */
    function drawOnCanvas(x, y, mouseIsPressed, mode){
        // when the mouse is pressed and moved/dragged
        if(mouseIsPressed){
            let canvas = document.getElementById("workAreCanvas");
            let context = canvas.getContext("2d");
            context.beginPath();
            context.lineWidth = penSize;
            context.strokeStyle = penColor;
            // when the user selects pen mode, draws on canvas using a regular pen
            if(mode == 'penMode'){
                context.moveTo(lastXPos, lastYPos);
                context.lineTo(x, y);
                context.closePath();
                context.stroke();
            }
            // when the user selects circles mode, circles are drawn along the mouse's path
            else if(mode == 'circlesMode'){
                context.arc(x, y, penSize / 2, 0, 2 * Math.PI);
                context.stroke();
            }
            // when the user selects squares mode, squares are drawn along the mouse's path
            else if(mode == 'squaresMode'){
                context.rect(x, y, penSize, penSize);
                context.stroke();
            }
            // when the user selects lines mode, : lines are drawn from the upper left hand
            // corner of the canvas to where the mouse is.
            else if(mode == 'linesMode'){
                context.moveTo(0,0);
                context.lineTo(x, y);
                context.stroke();
            }
        }
        lastXPos = x;
        lastYPos = y;
    }

    /** This function sets the color picker canvas to allow the user to pick the pen color.
      * The color picker is composed of colored and black-and-white gradients. The colored gradient
      * is positioned horizontally and the black-and-white gradient is positioned vertically and
      * is partly transparent.
    */
    function colorPickerCanvas(){
        // colored gradient
        let colorPickerCanvas = document.getElementById("ColorPickerCanvas");
        let coloredCtx = colorPickerCanvas.getContext("2d");
        let coloredGradient = coloredCtx.createLinearGradient(0,0,100,0);
        coloredGradient.addColorStop(0, "rgb(255, 0, 0)");
        coloredGradient.addColorStop(0.15, "rgb(255, 0, 255)");
        coloredGradient.addColorStop(0.33, "rgb(0, 0, 255)");
        coloredGradient.addColorStop(0.49, "rgb(0, 255, 255)");
        coloredGradient.addColorStop(0.67, "rgb(0, 255, 0)");
        coloredGradient.addColorStop(0.84, "rgb(255, 255, 0)");
        coloredGradient.addColorStop(1, "rgb(255, 0, 0)");
        coloredCtx.fillStyle = coloredGradient;
        coloredCtx.fillRect(0,0,100,100);
        // black-and-white gradient
        let colorPickerCanvas2 = document.getElementById("ColorPickerCanvas");
        let blackWhiteCtx = colorPickerCanvas2.getContext("2d");
        let blackWhiteGradient = blackWhiteCtx.createLinearGradient(0,0,0,100);
        blackWhiteGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        blackWhiteGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        blackWhiteGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        blackWhiteGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        blackWhiteCtx.fillStyle = blackWhiteGradient;
        blackWhiteCtx.fillRect(0,0,100,100);
    }

    /** This function controls the behavior of the 'PenCanvas' canvas.
      * This canvas contains a circle/round shape representation of the tip of the pen.
      * The size and color of the circle changes when the size button controls are pressed
      * and a color is selected.
    */
    function penSizeCanvas(){
        let canvas = document.getElementById("PenCanvas");
        let context = canvas.getContext("2d");
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;
        let radius = penSize / 2;
        context.clearRect(0,0,context.canvas.width, context.canvas.height);
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.fillStyle = penColor;
        context.fill();
        context.strokeStyle = penColor;
        context.stroke();
    }

    /** This function gathers the pixel data where the mouse was clicked in the color picker canvas.
      * The data gathered is assigned as the new value for the pen color.
    */
    function choseColor(){
        let canvas = document.getElementById("ColorPickerCanvas");
        canvas.onclick = function(event){
            let rect = canvas.getBoundingClientRect();
            let ctx = canvas.getContext("2d");
            let pxdata = ctx.getImageData(event.clientX - rect.left,
                        event.clientY - rect.top, 1, 1).data;
            penColor = "rgb(" + pxdata[0] + ", " + pxdata[1] + ", " + pxdata[2] + ")";
            // updates the PenCanvas
            penSizeCanvas();
        };
    }

    /** This function checks which mode was selected by the user and sets the selected mode to
      * the variable mode.
    */
    function choseMode(){
        document.getElementById("pen").onclick = function(){
            mode = 'penMode';
        };
        document.getElementById("circles").onclick = function(){
            mode = 'circlesMode';
        };
        document.getElementById("squares").onclick = function(){
            mode = 'squaresMode';
        };
        document.getElementById("lines").onclick =  function(){
            mode = 'linesMode';
        };
        // clearing the canvas
        document.getElementById("clear").onclick = clearCanvas;
    }

    /** This function changes the penSize variable whenever the plus or minus buttons
      * is pressed. It increments the pen size when plus button is pressed, and decrements
      * the size of the pen when mins button is pressed (decrements to a minimum size of`1)
    */
    function chosePenSize(){
        document.getElementById("plus").onclick = function(){
            penSize++;
            // updating the contents of the penSizeCanvas
            penSizeCanvas();
        };
        document.getElementById("minus").onclick = function(){
            if (penSize > 1){
                penSize--;
            }
            penSizeCanvas();
        };
    }

    /** This function clears the contents of the canvas.
    */
    function clearCanvas(){
        let canvas = document.getElementById("workAreCanvas");
        let context = canvas.getContext("2d");
        context.clearRect(0,0,context.canvas.width, context.canvas.height);
    }

    /** This function checks the mouse behavior outside the canvas. If the button
      * is not pressed, sets the mousePressed to false. This prevents a bug from happening
      * where a user draws inside the canvas, holdng the mouse down, then move the mouse
      * outside the canvas and release the mouse, the pen should not continue drawing
      * in the canvas once the user moves the mouse back into the canvas since the
      * mouse was released outside the canvas.
    */
    function checkMouseEventOutsideCanvas(){
        let mouseOutsideCanvas = document.getElementById("html");
        mouseOutsideCanvas.onmouseup = function() {
            mousePressed = false;
        };
    }
})();
