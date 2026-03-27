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
  
  // Transition State
  isInsideHouse: false,
  sceneZone: 'EXTERIOR',
  cameraSnap: false,
  lastExteriorPos: null,
  activeHouse: null,

  setNearbyHouse: (data) => set({ nearbyHouseData: data }),
  setIsTouch: (isTouch) => set({ isTouch }),
  setIsJumping: (isJumping) => set({ isJumping }),
  setMoveJoystick: (x, y) => set({ moveJoystick: { x, y } }),
  setLookJoystick: (x, y) => set({ lookJoystick: { x, y } }),
  
  enterHouse: () => {
    if (document.pointerLockElement) {
      document.exitPointerLock()
    }
    const store = useUIStore.getState()
    const currentPos = store.playerPosRef.current
    set({ 
      isInsideHouse: true, 
      sceneZone: 'INTERIOR',
      cameraSnap: true, 
      lastExteriorPos: currentPos,
      activeHouse: store.nearbyHouseData 
    })
  },
  
  leaveHouse: () => set({ isInsideHouse: false, sceneZone: 'EXTERIOR', cameraSnap: true }),
  
  setCameraSnap: (val) => set({ cameraSnap: val }),

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
