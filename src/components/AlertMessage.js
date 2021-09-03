/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { useState, useEffect } from 'react'
import { Alert } from 'react-bootstrap'

export default function AlertMessage(props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, [props]);

  if (show) {
    return (
      <Alert variant={props.type} onClose={() => setShow(false)} dismissible>
        {props.title &&
        <>
          <Alert.Heading>{props.title}</Alert.Heading>
          <hr />
        </>
        }
        <p className="mb-0">{props.message}</p>
      </Alert>
    );
  } else {
    return <></>
  }
}
