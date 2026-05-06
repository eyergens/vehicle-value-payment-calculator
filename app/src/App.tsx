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
  const [price, setPrice] = useState(0);
  const [quoteOptions, setQuoteOptions] = useState([
    {
      id: 1,
      downPayment: 3000,
      term: 60,
      interestRate: 5.8,
    },
    {
      id: 2,
      downPayment: 10000,
      term: 60,
      interestRate: 5.4,
    },
    {
      id: 3,
      downPayment: 8000,
      term: 40,
      interestRate: 5.5,
    },
  ]);
  const [selectedQuote, setSelectedQuote] = useState(quoteOptions[0]);

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

  const savePrice = (price: number) => {
    setPrice(price);
  };

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
            <Route path="/" element={<Search price={price} savePrice={savePrice}/>}/>
            <Route path="/quotes"
                   element={<Quotes price={price} quoteOptions={quoteOptions} setQuoteOptions={setQuoteOptions}
                                    selectedQuote={selectedQuote} setSelectedQuote={setSelectedQuote}/>}/>
            <Route path="*" element={<PageNotFound/>}/>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App
