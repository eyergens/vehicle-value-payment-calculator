import type {Handler} from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const {price} = event.queryStringParameters ?? {};

    if (!price) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Bad Request", message: "Missing parameters"})
      };
    }

    localStorage.setItem('price', price.toString());

    return {
      statusCode: 200,
      body: JSON.stringify({message: "Success"}),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600"
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Internal server error", message: "Internal server error"})
    };
  }
};
