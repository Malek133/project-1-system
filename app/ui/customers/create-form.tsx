'use client';
 
// ...
import { useActionState } from 'react';

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createCustomers, StateC } from '@/app/lib/actions';

export default function Form() {
  const initialState: StateC = { message: null, errors: {} };
  const [state, formAction] = useActionState(createCustomers,initialState);
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

       <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Choose a customers
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                // type="submit"
                
                placeholder="Enter name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
             
            </div>
          </div>
        </div>

        
        <div className="mb-4">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Choose an email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
               
                placeholder="Enter  Email"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                required
              />
              
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create customers</Button>
      </div>
    </form>
  );
}
