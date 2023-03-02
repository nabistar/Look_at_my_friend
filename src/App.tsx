import React, { memo } from 'react';
import {Routes, Route} from 'react-router-dom';

//page
import Main from './page/main';
import Refer from './page/Refer';

const App = memo(() => {
	return (
		<Routes>
			<Route path="/main/*" element={<Main />} />
			<Route path="/" element={<Refer />} />
		</Routes>
	);
});

export default App;