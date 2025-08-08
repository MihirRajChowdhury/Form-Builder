import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { FormBuilderState, FormSchema, FormField, FieldType } from '../types'

// Load forms from localStorage
export const loadFormsFromStorage = createAsyncThunk(
  'formBuilder/loadFormsFromStorage',
  async () => {
    const savedForms = localStorage.getItem('savedForms')
    return savedForms ? JSON.parse(savedForms) : []
  }
)

// Save forms to localStorage
export const saveFormsToStorage = createAsyncThunk(
  'formBuilder/saveFormsToStorage',
  async (forms: FormSchema[]) => {
    localStorage.setItem('savedForms', JSON.stringify(forms))
    return forms
  }
)

const initialState: FormBuilderState = {
  currentForm: null,
  savedForms: [],
  isPreviewMode: false,
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload
    },
    setSavedForms: (state, action: PayloadAction<FormSchema[]>) => {
      state.savedForms = action.payload
    },
    setIsPreviewMode: (state, action: PayloadAction<boolean>) => {
      state.isPreviewMode = action.payload
    },
    addField: (state, action: PayloadAction<{ type: FieldType; label: string }>) => {
      if (!state.currentForm) return
      
      const newField: FormField = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: action.payload.type,
        label: action.payload.label,
        required: false,
        validationRules: [],
        isDerived: false,
        order: state.currentForm.fields.length,
        options: action.payload.type === 'select' || action.payload.type === 'radio' 
          ? [{ label: 'Option 1', value: 'option1' }] 
          : undefined,
      }
      
      state.currentForm.fields.push(newField)
      state.currentForm.updatedAt = new Date().toISOString()
    },
    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (!state.currentForm) return
      
      const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId)
      if (fieldIndex !== -1) {
        state.currentForm.fields[fieldIndex] = {
          ...state.currentForm.fields[fieldIndex],
          ...action.payload.updates,
        }
        state.currentForm.updatedAt = new Date().toISOString()
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      if (!state.currentForm) return
      
      state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload)
      state.currentForm.updatedAt = new Date().toISOString()
    },
    reorderFields: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      if (!state.currentForm) return
      
      const { sourceIndex, destinationIndex } = action.payload
      const fields = [...state.currentForm.fields]
      const [removed] = fields.splice(sourceIndex, 1)
      fields.splice(destinationIndex, 0, removed)
      
      // Update order property
      fields.forEach((field, index) => {
        field.order = index
      })
      
      state.currentForm.fields = fields
      state.currentForm.updatedAt = new Date().toISOString()
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (!state.currentForm) return
      
      const formToSave: FormSchema = {
        ...state.currentForm,
        name: action.payload,
        id: state.currentForm.id || `form_${Date.now()}`,
        createdAt: state.currentForm.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      const existingIndex = state.savedForms.findIndex(f => f.id === formToSave.id)
      if (existingIndex !== -1) {
        state.savedForms[existingIndex] = formToSave
      } else {
        state.savedForms.push(formToSave)
      }
      
      // Save to localStorage
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms))
    },
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload)
      if (form) {
        state.currentForm = { ...form }
      }
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload)
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms))
    },
    clearCurrentForm: (state) => {
      state.currentForm = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFormsFromStorage.fulfilled, (state, action) => {
        state.savedForms = action.payload
      })
      .addCase(saveFormsToStorage.fulfilled, (state, action) => {
        state.savedForms = action.payload
      })
  },
})

export const {
  setCurrentForm,
  setSavedForms,
  setIsPreviewMode,
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  deleteForm,
  clearCurrentForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
