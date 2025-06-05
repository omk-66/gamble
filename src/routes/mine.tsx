import { createFileRoute } from '@tanstack/react-router'
import { Toaster, toast } from 'sonner'
import { Card,CardContent,CardFooter,CardHeader, CardTitle,CardDescription } from '@/components/ui/card'
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bomb, Diamond } from "lucide-react"
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { useAmountStore } from "@/store/amount.store"

const formSchema = z.object({
    betAmount: z.coerce.number().min(1).max(1000),
    mines: z.coerce.number().min(1).max(24),
})

export const Route = createFileRoute('/mine')({
    component: MineComponent,
})

function MineComponent() {
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle')
    const [revealedCells, setRevealedCells] = useState<number[]>([])
    const [minePositions, setMinePositions] = useState<number[]>([])
    const [currentWinnings, setCurrentWinnings] = useState(0)

    const { addToBalance, subtractFromBalance } = useAmountStore()
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            betAmount: 1,
            mines: 3,
        },
    })

    const calculateWinChance = (mines: number) => {
        return ((25 - mines) / 25 * 100).toFixed(2)
    }

    const calculatePotentialPayout = (betAmount: number, mines: number) => {
        const multiplier = 1 / (25 - mines) * 24
        return (betAmount * multiplier).toFixed(2)
    }

    const watchMines = form.watch('mines')
    const watchBetAmount = form.watch('betAmount')

    function onSubmit(values: z.infer<typeof formSchema>) {
        const mineCount = values.mines
        const positions: number[] = []
        while (positions.length < mineCount) {
            const pos = Math.floor(Math.random() * 25)
            if (!positions.includes(pos)) {
                positions.push(pos)
            }
        }
        setMinePositions(positions)
        setGameState('playing')
        setRevealedCells([])
        setCurrentWinnings(0)
        toast.info('Game started! Good luck!')
    }

    const handleCashout = () => {
        if (gameState === 'playing' && currentWinnings > 0) {
            const profit = currentWinnings - watchBetAmount
            const multiplier = (currentWinnings / watchBetAmount).toFixed(2)
            addToBalance(currentWinnings)
            setRevealedCells([...Array(25).keys()]) // Reveal all cells
            toast.success(`Cashed out with ${multiplier}x! Profit: $${profit.toFixed(2)}`)
            setGameState('idle')
            setMinePositions([])
            setCurrentWinnings(0)
        }
    }

    const handleCellClick = (index: number) => {
        if (gameState !== 'playing') return
        
        if (minePositions.includes(index)) {
            setGameState('lost')
            setRevealedCells([...Array(25).keys()]) // Reveal all cells
            subtractFromBalance(watchBetAmount)
            toast.error(`Game Over! You lost $${watchBetAmount}`)
            setTimeout(() => {
                setGameState('idle')
            }, 2000)
        } else {
            const newRevealed = [...revealedCells, index]
            setRevealedCells(newRevealed)
            
            // Calculate new winnings
            const newWinnings = parseFloat(watchBetAmount.toString()) * (newRevealed.length * 0.1 + 1)
            setCurrentWinnings(newWinnings)
            
            if (newRevealed.length === 25 - minePositions.length) {
                setGameState('idle')
                setRevealedCells([...Array(25).keys()]) // Reveal all cells
                toast.success(`Congratulations! You won $${newWinnings.toFixed(2)}!`)
            }
        }
    }

    return (
        <div className='w-full min-h-screen bg-background flex flex-col'>
            <div className='flex-1 container mx-auto py-8'>
                <Toaster position="top-center" richColors />
                <Card className="w-[95%] max-w-7xl p-8 shadow-2xl border-primary/20 bg-background/50 backdrop-blur-sm mx-auto">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Form Column - 1/3 width */}
                        <div className="col-span-12 md:col-span-4 space-y-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <CardHeader className="px-0 pt-0">
                                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">Mine Game</CardTitle>
                                            <CardDescription>Place your bet and avoid the mines</CardDescription>
                                        </CardHeader>
                                    </motion.div>
                                    <CardContent className="px-0">
                                        {/* ... Rest of the form fields remain the same ... */}
                                        {gameState === 'playing' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4"
                                            >
                                                <Button
                                                    type="button"
                                                    onClick={handleCashout}
                                                    className="w-full bg-green-500 hover:bg-green-600"
                                                    disabled={currentWinnings === 0}
                                                >
                                                    Cash Out ${(currentWinnings - watchBetAmount).toFixed(2)} ({(currentWinnings / watchBetAmount).toFixed(2)}x)
                                                </Button>
                                            </motion.div>
                                        )}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="relative space-y-6"
                                        >
                                            <FormField
                                                control={form.control}
                                                name="betAmount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Bet Amount</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input
                                                                    placeholder="Enter amount"
                                                                    {...field}
                                                                    type="number"
                                                                    className="h-12 text-lg pl-8 bg-background/50 backdrop-blur-sm border-primary/20 shadow-lg"
                                                                    disabled={gameState === 'playing'}
                                                                />
                                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">$</span>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mines"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-sm font-medium">Number of Mines</FormLabel>
                                                        <FormControl>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    type="range"
                                                                    min={1}
                                                                    max={24}
                                                                    {...field}
                                                                    className="w-full"
                                                                    disabled={gameState === 'playing'}
                                                                />
                                                                <div className="text-center text-sm text-primary">
                                                                    {field.value} mines
                                                                </div>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3}}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Win Chance:</span>
                                                    <motion.span
                                                        className="font-bold text-primary"
                                                        key={watchMines}
                                                        initial={{ scale: 1.2 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        {calculateWinChance(watchMines)}%
                                                    </motion.span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Potential Payout:</span>
                                                    <motion.span
                                                        className="font-bold text-primary"
                                                        key={`${watchBetAmount}-${watchMines}`}
                                                        initial={{ scale: 1.2 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        ${calculatePotentialPayout(watchBetAmount, watchMines)}
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CardContent>
                                    <CardFooter className="px-0 pb-0">
                                        <motion.div
                                            className="w-full"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20"
                                                disabled={gameState === 'playing'}
                                            >
                                                {gameState === 'playing' ? 'Game in Progress' : 'Start Game'}
                                            </Button>
                                        </motion.div>
                                    </CardFooter>
                                </form>
                            </Form>
                        </div>

                        <Separator orientation="vertical" className="mx-auto h-full hidden md:block bg-primary/30" />

                        {/* Game Column - 2/3 width */}
                        <div className="col-span-12 md:col-span-7">
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 25 }).map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className={`aspect-square rounded-lg ${
                                            gameState === 'idle' ? 'cursor-not-allowed' : 'cursor-pointer'
                                        } ${
                                            revealedCells.includes(index)
                                                ? minePositions.includes(index)
                                                    ? 'bg-red-500'
                                                    : 'bg-green-500'
                                                : 'bg-primary/20'
                                        } hover:bg-primary/30 transition-colors flex items-center justify-center`}
                                        onClick={() => handleCellClick(index)}
                                        whileHover={{ scale: gameState === 'playing' ? 1.05 : 1 }}
                                        whileTap={{ scale: gameState === 'playing' ? 0.95 : 1 }}
                                    >
                                        {revealedCells.includes(index) && (
                                            minePositions.includes(index) ? (
                                                <Bomb className="w-6 h-6 text-white" />
                                            ) : (
                                                <Diamond className="w-6 h-6 text-white" />
                                            )
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
