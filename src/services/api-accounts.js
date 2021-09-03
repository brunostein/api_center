/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import axiosRequest from './axios-request'
import { getState } from '../helpers/app-helper'
import { getApiURL } from '../helpers/api-helper'

export const refreshToken = async () => {

  const BASE_URL = getApiURL();
  const userData = getState('user').user;
  
  const postData = {
    username: userData.username,
    refresh_token: userData.refresh_token
  }

  const result = await axiosRequest.post(`${BASE_URL}/accounts/refresh-token`, postData)
    .then(({data}) => {
      if (data.success === true) {
        return data;
      }
  })
  .catch (err => {
    console.log(err);
  });
  return result
}

export const revokeRefreshToken = async (username, refreshToken) => {
  const BASE_URL = getApiURL();
  const postData = {
    username,
    refresh_token: refreshToken
  };
  const result = await axiosRequest.post(`${BASE_URL}/accounts/refresh-token/revoke`, postData)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const signIn = async (username, password) => {
  const BASE_URL = getApiURL();
  const postData = {
    username,
    password
  };
  const result = await axiosRequest.post(`${BASE_URL}/accounts/signin`, postData)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const createAccount = async (accountData) => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.post(`${BASE_URL}/accounts/signup`, accountData)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const getAccounts = async () => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.get(`${BASE_URL}/accounts/get`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const removeAccount = async (accountId) => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.delete(`${BASE_URL}/accounts/delete/${accountId}`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const blockAccount = async (accountId) => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.get(`${BASE_URL}/accounts/block/${accountId}`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const unblockAccount = async (accountId) => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.get(`${BASE_URL}/accounts/unblock/${accountId}`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}
