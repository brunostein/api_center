/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import axiosRequest from './axios-request'
import { getApiURL } from '../helpers/api-helper'

export const updateSettings = async (settingsData) => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.put(`${BASE_URL}/settings/update`, settingsData)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}

export const getSettings = async () => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.get(`${BASE_URL}/settings/get`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}
