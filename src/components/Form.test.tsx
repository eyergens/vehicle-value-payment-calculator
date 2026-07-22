import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi, it, beforeEach, expect} from 'vitest';
import Form from './Form';
import {add, selectQuotes} from '../features/quotes/quotesSlice';
import {select} from '../features/quotes/selectedQuoteSlice';
import {isInvalid} from '../utils/validation';
import {useAppDispatch, useAppSelector} from "../hooks.ts";
import {selectValue} from "../features/price/priceSlice.ts";

vi.mock('../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../features/quotes/quotesSlice', () => ({
  add: vi.fn((payload) => ({
    type: 'quotes/add',
    payload,
  })),
  selectQuotes: vi.fn(),
}));

vi.mock('../features/quotes/selectedQuoteSlice', () => ({
  select: vi.fn((id) => ({
    type: 'quotes/select',
    payload: id,
  })),
}));

vi.mock('../features/price/priceSlice', () => ({
  selectValue: vi.fn(),
}));

vi.mock('../utils/validation', () => ({
  isInvalid: vi.fn(),
}));

describe('Form Component', () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAppDispatch).mockReturnValue(dispatchMock);

    vi.mocked(useAppSelector).mockImplementation((selector) => {
      if (selector === selectQuotes) {
        return [
          {
            id: 1,
            downPayment: 5000,
            term: 60,
            interestRate: 5,
          },
        ];
      }

      if (selector === selectValue) {
        return {
          price: 50000,
        };
      }
      return undefined;
    });
  });


  it('renders all form fields', () => {
    render(<Form/>);

    expect(screen.getByLabelText(/down payment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/term/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest rate/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', {name: /add quote/i})
    ).toBeInTheDocument();
  });

  it('updates input values', async () => {
    const user = userEvent.setup();

    render(<Form/>);

    const downPayment = screen.getByLabelText(/down payment/i);

    await user.type(downPayment, '10000');

    expect(downPayment).toHaveValue(10000);
  });

  it('shows validation messages when invalid', async () => {
    const user = userEvent.setup();

    vi.mocked(isInvalid)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    render(<Form/>);

    await user.type(
      screen.getByLabelText(/down payment/i),
      '100'
    );

    await user.type(
      screen.getByLabelText(/term/i),
      '60'
    );

    await user.type(
      screen.getByLabelText(/interest rate/i),
      '5'
    );

    await user.click(
      screen.getByRole('button', {name: /add quote/i})
    );

    expect(
      screen.getByText(/invalid down payment/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/invalid loan term/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/invalid interest rate/i)
    ).toBeInTheDocument();

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('dispatches add and select when form is valid', async () => {
    const user = userEvent.setup();

    vi.mocked(isInvalid).mockReturnValue(false);

    render(<Form/>);

    await user.type(
      screen.getByLabelText(/down payment/i),
      '10000'
    );

    await user.type(
      screen.getByLabelText(/term/i),
      '72'
    );

    await user.type(
      screen.getByLabelText(/interest rate/i),
      '6.5'
    );

    await user.click(
      screen.getByRole('button', {name: /add quote/i})
    );

    expect(add).toHaveBeenCalledWith({
      id: 2,
      downPayment: '10000',
      term: '72',
      interestRate: '6.5',
    });

    expect(select).toHaveBeenCalledWith(2);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'quotes/add',
      payload: {
        id: 2,
        downPayment: '10000',
        term: '72',
        interestRate: '6.5',
      },
    });

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'quotes/select',
      payload: 2,
    });
  });

  it('clears the form after successful submit', async () => {
    const user = userEvent.setup();

    vi.mocked(isInvalid).mockReturnValue(false);

    render(<Form/>);

    const downPayment =
      screen.getByLabelText(/down payment/i);

    const term =
      screen.getByLabelText(/term/i);

    const interestRate =
      screen.getByLabelText(/interest rate/i);

    await user.type(downPayment, '5000');
    await user.type(term, '60');
    await user.type(interestRate, '5');

    await user.click(
      screen.getByRole('button', {name: /add quote/i})
    );

    expect(downPayment).toHaveValue(null);
    expect(term).toHaveValue(null);
    expect(interestRate).toHaveValue(null);
  });
});