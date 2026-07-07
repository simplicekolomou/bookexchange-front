import {createSlice} from "@reduxjs/toolkit";
import type {UserBooksState} from "./types/book.types.ts";

const initialState: UserBooksState = {
    books: [],
    wishlist: [],
    exchanges: [],
    averageRatings: 0,
}
const bookSlice= createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBooks(state, action) {
            state.books = action.payload.books;
        },
        setWishlist(state, action) {
            state.wishlist = action.payload.wishlist;
        },
        setExchange(state, action) {
            state.exchanges = action.payload.exchanges;
        },

        setAverage(state, action) {
            state.averageRatings = action.payload.averageRatings;
        }
    },
});
export const {setBooks, setWishlist, setExchange, setAverage} = bookSlice.actions;
export default bookSlice.reducer;