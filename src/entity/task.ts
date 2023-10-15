import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  doneTime: Date;

  @Column()
  notificationTime: Date;

  @Column({ default: false })
  isCompleted: Boolean;
}
