import { waitUntil } from '@vercel/functions';
import axios from 'axios';
import type { Message, TextChannel } from 'discord.js';

import { discordClient } from '..';
import { env } from '../env';
async function assistantThreadMessage(message: Message, prompt: string) {
  const processingMessage = await message.reply(
    'Please hold on, your request is being diligently processed by Mott...'
  );
  const typingInterval = setInterval(() => {
    if ('sendTyping' in message.channel) {
      (message.channel as TextChannel).sendTyping();
    }
  }, 5000);

  let updateInterval: NodeJS.Timeout | null = null;
  let updateCount = 0;
  const updateMessages = [
    "We're still working on your request. Thank you for your patience.",
    'Your request is taking a bit longer than expected. We appreciate your understanding.',
    "We're processing a complex query. Please bear with us a little longer.",
    "Almost there! We're finalizing your response.",
  ];

  try {
    const responsePromise = axios.post(`${env.CORE_AI_URL}/chat`, {
      message: prompt,
      headers: {
        'x-mott-key': 1,
      },
    });

    updateInterval = setInterval(async () => {
      if (updateCount < updateMessages.length) {
        await processingMessage.edit(updateMessages[updateCount]);
        updateCount++;
      }
    }, 5000) as unknown as NodeJS.Timeout;

    const response = await responsePromise;
    const messageToUser = response.data;
    clearInterval(updateInterval);
    await processingMessage.delete();

    const chunkSize = 2000;
    const messageChunks = [];
    for (let i = 0; i < messageToUser.length; i += chunkSize) {
      messageChunks.push(messageToUser.slice(i, i + chunkSize));
    }

    for (const chunk of messageChunks) {
      try {
        await message.reply(chunk);
      } catch (replyError) {
        console.error('Error sending message chunk:', replyError);
      }
    }
  } catch (err) {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    await processingMessage.delete();
    message.reply('Oops! Something went wrong. Please try again');

    console.log(err);
  } finally {
    clearInterval(typingInterval);
  }
}

export async function messageCreateListener(message: Message) {
  if (message.author.bot) {
    return;
  }

  if (
    !message.guild ||
    message.mentions.has(discordClient.user?.id ?? 'unknown-id')
  ) {
    const prompt = message.content
      .replace(`<@${discordClient.user?.id ?? 'unknown-id'}>`, '')
      .trim();

    waitUntil(assistantThreadMessage(message, prompt));
    return;
  }
}
