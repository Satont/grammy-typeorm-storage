import { session } from 'grammy';
import { getConnection, getRepository } from 'typeorm';
import { TypeormAdapter } from '../src';

import { createBot } from './helpers/createBot';
import createDbConnection, { Session } from './helpers/createDbConnection';
import { createMessage } from './helpers/createMessage';


export interface SessionData {
  pizzaCount: number;
}


beforeAll(async () => {
  await createDbConnection();
});

test('bot should be created', () => {
  expect(createBot()).not.toBeFalsy();
});

test('Typeorm connection test', async () => {
  expect(getConnection().isConnected).toBe(true);
});

describe('Pizza counter test', () => {
  test('Pizza counter should be equals 0 on initial', async () => {
    const bot = createBot<SessionData>();
    const ctx = createMessage(bot);

    bot.use(session({
      initial() {
        return { pizzaCount: 0 };
      },
      storage: new TypeormAdapter({ repisotory: getRepository(Session) }),
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(0);
    });
  });

  test('Pizza counter should be equals 1 after first message', async () => {
    const bot = createBot<SessionData>();

    bot.use(session({
      initial: () => ({ pizzaCount: 0 }),
      storage: new TypeormAdapter({ repisotory: getRepository(Session) }),
    }));

    bot.hears('first', (ctx) => {
      ctx.session.pizzaCount = Number(ctx.session.pizzaCount) + 1;
    });
    
    bot.hears('second', (ctx) => {
      expect(ctx.session.pizzaCount).toEqual(1);
    });
    
    const firstMessage = createMessage(bot, 'first');
    const secondMessage = createMessage(bot, 'second');

    await bot.handleUpdate(firstMessage.update);
    await bot.handleUpdate(secondMessage.update);
  });
});
