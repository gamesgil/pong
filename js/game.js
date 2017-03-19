if (!window.Gil) {
	window.Gil = {}
}

window.onload = function() {
    const READY         = "ready"
    const PLAYING       = "playing"
    const PAUSED        = "paused"
    const OUT_OF_BOUNDS = "outOfBounds"
    const GAME_OVER		= "gameOver"
    
    let status = PAUSED
    
	Gil.Controller = (function() {
       return {
           init: () => {
               Gil.View.init()
               
               let t = new Timer()
               t.start(3, function(sec) {
                   status = PLAYING
				   
				   Gil.View.setText("")
               })
			   
			   setInterval(function() {
				   Gil.View.update(Gil.Game.getPlayerScore(), Gil.Game.getCpuScore())
			   }, 1000 / 30)
           },
		   
		   waitBeforeProceed: () => {
			   if (status !== GAME_OVER) {
				   const t = new Timer()
				   t.start(3, function() {
					   Gil.View.resetBall()
					   Gil.View.setText("")

					   status = PLAYING
				   })
			   }
		   },
		   
		   playerScores: () => {
			   Gil.Game.addPlayerScore(1)
			   Gil.Controller.checkGameOver()
		   },
		   
		   cpuScores: () => {
			   Gil.Game.addCpuScore(1)
			   Gil.Controller.checkGameOver()
		   },
		   
		   checkGameOver: () => {
			   if (Gil.Game.getPlayerScore() === 3 || Gil.Game.getCpuScore() === 3) {
				   status = GAME_OVER
				   
				   if (Gil.Game.getPlayerScore() > Gil.Game.getCpuScore()) {
					   Gil.View.setText("Player Wins. Game Over!")
				   }
				   else {
					   Gil.View.setText("CPU Wins. Game Over!")
				   }
			   }
			   else {
				   throw new Error("")
				   status = OUT_OF_BOUNDS
				   
				   Gil.View.setText("Get Ready...")
			   }
		   }
       }
       
	   
   }())
	
    Gil.View = (function() {
       const canvas         = document.getElementById("canvas")
       const ctx            = canvas.getContext("2d")
       let BALL_SIZE      	= canvas.width / 40
       let PADDLE_X       	= canvas.width / 10
       let PADDLE_WIDTH   	= canvas.width / 50
       let PADDLE_HEIGHT 	= canvas.height / 4
       
       let paddlePlayerY    = (canvas.height - PADDLE_HEIGHT) / 2
       let paddleCpuY       = paddlePlayerY
       let ballPos          = {x: 0, y: 0}
       let ballSpeed        = {x: 15, y: 15}
       let ballDir          = {x: -1, y: 1}
	   let paddleCpuSpeed   = 4
	   let text				= "Get Ready!"
	   
       function update(playerScore, cpuScore) {
           let nextBallX = status === PLAYING ? ballPos.x + ballDir.x * ballSpeed.x : ballPos.x
           let nextBallY = status === PLAYING ? ballPos.y + ballDir.y * ballSpeed.y : ballPos.y
               
           ~function refresh() {
               ctx.clearRect(0, 0, canvas.width, canvas.height)
               ctx.fillStyle = "black"
               ctx.fillRect(0, 0, canvas.width, canvas.height)
               
			   Gil.Gui.drawPlayfield()
			   Gil.Gui.drawScore(playerScore, cpuScore)
			   Gil.Gui.drawText(text)
           }()
           
           ~function drawPlayerPaddle() {
               ctx.fillStyle = "white"
               ctx.fillRect(PADDLE_X, paddlePlayerY, PADDLE_WIDTH, PADDLE_HEIGHT)
           }()
           
           ~function drawCpuPaddle() {
               ctx.fillStyle = "white"
               ctx.fillRect(canvas.width - PADDLE_X, paddleCpuY, PADDLE_WIDTH, PADDLE_HEIGHT)
               
               if (status === PLAYING) {
                   if (paddleCpuY + PADDLE_HEIGHT / 2 < nextBallY) {
                       paddleCpuY += paddleCpuSpeed
                   }
                   else if (paddleCpuY + PADDLE_HEIGHT / 2 > nextBallY) {
                       paddleCpuY -= paddleCpuSpeed
                   }
               }
                   
           }()

		   ~function drawBall() {
			   if (status === PLAYING) {
			   	ctx.fillStyle = "white"
			   	ctx.fillRect(ballPos.x, ballPos.y, BALL_SIZE, BALL_SIZE)
			   
			   
			   ~function checkBoundsX() {
				   if ((nextBallX > canvas.width - BALL_SIZE) || (nextBallX < 0)) {
					   if (nextBallX > canvas.width - BALL_SIZE) {
						   Gil.Controller.playerScores()
					   }
					   else {
						   Gil.Controller.cpuScores()
						   
					   }

					   Gil.Controller.waitBeforeProceed()
				   }
			   }()
				}
               
               ~function checkBoundsY() {
                   if ((nextBallY > canvas.height - BALL_SIZE / 2) || (nextBallY < 0)) {
                       if (nextBallY > canvas.height - BALL_SIZE) {
                           nextBallY = canvas.height - BALL_SIZE
                       }
                       else {
                           nextBallY = 0
                       }

                       ballDir.y = -ballDir.y
                   }
               }()
               
               ~function checkPaddleCollision() {
                   let refPaddleX, refPaddleY
                   
                   if (nextBallX < canvas.width / 2) {
                       refPaddleX = PADDLE_X + PADDLE_WIDTH
                       refPaddleY = paddlePlayerY
                       
                       if (nextBallX <= refPaddleX && nextBallY >= refPaddleY && nextBallY <= refPaddleY + PADDLE_HEIGHT) {
                           nextBallX = refPaddleX
                           ballDir.x = 1
                           
                           if (nextBallY <= refPaddleY + PADDLE_HEIGHT / 2) {
                               ballDir.y = -1
                           }
                           else {
                               ballDir.y = 1
                           }
                           
                           ballSpeed.x += 0.5
                           ballSpeed.y += 0.5
                       }
                   }
                   else {
                       refPaddleX = canvas.width - PADDLE_X
                       refPaddleY = paddleCpuY
                       
                       if (nextBallX >= refPaddleX && nextBallY >= refPaddleY && nextBallY <= refPaddleY + PADDLE_HEIGHT) {
                           nextBallX = refPaddleX
                           ballDir.x = -1
                           
                           if (nextBallY <= refPaddleY + PADDLE_HEIGHT / 2) {
                               ballDir.y = -1
                           }
                           else {
                               ballDir.y = 1
                           }
                           
                           ballSpeed.x += 0.5
                           ballSpeed.y += 0.5
                       }
                   }
                }()
               
               ballPos.x = nextBallX
               ballPos.y = nextBallY
           }()
		   }
		
       function onMouseMove(e) {
           if (status === PLAYING) {
			   
               paddlePlayerY = e.offsetY
           }
       }
       
       
       return {
           init: () => {
			  canvas.style.width='100%';
			  canvas.style.height='100%';
			  canvas.width  = canvas.offsetWidth;
			  canvas.height = canvas.offsetHeight;
			   
			   Gil.Gui.init(canvas, ctx)
			   
			   Gil.View.resetBall()
			   
               document.addEventListener("mousemove", onMouseMove)
           },
		   
		   update: (playerScore, cpuScore, text) => {update(playerScore, cpuScore, text)},
		   
		   resetBall: () => {
			   ballSpeed = {x: 5, y: 5}
			   ballPos = {x: (canvas.width - BALL_SIZE) / 2, y: (canvas.height - BALL_SIZE) / 2}
		   },
		   
		   setText: (str) => {text = str}
		   
       }
    }())
   
   
   Gil.Game = (function() {
	   let playerScore = 0
	   let cpuScore = 0
	   
	   return {
		   addPlayerScore: (score) => {playerScore += score},
		   getPlayerScore: () => playerScore,
		   addCpuScore: (score) => {cpuScore += score},
		   getCpuScore: () => cpuScore
	   }
   }())
   
   Gil.Controller.init()
}

