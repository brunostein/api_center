/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import React from "react";
import { Redirect, Route } from "react-router";
import { connect } from "react-redux";

const  PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
    exact: boolean;
  }> = (props) => {

    return (props.userLogged !== null) 
      ? (<Route  path={props.path}  exact={props.exact} component={props.component} />) 
      : (<Redirect  to="/login"  />);
};

const mapStateToProps = state => ({
  userLogged: state.user.user
});

export default connect(mapStateToProps)(PrivateRoute);