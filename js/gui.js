if (!window.Gil) {
	window.Gil = {}
}

Gil.Gui = (function() {
	let canvas, ctx
	
	return {
		init: ($canvas, $context) => {
			canvas = $canvas
			ctx = $context
		},
		
		drawPlayfield: () => {
			const LINE_WIDTH     = 4
			const LINE_HEIGHT    = 16

			ctx.setLineDash([LINE_HEIGHT, LINE_HEIGHT])
			ctx.strokeStyle = "grey"
			ctx.lineWidth = LINE_WIDTH
			ctx.beginPath()
			ctx.moveTo((canvas.width - LINE_WIDTH) / 2, 0)
			ctx.lineTo((canvas.width - LINE_WIDTH) / 2, canvas.height)
			ctx.stroke()
		},
		
		drawScore: (playerScore, CpuScore) => {
			ctx.font = "1em Arial"
			ctx.fillStyle = "white"
			
			let fontSize = ctx.font.split(" ")[0].replace("px", "")
			ctx.fillText(playerScore, canvas.width / 4 - fontSize / 2, 20)
			ctx.fillText(CpuScore, 3 * canvas.width / 4 - fontSize / 2, 20)
		},
		
		drawText: (str) => {
			ctx.font = "2em Arial"
			ctx.fillStyle = "white"
			
			ctx.fillText(str, (canvas.width - ctx.measureText(str).width) / 2, (canvas.height - 0) / 2)
		}
			   
			   
	}
}())