import { AppNavbar } from '../components/Navbar';
import './styles/FraxHomePage.css';

export const HomePage = () => {
    return (
        <div className="homepage-wrapper">
            <AppNavbar />

            <div className="home-page-container">
                <video autoPlay loop muted playsInline className="home-video-background">
                    <source src="/background/Background.mp4" type="video/mp4" />
                    Ваш браузер не поддерживает видео-тег.
                </video>

                <div className="home-page-content">
                    <h1>Добро пожаловать в FRAX Calculator!</h1>
                    <p className="lead fs-4">Этот сервис предназначен для оценки десятилетней вероятности переломов шейки бедра и основных остеопоротитеских переломов.</p>
                </div>
            </div>
        </div>
    );
};