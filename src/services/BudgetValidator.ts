import { BudgetSchema } from '../models/ZodSchema';

export class BudgetValidator {
  static validate(data: unknown) {
    return BudgetSchema.safeParse(data);
  }
}