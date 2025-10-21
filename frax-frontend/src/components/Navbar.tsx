import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AppNavbar = () => (
    <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
            <Navbar.Brand as={Link} to="/">FRAXCALCULATOR.ORG</Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Главная</Nav.Link>
                <Nav.Link as={Link} to="/factors">Факторы риска</Nav.Link>
            </Nav>
        </Container>
    </Navbar>
);