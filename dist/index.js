var $dMEVx$react = require("react");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "createStore", function () { return $091c930e13b125ed$export$f51a9068ac82ea43; });
$parcel$export(module.exports, "useStore", function () { return $091c930e13b125ed$export$6ccbb43953eebf8; });
$parcel$export(module.exports, "useStoreSelectorState", function () { return $091c930e13b125ed$export$8d0dd255bc66a1b5; });

const $e0afaa5316535c17$export$7ed8d4c159f23ff1 = (dataIndex, dataIndexValue, rewrite = {})=>{
    return dataIndex.split(".").reduce((result, value, index, array)=>{
        const lastField = array.slice(0, index).reduce((r, v)=>r[v], result);
        if (array.length - 1 === index) lastField[value] = dataIndexValue;
        else lastField[value] = lastField[value] || {};
        return result;
    }, rewrite);
};
const $e0afaa5316535c17$export$5db42211b1fe4ea5 = (dataIndex, item)=>{
    return dataIndex.split(".").reduce((result, value)=>{
        const hasArray = value.match(/\[(\d+)\]$/);
        if (hasArray) return result && result[value.substring(0, hasArray.index)][parseInt(hasArray[1])];
        return result && result[value];
    }, item);
};


const $091c930e13b125ed$export$f51a9068ac82ea43 = (initialState, onChange)=>{
    let currentState = initialState;
    let serverSideState = null;
    const getState = ()=>currentState;
    const listeners = new Set();
    const setState = (fn)=>{
        currentState = fn(currentState);
        if (typeof onChange === "function") onChange(currentState);
        listeners.forEach((listener)=>listener());
    };
    const getServerSideState = ()=>serverSideState ?? initialState;
    let isInitialize = false;
    const initializeServerSideState = (initialServerSideState)=>{
        if (isInitialize === false) {
            currentState = initialServerSideState;
            serverSideState = initialServerSideState;
            isInitialize = true;
        }
    };
    const subscribe = (listener)=>{
        listeners.add(listener);
        return ()=>listeners.delete(listener);
    };
    return {
        getState: getState,
        setState: setState,
        getServerSideState: getServerSideState,
        initializeServerSideState: initializeServerSideState,
        subscribe: subscribe
    };
};
const $091c930e13b125ed$export$6ccbb43953eebf8 = (store, selector)=>{
    return (0, $dMEVx$react.useSyncExternalStore)(store.subscribe, ()=>selector(store.getState()), ()=>selector(store.getServerSideState()));
};
const $091c930e13b125ed$export$8d0dd255bc66a1b5 = (store, selector)=>{
    const state = $091c930e13b125ed$export$6ccbb43953eebf8(store, (0, $dMEVx$react.useCallback)((prev)=>(0, $e0afaa5316535c17$export$5db42211b1fe4ea5)(selector, prev), [
        selector
    ]));
    return (0, $dMEVx$react.useMemo)(()=>{
        return [
            state,
            (callback)=>{
                store.setState((prev)=>{
                    const value = (0, $e0afaa5316535c17$export$5db42211b1fe4ea5)(selector, prev);
                    return (0, $e0afaa5316535c17$export$7ed8d4c159f23ff1)(selector, typeof callback === "function" ? callback(value) : callback, {
                        ...prev
                    });
                });
            }
        ];
    }, [
        state,
        selector
    ]);
};


//# sourceMappingURL=index.js.map
