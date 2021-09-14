/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import axiosRequest from './axios-request'
import { getApiURL } from '../helpers/api-helper'

export const getLogs = async (lines = 15, filters = "") => {
  const BASE_URL = getApiURL();
  const result = await axiosRequest.get(`${BASE_URL}/logs/get-lines?lines=${lines}&filters=${filters}`)
    .then(({data}) => {
      return data;
  })
  .catch (err => {
    console.log(err);
  });
  return result;
}
