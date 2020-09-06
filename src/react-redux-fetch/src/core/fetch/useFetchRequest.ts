import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { FetchMethods, FetchRequest, FetchActionTypes } from "./fetchActions"
import { selectFetchState } from "./fetchSelector"
import { fetchState } from "./fetchReducer"

export function useFetchRequest<T> (dispatchInUseEffect:boolean  ,method:FetchMethods,url:string, postDate:any=undefined) {
  const key = url + method
  const dispatch = useDispatch()
  const myDispatch = (data:any) => {
      const request = new FetchRequest(
        FetchActionTypes.FetchSucceed, 
        FetchActionTypes.FetchFailed, 
        FetchActionTypes.FetchLoading,
        method, url, {key},data )
      dispatch(Object.assign({},request))
  }
  useEffect(()=>{
    if (dispatchInUseEffect){
      myDispatch(postDate)
   }
  },[url,method,postDate,dispatchInUseEffect])
  
  return [
    useSelector((state:any) => selectFetchState(state,key)),
    (postDate:any) => myDispatch(postDate)
  ] as [fetchState<T>, (postDate:any)=>{} ]
}
