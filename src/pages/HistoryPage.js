// src/pages/HistoryPage.js
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../services/api';

// Import Material-UI components
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
    Grow // ✅ Added Grow for transition
} from '@mui/material';

export default function HistoryPage() {
    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token, logoutAction } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getHistory(token);
                setHistory(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    logoutAction();
                    navigate('/login');
                } else {
                    alert('Failed to fetch history.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token, navigate, logoutAction]);

    if (loading) {
        // A better loading indicator from MUI
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!history || history.attempts.length === 0) {
        return (
            <Grow in={!loading}>
                <Container>
                    <Typography variant="h4" align="center">No Exam History Found</Typography>
                    <Typography align="center">Complete an exam to see your results here.</Typography>
                </Container>
            </Grow>
        );
    }

    return (
        // ✅ Wrap in Grow transition
        <Grow in={!loading}>
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Exam History
                </Typography>

                {/* Performance by Topic Card */}
                <Card sx={{ mb: 4, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Performance by Topic
                        </Typography>
                        <Box>
                            {history.topic_stats.map(stat => (
                                <Box
                                    key={stat.topic}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold', minWidth: '100px' }}
                                    >
                                        {stat.topic}:
                                    </Typography>
                                    <Chip label={`${stat.correct} correct`} color="success" variant="outlined" />
                                    <Chip label={`${stat.incorrect} incorrect`} color="error" variant="outlined" />
                                    <Typography variant="body2" color="text.secondary">
                                        ({stat.total} total)
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </CardContent>
                </Card>

                {/* Past Attempts Card */}
                <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Past Attempts
                        </Typography>
                        <List>
                            {history.attempts.map((attempt, index) => (
                                <div key={attempt.id}>
                                    <ListItem button component={Link} to={`/history/${attempt.id}`}>
                                        <ListItemText
                                            primary={`${attempt.topic || 'Mixed'} Exam`}
                                            secondary={`Taken on: ${new Date(attempt.submitted_at).toLocaleDateString()}`}
                                        />
                                        <Typography variant="h6" color="primary">
                                            Score: {attempt.score} / {attempt.total_questions}
                                        </Typography>
                                    </ListItem>
                                    {index < history.attempts.length - 1 && <Divider />}
                                </div>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Container>
        </Grow>
    );
}
