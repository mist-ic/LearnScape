import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ResourcePreferenceSelector } from '../components/ResourcePreferenceSelector';
import { Sparkles, Loader2 } from 'lucide-react';
import { ResourcePreference } from '../types';

const schema = z.object({
  prompt: z.string().min(1, 'Please describe what you want to learn'),
  months: z.number().min(1).max(24),
});

type FormData = z.infer<typeof schema>;

export function AutomaticRoadmap() {
  const navigate = useNavigate();
  const { generateAIRoadmap, isGenerating, error } = useRoadmapStore();
  const [resourcePreference, setResourcePreference] = useState<ResourcePreference | null>(null);
  
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
      const roadmap = await generateAIRoadmap(
        data.prompt,
        data.months,
        resourcePreference
      );
      navigate(`/roadmap/${roadmap.id}`);
    } catch (error) {
      console.error('Failed to generate roadmap:', error);
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
          placeholder="e.g., Python programming"
        />

        <Input
          type="number"
          label="How many months do you want to learn?"
          {...register('months', { valueAsNumber: true })}
          error={errors.months?.message}
          min={1}
          max={24}
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
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={isGenerating || !resourcePreference}
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating Roadmap...
            </>
          ) : (
            'Generate Roadmap'
          )}
        </Button>
      </form>
    </div>
  );
}