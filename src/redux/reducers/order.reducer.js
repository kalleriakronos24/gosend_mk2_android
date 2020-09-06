let initialState = {
    orders : []
}


export const orderReducers = (state = initialState, action) => {
    let check = state.orders.some((v,i) => v.id === action.item.id); 
    switch(action.type){
        case 'add':
            if(!check){
                return {
                    ...state,
                    orders : [
                        ...state.orders,
                        action.item
                    ]
                }
            }
            return 'data sudah ada';
        default:
            return state;
    }
}