import {
  Container,
  Typography,
  Button,
  Stack,
  FormControlLabel,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Grid } from '@mui/material';

import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';

export default function RecipesList() {
  const recipes = useSelector((s: RootState) => s.recipes);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const filtered = recipes
    .filter(r => difficultyFilter.length === 0 || difficultyFilter.includes(r.difficulty))
    .sort((a, b) => {
      const ta = a.steps.reduce((s, st) => s + st.durationMinutes, 0);
      const tb = b.steps.reduce((s, st) => s + st.durationMinutes, 0);
      return sort === 'asc' ? ta - tb : tb - ta;
    });

  const toggleDifficulty = (diff: string) => {
    setDifficultyFilter((prev) =>
      prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff]
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Recipes</Typography>
        <Button variant="contained" onClick={() => navigate('/create')}>
          Create Recipe
        </Button>
      </Stack>
      <Stack direction="row" spacing={2} mb={2}>
        {['Easy', 'Medium', 'Hard'].map(d => (
          <FormControlLabel
            key={d}
            control={<Checkbox checked={difficultyFilter.includes(d)} onChange={() => toggleDifficulty(d)} />}
            label={d}
          />
        ))}
        <ToggleButtonGroup
          value={sort}
          exclusive
          onChange={(_, v) => v && setSort(v)}
        >
          <ToggleButton value="asc">Sort: Low → High</ToggleButton>
          <ToggleButton value="desc">Sort: High → Low</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Grid container spacing={2}>
        {filtered.map(r => (
          <Grid size={{ xs: 12, md: 6 }} key={r.id}>
            <RecipeCard recipe={r} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
