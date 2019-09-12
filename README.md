# Yojji Core

- [Yojji Core](#yojji-core)
  - [Action Creator](#action-creator)
    - [actionNamespaceCreator(namespace, options?) => createAction](#actionnamespacecreatornamespace-options--createaction)
    - [createAction(type, options?) => IAction](#createactiontype-options--iaction)
  - [Simple Reducer Creator](#simple-reducer-creator)
    - [createSimpleReducer(action, reducer, initialState)](#createsimplereduceraction-reducer-initialstate)
  - [Reducer Creator](#reducer-creator)
    - [createReducer(action, reducersWrapper, initialState)](#createreduceraction-reducerswrapper-initialstate)
  - [Compose Reducers](#compose-reducers)
    - [compose(initialState, ...reducers)](#composeinitialstate-reducers)
  - [Redux Saga Helpers](#redux-saga-helpers)
    - [createWorker({ api, action })](#createworker-api-action)
    - [createWatcher({ api, action })](#createwatcher-api-action)
    - [createAndRunApiSagas(apiList) => { workers: SagaIterator[] }](#createandrunapisagasapilist---workers-sagaiterator)

## Action Creator

Library provides two ways to create actions: with a namespace or without.

### actionNamespaceCreator(namespace, options?) => createAction

Returns `createAction` function with provided namespace.

`@param  {string} namespace` - String prefix that will be added to every action created from that namespace.

`@param  {IOptions} actionCreatorOptions?`

`@param  {any} actionCreatorOptions.meta?` - Metadata that will be added to each action created from that namespace.

`@param  {(payload: any) => any} actionCreatorOptions.payloadCreator?` - A function that takes payload passed by the argument when creating the action and writes the result of its work to the action payload

```typescript

    import { actionNamespaceCreator } from '@yojji/core'

    const createAction = actionNamespaceCreator('NAMESPACE')
    const action = createAction('TYPE')

    // action().type === 'NAMESPACE/TYPE'

```

Using with options:

```javascript

    import { actionNamespaceCreator } from '@yojji/core'

    const createAction = actionNamespaceCreator('NAMESPACE', {
        meta: { provided: true },
        payloadCreator(payload: string) {
            return payload + '-modified'
        }
    })

    const action = createAction('TYPE')

    // action().type === 'NAMESPACE/TYPE'
    // action().meta.provided === true
    // action('payload').payload === 'payload-modified'

```

### createAction(type, options?) => IAction

Returns `IAction` function.

`@param  {string} type` - String describing the type of action.

`@param  {IOptions} actionCreatorOptions?`

**Note**

If `createAction` function was returned by `actionNamespaceCreator`, options provided to `createAction` will override options provided to `actionNamespaceCreator`

`@param  {any} actionCreatorOptions.meta?` - Metadata that will be added to each action created from that action creator.

`@param  {(payload: any) => any} actionCreatorOptions.payloadCreator?` - A function that takes payload passed by the argument when creating the action and writes the result of its work to the action payload

```javascript
    import { createAction } from '@yojji/core'

    const action = createAction('TYPE')

    // action().type === 'TYPE'
    // action.success() === 'TYPE_SUCCESS'
    // action.failure() === 'TYPE_FAILURE'
    // action.cancel() === 'TYPE_CANCEL'
    // action.request() === 'TYPE_REQUEST'
```

Using with options:

```javascript

    import { createAction } from '@yojji/core'

    const action = createAction('TYPE', {
        meta: { provided: true },
        payloadCreator(payload: string) {
            return payload + '-modified'
        }
    })

    // action().type === 'NAMESPACE/TYPE'
    // action().meta.provided === true
    // action('payload').payload === 'payload-modified'

```

Using with `actionNamespaceCreator` options:

```javascript

    import { actionNamespaceCreator } from '@yojji/core'

    const createAction = actionNamespaceCreator('NAMESPACE', {
        meta: { overridden: false },
        payloadCreator: () => 'Payload from namespaceCreator'
    })

    const action = createAction('TYPE', {
        meta: { overridden: true },
        payloadCreator: () => 'Payload from createAction'
    })

    // action().type === 'NAMESPACE/TYPE'
    // action().meta.overridden === true
    // action().payload === 'Payload from createAction'

    const anotherAction = createAction('ANOTHER_TYPE')

    // anotherAction().type === 'NAMESPACE/ANOTHER_TYPE'
    // anotherAction().meta.overridden === false
    // anotherAction().payload === 'Payload from namespaceCreator'

```

## Simple Reducer Creator

### createSimpleReducer(action, reducer, initialState)

Helper to create reducer connected to one action.

`@param {IAction | string} action` - Action to handle

`@param {TReducer<State>} reducer` - Reducer for action

`@param {State} initialState` - Initial state

```javascript

    import {
        createSimpleReducer,
        createAction
    } from '@yojji/core'

    const action = createAction('PLUS')

    const initialState = { count: 0 }

    const reducer = (state, action) => ({
        ...state,
        count: state.count + action.payload
    })

    const reducer = createSimpleReducer(action, reducer, initialState)

    // USAGE

    const state = reducer(initialState, action(5))

    // state.count === 5
```

## Reducer Creator

### createReducer(action, reducersWrapper, initialState)

Helper to create reducer connected to action with statuses.

`@param {IAction} action` - Action to handle created by `createAction`

`@param {Record<TActionsToHandle, string>} reducersWrapper` - Function that passes through the arguments all actions statuses to reducers

`@param {State} initialState` - initial state

```javascript

    import {
        createReducer,
        createAction
    } from '@yojji/core'

    const action = createAction('TYPE')

    const initialState = {
        default: false,
        success: false,
        failure: false,
        cancel: false,
    }

    const reducer = createReducer(action, ({
        // action types will be provided by the function
        DEFAULT, // DEFAULT === 'TYPE' === action().type
        SUCCESS, // SUCCESS === 'TYPE_SUCCESS' === action.success()
        FAILURE, // 'FAILURE === TYPE_FAILURE' === action.failure()
        CANCEL  // CANCEL === 'TYPE_CANCEL' === action.cancel()
    }) => ({
        // Connects provided action types to reducers
        [DEFAULT]: (state, action) => ({ ...state, default: true }),
        [SUCCESS]: (state, action) => ({ ...state, success: true }),
        [FAILURE]: (state, action) => ({ ...state , failure: true }),
        [CANCEL]: (state, action) => ({ ...state, cancel: true })
    }), initialState)

    let state = reducer(initialState, action())
    // state.default === true

    state = reducer(state, action.success())
    // state.success === true

    state = reducer(state, action.failure())
    // state.failure === true

    state = reducer(state, action.cancel())
    // state.cancel === true
```

## Compose Reducers

### compose(initialState, ...reducers)

Helper to compose reducers, provide to them same state and as a result create flat state (not nested like from using `combineReducers`)

`@param {State} initialState` - Initial state that will be provided to every reducer

`@param {TReducers[]} ...reducers` - Reducers to compose

```javascript

    import {
        createSimpleReducer,
        createAction
    } from '@yojji/core'

    const initialState = { a: 0, b: 0 }

    const actionA = createAction('TYPE_A')
    const reducerA = createSimpleReducer(
        actionA,
        (state) => ({ ...state, a: state.a + 1 }),
        initialState
    )

    const actionB = createAction('TYPE_B')
    const reducerB = createSimpleReducer(
        actionB,
        (state) => ({ ...state, b: state.b + 1 }),
        initialState
    )

    // Compose reducers to a flat state
    const reducer = compose(initialState, reducerA, reducerB)

    let state = reducer(initialState, actionA())
    // state.a === 1

    state = reducer(state, actionB())
    // state.b === 1

```

## Redux Saga Helpers

### createWorker({ api, action })

Helper to create worker saga that handles api calls.

`@param {IApi} apiOptions` - Object

`@param {(data?: any) => Promise} apiOptions.api` - Function that will be called by `call`

`@param {IAction} apiOptions.action` - Action which statuses will be dispatched on resolve / reject Promise: `success` - on resolve, `failure` - on reject and `cancel` - on saga `cancelled()`

```javascript

    import { createWorker } from '@yojji/core'

    const worker = createWorker(api.apiCall, actions.someAction)

    function * rootSaga() {
        yield takeEvery(actions.someAction, worker)

        // OR

        yield call(worker)
    }

```

### createWatcher({ api, action })

Spawns a saga on each action dispatched to the Store that matches provided action.

**Note** Must be called through `spawn`

`@param {IApi} apiOptions` - Object

`@param {() => Promise} apiOptions.api` - Function that will be called

`@param {IAction} apiOptions.action` - Action to match

```javascript

    import { createWatcher } from '@yojji/core'

    const apiOptions = {
        api: () => new Promise,
        action: actions.someAction
    }

    function * rootSaga() {
        yield spawn(createWatcher, apiOptions)

        yield put(actions.someAction) // Run watcher
    }

```

### createAndRunApiSagas(apiList) => { workers: SagaIterator[] }

Helper to spawn watcher sagas and create list of worker sagas.

Returns workers (SagaIterator).


`@param {IApi[]} apiList` - Array of `IApi` objects

```javascript
    import {
        createAndRunApiSagas
    } from '@yojji/core'

    const apiList = [
        { api: () => new Promise, action: actions.someAction }
    ]

    function * rootSaga() {
        const { workers } = yield call(createAndRunApiSagas, apiList)

        yield call(workers[actions.someAction.toString()])

        // OR

        yield put(actions.someAction)
    }
```
