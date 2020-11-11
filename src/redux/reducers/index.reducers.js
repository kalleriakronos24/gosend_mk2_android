import { combineReducers } from 'redux';
import loginToken from './token.reducers';
import { orderReducers } from './order.reducer.js';
import { coordReducer } from './coord.reducer';
import DeviceReducer from './device.reducer';

const Root = combineReducers({
    token : loginToken,
    orders : orderReducers,
    coordinate : coordReducer,
    device : DeviceReducer
})

export default Root;