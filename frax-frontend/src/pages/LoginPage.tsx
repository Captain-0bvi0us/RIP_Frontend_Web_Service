import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/userSlice';
import type { AppDispatch, RootState } from '../store';
import { BoxArrowInRight } from 'react-bootstrap-icons';
import './styles/main.css';

export const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/factors');
        }
        dispatch(clearError());
    }, [isAuthenticated, navigate, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(loginUser(formData)).unwrap();
            navigate('/factors');
        } catch (err) {
            console.error(err);
        }
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

                        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Floating className="mb-3">
                                <Form.Control
                                    id="username"
                                    type="text"
                                    placeholder="Логин"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
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
                                />
                                <label htmlFor="password" style={{ color: '#495057' }}>Пароль</label>
                            </Form.Floating>

                            <Button 
                                variant="danger" 
                                type="submit" 
                                className="w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
                                disabled={loading}
                            >
                                {loading ? <Spinner size="sm" animation="border" /> : <><BoxArrowInRight size={20}/> Войти</>}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <span className="text-muted">Нет аккаунта? </span>
                            <Link to="/register" className="text-danger fw-bold text-decoration-none">
                                Зарегистрироваться
                            </Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};