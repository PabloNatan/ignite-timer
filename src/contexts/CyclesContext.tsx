import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  intteruptDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountsSecondPassed: number
  interruptCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountsSecondPassed, setAmountSecondsPassed] = useState(0)

  const markCurrentCycleAsFinished = useCallback(() => {
    setCycles((oldState) =>
      oldState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
  }, [activeCycleId])

  function interruptCycle() {
    setCycles((oldState) =>
      oldState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, intteruptDate: new Date() }
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)
  }

  const setSecondsPassed = useCallback((seconds: number) => {
    setAmountSecondsPassed(seconds)
  }, [])

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    setCycles((oldState) => [...oldState, newCycle])
    setActiveCycleId(newCycle.id)
    setAmountSecondsPassed(0)
  }

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        amountsSecondPassed,
        interruptCycle,
        createNewCycle,
        setSecondsPassed,
        markCurrentCycleAsFinished,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export const useCyclesContext = () => useContext(CyclesContext)
