import { combineReducers } from 'redux';
import loginToken from './token.reducers';

const Root = combineReducers({
    token : loginToken
})

export default Root;