/**
 * TIFX Technologies
 * Copyright (c) 2014-2021 - All rights reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Written by Bruno B. Stein <bruno.stein@tifx.com.br>, 2021
 */

import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, storePersistor } from './redux/store'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={storePersistor}>
        <AppRoutes />
      </PersistGate>
    </Provider>
  );
}

export default App;
