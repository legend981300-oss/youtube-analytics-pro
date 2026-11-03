import Link from 'next/link';
import { PlaySquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-navy-950 p-4 text-center font-sans">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 shadow-lg shadow-brand-500/25 mb-4">
        <PlaySquare className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-2">
        Page Not Found
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        The analytics view or resource you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="mt-6">
        <Button size="sm">
          <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

