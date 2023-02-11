import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  intteruptDate?: Date
  finishedDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE: {
      return {
        ...state,
        cycles: [...state.cycles, action.payload.newCycle],
        activeCycleId: action.payload.newCycle.id,
      }
    }

    case ActionTypes.INTERRUPT_CURRENT_CYLCE: {
      const updatedCycles = state.cycles.map((cycle) =>
        cycle.id === state.activeCycleId
          ? { ...cycle, intteruptDate: new Date() }
          : cycle,
      )

      return {
        ...state,
        cycles: updatedCycles,
        activeCycleId: null,
      }
    }

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINESHED: {
      const updatedCycles = state.cycles.map((cycle) =>
        cycle.id === state.activeCycleId
          ? { ...cycle, finishedDate: new Date() }
          : cycle,
      )
      return {
        ...state,
        cycles: updatedCycles,
      }
    }

    default:
      return state
  }
}
