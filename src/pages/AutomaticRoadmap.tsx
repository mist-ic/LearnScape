import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ResourcePreferenceSelector } from '../components/ResourcePreferenceSelector';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ResourcePreference } from '../types';

const schema = z.object({
  prompt: z.string().min(1, 'Please describe what you want to learn'),
  months: z.number().min(1).max(24),
});

type FormData = z.infer<typeof schema>;

export function AutomaticRoadmap() {
  const navigate = useNavigate();
  const { createRoadmap, isGenerating, error, clearError } = useRoadmapStore();
  const [resourcePreference, setResourcePreference] = useState<ResourcePreference | null>(null);
  
  useEffect(() => {
    clearError();
  }, [clearError]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      months: 3,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!resourcePreference) return;

    try {
      const roadmap = await createRoadmap(
        data.prompt,
        `Master ${data.prompt} in ${data.months} months`,
        `${data.months} months`,
        resourcePreference
      );
      navigate(`/roadmap/${roadmap.id}`);
    } catch (error) {
      console.error('Failed to create roadmap:', error);
    }
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
          placeholder="e.g., Python programming for data science"
          disabled={isGenerating}
        />

        <Input
          type="number"
          label="How many months do you want to learn?"
          {...register('months', { valueAsNumber: true })}
          error={errors.months?.message}
          min={1}
          max={24}
          disabled={isGenerating}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resource Preference
          </label>
          <ResourcePreferenceSelector
            value={resourcePreference}
            onChange={setResourcePreference}
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isGenerating || !resourcePreference}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Creating Your Learning Path...
            </>
          ) : (
            'Generate Learning Path'
          )}
        </Button>
      </form>

      {isGenerating && (
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Our AI is crafting a personalized learning path for you.</p>
          <p>This may take a minute...</p>
        </div>
      )}
    </div>
  );
}