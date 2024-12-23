'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/config/api';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const signupSchema = z.object({
  role: z.enum(['customer', 'vendor']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  profilePhoto: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, 'Profile photo is required')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    )
    .optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'customer',
      name: '',
      email: '',
      password: '',
      contactNumber: '',
      address: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      let endpoint;
      switch (data.role) {
        case 'vendor':
          endpoint = `${API_BASE_URL}/user/create-vendor`;
          break;
        default:
          endpoint = `${API_BASE_URL}/user/create-customer`;
      }

      const formData = new FormData();

      // Create the payload structure
      const payload = {
        password: data.password,
        [data.role]: {
          email: data.email,
          name: data.name,
          contactNumber: data.contactNumber,
          address: data.address,
        },
      };

      console.log('Payload:', payload);

      // Append the data as a text field
      formData.append('data', JSON.stringify(payload));

      // Append file if it exists
      if (data.profilePhoto?.[0]) {
        formData.append('file', data.profilePhoto[0]);
      }

      // Log the FormData entries
      for (const pair of formData.entries()) {
        console.log('FormData Entry:', pair[0], pair[1]);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create account');
      }

      toast.success('Account created successfully');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Choose your role and fill in your details</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Account Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="customer" id="customer" />
                        <label htmlFor="customer">Customer</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vendor" id="vendor" />
                        <label htmlFor="vendor">Vendor</label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Profile Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          onChange(files);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
