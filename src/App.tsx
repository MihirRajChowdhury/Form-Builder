import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material'
import { Add as AddIcon, Visibility as PreviewIcon, List as ListIcon } from '@mui/icons-material'
import { RootState, AppDispatch } from './store'
import { loadFormsFromStorage } from './store/formBuilderSlice'
import { useNavigate, useLocation } from 'react-router-dom'
import FormBuilder from './components/FormBuilder'
import FormPreview from './components/FormPreview'
import MyForms from './components/MyForms'

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)

  useEffect(() => {
    dispatch(loadFormsFromStorage())
  }, [dispatch])

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700, 
              color: 'primary.main',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            Form Builder
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={isActiveRoute('/create') ? 'contained' : 'outlined'}
              startIcon={<AddIcon />}
              onClick={() => handleNavigation('/create')}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Create Form
            </Button>
            
            <Button
              variant={isActiveRoute('/preview') ? 'contained' : 'outlined'}
              startIcon={<PreviewIcon />}
              onClick={() => handleNavigation('/preview')}
              disabled={!currentForm}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Preview
            </Button>
            
            <Button
              variant={isActiveRoute('/myforms') ? 'contained' : 'outlined'}
              startIcon={<ListIcon />}
              onClick={() => handleNavigation('/myforms')}
              sx={{ 
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              My Forms
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/create" replace />} />
          <Route path="/create" element={<FormBuilder />} />
          <Route path="/preview" element={<FormPreview />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
