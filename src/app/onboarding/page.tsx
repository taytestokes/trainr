'use client';

import { useActionState } from 'react';

import { completeOnboarding } from './actions';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export default function OnboardingPage() {
  const [_error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await completeOnboarding(formData);
        return null;
      } catch {
        return 'Something went wrong. Please try again.';
      }
    },
    null,
  );

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Tell us a little about yourself to personalize your experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="onboarding-form" action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={1}
                max={120}
                placeholder="25"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Gender</Label>
              <Select name="gender" required>
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
              <Label>Height</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    id="heightFeet"
                    name="heightFeet"
                    type="number"
                    min={1}
                    max={8}
                    placeholder="5"
                    required
                  />
                  <span className="text-muted-foreground mt-1 block text-xs">Feet</span>
                </div>
                <div className="flex-1">
                  <Input
                    id="heightInches"
                    name="heightInches"
                    type="number"
                    min={0}
                    max={11}
                    placeholder="10"
                    required
                  />
                  <span className="text-muted-foreground mt-1 block text-xs">Inches</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="weight">Weight (lbs)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min={1}
                max={1000}
                placeholder="170"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="onboarding-form" className="w-full" disabled={isPending}>
            {isPending ? 'Saving...' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
