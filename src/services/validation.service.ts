import { z, ZodError, ZodIssue } from 'zod';
import { BudgetSchema, DepositSchema } from '../models/budget/budget.schema';
import { ExpenseSchema } from '../models/expense/expense.schema';
import { Budget } from '../models/budget/budget.types';
import { Expense } from '../models/expense/expense.types';
import { Deposit } from '../models/budget/budget.types';

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
