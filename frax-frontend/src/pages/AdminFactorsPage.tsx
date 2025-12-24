import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Modal, Form, Spinner, Image, Badge, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    fetchFactorsThunk, 
    deleteFactor, 
    createFactor, 
    updateFactor 
} from '../store/slices/factorsSlice';
import { PencilSquare, Trash, PlusLg, ArrowLeft, Image as ImageIcon } from 'react-bootstrap-icons';
import type { AppDispatch, RootState } from '../store';
import type { IFactor } from '../types';



const MINIO_BASE_URL = 'http://localhost:9000/factors/Images/';
const IMAGE_EXTENSION = '.png';

export const AdminFactorsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, loading, actionLoading } = useSelector((state: RootState) => state.factors);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ title: '', text: '', argument: 0 });
    const [imageShortName, setImageShortName] = useState(''); 

    useEffect(() => {
            dispatch(fetchFactorsThunk(''));
        }, [dispatch]);
    const extractShortName = (fullUrl?: string) => {
        if (!fullUrl) return '';
        let name = fullUrl.replace(MINIO_BASE_URL, '');
        name = name.replace(IMAGE_EXTENSION, '');
        return name;
    };

    const handleOpenModal = (factor?: IFactor) => {
        if (factor) {
            setIsEditing(true);
            setSelectedId(factor.id);
            setFormData({
                title: factor.title,
                text: factor.text,
                argument: factor.argument || 0
            });
            setImageShortName(extractShortName(factor.image));
        } else {
            setIsEditing(false);
            setSelectedId(null);
            setFormData({ title: '', text: '', argument: 0 });
            setImageShortName('');
        }
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот фактор?')) {
            await dispatch(deleteFactor(id));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();      
        try {
            const fullImageUrl = imageShortName.trim() 
                ? `${MINIO_BASE_URL}${imageShortName.trim()}${IMAGE_EXTENSION}`
                : undefined;
            const requestData = {
                ...formData,
                image: fullImageUrl 
            };

            if (isEditing && selectedId) {
                await dispatch(updateFactor({ 
                    id: selectedId, 
                    // @ts-ignore
                    data: requestData 
                })).unwrap();
            } else {
                await dispatch(createFactor(
                    // @ts-ignore
                    requestData
                )).unwrap();
            }

            setShowModal(false);
            dispatch(fetchFactorsThunk('')); 

        } catch (error) {
            alert('Произошла ошибка при сохранении.');
            console.error(error);
        }
    };

    return (
        <Container className="pt-5 mt-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-3">
                    <Button variant="outline-secondary" onClick={() => navigate('/factors')}>
                        <ArrowLeft /> Назад
                    </Button>
                    <h2 className="fw-bold m-0 text-secondary">Управление факторами</h2>
                </div>
                <Button variant="success" onClick={() => handleOpenModal()}>
                    <PlusLg className="me-2" /> Добавить фактор
                </Button>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-0">
                    <Table responsive hover className="m-0 align-middle">
                        <thead className="bg-light text-secondary small text-uppercase">
                            <tr>
                                <th className="ps-4 py-3">ID</th>
                                <th>Изображение</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Вес</th>
                                <th className="text-end pe-4">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-5"><Spinner animation="border" variant="danger" /></td></tr>
                            ) : items.map(factor => (
                                <tr key={factor.id} style={{ height: '80px' }}>
                                    <td className="ps-4 fw-bold text-muted">#{factor.id}</td>
                                    <td>
                                        <div className="rounded border d-flex align-items-center justify-content-center bg-light" style={{ width: 50, height: 50, overflow: 'hidden' }}>
                                            {factor.image ? (
                                                <Image src={factor.image} width={50} height={50} style={{objectFit: 'cover'}} onError={(e) => e.currentTarget.src = '/mock_images/default.png'} />
                                            ) : <ImageIcon className="text-muted" />}
                                        </div>
                                    </td>
                                    <td className="fw-semibold">{factor.title}</td>
                                    <td className="text-muted text-truncate" style={{maxWidth: 250}}>{factor.text}</td>
                                    <td><Badge bg="info" text="dark" pill>{factor.argument}</Badge></td>
                                    <td className="text-end pe-4">
                                        <Button variant="light" size="sm" className="text-primary me-2" onClick={() => handleOpenModal(factor)}><PencilSquare size={18} /></Button>
                                        <Button variant="light" size="sm" className="text-danger" onClick={() => handleDelete(factor.id)}><Trash size={18} /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
                <Modal.Header closeButton className="border-0"><Modal.Title>{isEditing ? 'Редактирование' : 'Новая услуга'}</Modal.Title></Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Название</Form.Label>
                            <Form.Control type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Коэффициент</Form.Label>
                            <Form.Control type="number" step="0.1" value={formData.argument} onChange={e => setFormData({...formData, argument: parseFloat(e.target.value)})} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Описание</Form.Label>
                            <Form.Control as="textarea" rows={3} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} required />
                        </Form.Group>               
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold small text-muted">Имя картинки (MinIO)</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="text-muted small" style={{fontSize: '0.8rem'}}>
                                    .../Images/
                                </InputGroup.Text>
                                <Form.Control 
                                    type="text" 
                                    placeholder="название (напр. smoking)" 
                                    value={imageShortName}
                                    onChange={e => setImageShortName(e.target.value)}
                                />
                                <InputGroup.Text className="text-muted small">
                                    {IMAGE_EXTENSION}
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text className="text-muted" style={{fontSize: '0.75rem'}}>
                                Итоговый путь: {MINIO_BASE_URL}{imageShortName || '...'}{IMAGE_EXTENSION}
                            </Form.Text>
                        </Form.Group>                       
                    </Modal.Body>
                    <Modal.Footer className="border-0">
                        <Button variant="light" onClick={() => setShowModal(false)}>Отмена</Button>
                        <Button variant="success" type="submit" disabled={actionLoading}>{actionLoading ? <Spinner size="sm" animation="border" /> : 'Сохранить'}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};