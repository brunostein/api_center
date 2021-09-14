  /**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect, useCallback } from 'react'
import { Row, Col, Card, Form, Button } from 'react-bootstrap'
import { getLogs } from '../services/api-logs'
import Layout from '../components/Layout'
import PageTitle from '../components/PageTitle'
import LoadingIcon from '../components/LoadingIcon'

const Logs = (props) => {

  const [apiLogs, setApiLogs] = useState([]);
  const [intervalApiLogs, setIntervalApiLogs] = useState(null);
  const [filterLogs, setFilterLogs] = useState("");
  const [totalLines, setTotalLines] = useState(15);

  const getApiLogs = useCallback(() => {
    getLogs(totalLines, filterLogs).then((result) => {
      if (result && result.success === true) {
        let logs = result.data.split('\n');
        setApiLogs(logs.reverse());
      }
    });
  }, [totalLines, filterLogs]);

  const stopFilterApiLogs = () => {
    if (intervalApiLogs !== null) {
      clearInterval(intervalApiLogs);
      setIntervalApiLogs(null);
    }
  }

  const clearFilterApiLogs = () => {
    setFilterLogs("");
    setApiLogs([]);
  }

  const startFilterApiLogs = () => {
    getApiLogs();
    stopFilterApiLogs();

    let intervalId = setInterval(getApiLogs, 5000);
    setIntervalApiLogs(intervalId);
  }

  useEffect(() => {
    getApiLogs();
  }, [getApiLogs]);

  return (
    <Layout>
      <Row>
        <Col>
          <PageTitle title="Logs da API" />
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="page-title mb-3">
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} controlId="input-total-lines" xs={12} md={3}>
                  <Form.Label>Total Lines</Form.Label>
                  <Form.Control as="select" custom onChange={(e) => setTotalLines(e.target.value)} value={totalLines}>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="input-filter" xs={12} md={9}>
                  <Form.Label>Filter</Form.Label>
                  <Form.Control type="text" placeholder="Filter" value={filterLogs} onChange={(e) => setFilterLogs(e.target.value)} />
                </Form.Group>
                <Col>
                  {intervalApiLogs === null
                  ? (
                    <Button variant="success" type="button" onClick={startFilterApiLogs} className="mr-2">
                    Start
                    </Button>
                  )
                  : (
                    <Button variant="info" type="button" onClick={stopFilterApiLogs} className="mr-2">
                      <LoadingIcon /> Stop
                    </Button>
                  )}
                  <Button variant="primary" type="button" onClick={clearFilterApiLogs}>
                    Clean  
                  </Button>
                </Col>
              </Form.Row>
              <Row>
                <Col className="mt-3">
                  <h5>Linhas de Log</h5>
                  <hr />
                  {apiLogs.map((element, index) => {
                    return <div style={{fontSize: "0.8rem"}} key={index}>{element}</div>
                    })
                  }
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export default Logs;
