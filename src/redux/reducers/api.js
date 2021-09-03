/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import {
  SET_CONNECTED_API, RESET_CONNECTED_API, 
  SET_API_INFO, RESET_API_INFO, 
  RESET_ALL
} from '../actions/api';

const initialState = {
  api: null,
  info: null
}

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CONNECTED_API:
      return {...state, api: action.payload };
    case RESET_CONNECTED_API:
      return {...state, api: null };
    case SET_API_INFO:
      return {...state, info: action.payload };
    case RESET_API_INFO:
      return {...state, info: null };
    case RESET_ALL:
      return initialState;
    default:
      return state;
  }
};

export default apiReducer;
