// src/pages/StartPage.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopics } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Import Material-UI components
import {
    Button,
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField
} from '@mui/material';

export default function StartPage() {
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    const [selectedTopic, setSelectedTopic] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [limit, setLimit] = useState(5);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await getTopics(token);
                setTopics(response.data);
            } catch (error) {
                alert('Could not fetch topics.');
            }
        };
        fetchTopics();
    }, [token]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const params = {
            topic: selectedTopic,
            difficulty: difficulty,
            limit: limit || 5,
        };
        navigate('/exam', { state: { params } });
    };

    return (
        <Container component="main" maxWidth="sm">
            <Card sx={{ mt: 8, boxShadow: 3 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Set Up Your Exam
                        </Typography>

                        {/* MUI Select component for Topics */}
                        <FormControl fullWidth>
                            <InputLabel id="topic-select-label">Topic</InputLabel>
                            <Select
                                labelId="topic-select-label"
                                id="topic"
                                value={selectedTopic}
                                label="Topic"
                                onChange={(e) => setSelectedTopic(e.target.value)}
                            >
                                <MenuItem value="">All Topics</MenuItem>
                                {topics.map(topic => <MenuItem key={topic} value={topic}>{topic}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {/* MUI Select component for Difficulty */}
                        <FormControl fullWidth>
                            <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                            <Select
                                labelId="difficulty-select-label"
                                id="difficulty"
                                value={difficulty}
                                label="Difficulty"
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <MenuItem value="">Any</MenuItem>
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>

                        {/* MUI TextField for Number of Questions */}
                        <TextField
                            id="limit"
                            label="Number of Questions"
                            type="number"
                            value={limit}
                            onChange={(e) => setLimit(parseInt(e.target.value) || '')}
                            InputProps={{ inputProps: { min: 1, max: 20 } }}
                            fullWidth
                        />

                        <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                            Start Exam
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}