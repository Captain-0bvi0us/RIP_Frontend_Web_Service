import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/FraxHomePage';
import { FactorsListPage } from './pages/FactorsListPage';
import { FactorDetailPage } from './pages/FactorDetailPage';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/factors" element={<FactorsListPage />} />
                    <Route path="/factors/:id" element={<FactorDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;