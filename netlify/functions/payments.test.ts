import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "./payments";
import {HandlerContext, HandlerEvent} from "@netlify/functions";

const mockFetch = vi.fn();

describe("Payments handler", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    process.env.CAR_API_KEY = "test-token";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if all query params are missing", async () => {
    const event = {
      queryStringParameters: null
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body)).toEqual({
      error: "Select a Vehicle Value under the Search tab before continuing",
    });
  });

  it("returns 400 if price param is missing", async () => {
    const event = {
      queryStringParameters: {
        downPayment: "8000",
        loanTerm: "15",
        interestRate: "3.4"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body)).toEqual({
      error: "Select a Vehicle Value under the Search tab before continuing",
    });
  });

  it("returns 400 if quote params are missing", async () => {
    const event = {
      queryStringParameters: {
        price: "34000"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body)).toEqual({
      error: "Select a Quote Option to continue",
    });
  });

  it("returns 400 if down payment is greater than the price", async () => {
    const event = {
      queryStringParameters: {
        price: "10000",
        downPayment: "12000",
        loanTerm: "15",
        interestRate: "3.4"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body)).toEqual({
      error: "Down Payment must be less than the Vehicle Value",
    });
  });

  it("returns API result when params are valid", async () => {
    const fakeApiResponse = { value: 12345 };

    mockFetch.mockResolvedValue({
      status: 200,
      json: vi.fn().mockResolvedValue(fakeApiResponse),
    });

    const event = {
      queryStringParameters: {
        price: "34000",
        downPayment: "8000",
        loanTerm: "15",
        interestRate: "3.4"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    expect(fetch).toHaveBeenCalledTimes(1);

    if (!res) throw new Error("Handler returned void");

    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(fakeApiResponse);
    expect(res.headers).toMatchObject({
      "Content-Type": "application/json",
    });
  });

  it("handles upstream API error status", async () => {
    mockFetch.mockResolvedValue({
      status: 500,
      json: vi.fn().mockResolvedValue({ error: "API failed" }),
    });

    const event = {
      queryStringParameters: {
        price: "34000",
        downPayment: "8000",
        loanTerm: "15",
        interestRate: "3.4"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ error: "API failed" });
  });

  it("returns 500 on exception", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const event = {
      queryStringParameters: {
        price: "34000",
        downPayment: "8000",
        loanTerm: "15",
        interestRate: "3.4"
      },
    } as unknown as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({
      error: "Internal server error",
    });
  });
});