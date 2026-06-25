import {Routes, Route, Link, BrowserRouter} from 'react-router-dom'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import './App.css'
import Quotes from './pages/Quotes'
import Search from "./pages/Search"
import {Button, type PaletteMode, Toolbar} from "@mui/material";
import {useMemo, useState} from "react";
import PageNotFound from "./pages/404.tsx";
import {indigo} from "@mui/material/colors";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const queryClient = new QueryClient()

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: indigo,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toolbar sx={{height: 80}}>
            {/* Navigation */}
            <nav>
              <Button variant="text"
                      component={Link}
                      to="/">
                Search
              </Button>
              <Button variant="text"
                      component={Link}
                      to="/quotes">
                Quotes
              </Button>
            </nav>

            <Button
              sx={{
                marginLeft: 'auto'
              }}
              onClick={() =>
                setMode(mode === "light" ? "dark" : "light")
              }
              color="inherit"
              startIcon={mode === "light" ? <DarkModeIcon/> : <LightModeIcon/>}
            >
              {mode === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
          </Toolbar>
          {/* Routes */}
          <Routes>
            <Route path="/" element={<Search/>}/>
            <Route path="/quotes" element={<Quotes/>}/>
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App
