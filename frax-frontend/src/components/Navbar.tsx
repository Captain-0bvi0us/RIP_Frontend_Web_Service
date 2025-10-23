import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const AppNavbar = () => {
    return (
        <Navbar bg="danger" variant="dark" fixed="top" className="shadow-sm">
            <Container fluid className='px-7'>
                <Navbar.Brand className='fs-4' as={Link} to="/">FRAXCALCULATOR.ORG</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link className='fs-5' as={Link} to="/factors">Факторы риска</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};
