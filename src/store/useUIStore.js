import { create } from 'zustand'

const useUIStore = create((set) => ({
  activeCard: null,
  isCardOpen: false,
  nearbyHouseData: null,
  playerPosRef: { current: [0, 0, 0] }, // Mutable ref for high frequency updates without re-renders
  setNearbyHouse: (data) => set({ nearbyHouseData: data }),
  openCard: (cardData) => {
    // Release pointer lock when opening a card so user can click links
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    set({ activeCard: cardData, isCardOpen: true })
  },
  closeCard: () => set({ activeCard: null, isCardOpen: false }),
}))

export default useUIStore
