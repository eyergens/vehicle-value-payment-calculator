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
import {useState} from 'react'
import AddIcon from "@mui/icons-material/Add"
import {add, selectQuotes} from "../features/quotes/quotesSlice.ts";
import {select} from "../features/quotes/selectedQuoteSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {selectValue} from "../features/price/priceSlice.ts";

export default function Form() {
  const [newQuote, setNewQuote] = useState({
    downPayment: null,
    term: null,
    interestRate: null
  });
  const [downPaymentError, setDownPaymentError] = useState(false);
  const [termError, setTermError] = useState(false);
  const [interestRateError, setInterestRateError] = useState(false);

  const quoteOptions = useAppSelector(selectQuotes);
  const price = useAppSelector(selectValue).price;
  const dispatch = useAppDispatch();

  const limits = {
    downPayment: {min: 0, max: price != 0 ? price : 1000000},
    term: {min: 1, max: 600},
    interestRate: {min: 0, max: 100}
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setNewQuote((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const isInvalid = (value: number | null, min: number, max: number): boolean => {
    return value == null || value < min || value > max;
  }

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const downPaymentInvalid = isInvalid(newQuote.downPayment, limits.downPayment.min, limits.downPayment.max);
    const termInvalid = isInvalid(newQuote.term, limits.term.min, limits.term.max);
    const interestRateInvalid = isInvalid(newQuote.interestRate, limits.interestRate.min, limits.interestRate.max);

    setDownPaymentError(downPaymentInvalid);
    setTermError(termInvalid);
    setInterestRateError(interestRateInvalid);

    if (!downPaymentInvalid && !termInvalid && !interestRateInvalid) {
      const newOption = {
        id: (quoteOptions.at(-1)?.id ?? 1) + 1,
        downPayment: newQuote.downPayment!,
        term: newQuote.term!,
        interestRate: newQuote.interestRate!
      };
      dispatch(add(newOption));
      dispatch(select(newOption.id));

      setNewQuote({
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
                min: limits.downPayment.min,
                max: limits.downPayment.max
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
                min: limits.term.min,
                max: limits.term.max
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
                min: limits.interestRate.min,
                max: limits.interestRate.max
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