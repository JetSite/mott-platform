import axios from 'axios';

import { env } from '../env';

export async function addDocumentation(content: string) {
  await axios.post(
    `${env.STRAPI_URL}/api/training-datas`,
    {
      data: {
        type: 'documentation',

        content,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      },
    }
  );
}

export async function improveDocumentation(content: string) {
  const response = await axios.post(
    `${env.STRAPI_URL}/api/mott-ai/improve-documentation`,
    {
      content,
    },
    {
      headers: {
        Authorization: `Bearer ${env.STRAPI_TOKEN}`,
      },
    }
  );
  return response.data;
}
