import {Autocomplete, Box, Button, IconButton, Paper, TextField, Typography} from '@mui/material'
import {useEffect, useState} from "react";
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import SearchIcon from '@mui/icons-material/Search';
import carMakesCSV from '../lib/makes.csv?raw';
import Papa from 'papaparse';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type {ModelSearchResult} from "../types/ModelSearchResult.ts";
import type {Make} from "../types/Make.ts";
import type {Model} from "../types/Model.ts";
import type {ValueSearchResult} from "../types/ValueSearchResult.ts";

const fetchModelSearchResults = async (query: string): Promise<ModelSearchResult> => {
  return axios.get<ModelSearchResult>(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${query}?format=json`
  ).then((response) => {
    return response.data;
  }).catch((error) => {
    return error;
  });
};

const fetchMarketValueSearchResults = async (make: string, model: string, year: number): Promise<ValueSearchResult> => {
  return axios.get<ValueSearchResult>("/api/vehicle-valuation", {
    params: {make, model, year}
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    return error.response.data;
  });
};

export default function Search({price, savePrice}: {
  price: number;
  savePrice: (price: number) => void,
}) {
  const [carMakes, setCarMakes] = useState<Make[]>([]);
  const [make, setMake] = useState<Make | null>(null);
  const [model, setModel] = useState('');
  const [year, setYear] = useState(dayjs());
  const [filters, setFilters] = useState({make: '', model: '', year: dayjs().year()});

  useEffect(() => {
    Papa.parse(carMakesCSV, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCarMakes(results.data as Make[]);
      },
    });
  }, []);

  const modelsQuery = useQuery({
    queryKey: ['models', make],
    queryFn: () => fetchModelSearchResults(make?.displayName ?? ''),
    enabled: !!make,
  })

  const valueQuery = useQuery({
    queryKey: ['valuation', filters],
    queryFn: () => fetchMarketValueSearchResults(filters.make, filters.model, filters.year),
    enabled: !!filters.make && !!filters.model && !!filters.year,
    retry: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({make: make?.value ?? '', model: model, year: year.year()});
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>Value Search</Typography>
      <Box p={2} component="form" onSubmit={handleSubmit}>
        <Paper
          sx={{padding: '16px', marginBottom: '16px'}}
          elevation={3}
        >
          <Autocomplete
            options={carMakes}
            getOptionLabel={(option) => option.displayName}
            value={make}
            onChange={(_event, newValue) => {
              setModel('');
              setMake(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vehicle Make"
                variant="outlined"
                required
                sx={{m: 1, width: '25ch'}}
              />
            )}
          />
          <Autocomplete
            options={modelsQuery.data?.Results.map((model: Model) => (model.Model_Name)) || []}
            getOptionLabel={option => option}
            noOptionsText={
              modelsQuery.isError
                ? "Error loading models"
                : (modelsQuery.isLoading ? "Loading options..." : "Select a make first")
            }
            value={model}
            onChange={(_event, newValue) => {
              setModel(newValue ?? '')
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Vehicle Model"
                variant="outlined"
                required
                sx={{m: 1, width: '25ch'}}
              />
            )}
          />
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Year"
                views={['year']}
                sx={{m: 1, width: '25ch'}}
                maxDate={dayjs()}
                value={year}
                onChange={(newValue) => setYear(newValue ?? dayjs())}
                slotProps={{
                  textField: {
                    required: true,
                  },
                }}
              />
            </LocalizationProvider>
          </div>
          <Button
            sx={{
              padding: '16px',
              m: 1,
              fontWeight: 'bold',
              alignSelf: 'center'
            }}
            type="submit"
            variant="outlined"
            startIcon={<SearchIcon/>}
            onClick={handleSubmit}
          >
            Search
          </Button>
        </Paper>

        {valueQuery.isLoading && <p>Loading...</p>}
        {
          valueQuery.data?.error &&
          <>
            <Typography variant={"h4"}>Error:</Typography>
            <Typography variant={"h5"}>{valueQuery.data?.message}</Typography>
          </>
        }
        {
          (valueQuery.isSuccess && !valueQuery.data?.error) &&
          <>
            <Typography variant={"h4"}>Estimated Value: ${valueQuery.data?.valuationPrice}</Typography>
            <IconButton onClick={() => {
              savePrice(valueQuery.data?.valuationPrice)
            }}>
              {
                price !== valueQuery.data?.valuationPrice ? <FavoriteBorderIcon></FavoriteBorderIcon> :
                  <FavoriteIcon></FavoriteIcon>
              }
            </IconButton>
          </>
        }
      </Box>
    </>
  );
}