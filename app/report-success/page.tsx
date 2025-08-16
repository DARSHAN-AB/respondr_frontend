import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home, Clock } from "lucide-react"
import Link from "next/link"
import { AnimatedSection } from "@/components/animated-section"

export default function ReportSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <AnimatedSection>
        <Card className="max-w-md w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-green-400 opacity-75"></div>
                <CheckCircle className="relative h-16 w-16 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Report Sent Successfully</CardTitle>
            <CardDescription>Emergency services have been notified and help is on the way</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Emergency services have received your incident report with photo and location
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  An ambulance has been dispatched to your location
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  Stay at the scene if it's safe to do so
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-500">•</span>
                  You may receive a call from emergency services for additional information
                </li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-700 mb-2">Our AI has analyzed your incident photo and determined:</p>
              <p className="text-sm font-medium text-gray-800">
                High severity road accident. Multiple vehicles involved.
              </p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-blue-600 mr-1" />
                <p className="text-sm text-blue-800">
                  Estimated ambulance arrival: <span className="font-bold">8 minutes</span>
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-red-50 p-4 border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Emergency Contact</h3>
              <p className="text-sm text-gray-700">
                If the situation worsens or you need immediate assistance, call emergency services directly:
              </p>
              <p className="text-xl font-bold text-red-600 mt-2 text-center">108</p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-[1.02]">
                <Home className="mr-2 h-4 w-4" /> Return to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </AnimatedSection>
    </div>
  )
}
