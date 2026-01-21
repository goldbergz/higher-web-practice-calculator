import { z } from 'zod';

export const ExpenseSchema = z.object({
  amount: z.number().positive({ message: 'Введите сумму больше 0' }),
  date: z.date(),
});
