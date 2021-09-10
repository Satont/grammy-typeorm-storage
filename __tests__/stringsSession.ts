import { session } from 'grammy';
import { getConnection, getRepository } from 'typeorm';
import { TypeormAdapter } from '../src';

import { createBot } from './helpers/createBot';
import createDbConnection, { Session } from './helpers/createDbConnection';
import { createMessage } from './helpers/createMessage';

beforeAll(async () => {
  await createDbConnection();
});

test('bot should be created', () => {
  expect(createBot()).not.toBeFalsy();
});

test('Typeorm connection test', async () => {
  expect(getConnection().isConnected).toBe(true);
});

describe('Test string session', () => {
  test('Initial session state should equals "test"', async () => {
    const bot = createBot<string>();
    const ctx = createMessage(bot);
    bot.use(session({
      initial() {
        return 'test';
      },
      storage: new TypeormAdapter({ repisotory: getRepository(Session) }),
    }));

    await bot.handleUpdate(ctx.update);

    bot.on('msg:text', (ctx) => {
      expect(ctx.session).toEqual(test);
    });
  });

  test('Session state should be changed to "testqwe" after message', async () => {
    const bot = createBot<string>();

    bot.use(session({
      initial() {
        return 'test';
      },
      storage: new TypeormAdapter({ repisotory: getRepository(Session) }),
    }));

    
    bot.hears('first', (ctx) => {
      expect(ctx.session).toEqual('test');
      ctx.session = ctx.session + 'qwe';
    });

    bot.hears('second', (ctx) => {
      expect(ctx.session).toEqual('testqwe');
    });

    await bot.handleUpdate(createMessage(bot, 'first').update);
    await bot.handleUpdate(createMessage(bot, 'second').update);
  });
});