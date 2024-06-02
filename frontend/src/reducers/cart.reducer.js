import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartSvc from "../pages/cms/cart/cartService";


export const getCartDetail = createAsyncThunk(
    'Cart/getCartDetail',
    async (data, thunkAPI) => {
        try {
            const response = await cartSvc.getMyCart()
            if (response) {
                return {total:response.meta.totalCount}
            }
        } catch (exception) {
            throw exception
        }
    }
)

const CartSlicer = createSlice({
    name: "Cart",
    initialState: {
        total:0
    },
    reducers: {
        setTotalCount: (state, action) => {
            state.total=action.payload.total
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getCartDetail.fulfilled, (state, action) => {
            state.total=action.payload.total  
        })
        builder.addCase(getCartDetail.rejected, (state, action) => {
            state.total=0
        })
    }
})
export const { setTotalCount } = CartSlicer.actions;
export default CartSlicer.reducer;