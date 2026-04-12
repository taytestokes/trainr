import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      age: true,
      height: true,
      gender: true,
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <ProfileForm user={user} />
    </div>
  );
}
