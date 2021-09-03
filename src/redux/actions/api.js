/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

export const SET_CONNECTED_API = 'SET_CONNECTED_API';
export const RESET_CONNECTED_API = 'RESET_CONNECTED_API';
export const SET_API_INFO = 'SET_API_INFO';
export const RESET_API_INFO = 'RESET_API_INFO';
export const RESET_ALL = 'RESET_ALL';

export const setConnectedApi = (data) => ({
  type: SET_CONNECTED_API,
  payload: data
});

export const resetConnectedApi = () => ({
  type: RESET_CONNECTED_API
});

export const setApiInfo = (data) => ({
  type: SET_API_INFO,
  payload: data
});

export const resetApiInfo = () => ({
  type: RESET_API_INFO
});

export const resetAll = () => ({
  type: RESET_ALL
});
