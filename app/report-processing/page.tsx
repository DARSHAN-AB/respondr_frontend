'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Search, X } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function ReportProcessingPage() {
  const router = useRouter(); // Safe outside Suspense as it's not client-side only
  const { toast } = useToast();
  const { token } = useAuth();

  // Initial check for token (server-safe)
  if (!token) {
    toast({
      variant: 'destructive',
      title: 'Authentication Error',
      description: 'Please log in to continue.',
    });
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <AnimatedSection>
        <Card className="max-w-md w-full p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <Suspense fallback={<div className="text-center">Loading report details...</div>}>
              <ReportContent router={router} toast={toast} token={token} />
            </Suspense>
          </div>
        </Card>
      </AnimatedSection>
    </div>
  );
}

function ReportContent({ router, toast, token }: { router: any; toast: any; token: string }) {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);
  const maxErrorRetries = 5;

  useEffect(() => {
    if (!reportId) {
      toast({
        variant: 'destructive',
        title: 'Invalid Report',
        description: 'No report ID provided.',
      });
      router.push('/dashboard');
      return;
    }

    // Animation loop: Cycle through steps 1–3 every 6 seconds (2 seconds per step)
    const animationInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === 3) {
          setProgress(0); // Reset progress at the end of cycle
          return 1;
        }
        setProgress((prev + 33.33).toFixed(2)); // Increment progress (33.33% per step)
        return prev + 1;
      });
    }, 2000);

    // Status check: Poll every 2 seconds
    const statusInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/booking/status/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch report status');
        }
        const { status } = await response.json();
        if (status === 'Accepted' || status === 'Assigned') {
          clearInterval(animationInterval);
          clearInterval(statusInterval);
          router.push(`/report-success?reportId=${reportId}`);
        } else if (status === 'Cancelled') {
          clearInterval(animationInterval);
          clearInterval(statusInterval);
          toast({
            variant: 'destructive',
            title: 'Report Cancelled',
            description: 'Your report has been cancelled.',
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        setErrorCount((prev) => prev + 1);
        if (errorCount >= maxErrorRetries) {
          clearInterval(animationInterval);
          clearInterval(statusInterval);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: error.message || 'Failed to check report status. Please try again later.',
          });
          router.push('/dashboard');
        }
      }
    }, 2000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(statusInterval);
    };
  }, [router, reportId, toast, token, errorCount]);

  const handleCancel = async () => {
    if (!reportId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing report ID or authentication.',
      });
      return;
    }

    setIsCancelled(true);
    try {
      const response = await fetch(`http://localhost:3001/api/booking/cancel/${reportId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel report');
      }
      toast({
        title: 'Report Cancelled',
        description: 'Your report has been cancelled.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      setIsCancelled(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to cancel report.',
      });
    }
  };

  return (
    <>
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step 1: Sending report */}
      <div
        className={`transition-all duration-300 ${currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Send className="h-10 w-10 text-red-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Sending your report</h2>
          <p className="text-gray-600 mb-4">Transmitting incident details to our servers...</p>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
          </div>
        </div>
      </div>

      {/* Step 2: Analyzing incident */}
      <div
        className={`transition-all duration-300 ${currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-200 rounded-full animate-ping opacity-75"></div>
              <div className="relative w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-lg">AI</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Analyzing incident severity</h2>
          <p className="text-gray-600 mb-4">Our AI is assessing the emergency priority level...</p>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
          </div>
        </div>
      </div>

      {/* Step 3: Searching for ambulance */}
      <div
        className={`transition-all duration-300 ${currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'}`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-green-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Searching for nearest ambulance</h2>
          <p className="text-gray-600 mb-4">Locating available emergency responders in your area...</p>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }} />
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <Button
        variant="outline"
        className="mt-6 border-red-600 text-red-600 hover:bg-red-50"
        onClick={handleCancel}
        disabled={isCancelled}
      >
        <X className="mr-2 h-4 w-4" />
        {isCancelled ? 'Cancelling...' : 'Cancel Report'}
      </Button>
    </>
  );
}