export type PaymentsSearchResult = {
  vin: string;
  payments: [];
  loanAmount: number;
  totalPaid: number;
  totalInterest: number;
  monthlyPayment: number;
  currency: string;
  error: string;
  message: string;
}