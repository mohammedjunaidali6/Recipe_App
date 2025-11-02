import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type SessionState = {
  activeRecipeId: string | null;
  byRecipeId: Record<string, {
    currentStepIndex: number;
    isRunning: boolean;
    stepRemainingSec: number;
    overallRemainingSec: number;
    lastTickTs?: number;
  }>;
};

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ recipeId: string; totalDurationSec: number; firstStepDurationSec: number }>) => {
      if (state.activeRecipeId) return; // Only one session
      state.activeRecipeId = action.payload.recipeId;
      state.byRecipeId[action.payload.recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: action.payload.firstStepDurationSec,
        overallRemainingSec: action.payload.totalDurationSec,
        lastTickTs: Date.now(),
      };
    },
    pauseSession: (state) => {
      if (!state.activeRecipeId) return;
      const s = state.byRecipeId[state.activeRecipeId];
      if (s) s.isRunning = false;
    },
    resumeSession: (state) => {
      if (!state.activeRecipeId) return;
      const s = state.byRecipeId[state.activeRecipeId];
      if (s) {
        s.isRunning = true;
        s.lastTickTs = Date.now();
      }
    },
    stopStep: (state, action: PayloadAction<{ totalSteps: number; nextStepDurationSec?: number }>) => {
      const id = state.activeRecipeId;
      if (!id) return;
      const s = state.byRecipeId[id];
      if (!s) return;
      const isLast = s.currentStepIndex === action.payload.totalSteps - 1;
      if (isLast) {
        delete state.byRecipeId[id];
        state.activeRecipeId = null;
      } else {
        s.currentStepIndex += 1;
        s.stepRemainingSec = action.payload.nextStepDurationSec || 0;
        s.isRunning = true;
        s.lastTickTs = Date.now();
      }
    },
    tickSecond: (state, action: PayloadAction<{ deltaSec: number; totalSteps: number; nextStepDurationSec?: number }>) => {
      const id = state.activeRecipeId;
      if (!id) return;
      const s = state.byRecipeId[id];
      if (!s?.isRunning) return;

      s.stepRemainingSec -= action.payload.deltaSec;
      s.overallRemainingSec -= action.payload.deltaSec;

      if (s.stepRemainingSec <= 0) {
        const isLast = s.currentStepIndex === action.payload.totalSteps - 1;
        if (isLast) {
          delete state.byRecipeId[id];
          state.activeRecipeId = null;
        } else {
          s.currentStepIndex += 1;
          s.stepRemainingSec = action.payload.nextStepDurationSec || 0;
          s.isRunning = true;
          s.lastTickTs = Date.now();
        }
      } else {
        s.lastTickTs = Date.now();
      }
    },
  },
});

export const { startSession, pauseSession, resumeSession, stopStep, tickSecond } = sessionSlice.actions;
export default sessionSlice.reducer;
