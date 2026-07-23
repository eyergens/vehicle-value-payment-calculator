import type {Handler} from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const {price, downPayment, loanTerm, interestRate} = event.queryStringParameters ?? {};

    if (!price || !downPayment || !loanTerm || !interestRate) {
      let message: string;
      if (!price) {
        message = "Select a Vehicle Value under the Search tab before continuing";
      } else {
        message = "Select a Quote Option to continue";
      }

      return {
        statusCode: 400,
        body: JSON.stringify({error: message})
      };
    }

    if (Number(downPayment) > Number(price)) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Down Payment must be less than the Vehicle Value"})
      };
    }

    const apiUrl = new URL(
      "https://api.carapi.dev/v1/payments/JHMZE2H79AS019110"
    );
    apiUrl.searchParams.set("token", process.env.CAR_API_KEY!);
    apiUrl.searchParams.set("price", price);
    apiUrl.searchParams.set("downPayment", downPayment);
    apiUrl.searchParams.set("loanTerm", loanTerm);
    apiUrl.searchParams.set("interestRate", interestRate);

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
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Internal server error"})
    };
  }
};
