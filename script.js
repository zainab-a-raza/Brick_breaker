const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let bricks =[];
let rows = 4
let columns = 8
let score=0;
let gameoff = false;
let frameid;

const img = document.getElementById('source')
const paddleimg = document.getElementById('paddlepng')
const win = document.getElementById('win')
const lost = document.getElementById('lose')
const intro = document.getElementById('intro')
const start = document.getElementById('start')
const wall = document.getElementById('bricks')
const restart = document.getElementById('restart')
const bg= document.getElementById('bg')


for(let i=0;i<rows;i++){
    bricks[i] = []; 
    for(let j=0;j<columns;j++){
        bricks[i][j] = 1;
    }
}

let block={
    gap: 12,
    initialx: 5,
    initialy: 5,
    width: 100,
    height: 30
}

let ball={
    x: 300,
    y: 400,
    size:15,
    dx:5,
    dy:5
}

function displayball(){
    ctx.fillStyle = 'rgb(239, 54, 17)';
    ctx.beginPath();
    ctx.moveTo(ball.x,ball.y);
    ctx.arc(ball.x,ball.y,ball.size,Math.PI*2,false);
    ctx.fill();
}

function moveball(){
    ball.x += ball.dx;
    ball.y += ball.dy
}

let paddle={
    x: 500,
    y: 700,
    width: 100,
    height: 30,
    dx:0,
    speed:10
}

function displaypaddle(){
    ctx.drawImage(paddleimg,paddle.x,paddle.y,paddle.width,paddle.height)
}

function movepaddleright(){
    paddle.dx = paddle.speed
}

function movepaddleleft(){
    paddle.dx = -paddle.speed
}

function movepaddle(){
    paddle.x += paddle.dx;
    paddlewallcollision();
}

function paddlewallcollision(){
    if(paddle.x< 0){
        paddle.x=0;
    }else if((paddle.x+paddle.width > canvas.width) ){
        paddle.x= canvas.width-paddle.width;
    }
}

function keyDown(e){
    if(e.key === 'Left' || e.key === 'ArrowLeft'){
        movepaddleleft();
    }else if(e.key === 'Right' || e.key === 'ArrowRight'){
        movepaddleright();
    }
}

function keyUp(e){
    if(e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'Right' || e.key === 'ArrowRight'){
        paddle.dx =0;
    } 
}


function ballwallcollision(){
    if(ball.x+ball.size>canvas.width || ball.x < 0){
        ball.dx *= -1;
    }
    
    if(ball.y<0){
        ball.dy *= -1;
    }
}


function displaybrick(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            if(bricks[i][j] === 1){
                ctx.drawImage(img,j*(block.width+block.gap),i*(block.height+block.gap),100,30);
            } 
        }
    }
}

function ballbrickcollision(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<columns;j++){
            if(bricks[i][j]===1){
                let brickx = j*(block.width+block.gap)
                let bricky = i*(block.height+block.gap)
                if(
                    (ball.x+ball.size>=brickx 
                    && ball.x-ball.size<=brickx + block.width
                    && ball.y+ball.size>=bricky &&ball.y-ball.size<=bricky+block.height)
                ){
                    bricks[i][j] = 0;
                    score+=1
                    if(ball.x+ball.size>=brickx && ball.x-ball.size<=brickx+block.width && (ball.y>bricky+block.height||ball.y<bricky-ball.size)){
                        ball.dy*=-1;
                    }
                    else{
                        ball.dx*=-1;
                    }


                } 
            }
        }
    }
}

function ballpaddlecollision(){
    if(ball.x+ball.size>=paddle.x && ball.x-ball.size<=paddle.x+paddle.width && ball.y+ball.size === paddle.y){
        ball.dy *= -1;
    }
}



function gameover(){
    if(ball.y+ball.size>canvas.height){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.font ='60px Arial'
        ctx.fillStyle = 'black'
        ctx.drawImage(lost,280,200,350,200)
        ctx.drawImage(restart,370,420,180,60)
        gameoff =true;
        document.addEventListener('click',restartgame);
    }
}

function wincheck(){
    if(score === rows*columns){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(win,280,200,350,200)
        ctx.drawImage(restart,370,420,180,60)
        gameoff =true;
        document.addEventListener('click',reload);
    }
}

function reload(){
    location.reload()
}

function displayscore(){
    ctx.font ='24px Arial'
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.fillText("Score: " + score,15,750)
}

function update(){
    if (gameoff) return;
    document.removeEventListener('click',startgame);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(bg,0,0,900,800)
    displayscore();
    displaybrick();
    displaypaddle();
    movepaddle();
    displayball();
    moveball();
    ballwallcollision();
    ballpaddlecollision();
    ballbrickcollision()
    gameover();
    wincheck();
    frameid = requestAnimationFrame(update);
}

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);

if(gameoff=== false){
    document.addEventListener('click',startgame);
}

    ctx.font ='60px Arial'
    ctx.fillStyle = 'Black'
    ctx.drawImage(intro,290,150,300,200)
    ctx.drawImage(start,350,380,170,60)




function startgame(e){
    if (gameoff===false && (e.offsetX>=350 && e.offsetX<=350+170  && e.offsetY >= 380 && e.offsetY<=380+60)){
        update()
    }    
}
function restartgame(e){
    
    if(e.offsetX>=370 && e.offsetX<=370+180  && e.offsetY >= 420 && e.offsetY<=420+60){
        cancelAnimationFrame(frameid)
        reset()
        gameoff =false
        document.removeEventListener('click',restartgame)
        update()
    }
}

function reset(){
    for(let i=0;i<rows;i++){
        bricks[i] = []; 
        for(let j=0;j<columns;j++){
            bricks[i][j] = 1;
        }
    }
    score= 0;
    paddle.dx =0;
    paddle.speed =10;
    paddle.x=500;
    paddle.y=700;
    ball.dx= 5;
    ball.dy=5;
    ball.x =300;
    ball.y=400;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
