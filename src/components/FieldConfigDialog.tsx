import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
  Divider,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { FormField, ValidationRule, SelectOption } from '../types'

interface FieldConfigDialogProps {
  field: FormField
  open: boolean
  onClose: () => void
  onUpdate: (fieldId: string, updates: Partial<FormField>) => void
}

const FieldConfigDialog: React.FC<FieldConfigDialogProps> = ({
  field,
  open,
  onClose,
  onUpdate,
}) => {
  const [localField, setLocalField] = useState<FormField>(field)
  const [newOption, setNewOption] = useState({ label: '', value: '' })

  useEffect(() => {
    setLocalField(field)
  }, [field])

  const handleSave = () => {
    onUpdate(field.id, localField)
    onClose()
  }

  const addOption = () => {
    if (newOption.label && newOption.value) {
      const option: SelectOption = { label: newOption.label, value: newOption.value }
      const updatedOptions = [...(localField.options || []), option]
      setLocalField({ ...localField, options: updatedOptions })
      setNewOption({ label: '', value: '' })
    }
  }

  const removeOption = (index: number) => {
    const updatedOptions = localField.options?.filter((_, i) => i !== index) || []
    setLocalField({ ...localField, options: updatedOptions })
  }

  const validationRuleTypes = [
    { value: 'required', label: 'Required' },
    { value: 'minLength', label: 'Minimum Length' },
    { value: 'maxLength', label: 'Maximum Length' },
    { value: 'email', label: 'Email Format' },
    { value: 'password', label: 'Password (8+ chars, must contain number)' },
  ]

  const addValidationRule = (type: string) => {
    const rule: ValidationRule = {
      type: type as ValidationRule['type'],
      message: `Field is ${type}`,
      enabled: true,
      value: type === 'minLength' ? '3' : type === 'maxLength' ? '50' : undefined,
    }
    
    setLocalField({
      ...localField,
      validationRules: [...localField.validationRules, rule],
    })
  }

  const removeValidationRule = (index: number) => {
    const updatedRules = localField.validationRules.filter((_, i) => i !== index)
    setLocalField({ ...localField, validationRules: updatedRules })
  }

  const updateValidationRule = (index: number, updates: Partial<ValidationRule>) => {
    const updatedRules = [...localField.validationRules]
    updatedRules[index] = { ...updatedRules[index], ...updates }
    setLocalField({ ...localField, validationRules: updatedRules })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Configure Field: {field.label}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={3}>
            {/* Basic Configuration */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Settings</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Field Label"
                    value={localField.label}
                    onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Value"
                    value={localField.defaultValue || ''}
                    onChange={(e) => setLocalField({ ...localField, defaultValue: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localField.required}
                        onChange={(e) => setLocalField({ ...localField, required: e.target.checked })}
                      />
                    }
                    label="Required Field"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={localField.isDerived}
                        onChange={(e) => setLocalField({ 
                          ...localField, 
                          isDerived: e.target.checked,
                          required: e.target.checked ? false : localField.required // Derived fields shouldn't be required
                        })}
                      />
                    }
                    label="Derived Field (computed from other fields)"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Options for Select/Radio fields */}
            {(field.type === 'select' || field.type === 'radio') && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Options</Typography>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Label"
                        value={newOption.label}
                        onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Value"
                        value={newOption.value}
                        onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={addOption}
                        disabled={!newOption.label || !newOption.value}
                        startIcon={<AddIcon />}
                      >
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {localField.options?.map((option, index) => (
                    <Chip
                      key={index}
                      label={`${option.label} (${option.value})`}
                      onDelete={() => removeOption(index)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Validation Rules */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Validation Rules</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Add validation rules to ensure data quality:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {validationRuleTypes.map((ruleType) => (
                    <Button
                      key={ruleType.value}
                      variant="outlined"
                      size="small"
                      onClick={() => addValidationRule(ruleType.value)}
                      disabled={localField.validationRules.some(r => r.type === ruleType.value)}
                    >
                      {ruleType.label}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {localField.validationRules.map((rule, index) => (
                  <Box key={index} sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <Typography variant="body2" fontWeight={500}>
                          {rule.type}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {(rule.type === 'minLength' || rule.type === 'maxLength') && (
                          <TextField
                            size="small"
                            label="Value"
                            type="number"
                            value={rule.value || ''}
                            onChange={(e) => updateValidationRule(index, { value: e.target.value })}
                          />
                        )}
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          label="Error Message"
                          value={rule.message}
                          onChange={(e) => updateValidationRule(index, { message: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton
                          size="small"
                          onClick={() => removeValidationRule(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FieldConfigDialog
