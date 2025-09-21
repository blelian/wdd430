'use server';

import postgres from 'postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Database client
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const InvoiceSchema = z.object({
  customerId: z.string({ required_error: 'Please select a customer.' }),
  amount: z.coerce.number().gt(0, { message: 'Amount must be greater than $0.' }),
  status: z.enum(['pending', 'paid'], { required_error: 'Please select a status.' }),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Create invoice action
export async function createInvoiceAction(prevState: State, formData: FormData): Promise<State> {
  const validated = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Invalid fields.' };
  }

  const { customerId, amount, status } = validated.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    return { message: 'Database error: Failed to create invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  return { message: 'Invoice created successfully!', errors: {} };
}

// Edit invoice action
export async function editInvoiceAction(prevState: State, payload: { invoiceId: string; formData: FormData }): Promise<State> {
  const { invoiceId, formData } = payload;

  const validated = InvoiceSchema.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: 'Invalid fields.' };
  }

  const { customerId, amount, status } = validated.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${invoiceId}
    `;
  } catch {
    return { message: 'Database error: Failed to update invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

  return { message: 'Invoice updated successfully!', errors: {} };
}
