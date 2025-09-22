// app/lib/validators.ts
import { z } from 'zod';

export const InvoiceSchema = z.object({
  customerId: z.string({
    required_error: 'Please select a customer.',
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number({
      invalid_type_error: 'Please enter a valid amount.',
    })
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    required_error: 'Please select a status.',
    invalid_type_error: 'Please select an invoice status.',
  }),
});

export type InvoiceSchemaType = z.infer<typeof InvoiceSchema>;
