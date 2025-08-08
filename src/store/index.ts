import { configureStore } from '@reduxjs/toolkit'
import formBuilderReducer from './formBuilderSlice'

export const store = configureStore({
  reducer: {
    formBuilder: formBuilderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['formBuilder/setCurrentForm', 'formBuilder/setSavedForms'],
        ignoredPaths: ['formBuilder.currentForm', 'formBuilder.savedForms'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
