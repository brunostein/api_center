/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { setConnectedApi } from '../redux/actions/api'
import { setLoggedUser } from '../redux/actions/user'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlug } from '@fortawesome/free-solid-svg-icons'
import AlertMessage from '../components/AlertMessage'
import { signIn } from '../services/api-accounts'
import config from '../config'

const Login = (props) => {

  const history = useHistory();
  
  const [message, setMessage] = useState("");

  const [protocol, setProtocol] = useState('http');
  const [host, setHost] = useState("");
  const [port, setPort] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = async (e) => {
    e.preventDefault();

    if (host === "" || port === "" || 
      username === "" || password === "") {
      setMessage(<AlertMessage type="warning" message="All the fields are required!" title="Form validation error" />);
      return;
    }

    let data = {
      protocol: protocol,
      host: host,
      port: port
    }

    props.setConnectedApi(data);

    let res = await signIn(username, password);
    if (res !== undefined) {
      if (res.success === true) {
        props.setLoggedUser(res.data);
        setMessage(<AlertMessage type="success" message="Authenticated successfully, redirecting..." title="Login" />);
        setTimeout(() => {
          history.push('/home')
        }, 2000);
      } else if (res.success === false) {
        setMessage(<AlertMessage type="warning" message="Authentication failed." title="Login" />);
      }
    }
  }

  return (
    <Row>
      <Helmet>
        <title>{config.app.name}</title>
      </Helmet>
      <Col md={{ span: 6, offset: 3 }}>
        <Card className="mt-5">
          <Card.Body>
            <h2><FontAwesomeIcon icon={faPlug} size="1x" /> {config.app.name}</h2>
            <hr />
            {message}
            <Form>
              <Form.Row>
                <Form.Group as={Col} controlId="input-protocol" xs={12} md={4}>
                  <Form.Label>Protocol</Form.Label>
                  <Form.Control as="select" custom onChange={(e) => setProtocol(e.target.value)} defaultValue="http">
                    <option value="http">http://</option>
                    <option value="https">https://</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group as={Col} controlId="input-host" xs={12} md={4}>
                  <Form.Label>Host</Form.Label>
                  <Form.Control type="host" placeholder="Host" onChange={(e) => setHost(e.target.value)} />
                </Form.Group>

                <Form.Group as={Col} controlId="input-port" xs={12} md={4}>
                  <Form.Label>Port</Form.Label>
                  <Form.Control type="port" placeholder="Port" onChange={(e) => setPort(e.target.value)} />
                </Form.Group>
              </Form.Row>

              <Form.Row>
                <Form.Group as={Col} controlId="input-username" xs={12} md={6}>
                  <Form.Label>Username</Form.Label>
                  <Form.Control type="username" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group as={Col} controlId="input-password" xs={12} md={6}>
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
              </Form.Row>

              <Button variant="primary" type="submit" onClick={submitForm}>
                Connect
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

const mapStateToProps = state => ({
  apiConnected: state.api.api || null
});

const mapDispatchToProps = {
  setConnectedApi: (data) => setConnectedApi(data),
  setLoggedUser: (data) => setLoggedUser(data)
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);