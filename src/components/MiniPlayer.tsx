import { Card, CardContent, Typography, IconButton, CircularProgress, Stack } from '@mui/material';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { pauseSession, resumeSession, stopStep } from '../features/session/sessionSlice';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/time';

export default function MiniPlayer() {
  const { activeRecipeId, byRecipeId } = useSelector((s: RootState) => s.session);
  const recipes = useSelector((s: RootState) => s.recipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!activeRecipeId) return null;
  const session = byRecipeId[activeRecipeId];
  if (!session) return null;

  const recipe = recipes.find(r => r.id === activeRecipeId);
  if (!recipe) return null;

  const totalSteps = recipe.steps.length;
  const current = session.currentStepIndex + 1;
  const progress =
    Math.round(((recipe.steps[session.currentStepIndex].durationMinutes * 60 - session.stepRemainingSec) /
      (recipe.steps[session.currentStepIndex].durationMinutes * 60)) *
    100);

  return (
    <Card
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 300,
        zIndex: 999,
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/cook/${activeRecipeId}`)}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <CircularProgress variant="determinate" value={progress} size={48} />
          <Stack flexGrow={1}>
            <Typography variant="body1">{recipe.title}</Typography>
            <Typography variant="caption">
              Step {current} of {totalSteps} · {formatTime(session.stepRemainingSec)}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                session.isRunning
                  ? dispatch(pauseSession())
                  : dispatch(resumeSession());
              }}
            >
              {session.isRunning ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                dispatch(stopStep({ totalSteps }));
              }}
            >
              <StopIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
