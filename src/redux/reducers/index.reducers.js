import { combineReducers } from 'redux';
import loginToken from './token.reducers';
import { orderReducers } from './order.reducer.js';

const Root = combineReducers({
    token : loginToken,
    orders : orderReducers
})

export default Root;