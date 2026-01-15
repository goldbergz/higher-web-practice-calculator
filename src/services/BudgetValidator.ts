import { BudgetSchema } from '../models/ZodSchema';
import { ExpenseSchema } from '../models/ZodSchema';

export class BudgetValidator {
  static validate(data: unknown) {
    return BudgetSchema.safeParse(data);
  }
}

export class ExpenseValidator {
  static validate(data: unknown) {
    return ExpenseSchema.safeParse(data);
  }
}
