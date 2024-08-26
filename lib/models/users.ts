import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { DiscordGuild } from './guilds';

@Table
export class DiscordUser extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  user_id!: string;

  @Column(DataType.STRING)
  global_name!: string;

  @Column(DataType.STRING)
  avatar!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  number_of_looses!: number;

  @BelongsToMany(() => DiscordGuild, 'DiscordGuildUser', 'user_id', 'guild_id')
  discordGuilds!: DiscordGuild[];
}
