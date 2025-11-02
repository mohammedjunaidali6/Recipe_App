import {
  Container, Typography, Button, Stack, LinearProgress, CircularProgress, Chip, Paper,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useEffect } from 'react';
import { startSession, tickSecond, pauseSession, resumeSession, stopStep } from '../features/session/sessionSlice';
import { formatTime } from '../utils/time';

export default function CookSession() {
  const { id } = useParams();
  const recipes = useSelector((s: RootState) => s.recipes);
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const recipe = recipes.find(r => r.id === id);
  const active = id && session.activeRecipeId === id ? session.byRecipeId[id] : null;

  useEffect(() => {
    if (!recipe) return;
    if (!active) return;
    const timer = setInterval(() => {
      if (!active.isRunning) return;
      const delta = (Date.now() - (active.lastTickTs || Date.now())) / 1000;
      dispatch(
        tickSecond({
          deltaSec: delta,
          totalSteps: recipe.steps.length,
          nextStepDurationSec: recipe.steps[active.currentStepIndex + 1]?.durationMinutes * 60,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [active, dispatch, recipe]);

  if (!recipe) return <Typography>Recipe not found.</Typography>;

  const totalDurationSec = recipe.steps.reduce((a, s) => a + s.durationMinutes * 60, 0);

  const start = () => {
    dispatch(
      startSession({
        recipeId: recipe.id,
        totalDurationSec,
        firstStepDurationSec: recipe.steps[0].durationMinutes * 60,
      })
    );
  };

  if (!active)
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4">{recipe.title}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={start}>
          Start Session
        </Button>
      </Container>
    );

  const currentStep = recipe.steps[active.currentStepIndex];
  const stepElapsed = currentStep.durationMinutes * 60 - active.stepRemainingSec;
  const stepProgress = Math.round((stepElapsed / (currentStep.durationMinutes * 60)) * 100);
  const overallElapsed = totalDurationSec - active.overallRemainingSec;
  const overallProgress = Math.round((overallElapsed / totalDurationSec) * 100);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">{recipe.title}</Typography>
      <Chip label={recipe.difficulty} sx={{ mb: 2 }} />

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6">
          Step {active.currentStepIndex + 1} of {recipe.steps.length}
        </Typography>
        <Typography>{currentStep.description}</Typography>
        <Stack alignItems="center" sx={{ my: 2 }}>
          <CircularProgress variant="determinate" value={stepProgress} size={100} />
          <Typography mt={1}>{formatTime(active.stepRemainingSec)}</Typography>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() =>
              active.isRunning ? dispatch(pauseSession()) : dispatch(resumeSession())
            }
          >
            {active.isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              dispatch(
                stopStep({
                  totalSteps: recipe.steps.length,
                  nextStepDurationSec:
                    recipe.steps[active.currentStepIndex + 1]?.durationMinutes * 60,
                })
              )
            }
          >
            STOP
          </Button>
        </Stack>
      </Paper>

      <Typography variant="h6" mb={1}>
        Overall Progress
      </Typography>
      <LinearProgress variant="determinate" value={overallProgress} />
      <Typography mt={1}>
        Remaining: {formatTime(active.overallRemainingSec)} · {overallProgress}%
      </Typography>
    </Container>
  );
}
