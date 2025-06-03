import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "@/components/ui/progress"
import React from "react"
import { motion } from "motion/react"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
  betAmount: z.coerce.number().min(1).max(1000),
})

export default function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      betAmount: 0,
    },
  })

  const [balance, setBalance] = React.useState(1000);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [result, setResult] = React.useState<number | null>(null);
  const [gameResult, setGameResult] = React.useState<'win' | 'loss' | null>(null);
  const [winThreshold, setWinThreshold] = React.useState(50);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const betAmount = values.betAmount;
    if (betAmount > balance) {
      form.setError("betAmount", { message: "Insufficient balance" });
      return;
    }

    setIsAnimating(true);
    const randomNum = Math.floor(Math.random() * 100);
    setResult(randomNum);

    // Win if number > winThreshold
    const isWin = randomNum > winThreshold;
    setTimeout(() => {
      setGameResult(isWin ? 'win' : 'loss');
      // Calculate payout based on probability
      const multiplier = 100 / (100 - winThreshold);
      const payout = isWin ? betAmount * multiplier : -betAmount;
      setBalance(prev => prev + payout);
      setIsAnimating(false);
    }, 2000);
  }

  const winChance = 100 - winThreshold;
  const betAmount = form.watch("betAmount");
  const potentialPayout = betAmount * (100 / winChance);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <div className="w-full border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dice Game</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Balance:</span>
            <span className="text-xl font-bold">${balance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-[90%] p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="col-span-1">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-2xl font-bold">Place Your Bet</CardTitle>
                    <CardDescription>Enter amount and try your luck</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <FormField
                      control={form.control}
                      name="betAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Bet Amount</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter amount" 
                              {...field} 
                              type="number"
                              className="h-12 text-lg" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Win Chance: {winChance}%</span>
                        <span>Potential Win: ${potentialPayout.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-0 pb-0">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg font-semibold"
                      disabled={isAnimating}
                    >
                      {isAnimating ? "Rolling..." : "Place Bet"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </div>

            {/* Game Column */}
            <div className="col-span-2 flex items-center">
              <div className="w-full space-y-6">
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative h-8">
                        <div 
                          className="absolute inset-0 bg-red-500/70 rounded-full"
                        />
                        <div 
                          className="absolute inset-0 bg-green-500/70 rounded-full"
                          style={{ 
                            width: `${100 - winThreshold}%`,
                            left: `${winThreshold}%`
                          }}
                        />
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={winThreshold}
                          onChange={(e) => setWinThreshold(Number(e.target.value))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Arrow */}
                  {result !== null && (
                    <div 
                      className={`absolute top-full transition-all duration-1000 ease-in-out`}
                      style={{ 
                        left: `${result}%`,
                        transform: `translateX(-50%) translateY(10px)`
                      }}
                    >
                      <div className="text-primary text-4xl">↑</div>
                      <div className="text-center text-lg font-bold">{result}</div>
                    </div>
                  )}

                  {/* Result Display */}
                  {gameResult && (
                    <div className={`mt-4 text-center text-xl font-bold ${
                      gameResult === 'win' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {gameResult === 'win' ? 'You Won!' : 'You Lost!'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
