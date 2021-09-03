/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { getState } from './app-helper'

export const getApiURL = () => {
  let data = getState('api').api;
  if (data !== null) {
    let uri = data.protocol + "://" + data.host + ":" + data.port + "/api/v1";
    return uri;
  }
}
