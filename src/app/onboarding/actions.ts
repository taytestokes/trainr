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

  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();
  const location = (formData.get('location') as string)?.trim();
  const age = Number(formData.get('age'));
  const heightFeet = Number(formData.get('heightFeet'));
  const heightInches = Number(formData.get('heightInches'));
  const weight = Number(formData.get('weight'));
  const gender = formData.get('gender') as string;

  // TODO: Handle image upload once storage infrastructure is in place
  // const image = formData.get('image') as File | null;

  if (!name || !age || !heightFeet || !weight || !gender) {
    throw new Error('All fields are required.');
  }

  const height = heightFeet * 12 + heightInches;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        age,
        height,
        gender,
        completedOnboarding: true,
        ...(phone && { phone }),
        ...(location && { location }),
      },
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
