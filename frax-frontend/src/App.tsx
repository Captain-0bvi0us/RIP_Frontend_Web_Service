// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/FraxHomePage';
import { FactorsListPage } from './pages/FactorsListPage';
import { FactorDetailPage } from './pages/FactorDetailPage';

// Компонент-обертка для навбара
const Layout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet /> {/* Здесь будут рендериться дочерние роуты */}
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="factors" element={<FactorsListPage />} />
                    <Route path="factors/:id" element={<FactorDetailPage />} />
                    {/* Можно добавить страницу 404 */}
                    <Route path="*" element={<h1>Страница не найдена</h1>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;