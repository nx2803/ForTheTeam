'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0a] z-50">
            <LoadingSpinner size="xl" text="INITIALIZING SYSTEM" />
        </div>
    );
}
