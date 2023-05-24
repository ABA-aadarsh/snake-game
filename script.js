const canvas=document.querySelector("#canvas")
const c=canvas.getContext("2d")
const scoreCard=document.querySelector("#score")
const canvasDimension={
    width:500,
    height:400,
    block:20
}
canvas.width=canvasDimension.width
canvas.height=canvasDimension.height
c.fillStyle="black"
c.fillRect(0,0,canvasDimension.width,canvasDimension.height)
c.globalAlpha=1
class SNAKE {
    constructor(){
        this.dead=false
        this.body=[
            {
                x:5,
                y:5,
                vx:1,
                vy:0
            },
            {
                x:4,
                y:5,
                vx:1,
                vy:0
            },
            {
                x:3,
                y:5,
                vx:1,
                vy:0
            }
        ]
        this.food={
            x:Math.floor(Math.random()*(canvasDimension.width/canvasDimension.block)+1),
            y:Math.floor(Math.random()*(canvasDimension.height/canvasDimension.block)+1),
            positionChanged:false
        }
        this.directionChange=false
        this.color="#29ad15"
        this.count=0
        this.score=0
    }
    update(){
        if(this.count%10==0 && this.dead==false){
            this.body[0].x+=this.body[0].vx
            this.body[0].y+=this.body[0].vy
            for(let i=1;i<this.body.length;i++){
                this.body[i].x+=this.body[i].vx
                this.body[i].y+=this.body[i].vy

                this.body[i].vx=this.body[i-1].x-this.body[i].x
                this.body[i].vy=this.body[i-1].y-this.body[i].y
            }
            this.directionChange=false
            // if the snake head eat the food
            if(this.body[0].x==this.food.x && this.body[0].y==this.food.y){
                this.food.positionChanged=true
                this.incrementScore()
                this.appendBody()
            }
            if(this.body[0].x>(canvasDimension.width/canvasDimension.block) || this.body[0].x<0 || this.body[0].y<0 || this.body[0].y>(canvasDimension.height/canvasDimension.block) ){
                // if the snake strikes to the border
                this.dead=true
                this.die()
            }else{
                for(let i=1;i<this.body.length;i++){
                    if(this.body[0].x==this.body[i].x && this.body[0].y==this.body[i].y){
                        // if the snake bite its own body
                        this.dead=true
                        this.die()
                        break
                    }
                }
            }
        }
        this.count+=1
    }
    incrementScore(){
        this.score+=1
        scoreCard.innerHTML=this.score
    }
    die(){
        const n=this.body.length
        for(let i=0;i<n;i++){
            this.body.pop()
        }
    }
    draw(){
        for(let i=this.body.length-1;i>=0;i--){
            c.fillStyle=this.color
            c.fillRect((this.body[i].x-1)*canvasDimension.block,(this.body[i].y-1)*canvasDimension.block,canvasDimension.block,canvasDimension.block)
            if(i==0){
                // making the head of the snake distinguished from body
                c.beginPath()
                c.arc((this.body[i].x-1)*canvasDimension.block+canvasDimension.block/2,(this.body[i].y-1)*canvasDimension.block+canvasDimension.block/2, 2, 0, 2 * Math.PI)
                c.strokeStyle="white"
                c.stroke()
                c.fillStyle="white"
                c.fill()
            }
        }
    }
    appendBody(){
        this.body.push(
            {
                x:this.body[this.body.length-1].x-this.body[this.body.length-1].vx,
                y:this.body[this.body.length-1].y-this.body[this.body.length-1].vy,
                vx:this.body[this.body.length-1].vx,
                vy:this.body[this.body.length-1].vy
            }
        )
    }
    foodLogic(){
        // draw food
        c.fillStyle="red"
        c.fillRect((this.food.x-1)*canvasDimension.block+3,(this.food.y-1)*canvasDimension.block+3,canvasDimension.block-6,canvasDimension.block-6)
        // if snake it food, the position of food changes
        if(this.food.positionChanged==true){
            this.food.x=Math.floor(Math.random()*(canvasDimension.width/canvasDimension.block)+1)
            this.food.y=Math.floor(Math.random()*(canvasDimension.height/canvasDimension.block)+1)
            this.food.positionChanged=false
        }
    }
}
const snake=new SNAKE()
const drawLine=(position, vector, color="black", style="solid",width=1)=>{
    c.beginPath();
    c.lineWidth=width
    c.moveTo(position.x,position.y);
    c.lineTo(position.x+vector.x,position.y+vector.y);
    c.strokeStyle=color
    if(style=="solid"){
        c.setLineDash([])
    }else if(style=="dotted"){
        c.setLineDash([5,15])
    }
    c.stroke(); 
}
const setgrid=()=>{
    for(let i=0;i<=(canvasDimension.height/canvasDimension.block);i++){
        drawLine({x:0,y:i*canvasDimension.block},{x:canvasDimension.width,y:0},"white")
        // drawLine({x:0,y:i*20},{x:canvasDimension.width,y:0},"#f5f7f1")
    }
    for(let i=0;i<=(canvasDimension.width/canvasDimension.block);i++){
        drawLine({x:i*canvasDimension.block,y:0},{x:0,y:canvasDimension.height},"white")
        // drawLine({x:i*20,y:0},{x:0,y:canvasDimension.height},"#f5f7f1")
    }
}
const animate=()=>{
    window.requestAnimationFrame(animate)
    c.clearRect(0,0,canvasDimension.width,canvasDimension.height)
    c.fillStyle="black"
    c.fillRect(0,0,canvasDimension.width,canvasDimension.height)
    setgrid()
    snake.foodLogic()
    snake.draw()
    snake.update()
}
animate()
window.addEventListener("keyup",(e)=>{
    e.preventDefault()
    const key=e.key
    switch(key){
        case "ArrowUp":
            if(snake.body[0].vy==0 && snake.directionChange==false){
                snake.body[0].vy=-1
                snake.body[0].vx=0
                snake.directionChange=true
            }
            break
        case "ArrowDown":
            if(snake.body[0].vy==0 && snake.directionChange==false){
                snake.body[0].vy=1
                snake.body[0].vx=0
                snake.directionChange=true
            }
            break
        case "ArrowRight":
            if(snake.body[0].vx==0 && snake.directionChange==false){
                snake.body[0].vx=1
                snake.body[0].vy=0
                snake.directionChange=true
            }
            break
        case "ArrowLeft":
            if(snake.body[0].vx==0 && snake.directionChange==false){
                snake.body[0].vx=-1
                snake.body[0].vy=0
                snake.directionChange=true
            }
            break
        default:
            break
    }
})