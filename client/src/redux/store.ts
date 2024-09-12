import { configureStore } from '@reduxjs/toolkit';
import FilesSlice from './files/FilesSlice';
import authSlice from './auth/authSlice';




export const store = configureStore({
    reducer: {
        files: FilesSlice.reducer,
        auth: authSlice.reducer,
     
    },
  })


// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export type StoreType = typeof store;