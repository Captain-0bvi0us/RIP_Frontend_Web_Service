import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/userSlice';
import type { AppDispatch, RootState } from '../store';
import { BoxArrowInRight, ExclamationTriangleFill } from 'react-bootstrap-icons';
import './styles/LoginPage.css';

export const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        dispatch(clearError());
        if (isAuthenticated) {
            navigate('/factors');
        }
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(clearError()); 
        dispatch(loginUser(formData));
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 background-color-login">
            <Container style={{ maxWidth: '400px' }}>
                <Card className="shadow border-0 rounded-4">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold" style={{ color: '#495057' }}>Вход</h2>
                            <p className="text-muted">Добро пожаловать в FRAX Calculator</p>
                        </div>
                        {error && (
                            <Alert variant="danger" className="d-flex align-items-center mb-4 shadow-sm animate-fade-in">
                                <ExclamationTriangleFill className="me-3 flex-shrink-0" size={24} />
                                <div>{error}</div>
                            </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                            <Form.Floating className="mb-3">
                                <Form.Control
                                    id="username"
                                    type="text"
                                    placeholder="Логин"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    isInvalid={!!error && error.toLowerCase().includes('пользователь')}
                                />
                                <label htmlFor="username" style={{ color: '#495057' }}>Логин</label>
                            </Form.Floating>

                            <Form.Floating className="mb-4">
                                <Form.Control
                                    id="password"
                                    type="password"
                                    placeholder="Пароль"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    isInvalid={!!error && error.toLowerCase().includes('пароль')}
                                />
                                <label htmlFor="password" style={{ color: '#495057' }}>Пароль</label>
                            </Form.Floating>

                            <Button 
                                variant="danger" 
                                type="submit" 
                                className="w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" animation="border" /> 
                                        <span>Вход...</span>
                                    </>
                                ) : (
                                    <>
                                        <BoxArrowInRight size={20}/> 
                                        <span>Войти</span>
                                    </>
                                )}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">Нет аккаунта? </span>
                            <Link to="/register" className="text-danger fw-bold text-decoration-none hover-underline">
                                Зарегистрироваться
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};