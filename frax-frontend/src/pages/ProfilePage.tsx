import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PersonCircle, PencilSquare, CheckLg, XLg, BoxArrowRight } from 'react-bootstrap-icons';
import { updateUserProfile, logoutUser } from '../store/slices/userSlice';
import type { RootState, AppDispatch } from '../store';
import './styles/main.css';

export const ProfilePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, token } = useSelector((state: RootState) => state.user);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ full_name: '', username: '', password: '' });

    useEffect(() => {
        if (!token) navigate('/login');
    }, [token, navigate]);

    useEffect(() => {
        if (user) {
            setEditData({
                full_name: user.full_name || '',
                username: user.username || '',
                password: '',
            });
        }
    }, [user]);

    const handleSave = () => {
        if (user?.id) {
            dispatch(updateUserProfile({ id: user.id, data: editData }))
            .unwrap()
            .then(() => {
                setIsEditing(false);
                setEditData(prev => ({ ...prev, password: '' }));
                alert('Профиль обновлен!');
            })
            .catch((err) => alert(`Ошибка: ${err}`));
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            full_name: user?.full_name || '', 
            username: user?.username || '', 
            password: ''
        });
    };

    if (!user) return null;

    return (
        <div className="background-color-profile">
            <Container className="pt-5 mt-5">
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow-sm border-0 rounded-4">
                            <Card.Header className="bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                                <h3 className="fw-bold mb-0" style={{ color: '#495057' }}>Личный кабинет</h3>
                                {user.moderator && (
                                    <Badge bg="warning" text="dark" className="fs-6">
                                        MODERATOR
                                    </Badge>
                                )}
                            </Card.Header>
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                                    <div className="me-4">
                                        <PersonCircle size={80} color="#495057" />
                                    </div>
                                    <div>
                                        <h4 className="fw-bold mb-1">{user.full_name}</h4>
                                        <p className="text-muted mb-0">@{user.username}</p>
                                        <p className="text-muted small">ID: {user.id}</p>
                                    </div>
                                </div>

                                <Form>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label style={{ color: '#495057', fontWeight: '500' }}>ФИО</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={isEditing ? editData.full_name : user.full_name || ''}
                                                    onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={isEditing ? 'border-danger' : 'bg-light'}
                                                />
                                            </Form.Group>
                                        </Col>
                                        
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label style={{ color: '#495057', fontWeight: '500' }}>Логин</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={isEditing ? editData.username : user.username || ''}
                                                    onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={isEditing ? 'border-danger' : 'bg-light'}
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label style={{ color: '#495057', fontWeight: '500' }}>
                                                    {isEditing ? 'Новый пароль' : 'Пароль'}
                                                </Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    value={isEditing ? editData.password : '********'}
                                                    placeholder={isEditing ? 'Введите новый пароль для изменения' : ''}
                                                    onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={isEditing ? 'border-danger' : 'bg-light'}
                                                />
                                                {isEditing && (
                                                    <Form.Text className="text-muted">
                                                        Оставьте пустым, если не хотите менять пароль.
                                                    </Form.Text>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex justify-content-between align-items-center mt-5">
                                        <div>
                                            {!isEditing ? (
                                                <Button 
                                                    variant="outline-secondary" 
                                                    onClick={() => setIsEditing(true)}
                                                    className="d-flex align-items-center gap-2"
                                                >
                                                    <PencilSquare /> Редактировать
                                                </Button>
                                            ) : (
                                                <div className="d-flex gap-2">
                                                    <Button 
                                                        variant="success" 
                                                        onClick={handleSave}
                                                        className="d-flex align-items-center gap-2"
                                                    >
                                                        <CheckLg /> Сохранить
                                                    </Button>
                                                    <Button 
                                                        variant="outline-danger" 
                                                        onClick={handleCancel}
                                                        className="d-flex align-items-center gap-2"
                                                    >
                                                        <XLg /> Отмена
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Button 
                                            variant="danger" 
                                            onClick={handleLogout}
                                            className="d-flex align-items-center gap-2"
                                        >
                                            <BoxArrowRight /> Выйти из аккаунта
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};