import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { setAuthToken } from '../../api/api';

const TOKEN_KEY = 'petlove_token';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/users/signup', data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Kayıt başarısız');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/users/signin', data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Giriş başarısız');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/users/signout');
  } catch (e) {
    // still log out client side
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue, getState }) => {
  const token = getState().auth.token || localStorage.getItem(TOKEN_KEY);
  if (!token) return rejectWithValue('No token');
  setAuthToken(token);
  try {
    const res = await api.get('/users/current');
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Kullanıcı alınamadı');
  }
});

export const updateUser = createAsyncThunk('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    const res = await api.patch('/users/current', data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Güncelleme başarısız');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem(TOKEN_KEY) || null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError(state) { state.error = null; },
    clientLogout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem(TOKEN_KEY);
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user || a.payload;
        s.token = a.payload.token;
        s.isLoggedIn = true;
        localStorage.setItem(TOKEN_KEY, a.payload.token);
        setAuthToken(a.payload.token);
      })
      .addCase(register.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(login.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload.user || a.payload;
        s.token = a.payload.token;
        s.isLoggedIn = true;
        localStorage.setItem(TOKEN_KEY, a.payload.token);
        setAuthToken(a.payload.token);
      })
      .addCase(login.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(logout.fulfilled, (s) => {
        s.user = null; s.token = null; s.isLoggedIn = false;
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })

      .addCase(fetchCurrentUser.fulfilled, (s, a) => {
        s.user = a.payload; s.isLoggedIn = true;
      })
      .addCase(fetchCurrentUser.rejected, (s) => {
        s.token = null; s.isLoggedIn = false;
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })

      .addCase(updateUser.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { clearError, clientLogout } = authSlice.actions;
export default authSlice.reducer;
