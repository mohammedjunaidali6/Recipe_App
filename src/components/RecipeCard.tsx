import { Card, CardContent, Typography, Chip, IconButton, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import type { Recipe } from '../features/recipes/types';
import { useDispatch } from 'react-redux';
import { toggleFavorite } from '../features/recipes/recipesSlice';
import { useNavigate } from 'react-router-dom';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalTime = recipe.steps.reduce((s, st) => s + st.durationMinutes, 0);

  return (
    <Card
      onClick={() => navigate(`/cook/${recipe.id}`)}
      sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{recipe.title}</Typography>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleFavorite(recipe.id));
            }}
          >
            {recipe.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
          </IconButton>
        </Stack>
        <Chip label={recipe.difficulty} sx={{ mt: 1 }} />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Total time: {totalTime} min
        </Typography>
      </CardContent>
    </Card>
  );
}
