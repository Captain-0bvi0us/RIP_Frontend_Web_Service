import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';



export const AppNavbar = () => {
    return (
        <Navbar bg="danger" variant="dark" fixed="top" className="shadow-sm" expand="lg">
            <Container fluid className='px-3 px-md-7'>
                <Navbar.Brand className='fs-4' as={Link} to="/">FRAXCALCULATOR.ORG</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link className='fs-5' as={Link} to="/factors">Факторы риска</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};