import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class DiscordUser extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  discord_id!: string;

  @Column(DataType.STRING)
  global_name!: string;

  @Column(DataType.STRING)
  avatar!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  number_of_looses!: number;
}
