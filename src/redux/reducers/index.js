/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import apiReducer from './api';
import userLoggedReducer from './user';
import {combineReducers} from 'redux';

const reducers = combineReducers({
  api: apiReducer,
  user: userLoggedReducer
});

export default reducers;
