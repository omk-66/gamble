import { Navbar } from "@/components/Navbar"
import { Card } from "@/components/ui/card"

interface GameLayoutProps {
  title: string
  children: React.ReactNode
}

export function GameLayout({ title, children }: GameLayoutProps) {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      <Navbar title={title} />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-[95%] max-w-7xl p-8 shadow-2xl border-primary/20 bg-background/50 backdrop-blur-sm">
          {children}
        </Card>
      </div>
    </div>
  )
} 