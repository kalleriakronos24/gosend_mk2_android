let initialState = {
    costumer_coordinate : 0,
    penerima : null,
    count: 0,
    pengirim : null,
    distance : 0,
    ongkir : 0
};


export const orderReducers = (state = initialState, action) => {
    // let check = state.orders.some((v,i) => v.id === action.item.id);
    console.log(state);
    switch(action.type){
        case 'penerima':
                return {
                    ...state,
                    penerima : action.penerima,
                }
        case 'pengirim':
            return {
                ...state,
                pengirim : action.pengirim
            }
        case 'reset':
            return {
                ...state,
                penerima : null,
                costumer_coordinate : 0,
                count : 0,
                pengirim: null
            }
        case 'update_distance':
            return {
                ...state,
                distance : action.distance,
                ongkir : action.ongkir
            };
        case 'add_count' : 
            return {
                ...state,
                count: action.count
            }
        default:
            return state;
    }
}