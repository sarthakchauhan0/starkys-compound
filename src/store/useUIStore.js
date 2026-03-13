import { create } from 'zustand'

const useUIStore = create((set) => ({
  activeCard: null,
  isCardOpen: false,
  openCard: (cardData) => set({ activeCard: cardData, isCardOpen: true }),
  closeCard: () => set({ activeCard: null, isCardOpen: false }),
}))

export default useUIStore
