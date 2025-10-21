import { Container } from 'react-bootstrap';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const HomePage = () => (
    <Container className="mt-4">
        <Breadcrumbs crumbs={[]} />
        <h1>Добро пожаловать в FRAX Calculator!</h1>
        <p>Этот сервис предназначен для оценки риска переломов.</p>
    </Container>
);