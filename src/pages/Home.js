/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Table, Card } from 'react-bootstrap'
import { setApiInfo } from '../redux/actions/api'
import { getInfo } from '../services/api-info'
import LoadingIcon from '../components/LoadingIcon'
import Layout from '../components/Layout'
import PageTitle from '../components/PageTitle'

const Home = (props) => {
  
  const [apiInfo, setApiInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getApiInfo = useCallback(() => {
    setLoading(true);
    getInfo().then((result) => {
      if (result !== undefined && result.success === true) {
        setApiInfo(result.data);
        props.setApiInfo(result.data);
      }
      setLoading(false);
    });
  }, [props]);

  useEffect(() => {
    getApiInfo();
  }, [getApiInfo]);

  return (
    <Layout>
      <Row>
        <Col>
          <PageTitle title="Informações da API" />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="page-title mb-3">
            <Card.Body>
              <h5 className="mb-3">Api Info</h5>

              {loading === true
                ? <LoadingIcon /> 
                : (
                  <Table hover className="mb-0">
                  <tbody>
                  {apiInfo !== null &&
                    <>
                    <tr>
                      <td width="200">Version</td>
                      <td>{apiInfo.api.version}</td>
                    </tr>
                    <tr>
                      <td width="200">Listen</td>
                      <td>{apiInfo.api.host}</td>
                    </tr>
                    <tr>
                      <td width="200">Port</td>
                      <td>{apiInfo.api.port}</td>
                    </tr>
                    </>
                  }
                  </tbody>
                  </Table>
                )
              }
            </Card.Body>
          </Card>
          
          <Card className="page-title ">
            <Card.Body>
              <h5 className="mb-3">Api Settings</h5>
              
              {loading === true
                ? <LoadingIcon /> 
                : (
                  <Table hover className="mb-0">
                  <tbody>
                  {apiInfo !== null &&
                    <>
                    <tr>
                      <td width="200">Name</td>
                      <td>{apiInfo.settings.name}</td>
                    </tr>
                    <tr>
                      <td width="200">Description</td>
                      <td>{apiInfo.settings.descr}</td>
                    </tr>
                    <tr>
                      <td width="200">Token Auth Scheme</td>
                      <td>{apiInfo.settings.tokenAuthScheme}</td>
                    </tr>
                    <tr>
                      <td width="200">Access Token Secret</td>
                      <td>{apiInfo.settings.accessTokenSecret}</td>
                    </tr>
                    <tr>
                      <td width="200">Access Token Expiration</td>
                      <td>{apiInfo.settings.accessTokenExpiresIn}</td>
                    </tr>
                    <tr>
                      <td width="200">Refresh Token Enabled</td>
                      <td>{(apiInfo.settings.refreshTokenEnabled === "on" ? "Yes" : "No")}</td>
                    </tr>
                    <tr>
                      <td width="200">Refresh Token Secret</td>
                      <td>{apiInfo.settings.refreshTokenSecret}</td>
                    </tr>
                    <tr>
                      <td width="200">Refresh Token Expiration</td>
                      <td>{apiInfo.settings.refreshTokenExpiresIn}</td>
                    </tr>
                    <tr>
                      <td width="200">Store Accesses History</td>
                      <td>{(apiInfo.settings.storeAccessesHistoryEnabled === "on" ? "Yes" : "No")}</td>
                    </tr>
                    </>
                  }
                  </tbody>
                  </Table>
                )
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

const mapStateToProps = state => ({
  userLogged: state.user.user
});

const mapDispatchToProps = {
  setApiInfo: (data) => setApiInfo(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
