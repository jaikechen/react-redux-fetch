import React, { Fragment } from 'react'
/*
import { useFetchRequest } from 'core/fetch/useFetchRequest'
*/
import {useFetchRequest} from 'r2fetch'
export interface Post {
    userId: number
    id: number
    title: string
    completed: boolean
}
export function App() {
    const [state,fetchState] = useFetchRequest<Post[]>(true, 'GET', 'posts')
    let Result 
    switch (state?.status) {
        case 'Succeed':
            Result = <div><input type="button" value="Refresh" onClick={()=> fetchState(undefined)}/>
                {
                    state.result?.map(x => (<div>
                        <div>{x.title}</div>
                    </div>)
                    )
                }
            </div>
            break;
        case 'Fail':
            Result = <div>{JSON.stringify(state.error)}</div>
        default:
            Result = <div>Loading</div>
            break;
    }
  return  <Fragment>
{Result}
  </Fragment>
}