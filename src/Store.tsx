import { configureStore } from '@reduxjs/toolkit';

import FileSlice from './Slice/FileSlice';

const store = configureStore({
	reducer: {
		FileSlice: FileSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;