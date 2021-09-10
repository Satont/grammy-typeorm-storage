import { StorageAdapter } from 'grammy';
import { Repository } from 'typeorm';
import { ISession } from './types/session';

export * from './types/session';

export class TypeormAdapter<T> implements StorageAdapter<T> {
  private repository: Repository<ISession>
  
  constructor(opts: { repisotory: Repository<ISession>}) {
    this.repository = opts.repisotory;
  }

  async read(key: string) {
    const session = await this.repository.findOne({ key });
    if (session === null || session === undefined) {
      return undefined;
    }
    return JSON.parse(session.value) as unknown as T;
  }

  async write(key: string, data: T) {
    const session = await this.repository.findOne({ key });
    const value = JSON.stringify(data);

    if (session) {
      await this.repository.update({ key }, { value });
    } else {
      await this.repository.save({ key, value });
    }
  }

  async delete(key: string) {
    await this.repository.delete({ key });
  }
}
