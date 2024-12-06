import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '@/config/api';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image: string;
    stock: number;
    shop: {
      id: string;
      name: string;
    };
  };
}

interface CartState {
  items: CartItem[];
  shopId: string | null;
  loading: boolean;
  error: string | null;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  shopId: null,
  loading: false,
  error: null,
  totalAmount: 0,
};

// Async thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity, shopId }: { productId: string; quantity: number; shopId: string }, { getState }) => {
    const state = getState() as { cart: CartState };
    
    // Check if adding product from different shop
    if (state.cart.shopId && state.cart.shopId !== shopId) {
      const confirmChange = window.confirm(
        'Adding products from a different shop will clear your current cart. Do you want to continue?'
      );
      
      if (!confirmChange) {
        throw new Error('Cancelled adding product from different shop');
      }
    }

    const response = await fetch(`${API_BASE_URL}/cart/add-to-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/cart/item/${productId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return productId;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.shopId = action.payload.shopId;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.shopId = action.payload.shopId;
        state.totalAmount = action.payload.totalAmount;
        toast.success('Product added to cart');
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add to cart';
        toast.error(state.error);
      })
      // Update Quantity
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        toast.success('Cart updated');
      })
      // Remove Item
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.productId !== action.payload);
        if (state.items.length === 0) {
          state.shopId = null;
        }
        toast.success('Item removed from cart');
      });
  },
});

export default cartSlice.reducer;