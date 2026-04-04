import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function SignupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { completedOnboarding: true },
    });

    if (!user?.completedOnboarding) {
      return redirect('/onboarding');
    }

    return redirect('/dashboard');
  }

  return <>{children}</>;
}
