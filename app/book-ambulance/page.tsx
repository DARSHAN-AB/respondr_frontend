'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, ArrowLeft, Ambulance, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/animated-section';
import { useAuth } from '@/lib/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BookAmbulancePage() {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [emergencyType, setEmergencyType] = useState('accident');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [destination, setDestination] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const { user, token } = useAuth();

  useEffect(() => {
    if (!token || !user) {
      router.push('/login');
      return;
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast({
            title: 'Location Detected',
            description: 'Your current location has been set.',
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Unable to get your location. Please enable location services.',
          });
        },
        { enableHighAccuracy: true }
      );
    }
  }, [toast, router, token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.userId) {
      setError('User not authenticated. Please log in.');
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'Please log in to book an ambulance.',
      });
      return;
    }

    if (!location) {
      setError('Location required. Please enable location services.');
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'We need your location to send an ambulance.',
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'Booking',
          latitude: location.lat,
          longitude: location.lng,
          destination,
          patientName,
          contactNumber,
          emergencyType,
          additionalInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book ambulance');
      }

      const { reportId } = await response.json();
      toast({
        title: 'Booking Submitted',
        description: `Booking ID: ${reportId}. Waiting for driver confirmation.`,
      });
      router.push(`/booking-processing?reportId=${reportId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to book ambulance.');
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: err.message || 'Failed to book ambulance.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 p-4">
      <div className="container mx-auto max-w-md">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <AnimatedSection>
          <Card className="shadow-2xl rounded-2xl border-0 overflow-hidden">
            <CardHeader className="bg-red-600 text-white p-6">
              <CardTitle className="text-xl font-bold">Book an Ambulance</CardTitle>
              <CardDescription className="text-red-100">Request emergency medical transportation</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <Alert variant="destructive" className="mb-4 animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="patientName" className="text-sm font-medium">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber" className="text-sm font-medium">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-sm font-medium">Destination (e.g., Hospital)</Label>
                  <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="h-12 rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="City Hospital"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Emergency Type</Label>
                  <RadioGroup
                    value={emergencyType}
                    onValueChange={setEmergencyType}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="accident" id="accident" className="text-red-600" />
                      <Label htmlFor="accident" className="cursor-pointer text-sm">Road Accident</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medical" id="medical" className="text-red-600" />
                      <Label htmlFor="medical" className="cursor-pointer text-sm">Medical Emergency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="text-red-600" />
                      <Label htmlFor="other" className="cursor-pointer text-sm">Other Emergency</Label>
                    </div>
                  </RadioGroup>
                </div>
                {location && (
                  <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                    <MapPin className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Pickup Location</p>
                      <p className="text-gray-600">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo" className="text-sm font-medium">Additional Information</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Describe the emergency situation..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[120px] rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking Ambulance...
                    </div>
                  ) : (
                    <>
                      <Ambulance className="mr-2 h-5 w-5" /> Book Ambulance
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
}