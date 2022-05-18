import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("ingredients")
export default class Ingredient {
  @PrimaryGeneratedColumn("uuid")
  readonly id: string;

  @Column({ unique: true, length: 164 })
  name: string;

  @Column({ length: 3 })
  measure: string;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  amount: number;

  @Column({ type: "decimal", precision: 8, scale: 2, name: "amount_min" })
  amountMin: number;

  @Column({ type: "decimal", precision: 8, scale: 2, name: "amount_max" })
  amountMax: number;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt: Date;
}
