import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useRoadmapStore } from '../store/roadmapStore';
import { Button } from '../components/Button';
import { SelectionCard } from '../components/SelectionCard';
import { categories, timeFrames } from '../data/categories';
import { Category, Skill, TimeFrame } from '../types';

type Step = 'category' | 'skill' | 'timeframe';

export function ManualRoadmap() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame | null>(null);
  const [customMonths, setCustomMonths] = useState<number>(1);
  const createRoadmap = useRoadmapStore((state) => state.createRoadmap);

  const handleBack = () => {
    if (currentStep === 'skill') {
      setCurrentStep('category');
      setSelectedSkill(null);
    } else if (currentStep === 'timeframe') {
      setCurrentStep('skill');
      setSelectedTimeFrame(null);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCurrentStep('skill');
  };

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentStep('timeframe');
  };

  const handleTimeFrameSelect = (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);
    if (timeFrame.id !== 'custom') {
      handleCreateRoadmap(timeFrame.months!);
    }
  };

  const handleCreateRoadmap = (months: number) => {
    if (!selectedSkill) return;

    const roadmap = createRoadmap(
      `${selectedSkill.title} Learning Path`,
      `Master ${selectedSkill.title} in ${months} months`,
      `${months} months`
    );
    navigate(`/roadmap/${roadmap.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        {currentStep !== 'category' && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div>
          <h2 className="text-2xl font-bold">Create Learning Path</h2>
          <p className="text-gray-600">
            {currentStep === 'category' && 'Select a category to get started'}
            {currentStep === 'skill' && 'Choose a specific skill to learn'}
            {currentStep === 'timeframe' && 'How long do you want to learn?'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {currentStep === 'category' && (
          <>
            {categories.map((category) => (
              <SelectionCard
                key={category.id}
                title={category.title}
                description={category.description}
                onClick={() => handleCategorySelect(category)}
                selected={selectedCategory?.id === category.id}
              />
            ))}
          </>
        )}

        {currentStep === 'skill' && selectedCategory && (
          <>
            {selectedCategory.skills.map((skill) => (
              <SelectionCard
                key={skill.id}
                title={skill.title}
                description={skill.description}
                icon={skill.icon}
                onClick={() => handleSkillSelect(skill)}
                selected={selectedSkill?.id === skill.id}
              />
            ))}
          </>
        )}

        {currentStep === 'timeframe' && (
          <>
            {timeFrames.map((timeFrame) => (
              <SelectionCard
                key={timeFrame.id}
                title={timeFrame.title}
                description={timeFrame.id === 'custom' 
                  ? 'Set your own learning duration'
                  : `Complete the roadmap in ${timeFrame.months} months`}
                onClick={() => handleTimeFrameSelect(timeFrame)}
                selected={selectedTimeFrame?.id === timeFrame.id}
              />
            ))}

            {selectedTimeFrame?.id === 'custom' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of months
                </label>
                <div className="flex gap-4">
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={customMonths}
                    onChange={(e) => setCustomMonths(Number(e.target.value))}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <Button onClick={() => handleCreateRoadmap(customMonths)}>
                    Create Roadmap
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}