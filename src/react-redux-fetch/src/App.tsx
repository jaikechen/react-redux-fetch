import React, { Fragment } from 'react'
import { useFetchRequest } from 'core/fetch/useFetchRequest'
//import {useFetchRequest} from 'r2fetch'
export interface Post {
    userId: number
    id: number
    title: string
    completed: boolean
}
const post_url = 'https://jsonplaceholder.typicode.com/posts111'

export function Header(){
    const [state,fetchState] = useFetchRequest<Post[]>(true, 'GET', post_url)
    return <div>
        {state?.result?.length}
        <input type="button" value="Refresh" onClick={()=> fetchState(undefined)}/>
    </div>
}

export function App() {
    const [state] = useFetchRequest<Post[]>(false, 'GET', post_url)
    console.log(state)
    let Result 
    switch (state?.status) {
        case 'Succeed':
            Result = <div>
                {
                    state.result?.map(x => (
                        <div key={x.id}>{x.title}</div>
                    )
                    )
                }
            </div>
            break;
        case 'Fail':
            Result = <div>{JSON.stringify(state.error)}</div>
            break;
        default:
            Result = <div>Loading</div>
            break;
    }
  return  <Fragment><Header/> {Result} </Fragment>
}