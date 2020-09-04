/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';

import NetInfo from "@react-native-community/netinfo";
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import Router from './src/routes';
import { createStore } from 'redux';
import Root from './src/redux/reducers/index.reducers';

const store = createStore(Root);

const App = () => {
  useEffect(() => {
    
    // hide the splash screen from native ui
    SplashScreen.hide();

    // listen for internet changes or connectivity
    NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    })

  }, [])
  return (
    <>
    <Provider store={store}>
      <Router/>
    </Provider>
    </>
  );
};

export default App;
