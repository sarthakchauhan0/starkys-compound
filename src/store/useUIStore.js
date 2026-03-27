import { create } from 'zustand'

const useUIStore = create((set) => ({
  activeCard: null,
  isCardOpen: false,
  nearbyHouseData: null,
  isTouch: false,
  isJumping: false,
  moveJoystick: { x: 0, y: 0 },
  lookJoystick: { x: 0, y: 0 },
  playerPosRef: { current: [0, 0, 0] }, // Mutable ref for high frequency updates without re-renders
  setNearbyHouse: (data) => set({ nearbyHouseData: data }),
  setIsTouch: (isTouch) => set({ isTouch }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setMoveJoystick: (x, y) => set({ moveJoystick: { x, y } }),
  setLookJoystick: (x, y) => set({ lookJoystick: { x, y } }),
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
