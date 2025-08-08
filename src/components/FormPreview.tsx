import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormHelperText,
  Alert,
  Grid,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { RootState } from '../store'
import { FormField, FormValues, FormErrors, FormSubmissionResult } from '../types'
import dayjs from 'dayjs'

// Utility function to calculate derived field values
const calculateDerivedValue = (
  field: FormField,
  formValues: FormValues,
  allFields: FormField[]
): any => {
  if (!field.isDerived || !field.parentFields || !field.derivedFormula) {
    return formValues[field.id]
  }

  try {
    const parentValues: { [key: string]: any } = {}
    
    // Get parent field values
    field.parentFields.forEach(parentId => {
      const parentField = allFields.find(f => f.id === parentId)
      if (parentField) {
        parentValues[parentId] = formValues[parentId] || ''
      }
    })

    // For calculation type
    if (field.derivedType === 'calculation') {
      let formula = field.derivedFormula
      // Replace field IDs with their values
      Object.keys(parentValues).forEach(fieldId => {
        const value = parentValues[fieldId]
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value || 0
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${fieldId}\\b`, 'g')
        formula = formula.replace(regex, numValue.toString())
      })
      
      // Safe evaluation using Function constructor
      const result = new Function('return ' + formula)()
      return isNaN(result) ? 0 : result
    }
    
    // For concatenation type
    if (field.derivedType === 'concatenation') {
      let formula = field.derivedFormula
      // Replace field IDs with their string values
      Object.keys(parentValues).forEach(fieldId => {
        const value = parentValues[fieldId] || ''
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${fieldId}\\b`, 'g')
        formula = formula.replace(regex, `"${value}"`)
      })
      
      // Safe evaluation
      const result = new Function('return ' + formula)()
      return result || ''
    }
    
    // For conditional type
    if (field.derivedType === 'conditional') {
      let formula = field.derivedFormula
      // Replace field IDs with their values
      Object.keys(parentValues).forEach(fieldId => {
        const value = parentValues[fieldId]
        const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value || 0
        // Use word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${fieldId}\\b`, 'g')
        formula = formula.replace(regex, numValue.toString())
      })
      
      // Safe evaluation
      const result = new Function('return ' + formula)()
      return result || ''
    }
    
    return formValues[field.id]
  } catch (error) {
    console.error('Error calculating derived value:', error)
    return formValues[field.id] || ''
  }
}

const FormPreview: React.FC = () => {
  const navigate = useNavigate()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  const [formValues, setFormValues] = useState<FormValues>({})
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize form values with defaults
  useEffect(() => {
    if (currentForm) {
      const initialValues: FormValues = {}
      
      // First, set initial values for all fields
      currentForm.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialValues[field.id] = field.defaultValue
        } else {
          // Set appropriate default values based on field type
          switch (field.type) {
            case 'checkbox':
              initialValues[field.id] = false
              break
            case 'select':
            case 'radio':
              initialValues[field.id] = field.options?.[0]?.value || ''
              break
            default:
              initialValues[field.id] = ''
          }
        }
      })
      
      // Then, calculate derived field values
      currentForm.fields.forEach(field => {
        if (field.isDerived) {
          const calculatedValue = calculateDerivedValue(field, initialValues, currentForm.fields)
          initialValues[field.id] = calculatedValue
        }
      })
      
      setFormValues(initialValues)
      setFormErrors({})
    }
  }, [currentForm])

  const validateField = (field: FormField, value: any): string[] => {
    const errors: string[] = []

    field.validationRules.forEach(rule => {
      if (!rule.enabled) return

      switch (rule.type) {
        case 'required':
          // Check if field is required (either by field.required or by validation rule)
          const isRequired = field.required || rule.type === 'required'
          if (isRequired && (!value || (typeof value === 'string' && !value.trim()))) {
            errors.push(rule.message || 'This field is required')
          }
          break
        case 'minLength':
          if (value && typeof value === 'string' && value.length < (rule.value as number)) {
            errors.push(rule.message || `Minimum length is ${rule.value} characters`)
          }
          break
        case 'maxLength':
          if (value && typeof value === 'string' && value.length > (rule.value as number)) {
            errors.push(rule.message || `Maximum length is ${rule.value} characters`)
          }
          break
        case 'email':
          if (value && typeof value === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(value)) {
              errors.push(rule.message || 'Please enter a valid email address')
            }
          }
          break
        case 'password':
          if (value && typeof value === 'string') {
            if (value.length < 8) {
              errors.push(rule.message || 'Password must be at least 8 characters long')
            } else if (!/\d/.test(value)) {
              errors.push(rule.message || 'Password must contain at least one number')
            }
          }
          break
      }
    })

    return errors
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => {
      const newValues = { ...prev, [fieldId]: value }
      
      // Recalculate derived fields that depend on this field
      if (currentForm) {
        const derivedFields = currentForm.fields.filter(f => 
          f.isDerived && f.parentFields?.includes(fieldId)
        )
        
        derivedFields.forEach(derivedField => {
          const calculatedValue = calculateDerivedValue(derivedField, newValues, currentForm.fields)
          newValues[derivedField.id] = calculatedValue
        })
      }
      
      return newValues
    })
    
    // Validate field in real-time and update errors
    if (currentForm) {
      const field = currentForm.fields.find(f => f.id === fieldId)
      if (field && !field.isDerived) {
        const fieldErrors = validateField(field, value)
        setFormErrors(prev => ({
          ...prev,
          [fieldId]: fieldErrors
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)

    if (!currentForm) {
      alert('No form to submit')
      return
    }

    // Validate all fields
    const newErrors: FormErrors = {}
    let hasErrors = false

    currentForm.fields.forEach(field => {
      // Skip validation for derived fields
      if (field.isDerived) return
      
      const fieldErrors = validateField(field, formValues[field.id])
      if (fieldErrors.length > 0) {
        newErrors[field.id] = fieldErrors
        hasErrors = true
      }
    })

    setFormErrors(newErrors)

    if (!hasErrors) {
      // Form is valid - show success message
      const result: FormSubmissionResult = {
        success: true,
        values: formValues,
      }
      
      alert('Form submitted successfully!')
      console.log('Form submission result:', result)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormValues({})
        setFormErrors({})
        setIsSubmitted(false)
      }, 2000)
    }
  }

  const renderField = (field: FormField) => {
    // For derived fields, always calculate the current value
    const value = field.isDerived 
      ? calculateDerivedValue(field, formValues, currentForm?.fields || [])
      : formValues[field.id]
    const errors = formErrors[field.id] || []
    const hasError = errors.length > 0

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            fullWidth
            type={field.type}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={hasError}
            helperText={
              field.isDerived 
                ? `Calculated from: ${field.parentFields?.map(id => 
                    currentForm?.fields.find(f => f.id === id)?.label
                  ).join(', ')}`
                : hasError ? errors[0] : ''
            }
            required={field.required}
            disabled={field.isDerived}
            InputProps={{
              readOnly: field.isDerived,
            }}
          />
        )

      case 'textarea':
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            required={field.required}
          />
        )

      case 'select':
        return (
          <FormControl fullWidth error={hasError} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              label={field.label}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {hasError && <FormHelperText>{errors[0]}</FormHelperText>}
          </FormControl>
        )

      case 'radio':
        return (
          <FormControl error={hasError} required={field.required}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {field.label}
            </Typography>
            <RadioGroup
              value={value || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {hasError && <FormHelperText>{errors[0]}</FormHelperText>}
          </FormControl>
        )

      case 'checkbox':
        return (
          <FormControl error={hasError}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                />
              }
              label={field.label}
            />
            {hasError && <FormHelperText>{errors[0]}</FormHelperText>}
          </FormControl>
        )

      case 'date':
        return (
          <DatePicker
            label={field.label}
            value={value ? dayjs(value) : null}
            onChange={(date) => handleFieldChange(field.id, date?.toISOString() || '')}
            slotProps={{
              textField: {
                fullWidth: true,
                error: hasError,
                helperText: hasError ? errors[0] : '',
                required: field.required,
              }
            }}
          />
        )

      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            error={hasError}
            helperText={hasError ? errors[0] : ''}
            required={field.required}
          />
        )
    }
  }

  if (!currentForm) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="primary.main">
              Select a Form to Preview
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No form is currently selected for preview. Please create a form in the builder or select an existing form from "My Forms" to see how it will appear to end users.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/create')}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                Create New Form
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/myforms')}
                sx={{ borderRadius: 2, px: 4, py: 1.5 }}
              >
                View My Forms
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" color="primary.main" gutterBottom>
        Form Preview: {currentForm.name}
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This is how your form will appear to end users. Fill it out and test the validation rules.
      </Alert>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {currentForm.fields.map((field) => (
                <Grid item xs={12} key={field.id}>
                  {renderField(field)}
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ px: 4 }}
                  >
                    Submit Form
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setFormValues({})
                      setFormErrors({})
                      setIsSubmitted(false)
                    }}
                  >
                    Reset Form
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default FormPreview
