// src/App.js
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// MUI Components for layout and styling
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';

// Import all your page components
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import StartPage from './pages/StartPage';
import HistoryPage from './pages/HistoryPage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import DetailedHistoryPage from './pages/DetailedHistoryPage';

// Import helper components and context
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Import simplified CSS
import './App.css';

function App() {
  const { token, logoutAction } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline styles and background color */}
      <BrowserRouter>
        {/* AppBar provides a consistent header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Modern Exam App
            </Typography>
            {!token ? (
              <>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/register">Register</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/start">Start Exam</Button>
                <Button color="inherit" component={Link} to="/history">History</Button>
                <Button
                  color="inherit"
                  onClick={logoutAction}
                  sx={{ color: 'secondary.main' }}
                >
                  Logout
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes Wrapper */}
            <Route element={<ProtectedRoute />}>
              <Route path="/start" element={<StartPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/exam" element={<ExamPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/history/:attemptId" element={<DetailedHistoryPage />} />
            </Route>

            {/* Default route redirects user based on login status */}
            <Route path="*" element={<Navigate to={token ? "/start" : "/login"} />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
