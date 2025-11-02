import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecipesList from './pages/RecipesList';
import CreateRecipe from './pages/CreateRecipe';
import CookSession from './pages/CookSession';
import MiniPlayer from './components/MiniPlayer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/recipes" />} />
          <Route path="/recipes" element={<RecipesList />} />
          <Route path="/create" element={<CreateRecipe />} />
          <Route path="/cook/:id" element={<CookSession />} />
        </Routes>
        <MiniPlayer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;