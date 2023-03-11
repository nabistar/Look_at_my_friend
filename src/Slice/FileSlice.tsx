import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/lookfriend";

class ErrorClass extends Error {
    response?: {
        data: any;
        status: number;
        headers: string;
    };
}

interface info {
    data: {[key: string]: string},
	pubdate: string,
	rt: string,
	rtcode: number,
	rtmsg: string | null
}

interface file {
	data: {[key: string]: string},
	pubdate: string,
	rt: string,
	rtcode: number,
	rtmsg: string | null
}

interface addimg {
	file: string,
	content: string | null,
	password: string
}

interface initialState {
    data: info | null;
	file: file | null;
    loading: boolean;
    error: ErrorClass | null;
}

export const getList = createAsyncThunk<info, info, { rejectValue: ErrorClass }>("FileSlice/getList", async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.get(API_URL);
        result = response.data;
    } catch (err) {
        if (err instanceof ErrorClass) {
            return rejectWithValue(err);
        }
    }

    return result;
});

export const PostItem = createAsyncThunk<info, addimg, { rejectValue: ErrorClass }>("FileSlice/PostItem", async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.post(API_URL, payload);
        result = response.data;
    } catch (err) {
        if (err instanceof ErrorClass) {
            return rejectWithValue(err);
        }
    }

    return result;
});

export const DeleteItem = createAsyncThunk<info, info, { rejectValue: ErrorClass }>("FileSlice/DeleteItem", async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response = await axios.delete(API_URL);
        result = response.data;
    } catch (err) {
        if (err instanceof ErrorClass) {
            return rejectWithValue(err);
        }
    }

    return result;
});

export const PostImg = createAsyncThunk<file, FormData, { rejectValue: ErrorClass }>("FileSlice/PostImg", async (payload, { rejectWithValue }) => {
    let result = null;

    try {
        const response: any = await axios.post(`${API_URL}img`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        result = response.data;
    } catch (err) {
        if (err instanceof ErrorClass) {
            return rejectWithValue(err);
        }
    }

    return result;
});

const FileSlice = createSlice({
    name: "FileSlice",
    initialState: {
        data: null,
		file: null,
        loading: false,
        error: null,
    } as initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getList.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(getList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload;
            })
            .addCase(getList.rejected, (state, { payload }) => {
                state.loading = false;
                if (payload) {
                    state.error = payload;
                }
            })
            .addCase(PostItem.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(PostItem.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload;
            })
            .addCase(PostItem.rejected, (state, { payload }) => {
                state.loading = false;
                if (payload) {
                    state.error = payload;
                }
            })
            .addCase(DeleteItem.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(DeleteItem.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload;
            })
            .addCase(DeleteItem.rejected, (state, { payload }) => {
                state.loading = false;
                if (payload) {
                    state.error = payload;
                }
            })
            .addCase(PostImg.pending, (state, { payload }) => {
                state.loading = true;
            })
            .addCase(PostImg.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.file = payload;
            })
            .addCase(PostImg.rejected, (state, { payload }) => {
                state.loading = false;
                if (payload) {
                    state.error = payload;
                }
            });
    },
});

export default FileSlice.reducer;
