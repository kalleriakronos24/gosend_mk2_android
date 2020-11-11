let initialState = {
    device_token: String
}


const DeviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'add_device_token':
            return {
                ...state,
                device_token: action.token
            }
        default:
            return state;
    }
}

export default DeviceReducer;