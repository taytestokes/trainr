'use client';

import { useActionState } from 'react';

import { updateProfile } from './actions';

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

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    age: number | null;
    height: number | null;
    gender: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const heightFeet = user.height ? Math.floor(user.height / 12) : undefined;
  const heightInches = user.height ? user.height % 12 : undefined;

  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          View and update your personal information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="profile-form" action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              placeholder="Your name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={1}
              max={120}
              defaultValue={user.age ?? undefined}
              placeholder="25"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Gender</Label>
            <Select name="gender" defaultValue={user.gender ?? undefined} required>
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
                  defaultValue={heightFeet}
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
                  defaultValue={heightInches}
                  placeholder="10"
                  required
                />
                <span className="text-muted-foreground mt-1 block text-xs">Inches</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button type="submit" form="profile-form" className="w-full" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-destructive'}`}>
            {state.message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
