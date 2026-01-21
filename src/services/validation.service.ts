import { ZodError } from 'zod';

import { BudgetSchema, DepositSchema } from '../models/budget/budget.schema';
import { Budget } from '../models/budget/budget.types';
import { Deposit } from '../models/budget/budget.types';
import { ExpenseSchema } from '../models/expense/expense.schema';
import { Expense } from '../models/expense/expense.types';

export class BudgetValidator {
  static validate(
    data: unknown
  ): { success: true; data: Budget } | { success: false; error: ZodError } {
    return BudgetSchema.safeParse(data);
  }
}

export class ExpenseValidator {
  static validate(
    data: unknown
  ): { success: true; data: Expense } | { success: false; error: ZodError } {
    return ExpenseSchema.safeParse(data);
  }
}

export class DepositValidator {
  static validate(
    data: unknown
  ): { success: true; data: Deposit } | { success: false; error: ZodError } {
    return DepositSchema.safeParse(data);
  }
}
