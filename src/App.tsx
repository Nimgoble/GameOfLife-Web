import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link as RouterLink, Outlet } from 'react-router-dom'
import { listBoards, BoardSummaryResponse } from './api/client'
import BoardDetails from './pages/BoardDetails'
import NewBoard from './pages/NewBoard'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import BoardList from './components/BoardList'

// Memoized layout to prevent unnecessary rerenders of routed pages
const Layout = React.memo(function Layout({ message }: { message: string }) {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Game of Life — Web UI (Demo)
      </Typography>
      {message && (
        <Typography color="error" sx={{ mb: 2 }} align="center">
          {message}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Outlet />
      </Box>
    </Container>
  )
})



export default function App() {
  const apiUrl = import.meta.env.GOL_API_URL ?? ''
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!apiUrl) setMessage('GOL_API_URL not set — set this to your API base URL')
  }, [apiUrl])

  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout message={message} />}>
            <Route path="/" element={<BoardList />} />
            <Route path="/new" element={<NewBoard />} />
            <Route path="/boards/:id" element={<BoardDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

