import { FetchActionTypes } from "./fetchActions";

export class fetchState<T>{
  constructor(
    public key:string,
    public status : 'Loading' |'Fail'| 'Succeed',
    public result : T|undefined = undefined,
    public error : string =''
  ){}
}


export function getFetchState(arr:fetchState<unknown>[], key:string) {
  return arr.find(x=>x.key === key)
}

function pushState(arr: fetchState<unknown>[], state: fetchState<unknown>) {
  return [...arr.filter(x => x.key !== state.key), state];
}

export const fetchReducer = (states = [], action:{type:string, payload:any}) => {
    switch(action.type){
      case FetchActionTypes.FetchLoading:{
        if (action.payload.key){
          const state = new fetchState(action.payload.key,'Loading')
          return pushState(states, state)
        }
        break
      }
      case FetchActionTypes.FetchSucceed:{
        const state = new fetchState(action.payload.key,'Succeed',action.payload.result)
        return pushState(states, state)
      }
      case FetchActionTypes.FetchFailed:{
        const state =  new fetchState(action.payload.key,'Fail',undefined, action.payload.error)
        return pushState(states, state)
      }
    }
    return states
}