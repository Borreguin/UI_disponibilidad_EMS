import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button }  from 'react-bootstrap';

const DefaultNavBar = (props) => {
    const { brand, navData, bg, variant } = props;
    return ( 
        <React.Fragment>
            <Navbar bg={bg} variant={variant}>
                <Navbar.Brand href={brand.route}>{brand.name}</Navbar.Brand>
                <Nav className="mr-auto">
                    {
                        navData.map((item) => (
                            <Nav.Link href={item.route} > {item.name}</Nav.Link>
                        ))
                    }
                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Buscar" className="mr-sm-2" />
                    <Button variant="outline-info">Buscar</Button>
                </Form>
            </Navbar>
        </React.Fragment> 
    );
}
 
export default DefaultNavBar;