import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/FraxHomePage';
import { FactorsListPage } from './pages/FactorsListPage';
import { FactorDetailPage } from './pages/FactorDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersListPage } from './pages/OrdersListPage';
import { OrderPage } from './pages/OrderPage';
import { AdminFactorsPage } from './pages/AdminFactorsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ForbiddenPage } from './pages/ForbiddenPage';
import { parseJWT } from './utils/jwt'; // Наша новая утилита
import { fetchUserProfile } from './store/slices/userSlice';
import type { RootState, AppDispatch } from './store';
import type { JSX } from 'react/jsx-runtime';



const MainLayout = () => (
    <>
        <AppNavbar />
        <main>
            <Outlet />
        </main>
    </>
);

const ProtectedRoute = ({ children, onlyModerator = false }: { children: JSX.Element, onlyModerator?: boolean }) => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
    if (!isAuthenticated) {
        return <ForbiddenPage />; 
    }
    if (onlyModerator && !user?.moderator) {
        return <ForbiddenPage />; 
    }
    return children;
};

function App() {
    const dispatch = useDispatch<AppDispatch>();
    const { token, user } = useSelector((state: RootState) => state.user);
    useEffect(() => {
        if (token && !user) {
            const payload = parseJWT(token);
            if (payload && payload.user_id) {
                dispatch(fetchUserProfile(payload.user_id));
            } else {
                localStorage.removeItem('authToken');
            }
        }
    }, [token, user, dispatch]);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />      
                <Route path="/register" element={<RegisterPage />} />  
                
                <Route element={<MainLayout />}>
                    <Route path="/factors" element={<FactorsListPage />} />
                    <Route path="/factors/:id" element={<FactorDetailPage />} />
                    
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} /> 
                    <Route path="/orders" element={<ProtectedRoute><OrdersListPage /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />

                    <Route path="/factors/manage" element={
                        <ProtectedRoute onlyModerator={true}>
                            <AdminFactorsPage />
                        </ProtectedRoute>
                    } />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;