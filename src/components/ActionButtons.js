/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState } from 'react';
import { Modal, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faSync } from '@fortawesome/free-solid-svg-icons'
import LoadingIcon from '../components/LoadingIcon'
import { shutdownSystem, rebootSystem } from '../services/api-utils'
import AlertMessage from '../components/AlertMessage'

const messages = {
  btnShutdownSystemTitle: "SHUTDOWN",
  btnRebootSystemTitle: "REBOOT",
  confirmShutdownModalTitle: "ShutDown System?",
  confirmShutdownModalMessage: "Do you really shut down API?",
  confirmRebootModalTitle: "Reboot System?",
  confirmRebootModalMessage: "Do you really reboot API?",
  actionErrorMessage: "Couldn't execute the action",
};

export default function ActionButtons(props) {

  const [btnAction, setBtnAction] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalBody, setConfirmModalBody] = useState("");
  const [btnActionMessage, setBtnActionMessage] = useState("");

  const onClickBtnAction = (action) => {

    setBtnActionMessage("");

    if (action === "shutdown") {
      setConfirmModalTitle(messages.confirmShutdownModalTitle);
      setConfirmModalBody(messages.confirmShutdownModalMessage);
      setConfirmModalShow(true);
      
    } else if (action === "reboot") {
      setConfirmModalTitle(messages.confirmRebootModalTitle);
      setConfirmModalBody(messages.confirmRebootModalMessage);
      setConfirmModalShow(true);
    }

    setBtnAction(action);
  }

  const actionButtonCallback = async () => {

    setLoading(true);

    let result = null;

    if (btnAction === "shutdown") {
      result = await shutdownSystem();
    } else if (btnAction === "reboot") {
      result = await rebootSystem();
    }

    if (result && result.msg) {
      setBtnActionMessage(<AlertMessage className="mt-3" type={result.success === true ? "success" : "warning"} message={result.msg} />);
    } else {
      setBtnActionMessage(<AlertMessage className="mt-3" type="danger" message={messages.actionErrorMessage} />);
    }

    setLoading(false);
  }

  return (
    <>
      <Row className="mb-3">
        <Col>
          <Button variant="danger" type="button" onClick={() => onClickBtnAction('shutdown')} className="mr-2">
            {(btnAction === "shutdown" && loading === true)
              ? <LoadingIcon /> 
              : <FontAwesomeIcon icon={faPowerOff} />
            }
            <br />
            {messages.btnShutdownSystemTitle}
          </Button>
          <Button variant="info" type="button" onClick={() => onClickBtnAction('reboot')}>
            {(btnAction === "reboot" && loading === true)
              ? <LoadingIcon /> 
              : <FontAwesomeIcon icon={faSync} />
            }
            <br />
            {messages.btnRebootSystemTitle}
          </Button>
        </Col>
      </Row>

      <Modal show={confirmModalShow} onHide={() => setConfirmModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{confirmModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {confirmModalBody}
          {btnActionMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModalShow(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={actionButtonCallback}>
            { loading === true
              ? <LoadingIcon /> 
              : "Save"
            }
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
