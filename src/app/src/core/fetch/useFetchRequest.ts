import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { FetchMethods, FetchRequest, FetchActionTypes } from "./fetchActions"
import { selectFetchState } from "./fetchSelector"
import { fetchState } from "./fetchReducer"
import { useHistory } from "react-router-dom"

let baseUrl=''
export const setBaseUrl = (url:string) => baseUrl =  url

let signInUrl = ''
export const setSignInUrl = (url:string) =>signInUrl = url

let getTokenHook :any
export const setGetTokenHook = (cb:(()=>string)) => getTokenHook = cb



export function useFetchRequest<T> (dispatchInUseEffect:boolean  ,method:FetchMethods,url:string,requireToken=false, initData:any=undefined) {
  url = baseUrl + url
  const history = useHistory();
  const key = url + method
  const dispatch = useDispatch()
  const getToken = () => {
    if (!getTokenHook){
      throw Error('this request require token, but the get token hook was not set')
    }
    const token = getTokenHook()
    if (!token){
      if (signInUrl){
        history.push(signInUrl)
      }
      throw Error('this request require token, but get token hook return empty')
    }
    return token
  }

  const myDispatch = (data:any) => {
      const request = new FetchRequest(
        FetchActionTypes.FetchSucceed, 
        FetchActionTypes.FetchFailed, 
        FetchActionTypes.FetchLoading,
        method, url, {key},data,requireToken ? getToken: undefined
         )
      dispatch(Object.assign({},request))
  }
  useEffect(()=>{
    if (dispatchInUseEffect){
      myDispatch(initData)
   }
  },[url,method,initData,dispatchInUseEffect])
  
  return [
    useSelector((state:any) => selectFetchState(state,key)),
    (data:any) => myDispatch(data)
  ] as [fetchState<T>, (postDate:any)=>{} ]
}
