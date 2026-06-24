import Option from '../components/Option'
import Form from '../components/Form'
import {Box, Typography} from '@mui/material'
import {useEffect} from 'react'
import axios from "axios";
import {useQuery} from "@tanstack/react-query";
import type {PaymentsSearchResult} from "../types/PaymentsSearchResult.ts";
import type {QuoteForm} from "../types/QuoteForm.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {add, selectQuotes} from "../features/quotes/quotesSlice.ts";
import {select, selectSelectedQuote, selectSelectedQuoteId} from "../features/quotes/selectedQuoteSlice.ts";

const fetchMonthlyPaymentsResults = async (price: number, downPayment: number, loanTerm: number, interestRate: number): Promise<PaymentsSearchResult> => {
  return axios.get<PaymentsSearchResult>("/api/payments", {
    params: {price, downPayment, loanTerm, interestRate}
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    return error.response.data;
  });
};

export default function Quotes({price}: {
  price: number;
}) {
  const quoteOptions = useAppSelector(selectQuotes);
  const selectedQuoteId = useAppSelector(selectSelectedQuoteId);
  const selectedQuote = useAppSelector(selectSelectedQuote);
  const dispatch = useAppDispatch()

  const addQuoteOption: QuoteForm['addQuoteOption'] = (values) => {
    const newOption = {
      id: (quoteOptions.at(-1)?.id ?? 1) + 1,
      downPayment: values.downPayment,
      term: values.term,
      interestRate: values.interestRate,
    };
    dispatch(add(newOption));
    dispatch(select(newOption.id));
  };

  useEffect(() => {
    if (!quoteOptions.some(option => option.id == selectedQuoteId)) {
      dispatch(select(quoteOptions[0]?.id || 0));
    }
  }, [quoteOptions]);

  const paymentsQuery = useQuery({
    queryKey: ['search', selectedQuote],
    queryFn: () => fetchMonthlyPaymentsResults(price, selectedQuote?.downPayment || 0,
      selectedQuote?.term || 0, selectedQuote?.interestRate || 0),
    enabled: price !== 0,
    retry: false
  })

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Vehicle Quotes
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }} p={2}>
        {
          quoteOptions.map((quote) => (
            <Option key={quote.id} option={quote}/>
          ))
        }
      </Box>

      <Form addQuoteOption={addQuoteOption}/>

      {paymentsQuery.isLoading && <p>Loading...</p>}
      {
        paymentsQuery.data?.error &&
        <>
          <Typography variant={"h5"}>{paymentsQuery.data?.message}</Typography>
        </>
      }
      {
        (paymentsQuery.isSuccess && !paymentsQuery.data?.error) &&
        <Typography variant={"h4"}>Estimated Monthly Payment: ${paymentsQuery.data?.monthlyPayment}</Typography>
      }
    </>
  );
}