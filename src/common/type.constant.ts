export interface CSV_data {
    Condition: string | undefined
    Action: string
}

export interface CSVuploaderProps {
    userId: number
    workflowId: number
    isOpen?: boolean
    onClose?: () => void
    onUpload?: (csvData: CSV_data[]) => void
}