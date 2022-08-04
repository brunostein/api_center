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

const messages = {
  updateSettingsAlertTitle: "API Settings Status!",
  updateSuccessAlertMessage: "API Settings updated successfully.",
  updateErrorAlertMessage: "Couldn't update the API Settings",
  needRebootAlertTile: "Need Reboot!",
  needRebootAlertMessage: "The API Settings have been changed, it is necessary to restart it for the changes to take effect.",
};

const Settings = (props) => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [, setNeedReboot] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companySupportEmail, setCompanySupportEmail] = useState('');
  const [apiName, setApiName] = useState('');
  const [apiDescr, setApiDescr] = useState('');
  const [tokenAuthScheme, setTokenAuthScheme] = useState('jwt');
  const [accessTokenSecret, setAccessTokenSecret] = useState('');
  const [accessTokenExpiration, setAccessTokenExpiration] = useState('');
  const [accessTokenExpirationInterval, setAccessTokenExpirationInterval] = useState('');
  const [refreshTokenEnabled, setRefreshTokenEnabled] = useState('');
  const [refreshTokenSecret, setRefreshTokenSecret] = useState('');
  const [refreshTokenExpiration, setRefreshTokenExpiration] = useState('');
  const [refreshTokenExpirationInterval, setRefreshTokenExpirationInterval] = useState('');
  const [storeAccessesHistoryEnabled, setStoreAccessesHistoryEnabled] = useState('off');
  const [swaggerProtocol, setSwaggerProtocol] = useState('http');
  const [swaggerHost, setSwaggerHost] = useState('localhost');
  const [swaggerPort, setSwaggerPort] = useState('');
  const [swaggerPath, setSwaggerPath] = useState('/doc');
  const [cacheEnabled, setCacheEnabled] = useState(false);
  const [cachePrefix, setCachePrefix] = useState('');
  const [cacheType, setCacheType] = useState('');
  const [cacheRedisHost, setCacheRedisHost] = useState('');
  const [cacheRedisPort, setCacheRedisPort] = useState('');
  const [cacheRedisPass, setCacheRedisPass] = useState('');
  const [cacheRedisDefaultExpirationTime, setCacheRedisDefaultExpirationTime] = useState(300);
  const [cacheRedisRandomExpiration, setCacheRedisRandomExpiration] = useState(true);
  const [cacheRedisRandomExpirationMinNumber, setCacheRedisRandomExpirationMinNumber] = useState(60);
  const [cacheRedisRandomExpirationMaxNumber, setCacheRedisRandomExpirationMaxNumber] = useState(600);

  const saveSettings = async () => {

    setLoading(true);

    let data = {
      companyName: companyName,
      companyWebsite: companyWebsite,
      companySupportEmail: companySupportEmail,
      name: apiName,
      descr: apiDescr,
      tokenAuthScheme: tokenAuthScheme,
      accessTokenSecret: accessTokenSecret,
      accessTokenExpiresIn: accessTokenExpiration + accessTokenExpirationInterval,
      refreshTokenEnabled: refreshTokenEnabled,
      refreshTokenSecret: refreshTokenSecret,
      refreshTokenExpiresIn: refreshTokenExpiration + refreshTokenExpirationInterval,
      storeAccessesHistoryEnabled: storeAccessesHistoryEnabled,
      swaggerHost: swaggerProtocol + "://" + swaggerHost,
      swaggerPort: swaggerPort,
      swaggerPath: swaggerPath,
      cacheEnabled: cacheEnabled,
      cachePrefix: cachePrefix,
      cacheType: cacheType,
      cacheRedisHost: cacheRedisHost,
      cacheRedisPort: cacheRedisPort,
      cacheRedisPass: cacheRedisPass,
      cacheRedisDefaultExpirationTime: cacheRedisDefaultExpirationTime,
      cacheRedisRandomExpiration: cacheRedisRandomExpiration,
      cacheRedisRandomExpirationMinNumber: cacheRedisRandomExpirationMinNumber,
      cacheRedisRandomExpirationMaxNumber: cacheRedisRandomExpirationMaxNumber
    };

    let result = await updateSettings(data);

    if (result && result.success === true) {
      setNewApiSettingsData(result.data);
      setMessage((
        <>
          <AlertMessage type="success" message={messages.updateSuccessAlertMessage} title={messages.updateSettingsAlertTitle} />
          <AlertMessage type="warning" message={messages.needRebootAlertMessage} title={messages.needRebootAlertTile} dismissible={false} />
        </>
      ));
    } else {
      let alertMessage = (result && result.msg ? result.msg : messages.updateErrorAlertMessage);
      setMessage(<AlertMessage type="warning" message={alertMessage} title={messages.updateSettingsAlertTitle} />);
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
      if (result && result.success === true) {

        let settings = result.data;

        let _accessTokenExpiration = null;
        if (settings.accessTokenExpiresIn) {
          _accessTokenExpiration = settings.accessTokenExpiresIn.slice(0, settings.accessTokenExpiresIn.length-1);
        }
        let _accessTokenExpirationInterval = null;
        if (settings.accessTokenExpiresIn) {
          _accessTokenExpirationInterval = settings.accessTokenExpiresIn.slice(-1);
        }
        let _refreshTokenExpiration = null;
        if (settings.refreshTokenExpiresIn) {
          _refreshTokenExpiration = settings.refreshTokenExpiresIn.slice(0, settings.refreshTokenExpiresIn.length-1);
        }
        let _refreshTokenExpirationInterval = null;
        if (settings.refreshTokenExpiresIn) {
          _refreshTokenExpirationInterval = settings.refreshTokenExpiresIn.slice(-1);
        }

        let _swaggerProtocol  = "http";
        let _swaggerHost = settings.swaggerHost;

        if (settings.swaggerHost && settings.swaggerHost !== "") {
          let swaggerHostSplited = settings.swaggerHost.split("://");
          _swaggerProtocol = swaggerHostSplited[0];
          _swaggerHost = swaggerHostSplited[1];
        }

        setNeedReboot(settings.needReboot);
        setCompanyName(settings.companyName);
        setCompanyWebsite(settings.companyWebsite);
        setCompanySupportEmail(settings.companySupportEmail);
        setApiName(settings.name);
        setApiDescr(settings.descr);
        setTokenAuthScheme(settings.tokenAuthScheme);
        setAccessTokenSecret(settings.accessTokenSecret);
        setAccessTokenExpiration(_accessTokenExpiration);
        setAccessTokenExpirationInterval(_accessTokenExpirationInterval);
        setRefreshTokenEnabled(settings.refreshTokenEnabled || "off");
        setRefreshTokenSecret(settings.refreshTokenSecret);
        setRefreshTokenExpiration(_refreshTokenExpiration);
        setRefreshTokenExpirationInterval(_refreshTokenExpirationInterval);
        setStoreAccessesHistoryEnabled(settings.storeAccessesHistoryEnabled || "off");
        setSwaggerProtocol(_swaggerProtocol);
        setSwaggerHost(_swaggerHost);
        setSwaggerPort(settings.swaggerPort);
        setSwaggerPath(settings.swaggerPath);
        setCacheEnabled(settings.cache.enabled);
        setCachePrefix(settings.cache.prefix);
        setCacheType(settings.cache.type);
        setCacheRedisHost(settings.cache.redis.host);
        setCacheRedisPort(settings.cache.redis.port);
        setCacheRedisPass("");
        setCacheRedisDefaultExpirationTime(settings.cache.redis.defaultExpirationTime);
        setCacheRedisRandomExpiration(settings.cache.redis.randomExpiration);
        setCacheRedisRandomExpirationMinNumber(settings.cache.redis.randomExpirationMinNumber);
        setCacheRedisRandomExpirationMaxNumber(settings.cache.redis.randomExpirationMaxNumber);

        if (settings.needReboot === true) {
          setMessage(<AlertMessage type="warning" message={messages.needRebootAlertMessage} title={messages.needRebootAlertTile} dismissible={false} />);
        }

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
          <Form.Group as={Col} controlId="input-company-name" xs={12} md={4}>
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-company-website" xs={12} md={4}>
            <Form.Label>Company Website</Form.Label>
            <Form.Control type="text" placeholder="Website" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-company-support-email" xs={12} md={4}>
            <Form.Label>Company Support Email</Form.Label>
            <Form.Control type="text" placeholder="Support Email" value={companySupportEmail} onChange={(e) => setCompanySupportEmail(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <hr className="my-4" />

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
            <Form.Control as="select" custom onChange={(e) => setTokenAuthScheme(e.target.value)} value={tokenAuthScheme}>
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
          <Form.Group as={Col} controlId="input-access-token-secret" xs={12} md={4}>
            <Form.Label>Access Token Secret</Form.Label>
            <Form.Control type="text" placeholder="Access Token Secret" value={accessTokenSecret} onChange={(e) => setAccessTokenSecret(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-access-token-expiration" xs={12} md={4}>
            <Form.Label>Access Token Expiration (Time)</Form.Label>
            <Form.Control type="text" placeholder="Access Token Expiration" value={accessTokenExpiration} onChange={(e) => setAccessTokenExpiration(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-access-token-expiration-interval" xs={12} md={4}>
            <Form.Label>Access Token Expiration (Interval)</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setAccessTokenExpirationInterval(e.target.value)} value={accessTokenExpirationInterval}>
              <option value="m">Minute(s)</option>
              <option value="h">Hour(s)</option>
              <option value="d">Day(s)</option>
              <option value="y">Year(s)</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="input-refresh-token-secret" xs={12} md={4}>
            <Form.Label>Refresh Token Secret</Form.Label>
            <Form.Control type="text" placeholder="Refresh Token Secret" value={refreshTokenSecret} onChange={(e) => setRefreshTokenSecret(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-refresh-token-expiration" xs={12} md={4}>
            <Form.Label>Refresh Token Expiration (Time)</Form.Label>
            <Form.Control type="text" placeholder="Refresh Token Expiration" value={refreshTokenExpiration} onChange={(e) => setRefreshTokenExpiration(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-refresh-token-expiration-interval" xs={12} md={4}>
            <Form.Label>Refresh Token Expiration (Interval)</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setRefreshTokenExpirationInterval(e.target.value)} value={refreshTokenExpirationInterval}>
              <option value="m">Minute(s)</option>
              <option value="h">Hour(s)</option>
              <option value="d">Day(s)</option>
              <option value="y">Year(s)</option>
            </Form.Control>
          </Form.Group>
        </Form.Row>

        <hr className="my-4" />

        <Form.Row>
          <Form.Group as={Col} controlId="input-swagger-protocol" xs={12} md={3}>
            <Form.Label>Swagger Protocol</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setSwaggerProtocol(e.target.value)} value={swaggerProtocol}>
              <option value="http">http://</option>
              <option value="https">https://</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="input-swagger-host" xs={12} md={4}>
            <Form.Label>Swagger Host</Form.Label>
            <Form.Control type="text" placeholder="Swagger Host" value={swaggerHost} onChange={(e) => setSwaggerHost(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-swagger-port" xs={12} md={2}>
            <Form.Label>Swagger Port</Form.Label>
            <Form.Control type="text" placeholder="Swagger Port" value={swaggerPort} onChange={(e) => setSwaggerPort(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-swagger-path" xs={12} md={3}>
            <Form.Label>Swagger Path</Form.Label>
            <Form.Control type="text" placeholder="Swagger Path" value={swaggerPath} onChange={(e) => setSwaggerPath(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <hr className="my-4" />

        <Form.Row>
          <Form.Group as={Col} controlId="input-cache-enable" xs={12} md={4}>
            <Form.Label>Cache Status</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setCacheEnabled(e.target.value)} value={cacheEnabled}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="input-cache-settings" xs={12} md={4}>
            <Form.Label>Cache Type</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setCacheType(e.target.value)} value={cacheType}>
              <option value="redis">Redis</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-prefix" xs={12} md={4}>
            <Form.Label>Redis Prefix</Form.Label>
            <Form.Control type="text" placeholder="Redis Prefix" value={cachePrefix} onChange={(e) => setCachePrefix(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="input-redis-host" xs={12} md={4}>
            <Form.Label>Redis Host</Form.Label>
            <Form.Control type="text" placeholder="Redis Host" value={cacheRedisHost} onChange={(e) => setCacheRedisHost(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-port" xs={12} md={4}>
            <Form.Label>Redis Port</Form.Label>
            <Form.Control type="text" placeholder="Redis Port" value={cacheRedisPort} onChange={(e) => setCacheRedisPort(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-pass" xs={12} md={4}>
            <Form.Label>Redis Password</Form.Label>
            <Form.Control type="text" placeholder="Redis Password" onChange={(e) => setCacheRedisPass(e.target.value)} />
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="input-redis-default-expiration-time" xs={12} md={3}>
            <Form.Label>Redis (Default expiration key time)</Form.Label>
            <Form.Control type="text" placeholder="Default expiration key time" value={cacheRedisDefaultExpirationTime} onChange={(e) => setCacheRedisDefaultExpirationTime(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-random-expiration" xs={12} md={3}>
            <Form.Label>Redis Random Expiration Time</Form.Label>
            <Form.Control as="select" custom onChange={(e) => setCacheRedisRandomExpiration(e.target.value)} value={cacheRedisRandomExpiration}>
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-random-expiration-min" xs={6} md={3}>
            <Form.Label>Redis Random Expiration Time (Min)</Form.Label>
            <Form.Control type="text" placeholder="Expiration Time (Min)" value={cacheRedisRandomExpirationMinNumber} onChange={(e) => setCacheRedisRandomExpirationMinNumber(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="input-redis-random-expiration-max" xs={6} md={3}>
            <Form.Label>Redis Random Expiration Time (Max)</Form.Label>
            <Form.Control type="text" placeholder="Expiration Time (Min)" value={cacheRedisRandomExpirationMaxNumber} onChange={(e) => setCacheRedisRandomExpirationMaxNumber(e.target.value)} />
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
