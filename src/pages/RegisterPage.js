// src/pages/RegisterPage.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';

// Import Material-UI components
import { Button, TextField, Container, Typography, Card, CardContent, Box } from '@mui/material';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await register(username, password);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.detail || 'Registration failed.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card sx={{ mt: 8, boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Use Box as the form container with flexbox for easy spacing */}
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Create Account
                        </Typography>

                        {/* MUI's TextField combines the label and input */}
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

                        {/* A modern, pre-styled button from MUI */}
                        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                            Register
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}