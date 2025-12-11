'use client';

import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { useEffect } from 'react';
import PrivacyControls from '@/components/ui/PrivacyControls';
import Card from '@/components/ui/Card';

export default function PrivacyPage() {
  const router = useRouter();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <PrivacyControls />
        </Card>
      </div>
    </div>
  );
}

