// report-incident/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { MapPin, Send, X, ArrowLeft, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatedSection } from '@/components/animated-section';
import { createReport } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function ReportIncidentPage() {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showNoAmbulanceModal, setShowNoAmbulanceModal] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

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
  }, [toast, router, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Only PNG files are allowed.',
      });
      return;
    }

    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoURL(null);
  };

  const handleSubmit = async () => {
    if (!photoFile) {
      toast({
        variant: 'destructive',
        title: 'Photo Required',
        description: 'Please upload a PNG photo of the incident.',
      });
      return;
    }

    if (!location) {
      toast({
        variant: 'destructive',
        title: 'Location Required',
        description: 'We need your location to send help.',
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await createReport({
        type: 'SOS',
        latitude: location.lat,
        longitude: location.lng,
        description,
        photo: photoFile,
      });

      toast({
        title: 'Report Sent',
        description: `Report ID: ${response.reportId}. Processing your request.`,
      });
      router.push(`/report-processing?reportId=${response.reportId}`);
    } catch (err: any) {
      let errorMessage = 'Failed to send report.';

      // if (err.status === 409 && err.reportId) {
      //   router.push(`/report-processing?reportId=${err.reportId}&noAmbulance=true`);
      //   return;
      // } else if (err.message) {
      //   errorMessage = err.message;
      // }

      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Report Failed',
        description: errorMessage,
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
              <CardTitle className="text-xl font-bold">Report Emergency</CardTitle>
              <CardDescription className="text-red-100">
                Upload a PNG photo and report an incident instantly
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {error && (
                <div className="text-red-700 bg-red-100 p-2 rounded mb-4">{error}</div>
              )}

              {!photoURL ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-4 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:border-red-600 transition"
                >
                  <Upload className="h-12 w-12 text-red-600" />
                  <p className="text-center text-gray-600">Upload a PNG photo to help emergency services</p>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={photoURL}
                    alt="Incident"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-gray-100 rounded-full shadow transition-all duration-300"
                    onClick={removePhoto}
                    aria-label="Remove uploaded photo"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </Button>
                </div>
              )}

              {location && (
                <div className="flex items-center p-4 bg-gray-100 rounded-lg shadow-sm">
                  <MapPin className="h-6 w-6 text-red-600 mr-3 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Your Location</p>
                    <p className="text-gray-600">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900"
                >
                  Incident Description (Optional)
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe what happened..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px] rounded-lg border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                />
              </div>
            </CardContent>

            <CardFooter className="p-6 bg-gray-50">
              <Button
                onClick={handleSubmit}
                className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                disabled={!photoFile || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Report...
                  </div>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Send Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </AnimatedSection>
      </div>

      <Dialog open={showNoAmbulanceModal} onOpenChange={setShowNoAmbulanceModal}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">No Ambulance Found</DialogTitle>
            <DialogDescription>
              Sorry, no ambulances are available in your area right now.
              <br />
              <strong>Please call 108 directly</strong> for immediate assistance.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowNoAmbulanceModal(false)} className="bg-red-600 hover:bg-red-700 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}