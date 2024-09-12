import { createSlice } from '@reduxjs/toolkit';
import type { FileType } from '../../types/FileTypes';
import { createFileThunk, deleteFileThunk, editFileThunk, getFilesThunk } from './FileAsyncActions';

type InitialStateType = {
  data: FileType[];
};

const initialState: InitialStateType = {
  data: [],
};

const FilesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFilesThunk.fulfilled, (state, { payload }) => {
      state.data = payload; // Сохраняем массив файлов
    });

    builder.addCase(createFileThunk.fulfilled, (state, { payload }) => {
      state.data.push(payload);
    });

    builder.addCase(deleteFileThunk.fulfilled, (state, { payload }) => {
      state.data = state.data.filter((el) => el.id !== payload);
    });

    builder.addCase(editFileThunk.fulfilled, (state, { payload }) => {
      state.data = state.data.map((el) => (el.id === payload.id ? payload : el));
    });
  },
});

export default FilesSlice;
