import { BudgetSchema } from '../utils/ZodSchema';
import { ExpenseSchema } from '../utils/ZodSchema';

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
