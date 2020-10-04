let initialState = {
    costumer_coordinate : 0,
    orders : [],
    count: 0,
    type : '',
    pickupDetail : null
}


export const orderReducers = (state = initialState, action) => {
    // let check = state.orders.some((v,i) => v.id === action.item.id);
    console.log(state);
    switch(action.type){
        case 'add':
                return {
                    ...state,
                    orders : [
                        ...state.orders,
                        action.item
                    ],
                    costumer_coordinate : action.costumer_coordinate,
                    type : action.tipe,
                    pickupDetail : action.pickup
                }
        case 'reset':
            return {
                ...state,
                orders : [],
                costumer_coordinate : 0,
                count : 0
            }
        case 'add_count' : 
            return {
                ...state,
                count: action.count
            }
        default:
            return state;
    }
}