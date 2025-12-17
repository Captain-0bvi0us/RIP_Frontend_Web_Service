import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldLockFill, ArrowLeft } from 'react-bootstrap-icons';
import './styles/ErrorPages.css';



export const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <div className="error-page-container">
            <div className="error-card">
                <div className="error-code">403</div>
                <div className="error-content">
                    <div className="error-icon-wrapper">
                        <ShieldLockFill size={40} />
                    </div>
                    <h1 className="error-title">Доступ запрещен</h1>
                    <p className="error-desc">
                        У вас недостаточно прав для просмотра этой страницы.
                        Этот раздел доступен только модераторам системы FRAX.
                    </p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="rounded-pill px-4">
                            <ArrowLeft className="me-2" /> Назад
                        </Button>
                        <Link to="/">
                            <Button variant="danger" className="rounded-pill px-4 shadow-sm">
                                На главную
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};