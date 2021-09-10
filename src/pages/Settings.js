/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect, useCallback } from 'react'
import { Form, Col, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { setApiInfo } from '../redux/actions/api'
import { getSettings, updateSettings } from '../services/api-settings'
import Layout from '../components/Layout'
import LoadingIcon from '../components/LoadingIcon'
import AlertMessage from '../components/AlertMessage'
import PageTitle from '../components/PageTitle'

const Settings = (props) => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [apiName, setApiName] = useState('');
  const [apiDescr, setApiDescr] = useState('');
  const [tokenAuthScheme, setTokenAuthScheme] = useState('jwt');
  const [accessTokenSecret, setAccessTokenSecret] = useState("");
  const [accessTokenExpiration, setAccessTokenExpiration] = useState("");
  const [refreshTokenEnabled, setRefreshTokenEnabled] = useState("");
  const [refreshTokenSecret, setRefreshTokenSecret] = useState("");
  const [refreshTokenExpiration, setRefreshTokenExpiration] = useState("");
  const [storeAccessesHistoryEnabled, setStoreAccessesHistoryEnabled] = useState("off");

  const saveSettings = async () => {

    setLoading(true);

    let data = {
      name: apiName,
      descr: apiDescr,
      tokenAuthScheme: tokenAuthScheme,
      accessTokenSecret: accessTokenSecret,
      accessTokenExpiresIn: accessTokenExpiration,
      refreshTokenEnabled: refreshTokenEnabled,
      refreshTokenSecret: refreshTokenSecret,
      refreshTokenExpiresIn: refreshTokenExpiration,
      storeAccessesHistoryEnabled: storeAccessesHistoryEnabled
    }

    let result = await updateSettings(data);
    if (result !== undefined && result.success === true) {
      
      setNewApiSettingsData(result.data);

      setMessage(<AlertMessage type="success" message="Updated successfully!" title="Update Settings Status" />);
    } else {
      setMessage(<AlertMessage type="success" message="Coudn't update the Api Settings!" title="Update Settings Status" />);
    }

    setLoading(false);
  }
  
  const setNewApiSettingsData = useCallback((data) => {
    let newSettings = props.apiInfo;
    newSettings.settings = data;
    props.setApiInfo(newSettings);
  }, [props]);

  useEffect(() => {
    getSettings().then((result) => {
      if (result !== undefined && result.success === true) {
        setApiName(result.data.name);
        setApiDescr(result.data.descr);
        setTokenAuthScheme(result.data.tokenAuthScheme);
        setAccessTokenSecret(result.data.accessTokenSecret);
        setAccessTokenExpiration(result.data.accessTokenExpiresIn);
        setRefreshTokenEnabled(result.data.refreshTokenEnabled || "off");
        setRefreshTokenSecret(result.data.refreshTokenSecret);
        setRefreshTokenExpiration(result.data.refreshTokenExpiresIn);
        setStoreAccessesHistoryEnabled(result.data.storeAccessesHistoryEnabled || "off");

        setNewApiSettingsData(result.data);
      }
    });
  }, [setNewApiSettingsData]);

  return (
    <Layout>
      <PageTitle title="Api Settings" />

      {message}

      <Form className="mt-3">
        <Form.Row>
          <Form.Group as={Col} controlId="input-api-name" xs={12} md={6}>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Name" value={apiName} onChange={(e) => setApiName(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-api-descr" xs={12} md={6}>
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Description" value={apiDescr} onChange={(e) => setApiDescr(e.target.value)} />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} controlId="input-store-accesses-history-enabled" xs={12} md={6}>
            <Form.Label>Store Accesses History</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setStoreAccessesHistoryEnabled(e.target.value)} value={storeAccessesHistoryEnabled}>
              <option value="on">Yes</option>
              <option value="off">No</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <hr className="my-4" />

        <Form.Row>
          <Form.Group as={Col} controlId="input-token-auth-scheme" xs={12} md={6}>
            <Form.Label>Token Auth Scheme</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setTokenAuthScheme(e.target.value)} value="jwt">
              <option value="jwt">JWT</option>
              <option value="bearer">Bearer</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="input-refresh-token-enabled" xs={12} md={6}>
            <Form.Label>RefreshToken Enabled</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setRefreshTokenEnabled(e.target.value)} value={refreshTokenEnabled}>
              <option value="on">Yes</option>
              <option value="off">No</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="input-access-token-secret" xs={12} md={6}>
            <Form.Label>Access Token Secret</Form.Label>
            <Form.Control type="text" placeholder="Access Token Secret" value={accessTokenSecret} onChange={(e) => setAccessTokenSecret(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-access-token-expiration" xs={12} md={6}>
            <Form.Label>Access Token Expiration</Form.Label>
            <Form.Control type="text" placeholder="Access Token Expiration" value={accessTokenExpiration} onChange={(e) => setAccessTokenExpiration(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="input-refresh-token-secret" xs={12} md={6}>
            <Form.Label>Refresh Token Secret</Form.Label>
            <Form.Control type="text" placeholder="Refresh Token Secret" value={refreshTokenSecret} onChange={(e) => setRefreshTokenSecret(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-refresh-token-expiration" xs={12} md={6}>
            <Form.Label>Refresh Token Expiration</Form.Label>
            <Form.Control type="text" placeholder="Refresh Token Expiration" value={refreshTokenExpiration} onChange={(e) => setRefreshTokenExpiration(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <Button variant="primary" type="button" onClick={saveSettings}>
          {loading === true
            ? <LoadingIcon /> 
            : "Save"
          }
        </Button>
      </Form>
    </Layout>
  )
}

const mapStateToProps = state => ({
  apiInfo: state.api.info
});

const mapDispatchToProps = {
  setApiInfo: (data) => setApiInfo(data),
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
