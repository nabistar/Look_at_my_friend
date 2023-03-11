import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './GlobalStyled';
import Meta from './Meta';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './Store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
	<Provider store={Store}>
	<BrowserRouter>
		<Meta />
		<GlobalStyles />
    	<App />
	</BrowserRouter>
	</Provider>
);
