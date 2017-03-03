var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 200;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 8;
var brickColumnCount = 5;
var brickWidth = 97.5;

var brickHeight = 20;
var brickPadding = 0.2;
var brickOffsetTop = 50;
var brickOffsetLeft = 10;
var score = 0;
var showStart = true;
var paddleColor = "#054DFF";
var lives = 3;
var speed = 6;


var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    playSound('sound-block');
                    if(score==10){
                       paddleWidth = 150;
                       paddleColor = 'green';
                       
                    }else if(score == 30){
                       lives ++;
                       paddleWidth = 100;
                       paddleColor = '#ccc';
                       
                    }
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function drawBall() {
    ctx.beginPath();
    //ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.rect(x,y,12,12);
    ctx.fillStyle = "#ccc";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
              
                 if(c < 1){
                    ctx.fillStyle = "#FF5733";
                  }else if(c < 2){
                    ctx.fillStyle = "#FFA005";
                  }else if(c < 3){ 
                    ctx.fillStyle = "#FFE633";
                  }else if(c < 4){
                    ctx.fillStyle = "#05FF6B";
                  }else{
                    ctx.fillStyle = "#05A4FF";
                  }

                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: "+score, 8, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            playSound('sound-paddle');
        }
        else {
            lives--;
            if(!lives) {
              alert("GAME OVER");
              document.location.reload();
            }else {
              x = canvas.width/2;
              y = canvas.height-30;
              dx = 2;
              dy = -2;
              paddleX = (canvas.width-paddleWidth)/2;
            }
            
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
  
}

function handleMouseClick(){
  showStart = false;
  setInterval(draw, speed);
}
function drawStart() {
    if(showStart == true){
      ctx.font = "15px Arial";
      ctx.fillStyle = "#fff";
      ctx.fillText("Click to start",canvas.width/2-40, canvas.height/2);
    }
    
}
drawStart();


function playSound(sound){
  const audio = document.querySelector("."+sound);
  audio.currentTime = 0;
  audio.play();
}





canvas.addEventListener('mousedown', handleMouseClick);
