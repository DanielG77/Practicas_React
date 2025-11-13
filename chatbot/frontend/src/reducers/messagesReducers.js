export function messagesReducer(state, action) {
    switch (action.type) {
        case 'SET':
            return action.payload;
        case 'ADD':
            return [...state, action.payload];
        case 'MARK_READ':
            return state.map(m => action.payload.includes(m._id) ? { ...m, read: true } : m);
        default:
            return state;
    }
}
