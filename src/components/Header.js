/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import config from '../config'

const Header = (props) => {

  const [apiUsername, setApiUsername] = useState("");

  useEffect(() => {
    if (props.userLogged !== null) {
      setApiUsername(props.userLogged.username);
    }
  },[props]);

  return (  
    <Navbar className="app-navbar" collapseOnSelect expand="lg" variant="">
      <Navbar.Brand>{config.app.name}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/home">Home</Nav.Link>
          <Nav.Link as={Link} to="/accounts">Accounts</Nav.Link>
          <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title={apiUsername} id="collasible-nav-dropdown" alignRight>
            <NavDropdown.Item href="#" onClick={props.logoutCallback}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const mapStateToProps = state => ({
  userLogged: state.user.user
});

export default connect(mapStateToProps)(Header);