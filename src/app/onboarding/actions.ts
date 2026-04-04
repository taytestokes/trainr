'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function completeOnboarding(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const age = Number(formData.get('age'));
  const heightFeet = Number(formData.get('heightFeet'));
  const heightInches = Number(formData.get('heightInches'));
  const weight = Number(formData.get('weight'));
  const gender = formData.get('gender') as string;

  if (!age || !heightFeet || !weight || !gender) {
    throw new Error('All fields are required.');
  }

  const height = heightFeet * 12 + heightInches;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { age, height, gender, completedOnboarding: true },
    }),
    prisma.weight.create({
      data: {
        id: crypto.randomUUID(),
        weight,
        userId: session.user.id,
      },
    }),
  ]);

  redirect('/dashboard');
}
