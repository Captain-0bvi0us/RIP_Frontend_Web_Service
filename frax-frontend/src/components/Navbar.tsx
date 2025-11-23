import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import { logoutUser } from '../store/slices/userSlice';
import { deleteOrder } from '../store/slices/fraxSlice'; 
import { fetchCartBadge } from '../store/slices/cartSlice';
import type { RootState, AppDispatch } from '../store';



export const AppNavbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.user);
    const { frax_id } = useSelector((state: RootState) => state.cart);

    const handleLogout = async () => {
        if (frax_id) {
            try {
                await dispatch(deleteOrder(frax_id)).unwrap();
                console.log(`Черновик ${frax_id} был автоматически удален при выходе.`);
            } catch (e) {
                console.error("Не удалось удалить черновик при выходе", e);
            }
        }
        dispatch(logoutUser())
            .then(() => {
                dispatch(fetchCartBadge());
                navigate('/login');
            });
    };

    return (
        <Navbar bg="danger" variant="dark" fixed="top" className="shadow-sm" expand="lg">
            <Container fluid className='px-3 px-md-7'>
                <Navbar.Brand className='fs-4 fw-bold' as={Link} to="/">
                    FRAXCALCULATOR.ORG
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    
                    <Nav className="ms-auto align-items-center gap-2">   

                        <Nav.Link className='text-white' as={Link} to="/factors">
                            Факторы риска
                        </Nav.Link>

                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/orders" className="text-white">
                                    Мои заявки
                                </Nav.Link>

                                <div className="text-white mx-2 d-none d-lg-block">|</div>

                                <Nav.Link as={Link} to="/profile" className="text-white d-flex align-items-center gap-2">
                                    <PersonCircle size={20} />
                                    <span className="fw-bold">
                                        {user?.username || user?.full_name || 'Пользователь'}
                                    </span>
                                </Nav.Link>

                                <Button 
                                    variant="outline-light" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="d-flex align-items-center gap-2"
                                >
                                    <BoxArrowRight /> Выход
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="text-white mx-2 d-none d-lg-block">|</div>
                                <Nav.Link as={Link} to="/login" className="text-white">
                                    Вход
                                </Nav.Link>
                                <Link to="/register">
                                    <Button variant="light" className="text-danger fw-bold">
                                        Регистрация
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};