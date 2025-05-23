'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import postgres from 'postgres';

const FormSchemaC= z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
})

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
export type StateC = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message?: string | null;
};
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const CreateCustomers = FormSchemaC.omit({ id: true });
 
export async function createInvoice(prevState: State, formData: FormData) {
    // const { customerId, amount, status } = CreateInvoice.parse({
      const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
   
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
   
    // try {
    //   await sql`
    //     INSERT INTO invoices (customer_id, amount, status, date)
    //     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    //   `;
    // } catch (error) {
    //   // We'll log the error to the console for now
    //   console.error(error);
    // }

    try {
      await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
      console.log(error)
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }

  export async function createCustomers(prevState: StateC,formDataCustomers:FormData){

    const validatedFields = CreateCustomers.safeParse({
      name: formDataCustomers.get('name'),
      email: formDataCustomers.get('email'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
   
    const { name,email } = validatedFields.data;
   

    try {
      await sql`
        INSERT INTO customers (id, name, email, image_url)
        VALUES (uuid_generate_v4(), ${name}, ${email}, '')
      `;
      
    } catch (error) {
      console.error('Error inserting customer:', error);
      return {
        message: 'Failed to create customer',
        errors: {},
      };
    }
    redirect('/dashboard/customers'); 
  }

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true,date:true });
 

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }
 
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`amountInCents
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.log(error)
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateCustomer = FormSchemaC.omit({ id: true });

export async function updateCustomers(id: string,
  prevState: StateC,
  formData: FormData,){

    const validatedFields = UpdateCustomer.safeParse({
      
      name: formData.get('name'),
      email: formData.get('email'),
    });
   
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
     const { name,email } = validatedFields.data;
    
   
    try {
      await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}
        WHERE id = ${id}
      `;
    } catch (error) {
      console.log(error)
      return { message: 'Database Error: Failed to Update Invoice.' };
    }
   
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');

}

  export async function deleteInvoice(id: string) {
    // throw new Error('Failed to Delete Invoice');
   
    // Unreachable code block
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  }

  export async function deleteCustomers(id: string) {
    // throw new Error('Failed to Delete Invoice');
   
    // Unreachable code block
    await sql`DELETE FROM customers WHERE id = ${id}`;
    revalidatePath('/dashboard/customers');
  }

  export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('credentials', formData);
    } catch (error) {
      console.log(error)
      if (error instanceof AuthError) {
        switch (error.message) {
          case 'CredentialsSignin':
            return 'Invalid credentials.';
          default:
            return 'Something went wrong.';
        }
      }
      throw error;
    }
  }