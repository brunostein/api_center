/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import axios from 'axios'
import { refreshToken } from './api-accounts'
import { getState, dispatchState } from '../helpers/app-helper'
import { setLoggedUser, setNeedNewAuth } from '../redux/actions/user'

const axiosApiInstance = axios.create();
const maxRetry = 3;
var _retry = 0;

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async config => {
    try {
      const userData = getState('user').user;
      config.headers = { 
        'Content-Type': 'application/json',
      }
      if (userData !== null) {
        config.headers['Authorization'] = `${userData.token_type} ${userData.access_token}`;
      }
      return config;
    } catch (err) {
      console.log("Interceptor set Access Token error" + err);
    }
  },
  error => {
    Promise.reject(error)
});

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use((response) => {
  return response
}, async function (error) {
  try {
    const originalRequest = error.config;

    if (error.response !== undefined && 
      error.response.status === 401 && _retry < maxRetry) {
    
      const apiData = getState('api').info;

      if (apiData !== null && apiData.settings.refreshTokenEnabled === "off") {
        dispatchState(setNeedNewAuth(true));
      } else {

        _retry++;
        let res = await refreshToken();

        if (res !== undefined && res.success === true && res.data.access_token !== undefined) {      
          dispatchState(setNeedNewAuth(false));
          dispatchState(setLoggedUser(res.data));
          axios.defaults.headers.common['Authorization'] = 'JWT ' + res.data.access_token;
          _retry = 0;
          return axiosApiInstance(originalRequest);
        } else {
          dispatchState(setNeedNewAuth(true));
        }
      }
    }
  } catch (err) {
    console.log("Interceptor Refresh Token error" + err);
  }

  return Promise.reject(error);
});

export default axiosApiInstance;
