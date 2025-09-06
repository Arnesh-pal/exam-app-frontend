// src/pages/ResultPage.js
import { useLocation, useNavigate, Link } from 'react-router-dom';

// Import Material-UI components
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Button,
    Chip
} from '@mui/material';

// Import MUI Icons for visual feedback
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReplayIcon from '@mui/icons-material/Replay';
import HistoryIcon from '@mui/icons-material/History';


export default function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const submissionDetails = location.state?.submissionDetails;

    if (!submissionDetails) {
        return (
            <Container maxWidth="sm">
                <Card sx={{ mt: 8, p: 4, textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>No result found</Typography>
                    <Typography>Please complete an exam to see your score.</Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/start')}
                        sx={{ mt: 2 }}
                    >
                        Start an Exam
                    </Button>
                </Card>
            </Container>
        );
    }

    const { score, total, detailed_results } = submissionDetails;
    const percentage = total > 0 ? (score / total * 100).toFixed(0) : 0;

    return (
        <Container maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Exam Complete!
            </Typography>

            {/* Main Score Card */}
            <Card sx={{ mb: 4, boxShadow: 3, textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h6" color="text.secondary">Your Score</Typography>
                    <Typography variant="h2" component="p" sx={{ fontWeight: 'bold', my: 1 }}>
                        {score} / {total}
                    </Typography>
                    <Chip label={`${percentage}%`} color={percentage >= 50 ? "success" : "error"} />
                </CardContent>
            </Card>

            {/* Answer Breakdown Section */}
            <Typography variant="h5" component="h2" gutterBottom>
                Answer Breakdown
            </Typography>
            <Box>
                {detailed_results.map((item, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
                        <CardContent>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }} gutterBottom>
                                Q: {item.question_text}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                                {item.is_correct ? (
                                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                ) : (
                                    <CancelIcon color="error" sx={{ mr: 1 }} />
                                )}
                                <Typography variant="body2" color={item.is_correct ? 'text.primary' : 'error.main'}>
                                    Your answer: {item.your_answer}
                                </Typography>
                            </Box>
                            {!item.is_correct && (
                                <Typography variant="body2" color="text.secondary">
                                    Correct answer: {item.correct_answer}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<ReplayIcon />}
                    onClick={() => navigate('/start')}
                >
                    Take Again
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<HistoryIcon />}
                    component={Link}
                    to="/history"
                >
                    View History
                </Button>
            </Box>
        </Container>
    );
}