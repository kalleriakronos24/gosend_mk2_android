let initialState = {
    coords : 0
};


export const coordReducer = (state = initialState, action) => {
    switch(action.type){
        case 'region_change':
                return {
                    ...state,
                    coords : action.coords
                }
        default:
            return state;
    }
}