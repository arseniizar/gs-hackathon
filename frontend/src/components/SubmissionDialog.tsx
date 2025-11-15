import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { submitSolution } from '@/lib/api';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${size} ${sizes[i]}`;
};

interface SubmissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challengeId: string;
    challengeTitle: string;
    onSubmissionSuccess: () => void;
}

export function SubmissionDialog({ open, onOpenChange, challengeId, challengeTitle, onSubmissionSuccess }: SubmissionDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setError(null);
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
        if (fileRejections.length > 0) {
            setError("File is not a valid CSV or is too large.");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false,
        maxSize: 50 * 1024 * 1024, // 50MB limit
    });

    const handleSubmit = async () => {
        if (!file || !challengeId) {
            setError("File and Challenge ID are required.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            await submitSolution(challengeId, file);
            toast({
                title: "Submission Successful",
                description: "Your file has been sent for evaluation. Good luck!",
            });
            onSubmissionSuccess();
            handleClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.response?.data || "An unknown error occurred during upload.";
            setError(errorMessage);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: typeof errorMessage === 'string' ? errorMessage : "Please check the file and try again.",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        if (isUploading) return;
        onOpenChange(false);
        setTimeout(() => {
            setFile(null);
            setError(null);
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[480px]" onInteractOutside={(e) => { if (isUploading) e.preventDefault(); }}>
                <DialogHeader>
                    <DialogTitle className="font-serif text-xl">Submit to: {challengeTitle}</DialogTitle>
                    <DialogDescription>
                        Your submission will be final. Please review your solution file carefully.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!file ? (
                        <div
                            {...getRootProps()}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-36 px-4 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                                isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                                error ? "border-destructive" : ""
                            )}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">CSV files up to 50MB</p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <FileIcon className="h-6 w-6 text-primary flex-shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {/* 👇 Використовуємо нову функцію */}
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={isUploading}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    {error && <p className="text-sm text-destructive mt-1">{error}</p>}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!file || isUploading}>
                        {isUploading ? "Uploading..." : "Submit Solution"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}