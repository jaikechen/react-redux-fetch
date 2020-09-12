# react-redux-fetch
A fetching hook for react, it uses redux to manage state, so the state can be shared among different components. 
# what does r2 means
r2 mean react and redux, I would like call this package react-redux-fetch, but the name was taken.

# Why use this hook?

1. it encapsulates common operations for invoke web api, like adding http header,  converting object to Json
2. it manages error, loading, succeed states for the fetching operation
3. it supports bearer token; it can redirect to sign page if it doesn't get the token
4. because it redux to manage state, the state can be shared between different component

# Installation via NPM
```npm i r2fetch```
## if you have redux in your project, 
import fetchReducer and fetchMiddleware, then added them to your createStore function
```typescript
import {fetchMiddleware, fetchReducer} from 'r2fetch'
export const reducers = combineReducers({fetchReducer});
export const rootStore = createStore(
  reducers,
  compose(
    applyMiddleware(fetchMiddleware)
  )
);

```
## if you don't have redux in your project 
import rootStore, then wrap you component in the redux provider

```typescript
import { rootStore } from 'r2fetch';
import { Provider } from 'react-redux';

ReactDOM.render(
     <Provider store={rootStore}>
        <App />
     </Provider> ,
  document.getElementById('root')
);
```
# hook definition

## useFetchRequest
``` typescript
export function useFetchRequest<T> (dispatchInUseEffect:boolean  ,method:FetchMethods,url:string,requireToken=false, initData:any=undefined) {
```
the hook returns an array, the first element is the state of the hook, the second element is a function, call the function to dispatch another request.
``` typescript
[fetchState<T>, (postDate:any)=>{} ]
```
the hook save the state of calling different web APIs separately, it differentiates states by url + method. which means
- you can call the hook multiple times for different web api   
- if you call same webapi in different components, the state is shared between the components.

## setBaseUrl
``` typescript
export const setBaseUrl = (url:string) => baseUrl =  url
```
if your are calling several web api, for example, the url are '/api/posts', '/api/comments/, etc.
you can  call setBaseUrl('api/'), then fetch request, you don't need to set full url, you can just past url 'posts' and 'comments'
the base url was stored globally, you only need to call setBaseUrl once, e.g. in app.tsx.

# Examples
## use cases
suppose you want display posts from https://jsonplaceholder.typicode.com/posts
for some reason, you want use two components to display the result
- Header component displays counts and a refresh button
- App Component displays post title list.


## work flow
- in Header, it call useFetchRequest, set the first parameter (dispatchInUseEffect) to true, the hook will dispatch a fetch request when the component is initializing
- in App, it call useFetchRequest, dispatchInUseEffect to false, the hook will not dispatch a fetch when the component is initializing
- the hook updates the status to loading, both Header and App components are re-rendered, because both of them are using the hook and are calling same web API
- when the hook gets date from web api, it set state.status to 'Succeed', in Header, it display the post count
- if something is wrong, the hook set state.status to 'Fail', both Header and App are re-rendered, App display an Error

```typescript
export interface Post {
    userId: number
    id: number
    title: string
    completed: boolean
}
setBaseUrl('https://jsonplaceholder.typicode.com/')
const post_url = 'posts'
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
```
# bearer token 

to ask the hook to add bearer token to header, 
``` typescript
setSignInUrl('/login')
setGetTokenHook(()=>'my token'/* e.g. get token from local storage*/)
``` 
then when you call useFetchRequest, set the parameter requireToken to true