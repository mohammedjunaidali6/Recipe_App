import {
  Container, TextField, Typography, Button, MenuItem, Stack, Divider, Paper, Snackbar
} from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
const addRecipe = (recipe: Recipe) => ({ type: 'recipes/addRecipe', payload: recipe });
import type { Difficulty, Ingredient, RecipeStep, Recipe } from '../features/recipes/types';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function CreateRecipe() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [snack, setSnack] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addIngredient = () => {
    setIngredients([...ingredients, { id: uuid(), name: '', quantity: 1, unit: 'g' }]);
  };
  const addStep = () => {
    setSteps([...steps, { id: uuid(), description: '', type: 'instruction', durationMinutes: 1, ingredientIds: [] }]);
  };

  const saveRecipe = () => {
    if (title.length < 3 || ingredients.length < 1 || steps.length < 1) return;
    const recipe: Recipe = {
      id: uuid(),
      title,
      difficulty,
      ingredients,
      steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch(addRecipe(recipe));
    setSnack(true);
    setTimeout(() => navigate('/recipes'), 1000);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>Create Recipe</Typography>
      <Stack spacing={2}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextField
          select
          label="Difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </TextField>

        <Divider>Ingredients</Divider>
        {ingredients.map((ing, i) => (
          <Paper key={ing.id} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                label="Name"
                value={ing.name}
                onChange={(e) => {
                  const arr = [...ingredients];
                  arr[i].name = e.target.value;
                  setIngredients(arr);
                }}
                size="small"
              />
              <TextField
                label="Qty"
                type="number"
                value={ing.quantity}
                onChange={(e) => {
                  const arr = [...ingredients];
                  arr[i].quantity = parseFloat(e.target.value);
                  setIngredients(arr);
                }}
                size="small"
                sx={{ width: 100 }}
              />
              <TextField
                label="Unit"
                value={ing.unit}
                onChange={(e) => {
                  const arr = [...ingredients];
                  arr[i].unit = e.target.value;
                  setIngredients(arr);
                }}
                size="small"
                sx={{ width: 100 }}
              />
              <Button
                color="error"
                onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                size="small"
              >
                Remove
              </Button>
            </Stack>
          </Paper>
        ))}

        <Button variant="outlined" onClick={addIngredient}>Add Ingredient</Button>

        <Divider>Steps</Divider>
        {steps.map((s, i) => (
          <Paper key={s.id} sx={{ p: 2 }}>
            <Stack spacing={1}>
              <TextField
                label="Description"
                value={s.description}
                onChange={(e) => {
                  const arr = [...steps];
                  arr[i].description = e.target.value;
                  setSteps(arr);
                }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  label="Duration (min)"
                  type="number"
                  value={s.durationMinutes}
                  onChange={(e) => {
                    const arr = [...steps];
                    arr[i].durationMinutes = parseInt(e.target.value || '0', 10);
                    setSteps(arr);
                  }}
                  size="small"
                  sx={{ width: 150 }}
                />
                <Button
                  color="error"
                  onClick={() => setSteps(steps.filter((_, idx) => idx !== i))}
                  size="small"
                >
                  Remove Step
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}

        <Button variant="outlined" onClick={addStep}>Add Step</Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button onClick={() => navigate('/recipes')}>Cancel</Button>
          <Button variant="contained" onClick={saveRecipe}>Save Recipe</Button>
        </Stack>
      </Stack>

      <Snackbar
        open={snack}
        onClose={() => setSnack(false)}
        message="Recipe saved"
        autoHideDuration={3000}
      />
    </Container>
  );
}
