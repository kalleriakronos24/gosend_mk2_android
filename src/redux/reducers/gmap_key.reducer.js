let initialState = {
    key: null
};


const GmapKeyReducer = (state = initialState, action) => {
    switch (action.type) {
        case "add_gmap_key":
            return {
                ...state,
                key: action.key
            }
        default:
            return null;
    }
};

export default GmapKeyReducer;