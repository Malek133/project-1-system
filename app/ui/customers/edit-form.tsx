'use client';


import {
  // CheckIcon,
  // ClockIcon,
  CurrencyDollarIcon,
  // UserCircleIcon,
} from '@heroicons/react/24/outline';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateCustomers, StateC } from '@/app/lib/actions';
import { useActionState } from 'react';

export default function EditInvoiceForm({
//   invoice,
  customers,
}: {
    customers:CustomerField
}) {
  const initialState: StateC = { message: null, errors: {} };
  const updateCustomersWithId = updateCustomers.bind(null, customers.id);
  const [state, formAction] = useActionState(updateCustomersWithId, initialState);
  console.log(state)
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customers.email}
                placeholder="Enter USD amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
          Choose a name
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
              
            <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                defaultValue={customers.name}
                
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
             
            </div>
          </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Customers</Button>
      </div>
    </form>
  );
}
