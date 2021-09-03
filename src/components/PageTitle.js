/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import { Card } from 'react-bootstrap'

export default function PageTitle(props) {
  return (  
    <Card className="page-title mb-3">
      <Card.Body>
        <h4 className="m-0">{props.title}</h4>
      </Card.Body>
    </Card>
  )
}
