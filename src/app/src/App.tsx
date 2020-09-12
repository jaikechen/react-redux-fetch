import React, { Fragment } from 'react'
import { setBaseUrl, setGetTokenHook, setSignInUrl, useFetchRequest } from 'core/fetch/useFetchRequest'
import {  BrowserRouter as Router, Route, Switch} from 'react-router-dom'
//import {useFetchRequest} from 'r2fetch'
export interface Post {
    userId: number
    id: number
    title: string
    completed: boolean
}
setBaseUrl('https://jsonplaceholder.typicode.com/')
setSignInUrl('/login')
setGetTokenHook(()=>'my token')

const post_url= 'posts'
export function Header(){
    const [state,fetchState] = useFetchRequest<Post[]>(true, 'GET', post_url)
    return <div>
        {state?.result?.length}
        <input type="button" value="Refresh" onClick={()=> fetchState(undefined)}/>
    </div>
}

export function Main() {
    const [state] = useFetchRequest<Post[]>(false, 'GET', post_url)
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
            Result = <div>{state.error}</div>
            break;
        default:
            Result = <div>Loading</div>
            break;
    }
  return  <Fragment><Header/> {Result} </Fragment>
}

export function Login(){
    return <div>Login</div>
}

export function App(){
    return <Router>
        <Switch>
            <Route path ='/login'><Login/></Route>
            <Route  path ='/'><Main/></Route>
        </Switch>
    </Router>
}