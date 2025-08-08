import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'

interface SaveFormDialogProps {
  open: boolean
  onClose: () => void
  onSave: (formName: string) => void
  currentFormName?: string
}

const SaveFormDialog: React.FC<SaveFormDialogProps> = ({
  open,
  onClose,
  onSave,
  currentFormName,
}) => {
  const [formName, setFormName] = useState(currentFormName || '')
  const [error, setError] = useState('')

  const handleSave = () => {
    if (!formName.trim()) {
      setError('Form name is required')
      return
    }
    
    if (formName.trim().length < 3) {
      setError('Form name must be at least 3 characters long')
      return
    }
    
    setError('')
    onSave(formName.trim())
  }

  const handleClose = () => {
    setFormName(currentFormName || '')
    setError('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SaveIcon color="primary" />
          Save Form
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Give your form a memorable name so you can easily find it later.
          </Typography>
          
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g., Customer Registration Form"
            error={!!error}
            helperText={error}
            autoFocus
          />
          
          {currentFormName && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This will update the existing form: "{currentFormName}"
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={!formName.trim()}
        >
          {currentFormName ? 'Update Form' : 'Save Form'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaveFormDialog
