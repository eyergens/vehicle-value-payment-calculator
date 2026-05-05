export type QuoteForm = {
  addQuoteOption?: (values: {
    downPayment: number;
    term: number;
    interestRate: number;
  }) => void;
}