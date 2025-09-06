// src/pages/LoginPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, TextField, Container, Typography, Card, CardContent, Box } from '@mui/material';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { loginAction } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await login(username, password);
            const token = response.data.access_token;
            loginAction(token); // Save the token using our context
            navigate('/start');  // Redirect to the exam page
        } catch (error) {
            alert(error.response?.data?.detail || 'Login failed.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Card sx={{ mt: 8 }}>
                <CardContent>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Login
                        </Typography>
                        <TextField
                            label="Username"
                            variant="outlined"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="contained" size="large" fullWidth>
                            Login
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}