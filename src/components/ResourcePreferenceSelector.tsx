import React from 'react';
import { ResourcePreference } from '../types';
import { SelectionCard } from './SelectionCard';
import { DollarSign, Sparkles, Scale } from 'lucide-react';

interface ResourcePreferenceSelectorProps {
  value: ResourcePreference | null;
  onChange: (preference: ResourcePreference) => void;
}

const preferences = [
  {
    id: 'free',
    title: 'Free Resources Only',
    description: 'Access a curated list of free learning materials and tutorials',
    icon: <Sparkles className="h-6 w-6 text-indigo-600" />,
  },
  {
    id: 'paid',
    title: 'Premium Resources',
    description: 'Get recommendations for high-quality paid courses and materials',
    icon: <DollarSign className="h-6 w-6 text-indigo-600" />,
  },
  {
    id: 'both',
    title: 'Both Free & Paid',
    description: 'Mix of free and premium resources for a balanced learning experience',
    icon: <Scale className="h-6 w-6 text-indigo-600" />,
  },
] as const;

export function ResourcePreferenceSelector({
  value,
  onChange,
}: ResourcePreferenceSelectorProps) {
  return (
    <div className="space-y-4">
      {preferences.map((pref) => (
        <SelectionCard
          key={pref.id}
          title={pref.title}
          description={pref.description}
          icon={pref.icon}
          onClick={() => onChange(pref.id as ResourcePreference)}
          selected={value === pref.id}
        />
      ))}
    </div>
  );
}