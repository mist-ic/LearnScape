import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Sparkles } from 'lucide-react';

const schema = z.object({
  prompt: z.string().min(1, 'Please describe what you want to learn'),
});

type FormData = z.infer<typeof schema>;

export function AutomaticRoadmap() {
  const navigate = useNavigate();
  const createRoadmap = useRoadmapStore((state) => state.createRoadmap);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // In a real application, this would call an AI service
    // For now, we'll create a simple roadmap
    const roadmap = createRoadmap(
      'AI Generated Roadmap',
      data.prompt,
      '3 months'
    );
    navigate(`/roadmap/${roadmap.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-2xl font-bold">AI-Powered Roadmap</h2>
        <Sparkles className="h-6 w-6 text-indigo-600" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="What do you want to learn?"
          {...register('prompt')}
          error={errors.prompt?.message}
          placeholder="e.g., I want to learn Python in 6 months"
        />
        <Button type="submit" className="w-full">
          Generate Roadmap
        </Button>
      </form>
    </div>
  );
}