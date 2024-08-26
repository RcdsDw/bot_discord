import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { DiscordUser } from './users';

@Table
export class DiscordGuild extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  guild_id!: string;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.STRING)
  avatar!: string;

  @BelongsToMany(() => DiscordUser, 'DiscordGuildUser', 'guild_id', 'user_id')
  discordUsers!: DiscordUser[];
}
