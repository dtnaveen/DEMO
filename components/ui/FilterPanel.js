'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GENDERS, NICHE_FILTERS, LOOKING_FOR, getAgeGroup, EDUCATION_LEVELS, LIFESTYLE_OPTIONS, OCCUPATION_CATEGORIES } from '@/lib/constants';
import { getCurrentUser } from '@/lib/localStorage';
import { isPremiumUser, hasPremiumFeature } from '@/lib/subscription';
import PremiumBadge from './PremiumBadge';
import UpgradePrompt from './UpgradePrompt';

export default function FilterPanel({ 
  filters, 
  onFiltersChange, 
  currentUserAgeGroup 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = getCurrentUser();
  const isPremium = isPremiumUser(currentUser);
  
  const handleAgeRangeChange = (type, value) => {
    const newRange = [...filters.ageRange];
    if (type === 'min') {
      newRange[0] = parseInt(value);
    } else {
      newRange[1] = parseInt(value);
    }
    onFiltersChange({ ...filters, ageRange: newRange });
  };
  
  const handleGenderToggle = (gender) => {
    const current = filters.genderPreference || [];
    const newPreferences = current.includes(gender)
      ? current.filter(g => g !== gender)
      : [...current, gender];
    onFiltersChange({ ...filters, genderPreference: newPreferences });
  };
  
  const toggleNicheFilter = (filterId) => {
    const current = filters.nicheFilters || [];
    const newFilters = current.includes(filterId)
      ? current.filter(f => f !== filterId)
      : [...current, filterId];
    onFiltersChange({ ...filters, nicheFilters: newFilters });
  };
  
  const nicheFilters = currentUserAgeGroup ? NICHE_FILTERS[currentUserAgeGroup] : [];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {isOpen && (
        <div className="space-y-6">
          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-600">Min</label>
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={filters.ageRange[0]}
                  onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600">Max</label>
                <input
                  type="range"
                  min="18"
                  max="50"
                  value={filters.ageRange[1]}
                  onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Distance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance: {filters.distance} miles
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={filters.distance}
              onChange={(e) => onFiltersChange({ ...filters, distance: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          {/* Gender Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map(gender => (
                <button
                  key={gender}
                  onClick={() => handleGenderToggle(gender)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    filters.genderPreference?.includes(gender)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {gender}
                </button>
              ))}
              <button
                onClick={() => handleGenderToggle('Everyone')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  filters.genderPreference?.includes('Everyone')
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Everyone
              </button>
            </div>
          </div>
          
          {/* Relationship Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relationship Type
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
              {LOOKING_FOR.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.relationshipTypes?.includes(type) || false}
                    onChange={() => {
                      const current = filters.relationshipTypes || [];
                      const newTypes = current.includes(type)
                        ? current.filter(t => t !== type)
                        : [...current, type];
                      onFiltersChange({ ...filters, relationshipTypes: newTypes });
                    }}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {(!filters.relationshipTypes || filters.relationshipTypes.length === 0) && (
              <p className="text-xs text-gray-500 mt-1">All types shown (select to filter)</p>
            )}
          </div>
          
          {/* Minimum Match Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Match: {filters.minMatchPercentage}%
            </label>
            <input
              type="range"
              min="60"
              max="100"
              value={filters.minMatchPercentage}
              onChange={(e) => onFiltersChange({ ...filters, minMatchPercentage: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          
          {/* Advanced Filters - Premium Only */}
          {isPremium ? (
            <>
              {/* Education Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {EDUCATION_LEVELS.map(level => (
                    <label key={level} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={filters.education?.includes(level) || false}
                        onChange={() => {
                          const current = filters.education || [];
                          const newEducation = current.includes(level)
                            ? current.filter(e => e !== level)
                            : [...current, level];
                          onFiltersChange({ ...filters, education: newEducation });
                        }}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occupation Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </label>
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                  {OCCUPATION_CATEGORIES.map(occupation => (
                    <label key={occupation} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input
                        type="checkbox"
                        checked={filters.occupation?.includes(occupation) || false}
                        onChange={() => {
                          const current = filters.occupation || [];
                          const newOccupation = current.includes(occupation)
                            ? current.filter(o => o !== occupation)
                            : [...current, occupation];
                          onFiltersChange({ ...filters, occupation: newOccupation });
                        }}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{occupation}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lifestyle Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lifestyle Preferences
                </label>
                <div className="space-y-3">
                  {/* Exercise */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Exercise Frequency</label>
                    <select
                      value={filters.lifestyle?.exercise || ''}
                      onChange={(e) => onFiltersChange({ 
                        ...filters, 
                        lifestyle: { ...filters.lifestyle, exercise: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {LIFESTYLE_OPTIONS.exercise.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Diet */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Diet</label>
                    <select
                      value={filters.lifestyle?.diet || ''}
                      onChange={(e) => onFiltersChange({ 
                        ...filters, 
                        lifestyle: { ...filters.lifestyle, diet: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {LIFESTYLE_OPTIONS.diet.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Drinking */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Drinking</label>
                    <select
                      value={filters.lifestyle?.drinking || ''}
                      onChange={(e) => onFiltersChange({ 
                        ...filters, 
                        lifestyle: { ...filters.lifestyle, drinking: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {LIFESTYLE_OPTIONS.drinking.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Children */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Children</label>
                    <select
                      value={filters.lifestyle?.children || ''}
                      onChange={(e) => onFiltersChange({ 
                        ...filters, 
                        lifestyle: { ...filters.lifestyle, children: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Any</option>
                      {LIFESTYLE_OPTIONS.children.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <UpgradePrompt
              feature="Advanced Filters"
              benefits={[
                'Filter by Education Level',
                'Filter by Occupation',
                'Filter by Lifestyle Preferences',
                'More precise matching',
              ]}
              variant="inline"
            />
          )}

          {/* Niche Filters */}
          {nicheFilters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Filters
              </label>
              <div className="space-y-2">
                {nicheFilters.map(filter => (
                  <label key={filter.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.nicheFilters?.includes(filter.id) || false}
                      onChange={() => toggleNicheFilter(filter.id)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {/* Reset Button */}
          <button
            onClick={() => {
              onFiltersChange({
                ageRange: [18, 50],
                distance: 25,
                genderPreference: ['Everyone'],
                relationshipTypes: [],
                minMatchPercentage: 60,
                nicheFilters: []
              });
            }}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
