import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

interface CharactersState {
  items: Character[];
  loading: boolean;
  error: string | null;
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  } | null;
}

const initialState: CharactersState = {
  items: [],
  loading: false,
  error: null,
  info: null,
};

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (
    { name = '', status = '', page = 1 }: { name?: string; status?: string; page?: number } = {},
    thunkAPI
  ) => {
    try {
      let url = `https://rickandmortyapi.com/api/character?page=${page}`;
      if (name) {
        url += `&name=${encodeURIComponent(name)}`;
      }
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      const response = await axios.get(url);
      const data = response.data;
      // Only return the first 12 results for display
      return { results: (data.results as Character[]).slice(0, 12), info: data.info };
    } catch (error: any) {
      // If the error is a 404 (no characters found), return empty results and info
      if (error.response && error.response.status === 404) {
        return { results: [], info: { count: 0, pages: 1, next: null, prev: null } };
      }
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch characters');
    }
  }
);

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setCharacters: (state, action: PayloadAction<Character[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.items = action.payload.results;
        state.loading = false;
        state.error = null;
        state.info = action.payload.info;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch characters';
      });
  },
});


export const { setCharacters } = charactersSlice.actions;
export default charactersSlice.reducer;
