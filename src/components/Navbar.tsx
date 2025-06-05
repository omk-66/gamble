import { motion } from "framer-motion"
import useAmountStore from "@/store/amount.store"
import React from "react"
import { Link } from "@tanstack/react-router"

interface NavbarProps {
  title: string
}

export function Navbar({ title }: NavbarProps) {
  const { balance } = useAmountStore()
  const [gameResult, setGameResult] = React.useState<'win' | 'loss' | null>(null)

  return (
    <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link to="/">
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text"
          animate={{ 
            backgroundSize: ["100% 100%", "200% 100%"],
            backgroundPosition: ["0% 0%", "100% 0%"]
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          {title}
        </motion.h1></Link>
        <motion.div 
          className="flex items-center gap-4 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5"
          whileHover={{ scale: 1.02, boxShadow: "0 8px 32px -8px rgba(var(--primary), 0.2)" }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-muted-foreground">Balance:</span>
          <motion.span 
            key={balance}
            initial={{ scale: 1.2, color: gameResult === 'win' ? '#22c55e' : '#ef4444' }}
            animate={{ scale: 1, color: 'white' }}
            className="text-2xl font-bold"
          >
            ${balance.toFixed(2)}
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
} 