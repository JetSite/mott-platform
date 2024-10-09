import axios from "axios";

export async function addDocumentation(content: string) {
  await axios.post(
    `${process.env.BACKEND_URL}/api/training-datas`,
    {
      data: {
        type: "documentation",

        content,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
}

export async function improveDocumentation(content: string) {
  const response = await axios.post(
    `${process.env.BACKEND_URL}/api/mott-ai/improve-documentation`,
    {
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
  return response.data;
}
