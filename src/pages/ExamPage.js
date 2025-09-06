// src/pages/ExamPage.js
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { startExam, saveResult } from '../services/api';
import { Box, Button, Card, CardContent, Typography, LinearProgress, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

const areArraysEqual = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();
    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

export default function ExamPage() {
    const { token, logoutAction } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const params = location.state?.params;

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [loading, setLoading] = useState(true);

    const handleSubmit = useCallback(async () => {
        let score = 0;
        const detailed_results = questions.map(q => {
            const userAnswer = answers[q.id];
            let isCorrect = false;

            if (q.isMultipleChoice) {
                isCorrect = areArraysEqual(userAnswer, q.correctAnswers);
            } else {
                isCorrect = userAnswer === q.correctAnswers[0];
            }
            if (isCorrect) score++;

            const yourAnswerString = Array.isArray(userAnswer) ? userAnswer.join(', ') : (userAnswer || "Not Answered");

            return {
                question_text: q.question_text,
                your_answer: yourAnswerString,
                correct_answer: q.correctAnswers.join(', '),
                is_correct: isCorrect,
                isMultipleChoice: q.isMultipleChoice,
                options: q.options
            };
        });

        const resultData = {
            topic: params?.topic,
            score: score,
            total: questions.length,
            detailed_results: detailed_results
        };

        try {
            await saveResult(resultData, token);
            navigate('/result', { state: { submissionDetails: resultData } });
        } catch (error) {
            alert("There was an error saving your exam result.");
        }
    }, [answers, questions, navigate, token, params]);

    useEffect(() => {
        if (!params) { navigate('/start'); return; }
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await startExam(token, params);
                setQuestions(response.data || []);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    alert('Your session has expired. Please log in again.');
                    logoutAction();
                    navigate('/login');
                } else {
                    alert('Failed to load exam questions.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [token, params, navigate, logoutAction]);

    useEffect(() => {
        if (!loading && questions.length > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) { clearInterval(timer); handleSubmit(); return 0; }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, questions, handleSubmit]);

    const handleAnswerSelect = (question, selectedOption) => {
        const questionId = question.id;
        const currentAnswers = answers[questionId];
        if (question.isMultipleChoice) {
            const newAnswers = currentAnswers ? [...currentAnswers] : [];
            const optionIndex = newAnswers.indexOf(selectedOption);
            if (optionIndex > -1) {
                newAnswers.splice(optionIndex, 1);
            } else {
                newAnswers.push(selectedOption);
            }
            setAnswers({ ...answers, [questionId]: newAnswers });
        } else {
            setAnswers({ ...answers, [questionId]: selectedOption });
        }
    };

    if (loading) return <h1>Loading Exam...</h1>;
    if (!questions || questions.length === 0) return <h1>No questions available. Try different parameters.</h1>;

    const currentQuestion = questions[currentQuestionIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const progress = (timeLeft / (30 * 60)) * 100;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Exam In Progress</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Typography>
                </Box>
            </Box>

            <Card>
                <CardContent>
                    <Typography variant="h6" color="text.secondary">Question {currentQuestionIndex + 1}/{questions.length}</Typography>
                    <Typography variant="h5" sx={{ my: 2 }}>{currentQuestion.question_text}</Typography>

                    {currentQuestion.isMultipleChoice ? (
                        <FormGroup>
                            {currentQuestion.options.map(option => (
                                <FormControlLabel
                                    key={option}
                                    control={
                                        <Checkbox
                                            checked={answers[currentQuestion.id]?.includes(option) || false}
                                            onChange={() => handleAnswerSelect(currentQuestion, option)}
                                        />
                                    }
                                    label={option}
                                />
                            ))}
                        </FormGroup>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {currentQuestion.options.map(option => (
                                <Button
                                    key={option}
                                    variant={answers[currentQuestion.id] === option ? "contained" : "outlined"}
                                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                                >
                                    {option}
                                </Button>
                            ))}
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={() => setCurrentQuestionIndex(i => i - 1)} disabled={currentQuestionIndex === 0}>Previous</Button>
                {currentQuestionIndex < questions.length - 1 ? (
                    <Button onClick={() => setCurrentQuestionIndex(i => i + 1)} variant="contained">Next</Button>
                ) : (
                    <Button onClick={handleSubmit} variant="contained" color="success">Submit Exam</Button>
                )}
            </Box>
        </Box>
    );
}