import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [betAmount, setBetAmount] = useState(1)
  const [gameState, setGameState] = useState<'idle' | 'playing'>('idle')
  const [multiplier, setMultiplier] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      // Make canvas responsive but smaller
      canvas.width = 600
      canvas.height = 400
      const ctx = canvas.getContext('2d')
      if (ctx) {
        let ballX = canvas.width / 2
        let ballY = 30
        let ballVelocityY = 6 // Increased vertical speed
        let ballVelocityX = (Math.random() - 0.5) * 8 // Increased horizontal speed

        // Draw buckets at bottom
        const drawBuckets = () => {
          const bucketWidth = canvas.width / 16
          ctx.fillStyle = '#444'
          for(let i = 0; i < 16; i++) {
            ctx.fillRect(i * bucketWidth, canvas.height - 30, bucketWidth - 2, 30)
            ctx.fillStyle = '#fff'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(`${i + 1}x`, i * bucketWidth + bucketWidth/2, canvas.height - 10)
          }
        }
        
        // Draw pegs in triangle formation
        const drawPegs = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.fillStyle = '#666'
          const pegSpacing = canvas.width / 16
          for(let row = 0; row < 8; row++) { // Reduced rows
            for(let col = 0; col <= row; col++) {
              const x = (canvas.width/2) - (row * pegSpacing/2) + (col * pegSpacing)
              const y = 80 + (row * pegSpacing)
              ctx.beginPath()
              ctx.arc(x, y, 3, 0, Math.PI * 2) // Smaller pegs
              ctx.fill()
            }
          }
          drawBuckets()
        }

        // Draw ball
        const drawBall = () => {
          ctx.beginPath()
          ctx.fillStyle = '#ff0000'
          ctx.arc(ballX, ballY, 6, 0, Math.PI * 2) // Smaller ball
          ctx.fill()
        }

        // Animation loop
        const animate = () => {
          if (gameState === 'playing') {
            drawPegs()
            drawBall()

            // Ball physics
            ballY += ballVelocityY
            ballX += ballVelocityX

            // Bounce off walls
            if (ballX < 6 || ballX > canvas.width - 6) {
              ballVelocityX *= -0.8
            }

            // Collision with pegs
            const pegSpacing = canvas.width / 16
            for(let row = 0; row < 8; row++) {
              for(let col = 0; col <= row; col++) {
                const pegX = (canvas.width/2) - (row * pegSpacing/2) + (col * pegSpacing)
                const pegY = 80 + (row * pegSpacing)
                const dx = ballX - pegX
                const dy = ballY - pegY
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 9) {
                  ballVelocityX = (Math.random() - 0.5) * 8
                  ballVelocityY = Math.abs(ballVelocityY)
                }
              }
            }

            // Reset when ball reaches bottom
            if (ballY > canvas.height - 30) {
              setGameState('idle')
              const bucketIndex = Math.floor(ballX / (canvas.width / 16))
              const finalMultiplier = Math.min(Math.max(bucketIndex + 1, 1), 16)
              setMultiplier(finalMultiplier)
            }
          }
          requestAnimationFrame(animate)
        }

        animate()
      }
    }
  }, [gameState])

  const startGame = () => {
    setGameState('playing')
  }

  return <div className='w-full min-h-screen bg-background flex flex-col'>
    <div className='flex-1 container mx-auto py-8'>
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-2">
          <CardTitle>Plinko Game</CardTitle>
          <CardDescription>Place your bet and watch the ball drop!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <canvas 
            id="canvas" 
            ref={canvasRef} 
            className="border border-primary/20 rounded-lg mx-auto w-full"
            style={{maxHeight: '400px'}}
          />
          <div className="flex gap-4">
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              placeholder="Bet amount"
              className="w-32"
            />
            <Button onClick={startGame} disabled={gameState === 'playing'}>
              Drop Ball
            </Button>
          </div>
          {multiplier > 1 && (
            <div className="text-center text-2xl font-bold">
              Multiplier: {multiplier}x
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
}
