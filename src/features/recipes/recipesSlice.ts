import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Recipe } from '../recipes/types';

const STORAGE_KEY = 'recipes:v1';

const loadRecipes = (): Recipe[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveRecipes = (recipes: Recipe[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
};

const initialState: Recipe[] = loadRecipes();

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.push(action.payload);
      saveRecipes(state);
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.findIndex(r => r.id === action.payload.id);
      if (index >= 0) {
        state[index] = action.payload;
        saveRecipes(state);
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const recipe = state.find(r => r.id === action.payload);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        saveRecipes(state);
      }
    },
  },
});

export const { addRecipe, updateRecipe, toggleFavorite } = recipesSlice.actions;
export default recipesSlice.reducer;
