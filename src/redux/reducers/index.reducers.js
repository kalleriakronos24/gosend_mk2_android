import { combineReducers } from 'redux';
import loginToken from './token.reducers';
import { orderReducers } from './order.reducer.js';
import { coordReducer } from './coord.reducer';

const Root = combineReducers({
    token : loginToken,
    orders : orderReducers,
    coordinate : coordReducer
})

export default Root;