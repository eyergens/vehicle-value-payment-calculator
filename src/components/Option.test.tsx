import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {vi, describe, it, expect, beforeEach} from 'vitest';

import Option from './Option';

import {useAppDispatch, useAppSelector} from '../hooks';
import {select} from '../features/quotes/selectedQuoteSlice';
import {remove} from '../features/quotes/quotesSlice';

vi.mock('../hooks', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('../features/quotes/selectedQuoteSlice', () => ({
  select: vi.fn((id: number) => ({
    type: 'quotes/select',
    payload: id,
  })),
  selectSelectedQuoteId: vi.fn(),
}));

vi.mock('../features/quotes/quotesSlice', () => ({
  remove: vi.fn((id: number) => ({
    type: 'quotes/remove',
    payload: id,
  })),
}));

describe('Option', () => {
  const dispatchMock = vi.fn();

  const option = {
    id: 1,
    downPayment: 5000,
    term: 60,
    interestRate: 5.5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAppDispatch).mockReturnValue(dispatchMock);
    vi.mocked(useAppSelector).mockReturnValue(false);
  });

  it('renders option information', () => {
    render(<Option option={option}/>);

    expect(screen.getByText('Quote Option 1')).toBeInTheDocument();
    expect(screen.getByText('Down Payment: $5000')).toBeInTheDocument();
    expect(screen.getByText('Term (months): 60')).toBeInTheDocument();
    expect(screen.getByText('Interest Rate: 5.5%')).toBeInTheDocument();
  });

  it('dispatches select when paper is clicked', async () => {
    const user = userEvent.setup();

    render(<Option option={option}/>);

    await user.click(screen.getAllByText('Quote Option 1')[0]);

    expect(select).toHaveBeenCalledWith(1);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'quotes/select',
      payload: 1,
    });
  });

  it('dispatches remove when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(<Option option={option}/>);

    const deleteButton = screen.getAllByRole('button')[0];

    await user.click(deleteButton);

    expect(remove).toHaveBeenCalledWith(1);

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'quotes/remove',
      payload: 1,
    });
  });

  it('does not dispatch select when delete button is clicked', async () => {
    const user = userEvent.setup();

    render(<Option option={option}/>);

    await user.click(screen.getAllByRole('button')[0]);

    expect(remove).toHaveBeenCalledTimes(1);
    expect(select).not.toHaveBeenCalled();
  });
});