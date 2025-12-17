import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Compass, HouseDoorFill } from 'react-bootstrap-icons';
import './styles/ErrorPages.css';



export const NotFoundPage = () => {
    return (
        <div className="error-page-container">
            <div className="error-card">
                <div className="error-code">404</div>
                <div className="error-content">
                    <div className="error-icon-wrapper">
                        <Compass size={40} />
                    </div>
                    <h1 className="error-title">Страница не найдена</h1>
                    <p className="error-desc">
                        Похоже, мы не можем найти то, что вы ищете. 
                        Возможно, страница была удалена или вы ввели неверный адрес.
                    </p>
                    <Link to="/">
                        <Button variant="danger" size="lg" className="px-4 rounded-pill shadow-sm">
                            <HouseDoorFill className="me-2" /> На главную
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};