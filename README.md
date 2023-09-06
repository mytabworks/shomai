# shomai
A small, easy, blazingly fast and scalable state-management solution for react.

// sample-store.ts
```js
import { createStore } from "shomai";

export interface SampleStore {
    counter: number;
    decounter: number;
}

export const sampleStore = createStore<SampleStore>({
    counter: 0,
    decounter: 100
})
```

// HelloWorld.tsx
```js
import React from 'react'
import { useStore, useStoreSelectorState } from 'shomai'
import { sampleStore } from './sample-store'

const HelloWorld: React.FunctionComponent<HelloWorldProps> = () => {

    const counter = useStore(sampleStore, (state) => state.counter)

    const [decounter, setDecounter] = useStoreSelectorState<number>(sampleStore, 'decounter')

    return (
        <>
            <button onClick={() => sampleStore.setState(prev => ({...prev, counter: prev.counter + 1}))}>Counter ({counter})</button>
            <button onClick={() => setDecounter(prev => prev - 1)}>Decounter ({decounter})</button>
        </>
    )
}
```