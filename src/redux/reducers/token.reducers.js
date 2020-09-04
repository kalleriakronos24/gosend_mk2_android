let initialState = {
    dummy : '',
    token : null
}


const loginToken = (state = initialState, action) => {
    switch(action.type){
        case 'LOGIN_TOKEN':
            return {
                ...state,
                token : action.token
            }
        case 'LOGOUT':
            return {
                ...state,
                token : null
            }
        default:
            return state
    }
}

export default loginToken;