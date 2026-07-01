import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handler } from "./vehicle-valuation";
import {HandlerContext, HandlerEvent} from "@netlify/functions";

const mockFetch = vi.fn();

describe("Vehicle Valuation handler", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    process.env.CAR_API_KEY = "test-token";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if query params are missing", async () => {
    const event = {
      queryStringParameters: null,
    } as HandlerEvent;

    const mockContext = {
      clientContext: {},
    } as HandlerContext;

    const res = await handler(event, mockContext);

    if (!res) throw new Error("Handler returned void");

    expect(res?.statusCode).toBe(400);
    expect(JSON.parse(res?.body)).toEqual({
      error: "Missing parameters",
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
        make: "Toyota",
        model: "Camry",
        year: "2020",
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
        make: "Honda",
        model: "Civic",
        year: "2019",
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
        make: "Ford",
        model: "Focus",
        year: "2018",
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