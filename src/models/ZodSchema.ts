import { z } from 'zod';

export const BudgetSchema = z.object({
  initialBalance: z.number().positive({ message: 'Баланс должен быть больше 0' }),

  endDate: z.date({ required_error: 'Укажите дату окончания' }).refine(
    date => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    {
      message: 'Дата должна быть позже сегодняшнего дня',
    }
  ),
});

export const ExpenseSchema = z.object({
  amount: z.number().positive({ message: 'Введите сумму больше 0' }),
});

export type Budget = z.infer<typeof BudgetSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
// export type Expense = {
//   amount: number;
//   date: Date;
// };
