import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from "../redux/user/userSlice";
import themeReducer from "../redux/theme/themeSlice";
import storage from 'redux-persist/lib/storage';
import {persistStore,persistReducer} from "redux-persist";

const rootReducer = combineReducers({
  user:userReducer,
  theme:themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false}),
})

export const persistor = persistStore(store);