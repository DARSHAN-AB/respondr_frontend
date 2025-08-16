import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface VerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  verificationStatus: "not_submitted" | "pending" | "accepted" | "rejected" | null
  onAction: (action: "cancel" | "submit") => void
  onClose: () => void
  setDriverStatus: (status: "available" | "busy" | "offline") => void
  toast: (options: { title: string; description: string; variant?: string }) => void
}

export default function VerificationDialog({
  open,
  onOpenChange,
  verificationStatus,
  onAction,
  onClose,
  setDriverStatus,
  toast,
}: VerificationDialogProps) {
  console.log('VerificationDialog rendered, open:', open, 'status:', verificationStatus)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md z-50">
        <DialogHeader>
          <DialogTitle>
            {verificationStatus === "not_submitted" ? "Verification Required" : "Verification Status"}
          </DialogTitle>
          <DialogDescription>
            {verificationStatus === "not_submitted" &&
              "Please submit your verification details to go online."}
            {verificationStatus === "pending" &&
              "Your verification request is still pending. Please be patient; we will verify and get back to you."}
            {verificationStatus === "rejected" &&
              "Your verification request was rejected. Please resubmit or contact support."}
            {verificationStatus === "accepted" && "Your verification is approved. You can now go online."}
            {!verificationStatus && "Checking verification status..."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex sm:justify-between">
          {verificationStatus === "not_submitted" ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onAction("cancel")}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => onAction("submit")}
                className="bg-red-600 hover:bg-red-700"
              >
                Submit Verification
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-red-600 text-red-600 hover:bg-red-50"
            >
              Back
            </Button>
          )}
          {verificationStatus === "accepted" && (
            <Button
              type="button"
              onClick={() => {
                setDriverStatus("available")
                onOpenChange(false)
                toast({
                  title: "Online",
                  description: "You are now online and can accept jobs.",
                })
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Go Online
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}