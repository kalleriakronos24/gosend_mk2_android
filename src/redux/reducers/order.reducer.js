let initialState = {
    costumer_coordinate : 0,
    orders : []
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
                    costumer_coordinate : action.costumer_coordinate
                }
        default:
            return state;
    }
}