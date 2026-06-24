import type {Handler} from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const {make, model, year} = event.queryStringParameters ?? {};

    if (!make || !model || !year) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Missing parameters"})
      };
    }

    const apiUrl = new URL(
      "https://api.carapi.dev/v1/vehicle-valuation"
    );
    apiUrl.searchParams.set("token", process.env.CAR_API_KEY!);
    apiUrl.searchParams.set("make", make);
    apiUrl.searchParams.set("model", model);
    apiUrl.searchParams.set("year", year);
    apiUrl.searchParams.set("country", "US");

    const response = await fetch(apiUrl.toString());
    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Internal server error"})
    };
  }
};
