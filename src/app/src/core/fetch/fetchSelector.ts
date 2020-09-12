import { createSelector } from 'reselect'
import { fetchState, getFetchState } from './fetchReducer'
const state = (state:any) => state.fetchReducer


export const selectFetchState = createSelector(
  state,
  (s:any, key:string) => key,
  (states: fetchState<unknown>[], key:string) => {
    return getFetchState(states, key)
  }
)