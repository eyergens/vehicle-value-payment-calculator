import {
  Box,
  OutlinedInput,
  Button,
  Paper,
  Typography,
  InputAdornment,
  InputLabel,
  FormControl,
  FormHelperText
} from '@mui/material'
import React, {useState} from 'react'
import AddIcon from "@mui/icons-material/Add"
import type {QuoteForm} from "../types/QuoteForm.ts";

export default function Form({addQuoteOption}: QuoteForm) {
  const [newQuote, setNewQuotes] = useState({
    downPayment: null,
    term: null,
    interestRate: null
  });
  const [downPaymentError, setDownPaymentError] = useState(false);
  const [termError, setTermError] = useState(false);
  const [interestRateError, setInterestRateError] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewQuotes((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const isInvalid = (value: number | null): boolean => {
    return value == null || value <= 0
  }

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const downPaymentInvalid = isInvalid(newQuote.downPayment);
    const termInvalid = isInvalid(newQuote.term);
    const interestRateInvalid = isInvalid(newQuote.interestRate);

    setDownPaymentError(downPaymentInvalid);
    setTermError(termInvalid);
    setInterestRateError(interestRateInvalid);

    if (!downPaymentInvalid && !termInvalid && !interestRateInvalid) {
      addQuoteOption?.({
        downPayment: newQuote.downPayment!,
        term: newQuote.term!,
        interestRate: newQuote.interestRate!
      });

      setNewQuotes({
        downPayment: null,
        term: null,
        interestRate: null
      })
    }
  };

  return (
    <Box p={2} component="form" onSubmit={handleSubmit}>
      <Paper
        sx={{padding: '16px', marginBottom: '16px'}}
        elevation={3}
      >
        <Typography variant="h6">New Quote Option</Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <FormControl sx={{m: 1, width: '25ch', alignSelf: 'center'}} variant="outlined" error={downPaymentError}>
            <InputLabel htmlFor='downPayment'>Down Payment</InputLabel>
            <OutlinedInput
              required
              label="Down Payment"
              type="number"
              name="downPayment"
              value={newQuote.downPayment || ''}
              onChange={handleChange}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              inputProps={{
                min: 0
              }}
            />
            {downPaymentError && <FormHelperText id="component-error-text">Invalid Down Payment</FormHelperText>}
          </FormControl>
          <FormControl sx={{m: 1, width: '25ch', alignSelf: 'center'}} variant="outlined" error={termError}>
            <InputLabel htmlFor='term'>Term (months)</InputLabel>
            <OutlinedInput
              required
              label="Term (months)"
              type="number"
              name="term"
              value={newQuote.term || ''}
              onChange={handleChange}
              inputProps={{
                min: 0
              }}
            />
            {termError && <FormHelperText id="component-error-text">Invalid Loan Term</FormHelperText>}
          </FormControl>
          <FormControl sx={{m: 1, width: '25ch', alignSelf: 'center'}} variant="outlined" error={interestRateError}>
            <InputLabel htmlFor='interestRate'>Interest Rate</InputLabel>
            <OutlinedInput
              required
              label="Interest Rate"
              type="number"
              name="interestRate"
              value={newQuote.interestRate || ''}
              onChange={handleChange}
              endAdornment={<InputAdornment position="start">%</InputAdornment>}
              inputProps={{
                step: "0.01",
                min: 0
              }}
            />
            {interestRateError && <FormHelperText id="component-error-text">Invalid Interest Rate</FormHelperText>}
          </FormControl>
        </Box>
        <Button
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            marginTop: '0.5rem'
          }}
          type="submit"
          variant="outlined"
          startIcon={<AddIcon/>}
          onClick={handleSubmit}
        >
          Add Quote
        </Button>
      </Paper>
    </Box>
  );
}