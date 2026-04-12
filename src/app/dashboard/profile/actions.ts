'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function updateProfile(
  _prev: { success: boolean; message: string } | null,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const name = (formData.get('name') as string)?.trim();
  const age = Number(formData.get('age'));
  const heightFeet = Number(formData.get('heightFeet'));
  const heightInches = Number(formData.get('heightInches'));
  const gender = formData.get('gender') as string;

  if (!name || !age || !heightFeet || !gender) {
    return { success: false, message: 'All fields are required.' };
  }

  const height = heightFeet * 12 + heightInches;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, age, height, gender },
    });
  } catch {
    return { success: false, message: 'Something went wrong. Please try again.' };
  }

  revalidatePath('/dashboard/profile');

  return { success: true, message: 'Profile updated successfully.' };
}
