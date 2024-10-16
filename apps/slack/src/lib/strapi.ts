import axios from "axios";
import { logger } from "../utils/logger";

export async function addSlackInstallation(id: string, installation: any) {
  await axios.post(
    `${process.env.BACKEND_URL}/api/slack-installations`,
    {
      data: {
        uid: id,
        installation,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
}

export async function getSlackInstallation(id: string) {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/api/slack-installations?filters[uid][$eq]=${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
  if (!response.data?.data?.[0]) {
    throw new Error(`Installation not found: ${id}`);
  }
  return response.data.data[0].attributes.installation;
}

export async function deleteSlackInstallation(id: string) {
  logger.info("Deleting installation", id);
  await axios.delete(
    `${process.env.BACKEND_URL}/api/slack-installations?filters[uid][$eq]=${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );

  return true;
}

export async function getDatabaseInfo() {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/api/mott-ai/databases`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
  return response.data;
}

export async function getTableSchema(tableName: string) {
  const response = await axios.get(
    `${process.env.BACKEND_URL}/api/mott-ai/tables/${tableName}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_TOKEN}`,
      },
    }
  );
  return response.data;
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
