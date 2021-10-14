/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Row, Col, Form, Modal, Button } from 'react-bootstrap'
import { resetConnectedApi } from '../redux/actions/api'
import { resetLoggedUser, setLoggedUser, setNeedNewAuth } from '../redux/actions/user'
import { signIn } from '../services/api-accounts'
import config from '../config'
import Header from './Header'
import ApiConnected from './ApiConnected'
import LoadingIcon from '../components/LoadingIcon'
import AlertMessage from '../components/AlertMessage'
import ActionButtons from '../components/ActionButtons';

const Layout = (props) => {
  
  const history = useHistory();
  
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [formModalLoginShow, setFormModalLoginShow] = useState(false);
  const [formModalLoginTitle, setFormModalLoginTitle] = useState("");
  
  // Form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logout = () => {
    props.resetConnectedApi();
    props.resetLoggedUser();
    history.push('/')
  }
  
  const formAuthSubmitCallback = async () => {
    setLoading(true);
    
    let res = await signIn(username, password);
    if (res !== undefined) {
      if (res.success === true) {
        props.setLoggedUser(res.data);
        props.setNeedNewAuth(false);
        setMessage(<AlertMessage type="success" message="Authenticated successfully, redirecting..." title="Authentication Status" />);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else if (res.success === false) {
        setMessage(<AlertMessage type="warning" message={res.msg || "Authentication failed."} title="Authentication Status" />);
      }
    }
    
    setLoading(false);
  }
  
  const showFormModalAuth = () => {
    setFormModalLoginTitle("New Authentication");
    setFormModalLoginShow(true);
  }
  
  useEffect(() => {
    if (props.userLogged.needNewAuth === true) {
      showFormModalAuth();
    }
  }, [props.userLogged])

  return (
    <div className="wrapper pb-3">
      <HelmetProvider>
      <Helmet>
        <title>{config.app.name}</title>
        <link rel="icon" type="image/png" href="favicon_connected.ico" sizes="16x16" />
      </Helmet>

      <header className="header">
        <Header logoutCallback={logout}  />
      </header>

      <div className="api-connected py-3 mb-3">
        <Col>
          <ActionButtons />
          <hr className="mb-2" />
        </Col>
        <Col>
          <ApiConnected />
        </Col>
      </div>

      <div className="content">
      {props.userLogged.needNewAuth === true ? (
        <Modal show={formModalLoginShow} onHide={logout}>
          <Modal.Header closeButton>
            <Modal.Title>{formModalLoginTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {message}
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="input-username" xs={12} md={6}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group as={Col} controlId="input-password" xs={12} md={6}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
              </Form.Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={formAuthSubmitCallback}>
              {loading === true
              ? <LoadingIcon /> 
              : "Authenticate"
              }
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Container>
          <Row>
            <Col>{props.children}</Col>
          </Row>
        </Container>
        )
      }
      </div>

      <footer className="footer">
      </footer>
    </HelmetProvider>
    </div>
  )
}

const mapStateToProps = state => ({
  apiConnected: state.api.api,
  userLogged: state.user
});

const mapDispatchToProps = {
  resetConnectedApi: () => resetConnectedApi(),
  resetLoggedUser: () => resetLoggedUser(),
  setLoggedUser: (data) => setLoggedUser(data),
  setNeedNewAuth: (data) => setNeedNewAuth(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
