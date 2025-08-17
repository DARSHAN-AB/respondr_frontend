'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ambulance, MapPin, Search, CheckCircle, X } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';

export default function BookingProcessingPage() {
  const router = useRouter(); // Safe to use outside Suspense as it's not client-side only
  const { toast } = useToast();
  const { token } = useAuth();

  // Initial check for reportId and token (server-safe)
  if (!token) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: 'Missing authentication. Redirecting to dashboard.',
    });
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <AnimatedSection>
        <Card className="max-w-md w-full p-8 shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <Suspense fallback={<div className="text-center">Loading booking details...</div>}>
              <BookingContent router={router} toast={toast} token={token} />
            </Suspense>
          </div>
        </Card>
      </AnimatedSection>
    </div>
  );
}

function BookingContent({ router, toast, token }: { router: any; toast: any; token: string }) {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('reportId');
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [ambulancesFound, setAmbulancesFound] = useState(0);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (!reportId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Missing report ID. Redirecting to dashboard.',
      });
      router.push('/dashboard');
      return;
    }

    // Animation loop
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev === 2 ? 1 : prev + 1));
      setProgress((prev) => (prev === 100 ? 0 : prev + 50));
      setAmbulancesFound((prev) => (prev === 0 ? 2 : prev));
    }, 4000);

    // Poll report status every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/booking/status/${reportId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch booking status');
        }
        const { status } = await response.json();
        if (status === 'Assigned') {
          clearInterval(pollInterval);
          clearInterval(stepInterval);
          setCurrentStep(3);
          setProgress(100);
          setTimeout(() => {
            router.push('/booking-success');
          }, 2000);
        } else if (status === 'Cancelled') {
          clearInterval(pollInterval);
          clearInterval(stepInterval);
          toast({
            variant: 'destructive',
            title: 'Booking Cancelled',
            description: 'Your booking has been cancelled.',
          });
          router.push('/dashboard');
        }
      } catch (error: any) {
        console.error('Error polling booking status:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to check booking status.',
        });
      }
    }, 5000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(pollInterval);
    };
  }, [reportId, router, toast, token]);

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
        throw new Error('Failed to cancel booking');
      }
      toast({
        title: 'Booking Cancelled',
        description: 'Your ambulance booking has been cancelled.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      setIsCancelled(false);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to cancel booking.',
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

      {/* Step 1: Searching for ambulances */}
      <div
        className={`transition-all duration-300 ${
          currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 relative">
            <div className="absolute w-20 h-20 bg-blue-100 rounded-full animate-ping opacity-50"></div>
            <Search className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Searching for nearest ambulance</h2>
          <p className="text-gray-600 mb-4">Locating available ambulances in your area...</p>

          <div className="w-full max-w-xs bg-blue-50 rounded-lg p-3 mb-4 relative overflow-hidden">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Your location</p>
                <p className="text-xs text-blue-600">Scanning a 5km radius...</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-200 rounded-full animate-ping opacity-50"></div>
            <div
              className="absolute -top-6 -right-6 w-12 h-12 bg-blue-200 rounded-full animate-ping opacity-50"
              style={{ animationDelay: '500ms' }}
            ></div>
          </div>

          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '600ms' }}
            />
          </div>
        </div>
      </div>

      {/* Step 2: Found ambulances */}
      <div
        className={`transition-all duration-300 ${
          currentStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Ambulance className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ambulances Found!</h2>
          <p className="text-gray-600 mb-4">We found {ambulancesFound} ambulances near your location</p>

          <div className="w-full max-w-xs bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center mr-2">
                  <Ambulance className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">City Hospital</p>
                  <p className="text-xs text-green-600">2.4 km away</p>
                </div>
              </div>
              <div className="text-xs font-medium text-green-800">ETA: 8 min</div>
            </div>
            <div className="h-1 w-full bg-green-200 rounded-full">
              <div className="h-1 bg-green-600 rounded-full animate-pulse" style={{ width: '80%' }}></div>
            </div>
          </div>

          <p className="text-sm text-gray-600">Waiting for driver to accept...</p>
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
            <div
              className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
              style={{ animationDelay: '600ms' }}
            />
          </div>
        </div>
      </div>

      {/* Step 3: Ambulance confirmed */}
      <div
        className={`transition-all duration-300 ${
          currentStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 absolute'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ambulance Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your ambulance has been booked and is on the way</p>

          <div className="w-full max-w-xs bg-green-50 rounded-lg p-4 mb-2 border border-green-200">
            <div className="flex items-center">
              <div className="mr-3 relative">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Ambulance className="h-6 w-6 text-red-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium text-green-800">Driver Assigned</p>
                <p className="text-xs text-green-700">City Hospital • 8 min ETA</p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 animate-pulse">Redirecting to booking details...</div>
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
        {isCancelled ? 'Cancelling...' : 'Cancel Booking'}
      </Button>
    </>
  );
}