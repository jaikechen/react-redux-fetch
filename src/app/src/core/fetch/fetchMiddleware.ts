import { FetchActionTypes, FetchRequest } from "./fetchActions"
export const fetchMiddleware = ({ dispatch }: any) => (next: any) => async (action: FetchRequest) => {
  switch (action.type) {
    case FetchActionTypes.FetchRequest: {
      const { url, onSuccess, onError, onLoading } = action
      let error: any
      let result: any = false
      try {
        if (onLoading) {
          dispatch({
            type: onLoading,
            payload: { ...action.payload, url }
          })
        }
        const option = await buildOption(action)
        const response = await fetch(url, option)
        const text = await response.text()
        if (response.ok) {
          result = getResult(text)
        }
        else {
          switch (response.status){
            case 404:{
              error = "url not found"
              break
            }
            default:{
              error = getError(text)
            }
          }
        }
      } catch (err) {
        error = err.message
      }
      dispatch({
        type: result!==false ? onSuccess : onError,
        payload: {
          ...action.payload,
          error, result, url
        }
      })
    }
  }
  return next(action)
}
const buildOption = async (action: FetchRequest) => {
  const { method, getTokenHook } = action
  const headers: any = { 'Content-Type': 'application/json' }
  const option: any = {}
  option['headers'] = headers
  option['method'] = method
  if (method !== 'GET') {
    option['body'] = JSON.stringify(action.postData)
  }
  if (getTokenHook) {
    const token = getTokenHook()
    headers['Authorization'] = `Bearer ${token}`
  }
  return option
}

function getResult(text: string) {
  let result: any
  try {
    result = JSON.parse(text)
  } catch{
    result = text
  }
  return result
}

function getError(text: string) {
  
  let error = text
  try {
    let json = JSON.parse(text)
    error = json.message ?? json.error ?? text
  } catch{
  }
  return error
}