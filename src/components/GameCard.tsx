import { Card } from "./ui/card"
import { Separator } from "./ui/separator"
import { BetForm } from "./BetForm"
import { GameVisualizer } from "./GameVisualizer"

interface GameCardProps {
  title: string
  description: string
  onSubmit: (betAmount: number) => void
}

export function GameCard({ title, description, onSubmit }: GameCardProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="w-[95%] max-w-7xl p-8 shadow-2xl border-primary/20 bg-background/50 backdrop-blur-sm">
        <div className="grid grid-cols-12 gap-8">
          {/* Form Column - 1/3 width */}
          <div className="col-span-12 md:col-span-4 space-y-6">
            <BetForm 
              title={title}
              description={description}
              onSubmit={onSubmit}
            />
          </div>

          <Separator orientation="vertical" className="mx-auto h-full hidden md:block bg-primary/30" />

          {/* Game Column - 2/3 width */}
          <div className="col-span-12 md:col-span-7 flex items-center">
            <GameVisualizer />
          </div>
        </div>
      </Card>
    </div>
  )
} 