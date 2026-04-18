'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Check, ChevronLeft, ChevronRight, Upload, User } from 'lucide-react';

import { completeOnboarding } from './actions';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const STEPS = [
  { title: 'Basic Info', description: 'Name and photo' },
  { title: 'Physical Info', description: 'Body measurements' },
  { title: 'Review', description: 'Confirm your details' },
] as const;

interface WizardFormData {
  name: string;
  phone: string;
  location: string;
  image: File | null;
  age: string;
  gender: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
}

const initialFormData: WizardFormData = {
  name: '',
  phone: '',
  location: '',
  image: null,
  age: '',
  gender: '',
  heightFeet: '',
  heightInches: '',
  weight: '',
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imagePreview = useMemo(
    () => (formData.image ? URL.createObjectURL(formData.image) : null),
    [formData.image],
  );

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function updateField<K extends keyof WizardFormData>(key: K, value: WizardFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function canContinue(): boolean {
    if (currentStep === 0) {
      return formData.name.trim().length > 0;
    }
    if (currentStep === 1) {
      return (
        formData.age !== '' &&
        formData.gender !== '' &&
        formData.heightFeet !== '' &&
        formData.weight !== ''
      );
    }
    return true;
  }

  function handleContinue() {
    if (canContinue() && currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleComplete() {
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set('name', formData.name.trim());
        fd.set('phone', formData.phone.trim());
        fd.set('location', formData.location.trim());
        fd.set('age', formData.age);
        fd.set('gender', formData.gender);
        fd.set('heightFeet', formData.heightFeet);
        fd.set('heightInches', formData.heightInches || '0');
        fd.set('weight', formData.weight);
        if (formData.image) {
          fd.set('image', formData.image);
        }
        await completeOnboarding(fd);
      } catch {
        setError('Something went wrong. Please try again.');
      }
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-lg flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm">Help us personalize your experience</p>
        </div>

        <StepIndicator currentStep={currentStep} />

        <Card>
          <CardContent className="pt-6">
            {currentStep === 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <Avatar className="size-24">
                      {imagePreview ? (
                        <AvatarImage src={imagePreview} alt="Profile preview" />
                      ) : (
                        <AvatarFallback className="text-2xl">
                          <User className="text-muted-foreground size-8" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-1.5 size-4" />
                    Upload photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      updateField('image', file);
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">
                    Full name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="age">
                    Age <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => updateField('age', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => updateField('gender', value ?? '')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    Height <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        id="heightFeet"
                        type="number"
                        min={1}
                        max={8}
                        placeholder="5"
                        value={formData.heightFeet}
                        onChange={(e) => updateField('heightFeet', e.target.value)}
                      />
                      <span className="text-muted-foreground mt-1 block text-xs">Feet</span>
                    </div>
                    <div className="flex-1">
                      <Input
                        id="heightInches"
                        type="number"
                        min={0}
                        max={11}
                        placeholder="10"
                        value={formData.heightInches}
                        onChange={(e) => updateField('heightInches', e.target.value)}
                      />
                      <span className="text-muted-foreground mt-1 block text-xs">Inches</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="weight">
                    Weight (lbs) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min={1}
                    max={1000}
                    placeholder="170"
                    value={formData.weight}
                    onChange={(e) => updateField('weight', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="size-20">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Profile preview" />
                    ) : (
                      <AvatarFallback className="text-xl">
                        <User className="text-muted-foreground size-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <p className="text-lg font-medium">{formData.name}</p>
                </div>

                <div className="flex flex-col gap-3 border-t pt-4">
                  <ReviewRow label="Phone" value={formData.phone || '—'} />
                  <ReviewRow label="Location" value={formData.location || '—'} />
                  <ReviewRow label="Age" value={formData.age} />
                  <ReviewRow label="Gender" value={formData.gender} />
                  <ReviewRow
                    label="Height"
                    value={`${formData.heightFeet}'${formData.heightInches ? ` ${formData.heightInches}"` : ''}`}
                  />
                  <ReviewRow label="Weight" value={`${formData.weight} lbs`} />
                </div>

                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ChevronLeft className="mr-1 size-4" />
                Back
              </Button>
            ) : (
              <div />
            )}
            {currentStep < STEPS.length - 1 ? (
              <Button type="button" onClick={handleContinue} disabled={!canContinue()}>
                Continue
                <ChevronRight className="ml-1 size-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleComplete} disabled={isPending}>
                {isPending ? 'Saving...' : 'Complete'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex">
      {STEPS.map((step, index) => (
        <div key={step.title} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full items-center">
            {index > 0 && (
              <div
                className={cn('h-0.5 flex-1', index <= currentStep ? 'bg-primary' : 'bg-border')}
              />
            )}
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold',
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'border-primary bg-background text-primary'
                    : 'bg-background text-muted-foreground/50 border-muted-foreground/30',
              )}
            >
              {index < currentStep ? <Check className="size-4" /> : index + 1}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn('h-0.5 flex-1', index < currentStep ? 'bg-primary' : 'bg-border')}
              />
            )}
          </div>
          <div className="text-center">
            <p
              className={cn(
                'text-xs font-medium',
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground/50',
              )}
            >
              {step.title}
            </p>
            <p className="text-muted-foreground text-[10px]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium capitalize">{value}</span>
    </div>
  );
}
