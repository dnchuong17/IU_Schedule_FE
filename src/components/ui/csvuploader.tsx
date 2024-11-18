import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { useState } from "react"
import {importWorkflow} from "@/lib/API.ts";
import {HttpStatusCode} from "axios";
import {CSV_data, CSVuploaderProps} from "@/common/type.constant.ts";


export function CSVuploader({ isOpen = false, userId, workflowId,onClose }: CSVuploaderProps) {
  const [csvContent, setCsvContent] = useState<CSV_data[]>([])

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split("\n")

        const csvData: CSV_data[] = lines
            .slice(1) // Skip the header row
            .map((line) => {
              const [condition, action] = line.split(",").map(item => item.trim());
              return {
                Condition: condition?.replace(/"/g, ""),
                Action: action?.replace(/"/g, ""),
              };
            })
          .filter((rule) => rule.Condition && rule.Action)
        setCsvContent(csvData)
        console.log(csvData)
      }
      reader.readAsText(file)
    }
  }

  const handleUploadClick = async () => {
    if (csvContent.length > 0) {
      const res = await importWorkflow(workflowId, userId, csvContent)
      if (res !== HttpStatusCode.Ok){
        toast.error("Please select a CSV file first!")
        return;
      }
      setCsvContent([]);
      toast.success(
        <div>
          <p>CSV file uploaded successfully!</p>
          <div className="mt-2 max-h-40 overflow-auto">
            {csvContent.map((row, index) => (
              <div
                key={index}
                className="text-sm mt-1"
              >
                <strong>Condition:</strong> {row.Condition}
                <br />
                <strong>Action:</strong> {row.Action}
              </div>
            ))}
          </div>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )
      onClose?.()
    } else {
      toast.error("Please select a CSV file first!")
    }
  }

  const handleReset = () => {
    setCsvContent([])
    const fileInput = document.getElementById("file") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload CSV file</DialogTitle>
          <DialogDescription>
            Upload a CSV file with Condition and Action columns.
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2 text-sm">
              <Label
                htmlFor="file"
                className="text-sm font-medium"
              >
                CSV file
              </Label>
              <Input
                className="border-2 border-slate-700"
                id="file"
                type="file"
                placeholder="CSV file"
                accept=".csv"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={csvContent.length === 0}
            >
              Reset
            </Button>
            <Button
              size="lg"
              onClick={handleUploadClick}
            >
              Upload
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
