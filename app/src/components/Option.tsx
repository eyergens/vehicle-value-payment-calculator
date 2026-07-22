import {Box, IconButton, Paper, Typography} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import type {QuoteOption} from "../types/QuoteOption.ts";
import {remove} from "../features/quotes/quotesSlice.ts";
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {select, selectSelectedQuoteId} from "../features/quotes/selectedQuoteSlice.ts";

export default function Option({option}: {
  option: QuoteOption
}) {
  const selected = useAppSelector(selectSelectedQuoteId) === option.id;
  const dispatch = useAppDispatch()

  return (
    <Paper
      sx={{
        padding: '16px',
        margin: '16px',
        cursor: 'pointer',
        border: selected ? '2px solid' : 'none',
        borderColor: 'primary.main',
        bgcolor: selected ? 'action.selected' : 'background.paper'
      }}
      key={option.id}
      elevation={selected ? 8 : 1}
      onClick={() => dispatch(select(option.id))}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="h5">Quote Option {option.id}</Typography>
        <IconButton onClick={(e) => {
          e.stopPropagation();
          dispatch(remove(option.id));
        }}>
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Typography>Down Payment: ${option.downPayment}</Typography>
        <Typography>Term (months): {option.term}</Typography>
        <Typography>Interest Rate: {option.interestRate}%</Typography>
      </Box>
    </Paper>
  );
}