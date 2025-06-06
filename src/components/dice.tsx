import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import React from "react"
import { Toaster, toast } from 'sonner'
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import useAmountStore from "@/store/amount.store"

const formSchema = z.object({
  betAmount: z.coerce.number().min(1).max(1000),
})

export default function DiceGame() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      betAmount: 0,
    },
  })

  const { balance, addToBalance, subtractFromBalance } = useAmountStore()
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
    setGameResult(isWin ? 'win' : 'loss');
    // Calculate payout based on probability
    const multiplier = 100 / (100 - winThreshold);
    const payout = betAmount * multiplier;
    
    if (isWin) {
      addToBalance(payout);
      toast.success(`✅ You Won $${payout.toFixed(2)}`, {
        duration: 3000,
      });
    } else {
      subtractFromBalance(betAmount);
      toast.error(`❌ You Lost $${betAmount.toFixed(2)}`, {
        duration: 3000,
      });
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  }

  const winChance = 100 - winThreshold;
  const betAmount = form.watch("betAmount");
  const potentialPayout = betAmount * (100 / winChance);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col -mt-20">
      <Toaster position="top-center" richColors />

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-[95%] max-w-7xl p-8 shadow-2xl border-primary/20 bg-background/50 backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-8">
            {/* Form Column - 1/3 width */}
            <div className="col-span-12 md:col-span-4 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">Place Your Bet</CardTitle>
                      <CardDescription>Enter amount and try your luck</CardDescription>
                    </CardHeader>
                  </motion.div>
                  <CardContent className="px-0">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative"
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
                                />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/50">$</span>
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
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Win Chance:</span>
                          <motion.span 
                            className="font-bold text-primary"
                            key={winChance}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                          >
                            {winChance}%
                          </motion.span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Potential Payout:</span>
                          <motion.span 
                            className="font-bold text-primary"
                            key={potentialPayout}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                          >
                            ${potentialPayout.toFixed(2)}
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
                        disabled={isAnimating}
                      >
                        {isAnimating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            ⚀
                          </motion.div>
                        ) : null}
                        {isAnimating ? "Rolling..." : "Place Bet"}
                      </Button>
                    </motion.div>
                  </CardFooter>
                </form>
              </Form>
            </div>

            <Separator orientation="vertical" className="mx-auto h-full hidden md:block bg-primary/30" />

            {/* Game Column - 2/3 width */}
            <div className="col-span-12 md:col-span-7 flex items-center">
              <div className="w-full space-y-8">
                <div className="relative">
                  {/* Progress Bar */}
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="flex-1">
                      <div className="relative h-12 rounded-lg overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-[#ff4444]/80 backdrop-blur-sm" />
                        <motion.div 
                          className="absolute inset-0 bg-[#00c853]/80 backdrop-blur-sm"
                          style={{ 
                            width: `${100 - winThreshold}%`,
                            left: `${winThreshold}%`
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
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
                      <div className="flex justify-between mt-3 text-sm font-medium">
                        <span className="text-red-400">Loss Zone</span>
                        <span className="text-green-400">Win Zone</span>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>0</span>
                        <span>25</span>
                        <span>50</span>
                        <span>75</span>
                        <span>100</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Animated Arrow */}
                  <AnimatePresence>
                    {result !== null && (
                      <motion.div 
                        className="absolute top-full"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 10, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        style={{ 
                          left: `${result}%`,
                          transform: `translateX(-50%)`
                        }}
                      >
                        <motion.div 
                          className="flex flex-col items-center gap-2"
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <div className="relative">
                            <motion.div 
                              className="absolute inset-0 bg-primary/20 rounded-full"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            />
                            <div className="relative z-10 bg-primary rounded-full p-2 shadow-lg shadow-primary/20">
                              <ArrowUp className="w-8 h-8 text-background" />
                            </div>
                          </div>
                          <motion.div 
                            className="text-center font-bold text-xl bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            {result}
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
