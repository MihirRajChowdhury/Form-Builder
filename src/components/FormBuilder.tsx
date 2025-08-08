import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material'
import { RootState, AppDispatch } from '../store'
import { addField, updateField, deleteField, saveForm, setCurrentForm, reorderFields, clearCurrentForm } from '../store/formBuilderSlice'
import { FieldType, FormField } from '../types'
import FieldConfigDialog from './FieldConfigDialog'

const FormBuilder: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [showFieldDialog, setShowFieldDialog] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType>('text')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [configuringField, setConfiguringField] = useState<FormField | null>(null)
  const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null)

  // Initialize a new form if none exists
  useEffect(() => {
    if (!currentForm) {
      dispatch(setCurrentForm({
        id: `form-${Date.now()}`,
        name: 'Untitled Form',
        fields: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }))
    }
  }, [currentForm, dispatch])

  const handleAddField = () => {
    if (newFieldLabel.trim()) {
      dispatch(addField({ type: selectedFieldType, label: newFieldLabel.trim() }))
      setNewFieldLabel('')
      setShowFieldDialog(false)
    }
  }

  const handleSaveForm = (formName: string) => {
    dispatch(saveForm(formName))
    setShowSaveDialog(false)
    
    // Clear the current form to reset to default state
    dispatch(clearCurrentForm())
    
    // Redirect to myforms page
    navigate('/myforms')
  }

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId))
  }

  const handleConfigureField = (field: FormField) => {
    setConfiguringField(field)
  }

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    dispatch(updateField({ fieldId, updates }))
  }

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedFieldId(fieldId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault()
    if (!draggedFieldId || draggedFieldId === targetFieldId) return

    const draggedIndex = currentForm?.fields.findIndex(f => f.id === draggedFieldId) || -1
    const targetIndex = currentForm?.fields.findIndex(f => f.id === targetFieldId) || -1

    if (draggedIndex !== -1 && targetIndex !== -1) {
      dispatch(reorderFields({ sourceIndex: draggedIndex, destinationIndex: targetIndex }))
    }
    setDraggedFieldId(null)
  }

  const fieldTypeOptions = [
    { value: 'text', label: 'Text Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date Picker' },
  ]

  // Show welcome screen if no form exists
  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="primary.main">
              Welcome to Form Builder! 
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start building your dynamic form by adding fields and configuring them to your needs.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setShowFieldDialog(true)}
              sx={{ borderRadius: 2, px: 4, py: 1.5 }}
            >
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" color="primary.main" fontWeight={600}>
            Building: {currentForm.name || 'Untitled Form'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentForm.fields.length} field{currentForm.fields.length !== 1 ? 's' : ''} • 
            {currentForm.fields.filter(f => f.required).length} required • 
            {currentForm.fields.filter(f => f.isDerived).length} derived
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowFieldDialog(true)}
            sx={{ borderRadius: 2 }}
          >
            Add Field
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setShowSaveDialog(true)}
            disabled={currentForm.fields.length === 0}
            sx={{ borderRadius: 2 }}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {/* Instructions */}
      {currentForm.fields.length === 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            💡 <strong>Quick Tips:</strong>
          </Typography>
          <Box component="ul" sx={{ pl: 3, color: 'text.secondary' }}>
            <li>Drag fields to reorder them</li>
            <li>Click the settings icon to configure field properties</li>
            <li>Use derived fields to create calculated values</li>
            <li>Add validation rules to ensure data quality</li>
          </Box>
        </Box>
      )}

      {/* Fields List */}
      {currentForm.fields.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8, backgroundColor: '#f8f9fa' }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No fields added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Click "Add Field" to start building your form
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowFieldDialog(true)}
              sx={{ borderRadius: 2 }}
            >
              Add Your First Field
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {currentForm.fields.map((field) => (
            <Grid item xs={12} key={field.id}>
              <Card 
                sx={{ 
                  position: 'relative',
                  opacity: draggedFieldId === field.id ? 0.5 : 1,
                  cursor: 'grab',
                  '&:active': { cursor: 'grabbing' }
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, field.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, field.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'text.secondary',
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' }
                      }}
                    >
                      <DragIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {field.label}
                    </Typography>
                    <Chip 
                      label={field.type} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    {field.required && (
                      <Chip 
                        label="Required" 
                        size="small" 
                        color="error" 
                        variant="outlined" 
                      />
                    )}
                    {field.isDerived && (
                      <Chip 
                        label="Derived" 
                        size="small" 
                        color="secondary" 
                        variant="outlined" 
                      />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleConfigureField(field)}
                      sx={{ color: 'primary.main' }}
                    >
                      <SettingsIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteField(field.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  
                  {/* Display validation rules */}
                  {field.validationRules.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      {field.validationRules.map((rule, ruleIndex) => (
                        <Chip
                          key={ruleIndex}
                          label={`${rule.type}: ${rule.message}`}
                          size="small"
                          color="info"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}

                  {/* Display derived field info */}
                  {field.isDerived && field.parentFields && field.parentFields.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={`Derived from: ${field.parentFields.length} field(s)`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Field Dialog */}
      <Dialog open={showFieldDialog} onClose={() => setShowFieldDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Field</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Field Type</InputLabel>
              <Select
                value={selectedFieldType}
                onChange={(e) => setSelectedFieldType(e.target.value as FieldType)}
                label="Field Type"
              >
                {fieldTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Field Label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Enter field label..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFieldDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddField} 
            variant="contained"
            disabled={!newFieldLabel.trim()}
          >
            Add Field
          </Button>
        </DialogActions>
      </Dialog>

      {/* Simple Save Form Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Form Name"
              placeholder="Enter form name..."
              autoFocus
              value={currentForm.name}
              onChange={(e) => {
                // Update the form name directly
                dispatch(setCurrentForm({
                  ...currentForm,
                  name: e.target.value
                }))
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveForm(currentForm.name || 'Untitled Form')} 
            variant="contained"
          >
            Save Form
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Configuration Dialog */}
      {configuringField && (
        <FieldConfigDialog
          field={configuringField}
          open={!!configuringField}
          onClose={() => setConfiguringField(null)}
          onUpdate={handleFieldUpdate}
        />
      )}
    </Box>
  )
}

export default FormBuilder
