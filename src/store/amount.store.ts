import { create } from 'zustand'

interface AmountStore {
  balance: number
  setBalance: (balance: number) => void
  betAmount: number 
  setBetAmount: (amount: number) => void
  addToBalance: (amount: number) => void
  subtractFromBalance: (amount: number) => void
}

export const useAmountStore = create<AmountStore>((set) => ({
  balance: 1000, // Starting balance
  setBalance: (balance: number) => set({ balance }),
  betAmount: 0,
  setBetAmount: (amount: number) => set({ betAmount: amount }),
  addToBalance: (amount: number) => set((state) => ({ 
    balance: state.balance + amount 
  })),
  subtractFromBalance: (amount: number) => set((state) => ({
    balance: state.balance - amount
  }))
}))

export default useAmountStore;