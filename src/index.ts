import { useCallback, useMemo, useSyncExternalStore } from "react";
import { chainedDataIndexExtractor, chainedDataIndexToObject } from "./utils/chainedDataIndex";
import { FlattenObject } from "./type";

export * from "./type";

export const createStore = <P = Record<string, any>>(initialState: P, onChange?: (state: P) => void) => {
    let currentState = initialState

    let serverSideState: P | null = null

    const getState = () => currentState;

    const listeners = new Set<() => void>()

    const setState = (fn: (state: P) => P) => {

        currentState = fn(currentState)

        if(typeof onChange === 'function') onChange(currentState)
        
        listeners.forEach((listener) => listener())
    }
    
    const getServerSideState = () => serverSideState ?? initialState

    let isInitialize = false

    const initializeServerSideState = (initialServerSideState: P) => {
        if(isInitialize === false) {
            currentState = initialServerSideState
    
            serverSideState = initialServerSideState

            isInitialize = true
        }
    } 

    const subscribe = (listener: () => void) => {
        
        listeners.add(listener)

        return () => listeners.delete(listener)
    }

    return {
        getState, 
        setState,
        getServerSideState,
        initializeServerSideState,
        subscribe
    }
}

export const useStore = <P = Record<string, any>, S = any>(store: ReturnType<typeof createStore<P>>, selector: (state: P) => S) => {
    return useSyncExternalStore<S>(
        store.subscribe, 
        () => selector(store.getState()),
        () => selector(store.getServerSideState())
    )
}

export const useStoreSelectorState = <P = Record<string, any>, K extends keyof FlattenObject<P> = keyof FlattenObject<P>, S = FlattenObject<P>[K]>(store: ReturnType<typeof createStore<P>>, selector: K): [S, (callback: S | ((state: S) => S)) => void] => {
    const state = useStore(store, useCallback((prev) => chainedDataIndexExtractor<P, S>(selector as string, prev), [selector]))

    return useMemo(() => {
        return [state, (callback: S | ((state: S) => S)) => {
            store.setState(prev => {
                const value = chainedDataIndexExtractor<P, S>(selector as string, prev)
                return chainedDataIndexToObject(selector as string, typeof callback === 'function' ? (callback as any)(value) : callback, {...prev})
            })
        }]
    }, [state, selector])
}