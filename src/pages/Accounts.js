/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPlus, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import moment from 'moment'
import jwt_decode from "jwt-decode"
import { 
  getAccounts, createAccount, 
  removeAccount, blockAccount, 
  unblockAccount, revokeRefreshToken 
} from '../services/api-accounts'
import Layout from '../components/Layout'
import AlertMessage from '../components/AlertMessage'
import LoadingIcon from '../components/LoadingIcon'
import PageTitle from '../components/PageTitle'

const Accounts = (props) => {

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalRefreshTokenInfoMessage, setModalRefreshTokenInfoMessage] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scope, setScope] = useState("");

  const [accountId, setAccountId] = useState(false);
  const [accountsList, setAccountsList] = useState([]);

  const [formModalShow, setFormModalShow] = useState(false);
  const [formModalTitle, setFormModalTitle] = useState("");

  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalBody, setConfirmModalBody] = useState("");
  
  const [refreshTokenInfoModalShow, setRefreshTokenInfoModalShow] = useState(false);
  
  const [tokenInfo, setTokenInfo] = useState(null);
  
  const refreshTokenInfo = (username, refreshToken) => {
    let info = {
      username,
      refreshToken,
      data: null
    }

    let refreshTokenDecoded = jwt_decode(refreshToken);
    let refreshTokenDecodedHeader = jwt_decode(refreshToken, { header: true })

    let refreshTokenExp = moment.unix(refreshTokenDecoded.exp).format('DD/MM/YYYY HH:mm:ss');
    let refreshTokenIat = moment.unix(refreshTokenDecoded.iat).format('DD/MM/YYYY HH:mm:ss');
    refreshTokenDecoded.exp = refreshTokenExp;
    refreshTokenDecoded.iat = refreshTokenIat;
    
    info.data = {...refreshTokenDecoded, header: refreshTokenDecodedHeader };

    setTokenInfo(info);
  };
  
  const getAccountsList = useCallback(() => {
    getAccounts().then((result) => {
      if (result !== undefined && result.success === true) {
        setAccountsList(result.data);
      }
    });
  }, []);

  const showModalForm = () => {
    setFormModalTitle("Create Account");
    setFormModalShow(true);
  }

  const formSubmitCallback = async () => {
    
    setLoading(true);
    
    if (email === "" || username === "" || 
      password === "" || scope === "") {
      setModalMessage(<AlertMessage type="warning" message="All the fields are required!" title="Form validation error" />);
      setLoading(false);
      return;
    }

    let data = {
      email: email,
      username: username,
      password: password,
      scope: scope
    }
    
    let res = await createAccount(data);
    if (res !== undefined) {
      let messageType = "danger";
      if (res.success === false) {
        messageType = "warning";
      } else if (res.success === true) {
        messageType = "success";
      }
      setMessage(<AlertMessage type={messageType} message={res.msg || "Error create account."} title="Create Account Status" />);
    }
    
    setLoading(false);
    setFormModalShow(false);
    getAccountsList();
  }
  
  const requestBlockAccount = async (accountId) => {
    
    setLoading(true);
    
    let res = await blockAccount(accountId);
    if (res !== undefined) {
      let messageType = "danger";
      if (res.success === false) {
        messageType = "warning";
      } else if (res.success === true) {
        messageType = "success";
      }
      setMessage(<AlertMessage type={messageType} message={res.msg || "Error block account."} title="Block Account Status" />);
    }
    
    setLoading(false);
    getAccountsList();
  }
  
  const requestUnblockAccount = async (accountId) => {
    
    setLoading(true);
    
    let res = await unblockAccount(accountId);
    if (res !== undefined) {
      let messageType = "danger";
      if (res.success === false) {
        messageType = "warning";
      } else if (res.success === true) {
        messageType = "success";
      }
      setMessage(<AlertMessage type={messageType} message={res.msg || "Error unblock account."} title="Unblock Account Status" />);
    }
    
    setLoading(false);
    getAccountsList();
  }
  
  const showModalConfirm = (accountId) => {
    setAccountId(accountId);
    setConfirmModalTitle("Remove Account");
    setConfirmModalBody("Do you really want to remove this account?");
    setConfirmModalShow(true);
  }
  
  const removeAccountCallback = async (e) => {
    e.preventDefault();

    let res = await removeAccount(accountId);
    if (res !== undefined) {
      let messageType = "danger";
      if (res.success === false) {
        messageType = "warning";
      } else if (res.success === true) {
        messageType = "success";
      }
      setMessage(<AlertMessage type={messageType} message={res.msg || "Error to remove account."} title="Remove Account Status" />);
    }

    setConfirmModalShow(false);
    getAccountsList();
  }

  const showModalRefreshTokenInfo = (username, refreshToken) => {
    refreshTokenInfo(username, refreshToken);
    setRefreshTokenInfoModalShow(true);
  }
  
  const requestRevokeRefreshToken = async () => {
    let res = await revokeRefreshToken(tokenInfo.username, tokenInfo.refreshToken);
    if (res !== undefined) {
      let messageType = "danger";
      if (res.success === false) {
        messageType = "warning";
      } else if (res.success === true) {
        messageType = "success";
      }
      setRefreshTokenInfoModalShow(false);
      setModalRefreshTokenInfoMessage(<AlertMessage type={messageType} message={res.msg || "Error to revoke Refresh Token."} title="Revoke Refresh Token" />);
    }
  }
  
  useEffect(() => {
    getAccountsList();
  }, [getAccountsList]);

  return (
    <Layout>
      <PageTitle title="Api Accounts" />
      
      {message}

      <p className="mt-3">
        <Button onClick={() => showModalForm()}><FontAwesomeIcon icon={faPlus} /></Button>
      </p>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th width="250">#</th>
            <th>Username</th>
            <th>Scope</th>
            <th className="text-center">Refresh Token</th>
            <th className="text-center">Blocked?</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {accountsList.map((data, index) => {
            return (
              <tr key={index}>
                <td>{data._id}</td>
                <td>{data.username} </td>
                <td>{data.scope}</td>
                <td className="text-center">
                  {data.refresh_token !== null &&
                  <Button variant="danger" onClick={() => showModalRefreshTokenInfo(data.username, data.refresh_token)} title="Show Refresh Token Info">show info</Button>
                  }
                </td>
                <td className="text-center">
                  {data.blocked === false
                  ? <FontAwesomeIcon icon={faLockOpen} size="2x" className="text-success" />
                  : <FontAwesomeIcon icon={faLock} size="2x" className="text-danger" />
                  }
                </td>
                <td className="text-center">
                  {data.scope !== "system" &&
                    <Button variant="danger" onClick={() => showModalConfirm(data._id)} titl="Remove Account"><FontAwesomeIcon icon={faTrash} /></Button>
                  }
                  {data.blocked === false
                    ? <Button className="ml-1" variant="danger" onClick={() => requestBlockAccount(data._id)} title="Block"><FontAwesomeIcon icon={faLock} /></Button>
                    : <Button className="ml-1" variant="success" onClick={() => requestUnblockAccount(data._id)} title="Unblock"><FontAwesomeIcon icon={faLockOpen} /></Button>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      
      <Modal show={formModalShow} onHide={() => setFormModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMessage}
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="input-email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
            </Form.Row>
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

            <Form.Row>
              <Form.Group as={Col} controlId="input-scope">
                <Form.Label>Scope</Form.Label>
                <Form.Control type="text" placeholder="Scope" onChange={(e) => setScope(e.target.value)} />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setFormModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={formSubmitCallback}>
            {loading === true
            ? <LoadingIcon /> 
            : "Create"
            }
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={confirmModalShow} onHide={() => setConfirmModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{confirmModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModalBody}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={removeAccountCallback}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Modal show={refreshTokenInfoModalShow} onHide={() => setRefreshTokenInfoModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Refresh Token Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalRefreshTokenInfoMessage}
          <p>{tokenInfo !== null ? tokenInfo.username : ""}</p>
          <Table striped bordered hover>
          <tbody>
          {tokenInfo !== null &&
            <>
            <tr>
              <td>Type</td>
              <td>{tokenInfo.data.header.typ}</td>
            </tr>
            <tr>
              <td>Algorithm</td>
              <td>{tokenInfo.data.header.alg}</td>
            </tr>
            <tr>
              <td>Created at</td>
              <td>{tokenInfo.data.iat}</td>
            </tr>
            <tr>
              <td>Expiration Date</td>
              <td>{tokenInfo.data.exp}</td>
            </tr>
            </>
          }
          </tbody>
          </Table>
          <Button className="mt-3" variant="danger" onClick={() => requestRevokeRefreshToken(tokenInfo)} title="Revoke"><FontAwesomeIcon icon={faLock} /> Revoke</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRefreshTokenInfoModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  )
}

const mapStateToProps = state => ({
  userLogged: state.user.user
});

export default connect(mapStateToProps)(Accounts);