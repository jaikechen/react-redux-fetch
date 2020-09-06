# react-redux-fetch
A fetching hook for react, it uses redux to manage state, so the state can be share via different components. 
# what does r2 means
r2 mean react and redux, I would like call this package react-redux-fetch, but the name was taken.

#### Why use this hook?

1. it encapsulates common operations for invoke web api, like adding http header,  converting object to Json
2. it manage error, loading, succeed states for the fetching operation
3. because it redux to manage state, the state can be shared between different component

### Installation via NPM
```npm i r2fetch```
#### if you have redux in your project, 
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
#### if you don't have redux in your project 
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

### Examples
suppose you want display posts from https://jsonplaceholder.typicode.com/posts'
you want use 2 components to display the result
- Header component displays counts and a refresh button
- App Component displays post title list.

With r2fetch managing states, the 2 components programming is simple
```typescript
export interface Post {
    userId: number
    id: number
    title: string
    completed: boolean
}
const post_url = 'https://jsonplaceholder.typicode.com/posts'

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
### License
react-use-fetch-ts has been released under the [zlib/libpng](https://github.com/Lusito/react-use-fetch-ts/blob/master/LICENSE) license, meaning you
can use it free of charge, without strings attached in commercial and non-commercial projects. Credits are appreciated but not mandatory.