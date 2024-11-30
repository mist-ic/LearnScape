import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const register = useAuthStore((state) => state.register);
  
  const from = location.state?.from || '/';
  
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await register(data.email, data.password, data.name);
      navigate(from);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            {...registerField('name')}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            {...registerField('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            {...registerField('password')}
            error={errors.password?.message}
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            state={{ from }}
            className="text-indigo-600 hover:text-indigo-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}