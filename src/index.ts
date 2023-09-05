import { useCallback, useMemo } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim"
import { chainedDataIndexExtractor, chainedDataIndexToObject } from "./utils/chainedDataIndex";

export const createStore = <P = any>(initialState: P) => {
    let currentState = initialState

    let serverSideState: P | null = null

    const getState = () => currentState;

    const listeners = new Set<() => void>()

    const setState = (fn: (state: P) => P) => {

        currentState = fn(currentState)
        
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

export const useStore = <S = any, P = any>(store: ReturnType<typeof createStore<P>>, selector: (state: P) => S) => {
    return useSyncExternalStore<S>(
        store.subscribe, 
        () => selector(store.getState()),
        () => selector(store.getServerSideState())
    )
}

export const useStoreSelectorState = <S = any, P = any>(store: ReturnType<typeof createStore<P>>, selector: string): [S, (callback: S | ((state: S) => S)) => void] => {
    const state = useStore(store, useCallback((prev) => chainedDataIndexExtractor<P, S>(selector, prev), [selector]))

    return useMemo(() => {
        return [state, (callback: S | ((state: S) => S)) => {
            store.setState(prev => {
                const value = chainedDataIndexExtractor<P, S>(selector, prev)
                return chainedDataIndexToObject(selector, typeof callback === 'function' ? (callback as any)(value) : callback, {...prev})
            })
        }]
    }, [state, selector])
}