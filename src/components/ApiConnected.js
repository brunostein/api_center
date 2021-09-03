/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlug } from '@fortawesome/free-solid-svg-icons'

const ApiConnected = (props) => {

  const [apiName, setApiName] = useState("");
  
  useEffect(() => {
    if (props.apiInfoSettings !== null) {
      setApiName(props.apiInfoSettings.name || "");
    }
  },[props.apiInfoSettings]);

  return (
    <span><FontAwesomeIcon icon={faPlug} rotation={90} /> {apiName}</span>
  )
}

const mapStateToProps = state => ({
  apiInfoSettings: (state.api.info ? state.api.info.settings : null)
});

export default connect(mapStateToProps)(ApiConnected);