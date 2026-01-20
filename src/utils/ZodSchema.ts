import { z } from 'zod';

export const BudgetSchema = z.object({
  initialBalance: z.number().positive({ message: 'Баланс должен быть больше 0' }),

  endDate: z.preprocess(
    arg => {
      if (typeof arg === 'string' && arg.trim() !== '') {
        const [day, month, year] = arg.split('.');
        return new Date(+year, +month - 1, +day);
      }
      return arg;
    },
    z.date({ required_error: 'Укажите дату окончания' }).refine(
      date => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      },
      { message: 'Дата должна быть позже сегодняшнего дня' }
    )
  ),
});

export const ExpenseSchema = z.object({
  amount: z.number().positive({ message: 'Введите сумму больше 0' }),
  date: z.date(),
});

export const DepositSchema = z.object({
  deposit: z.number().positive({ message: 'Введите сумму больше 0' }),
});

export type Budget = z.infer<typeof BudgetSchema>;
export type Expense = z.infer<typeof ExpenseSchema> & {
  id?: number;
};
