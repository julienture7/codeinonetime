
'use client';

import React from 'react';
import { Label } from './label'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'; 
import { AVAILABLE_VOICES, DEFAULT_VOICE_NAME } from '../../lib/utils'; // Corrected relative path from src/constants or src/lib/utils
import type { VoiceOption } from '../../types'; // Corrected relative path from src/types


interface VoiceSelectionPanelProps {
  selectedVoice: string;
  onVoiceChange: (voiceName: string) => void;
}

// A placeholder for Shadcn Select if not fully generated/available
const FallbackSelect: React.FC<{
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}> = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="block w-full p-2 border border-input rounded-md bg-background"
  >
    {children}
  </select>
);

const FallbackSelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => (
  <option value={value}>{children}</option>
);

const FallbackSelectTrigger: React.FC<{ children: React.ReactNode, className?: string, id?:string }> = ({ children, className, id }) => (
  <div id={id} className={`p-2 border border-input rounded-md bg-background ${className}`}>{children}</div>
);

const FallbackSelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => <span>{placeholder}</span>;
const FallbackSelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;


export function VoiceSelectionPanel({ selectedVoice, onVoiceChange }: VoiceSelectionPanelProps) {
  // Use actual Shadcn components if available, otherwise use fallbacks.
  const SelectComp = Select || FallbackSelect;
  const SelectItemComp = SelectItem || FallbackSelectItem;
  const SelectTriggerComp = SelectTrigger || FallbackSelectTrigger;
  const SelectValueComp = SelectValue || FallbackSelectValue;
  const SelectContentComp = SelectContent || FallbackSelectContent;

  return (
    <div className="space-y-2">
      <Label htmlFor="voice-select">Choose AI Voice</Label>
      <SelectComp value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTriggerComp id="voice-select" className="w-full md:w-[280px]">
          <SelectValueComp placeholder="Select a voice" />
        </SelectTriggerComp>
        <SelectContentComp>
          {AVAILABLE_VOICES.map((voice: VoiceOption) => (
            <SelectItemComp key={voice.id} value={voice.value}>
              {voice.name}
            </SelectItemComp>
          ))}
        </SelectContentComp>
      </SelectComp>
      <p className="text-xs text-muted-foreground">
        Selected voice will be used for the AI companion. Default: {AVAILABLE_VOICES.find(v => v.value === DEFAULT_VOICE_NAME)?.name || DEFAULT_VOICE_NAME}.
      </p>
    </div>
  );
}