import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  Visibility as PreviewIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { RootState, AppDispatch } from '../store'
import { loadForm, deleteForm, clearCurrentForm } from '../store/formBuilderSlice'

const MyForms: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { savedForms } = useSelector((state: RootState) => state.formBuilder)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [formToDelete, setFormToDelete] = useState<string | null>(null)

  const handlePreviewForm = (formId: string) => {
    dispatch(loadForm(formId))
    navigate('/preview')
  }

  const handleEditForm = (formId: string) => {
    dispatch(loadForm(formId))
    navigate('/create')
  }

  const handleDeleteForm = (formId: string) => {
    setFormToDelete(formId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (formToDelete) {
      dispatch(deleteForm(formToDelete))
      setDeleteDialogOpen(false)
      setFormToDelete(null)
    }
  }

  const handleCreateNewForm = () => {
    dispatch(clearCurrentForm())
    navigate('/create')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getFieldTypeSummary = (fields: any[]) => {
    const typeCounts: { [key: string]: number } = {}
    fields.forEach(field => {
      typeCounts[field.type] = (typeCounts[field.type] || 0) + 1
    })
    
    return Object.entries(typeCounts)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ')
  }

  if (savedForms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom color="primary.main">
              No Forms Created Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start building your first dynamic form to see it here.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateNewForm}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary.main" fontWeight={600}>
          My Forms ({savedForms.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNewForm}
          sx={{ borderRadius: 2 }}
        >
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {savedForms.map((form) => (
          <Grid item xs={12} md={6} lg={4} key={form.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom color="primary.main">
                  {form.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Created: {formatDate(form.createdAt)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Fields: {form.fields.length} ({getFieldTypeSummary(form.fields)})
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {form.fields.some(f => f.required) && (
                    <Chip label="Has Required Fields" size="small" color="warning" variant="outlined" />
                  )}
                  {form.fields.some(f => f.validationRules.length > 0) && (
                    <Chip label="Has Validation" size="small" color="info" variant="outlined" />
                  )}
                  {form.fields.some(f => f.type === 'select' || f.type === 'radio') && (
                    <Chip label="Has Options" size="small" color="secondary" variant="outlined" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PreviewIcon />}
                    onClick={() => handlePreviewForm(form.id)}
                    sx={{ flex: 1 }}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditForm(form.id)}
                    sx={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteForm(form.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this form? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyForms
