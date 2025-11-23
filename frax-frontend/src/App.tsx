import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/FraxHomePage';
import { FactorsListPage } from './pages/FactorsListPage';
import { FactorDetailPage } from './pages/FactorDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersListPage } from './pages/OrdersListPage';
import { OrderPage } from './pages/OrderPage';



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
        <Route path="/login" element={<LoginPage />} />      
        <Route path="/register" element={<RegisterPage />} />  
        <Route element={<MainLayout />}>
            <Route path="/factors" element={<FactorsListPage />} />
            <Route path="/factors/:id" element={<FactorDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} /> 
            <Route path="/orders" element={<OrdersListPage />} />
            <Route path="/orders/:id" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

export default App;