// src/pages/DetailedHistoryPage.js
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHistoryDetail } from '../services/api';

// Import Material-UI components
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Button
} from '@mui/material';

// Import MUI Icons for visual feedback
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DetailedHistoryPage() {
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const { attemptId } = useParams();
    const { token, logoutAction } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await getHistoryDetail(attemptId, token);
                setDetails(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    logoutAction();
                    navigate('/login');
                } else {
                    alert('Failed to fetch attempt details.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [attemptId, token, navigate, logoutAction]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Exam Details
            </Typography>

            <Box sx={{ mt: 4 }}>
                {details.map((item, index) => (
                    // Each question is rendered in its own Card for a clean look
                    <Card key={index} sx={{ mb: 2, boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h6" component="p" gutterBottom>
                                Q: {item.question_text}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                {item.is_correct ? (
                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                ) : (
                                    <CancelIcon color="error" sx={{ mr: 1 }} />
                                )}
                                <Typography variant="body1" color={item.is_correct ? 'success.main' : 'error.main'}>
                                    Your answer: {item.your_answer}
                                </Typography>
                            </Box>

                            {!item.is_correct && (
                                <Typography variant="body1" color="info.main">
                                    Correct answer: {item.correct_answer}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                    component={Link}
                    to="/history"
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                >
                    Back to History
                </Button>
            </Box>
        </Container>
    );
}