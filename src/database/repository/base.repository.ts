import mongoose from 'mongoose';

export class findByIdDto {
  id: string;
}

export class OptionsDto {
  show: 'all' | 'removed';
}

export abstract class BaseRepository {
  abstract findOne<T>(data: any, options?: OptionsDto): Promise<T>;
  abstract findAll<T>(data: any, options?: OptionsDto): Promise<T[]>;

  protected addOptions(data: any, options: OptionsDto) {
    if (options.show) {
      switch (options.show) {
        case 'all':
          delete data.deletedAt;
          break;

        case 'removed':
          data.deletedAt = { $ne: null };
          break;
      }
    }

    return data;
  }

  protected convertToObjectId(data: string) {
    return new mongoose.Types.ObjectId(data);
  }
}
