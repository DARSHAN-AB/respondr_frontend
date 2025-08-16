"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RoleSidebar } from "@/components/role-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Shield, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function DriverVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toastTrigger, setToastTrigger] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<"not_submitted" | "pending" | "accepted" | "rejected">(
    "not_submitted"
  );
  const [driverId, setDriverId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    licenseNumber: "",
    ambulanceRegistration: "",
    address: "",
  });
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [previewUrls, setPreviewUrls] = useState<{ idProof?: string; license?: string }>({});

  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch driverId and verification status on mount
  useEffect(() => {
    console.log('Verification page useEffect - User:', user);
    const fetchDriverIdAndStatus = async () => {
      if (!user?.userId) {
        console.log('No userId in useEffect, skipping fetch');
        setToastTrigger((prev) => prev + 1);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "User not authenticated. Please log in again.",
          duration: Infinity,
          action: {
            label: "Log In",
            onClick: () => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            },
          },
        });
        return;
      }

      // Fetch driverId
      try {
        console.log(`Fetching driverId for userId: ${user.userId}`);
        const driverResponse = await fetch(`http://localhost:3001/api/driver-id/${user.userId}`);
        const driverData = await driverResponse.json();
        console.log('Driver ID response:', driverData);

        if (!driverResponse.ok) {
          throw new Error(driverData.error || 'Failed to fetch driver ID');
        }

        setDriverId(driverData.driverId);
      } catch (error) {
        console.error('Error fetching driverId:', error);
        setToastTrigger((prev) => prev + 1);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No driver profile found for your account. Please contact support.",
          duration: Infinity,
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        return;
      }

      // Fetch verification status
      try {
        console.log(`Fetching verification status for userId: ${user.userId}`);
        const statusResponse = await fetch(`http://localhost:3001/api/verification-status/${user.userId}`);
        const statusData = await statusResponse.json();
        console.log('Verification status response:', statusData);

        if (!statusResponse.ok) {
          throw new Error(statusData.error || 'Failed to fetch verification status');
        }

        setVerificationStatus(statusData.status || "not_submitted");
      } catch (error) {
        console.error('Error fetching verification status:', error);
        setToastTrigger((prev) => prev + 1);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch verification status. Please try again.",
          duration: Infinity,
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
      }
    };
    fetchDriverIdAndStatus();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idProof" | "license") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if file is jpg
      if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
        setToastTrigger((prev) => prev + 1);
        toast({
          variant: "destructive",
          title: "Invalid File Format",
          description: "Please upload a JPG image file.",
          duration: Infinity,
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setToastTrigger((prev) => prev + 1);
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please upload a file smaller than 5MB.",
          duration: Infinity,
          action: {
            label: "Close",
            onClick: () => {},
          },
        });
        return;
      }

      if (type === "idProof") {
        setIdProofFile(file);
        setPreviewUrls((prev) => ({ ...prev, idProof: URL.createObjectURL(file) }));
      } else {
        setLicenseFile(file);
        setPreviewUrls((prev) => ({ ...prev, license: URL.createObjectURL(file) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!idProofFile || !licenseFile) {
      setToastTrigger((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Missing Files",
        description: "Please upload both ID proof and license documents.",
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      return;
    }

    if (!formData.licenseNumber || !formData.ambulanceRegistration || !formData.address) {
      setToastTrigger((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      return;
    }

    // Debug authentication state
    console.log('Authentication state:', {
      user,
      driverId,
      token: localStorage.getItem('token'),
      tokenExists: !!localStorage.getItem('token'),
      timestamp: new Date().toISOString(),
    });

    // Check user.userId and driverId
    if (!user || user.userId === undefined || user.userId === null || isNaN(Number(user.userId))) {
      console.error('Invalid user ID:', user?.userId, 'Full user object:', user, 'Token:', localStorage.getItem('token'));
      setToastTrigger((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "User not authenticated or invalid user ID. Please log out and log in again.",
        duration: Infinity,
        action: {
          label: "Log In",
          onClick: () => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          },
        },
      });
      return;
    }

    if (!driverId) {
      console.error('No driverId available for userId:', user.userId);
      setToastTrigger((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Driver Profile Error",
        description: "No driver profile found for your account. Please contact support.",
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate progress for UX
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);

    // Prepare form data
    const formDataToSend = new FormData();
    formDataToSend.append("licenseNumber", formData.licenseNumber);
    formDataToSend.append("ambulanceRegistration", formData.ambulanceRegistration);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("driverId", String(driverId));
    if (idProofFile) formDataToSend.append("idProof", idProofFile);
    if (licenseFile) formDataToSend.append("license", licenseFile);

    try {
      console.log('Sending verification request:', {
        licenseNumber: formData.licenseNumber,
        ambulanceRegistration: formData.ambulanceRegistration,
        address: formData.address,
        driverId,
        idProof: idProofFile?.name,
        license: licenseFile?.name,
        timestamp: new Date().toISOString(),
      });

      const response = await fetch("http://localhost:3001/api/driver-verification/submit", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formDataToSend,
      });

      console.log('Response status:', response.status, 'OK:', response.ok, 'Headers:', Object.fromEntries(response.headers));

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse response JSON:', jsonError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `Failed to submit verification (Status: ${response.status})`;
        if (errorMessage.includes('foreign key constraint fails') || errorMessage.includes('ambulances_ibfk_1')) {
          throw new Error(
            'Invalid driver profile. The driver ID does not match a valid record. Please contact support.'
          );
        }
        if (response.status === 400) {
          throw new Error(
            errorMessage.includes('Missing required fields') ? 'Please ensure all fields are filled correctly.' :
            errorMessage.includes('Missing required files') ? 'Please upload both ID proof and license files.' :
            errorMessage.includes('Only JPG files') ? 'Please upload JPG files only.' :
            errorMessage.includes('Files must be smaller') ? 'Please upload files smaller than 5MB.' :
            errorMessage.includes('No driver profile found') ? 'No driver profile found for your account. Please contact support.' :
            'Invalid submission data. Please check your inputs and try again, or contact support.'
          );
        }
        throw new Error(errorMessage);
      }

      setVerificationStatus("pending");
      setToastTrigger((prev) => prev + 1);
      toast({
        title: "Verification Submitted",
        description: "Your verification documents have been submitted for review.",
        duration: 10000,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } catch (error) {
      console.error('Submission error:', error);
      setToastTrigger((prev) => prev + 1);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit verification. Please try again or contact support.",
        duration: Infinity,
        action: {
          label: "Close",
          onClick: () => {},
        },
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <RoleSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
              </div>
              <h1 className="text-xl font-bold text-red-600">Respondr</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-3xl mx-auto">
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-600 to-red-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Driver Verification
                  </CardTitle>
                  <CardDescription className="text-red-100">
                    Complete your verification to start accepting emergency requests
                  </CardDescription>
                </CardHeader>

                {verificationStatus === "pending" ? (
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Verification In Progress</h3>
                      <p className="text-gray-600 max-w-md mb-6">
                        Your verification documents have been submitted and are currently under review. This process
                        typically takes 1-2 business days.
                      </p>
                      <div className="w-full max-w-md p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-yellow-800">Verification pending</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              You will receive a notification once your verification is complete. You can continue to
                              use the app, but you won't be able to accept emergency requests until your verification is
                              approved.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : verificationStatus === "accepted" ? (
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Verification Approved</h3>
                      <p className="text-gray-600 max-w-md mb-6">
                        Congratulations! Your verification has been approved. You can now accept emergency requests.
                      </p>
                      <div className="w-full max-w-md p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-800">Verification complete</h4>
                            <p className="text-sm text-green-700 mt-1">
                              You are now a verified driver on Respondr. You can start accepting emergency requests and
                              helping people in need.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                          <Input
                            id="licenseNumber"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleInputChange}
                            placeholder="DL12345678"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="ambulanceRegistration">Ambulance Registration Number *</Label>
                          <Input
                            id="ambulanceRegistration"
                            name="ambulanceRegistration"
                            value={formData.ambulanceRegistration}
                            onChange={handleInputChange}
                            placeholder="KA01AB1234"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Current Address *</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your full address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="idProofUpload">Upload ID Proof (JPG only) *</Label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <Input
                              id="idProofUpload"
                              type="file"
                              accept=".jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "idProof")}
                              className="hidden"
                            />
                            <Label htmlFor="idProofUpload" className="flex flex-col items-center gap-2 cursor-pointer">
                              {previewUrls.idProof ? (
                                <div className="relative w-full">
                                  <img
                                    src={previewUrls.idProof || "/placeholder.svg"}
                                    alt="ID Proof Preview"
                                    className="h-32 object-cover rounded-lg mx-auto"
                                  />
                                  <div className="mt-2 text-sm text-gray-600">Click to change</div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-gray-400" />
                                  <span className="text-sm text-gray-500">Click to upload ID proof (max 5MB)</span>
                                </>
                              )}
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="licenseUpload">Upload Driver's License (JPG only) *</Label>
                          <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <Input
                              id="licenseUpload"
                              type="file"
                              accept=".jpg,.jpeg"
                              onChange={(e) => handleFileChange(e, "license")}
                              className="hidden"
                            />
                            <Label htmlFor="licenseUpload" className="flex flex-col items-center gap-2 cursor-pointer">
                              {previewUrls.license ? (
                                <div className="relative w-full">
                                  <img
                                    src={previewUrls.license || "/placeholder.svg"}
                                    alt="License Preview"
                                    className="h-32 object-cover rounded-lg mx-auto"
                                  />
                                  <div className="mt-2 text-sm text-gray-600">Click to change</div>
                                </div>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-gray-400" />
                                  <span className="text-sm text-gray-500">Click to upload license (max 5MB)</span>
                                </>
                              )}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-gray-50 border-t p-6">
                      {isSubmitting && (
                        <div className="w-full mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Uploading documents...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            <span>Submitting...</span>
                          </div>
                        ) : (
                          "Submit Verification"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                )}
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}