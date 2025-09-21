'use client';

import { CustomerField } from '@/app/lib/definitions';
import { UserCircleIcon, CurrencyDollarIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { State, createInvoiceAction } from '@/app/lib/actions';

export default function CreateInvoiceForm({ customers }: { customers: CustomerField[] }) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoiceAction, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">Choose customer</label>
          <div className="relative">
            <select id="customer" name="customerId" defaultValue="" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm">
              <option value="" disabled>Select a customer</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <UserCircleIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.customerId?.map((err, i) => <p key={i} className="text-red-500 text-xs">{err}</p>)}
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">Amount</label>
          <div className="relative">
            <input id="amount" name="amount" type="number" step="0.01" placeholder="Enter USD amount" className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm" />
            <CurrencyDollarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
          {state.errors?.amount?.map((err, i) => <p key={i} className="text-red-500 text-xs">{err}</p>)}
        </div>

        {/* Status */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">Invoice status</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input type="radio" name="status" value="pending" defaultChecked /> Pending <ClockIcon className="h-4 w-4" />
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="status" value="paid" /> Paid <CheckIcon className="h-4 w-4" />
            </label>
          </div>
          {state.errors?.status?.map((err, i) => <p key={i} className="text-red-500 text-xs">{err}</p>)}
        </fieldset>

        {state.message && <p className="text-green-600">{state.message}</p>}

        <div className="flex justify-end gap-4">
          <Button type="submit">Create Invoice</Button>
        </div>
      </div>
    </form>
  );
}
