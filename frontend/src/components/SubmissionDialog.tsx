import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubmissionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    challengeTitle: string;
}

export function SubmissionDialog({ open, onOpenChange, challengeTitle }: SubmissionDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Please select a file to submit.");
            return;
        }

        setIsUploading(true);
        setError(null);

        // Імітація завантаження на сервер
        console.log("Uploading file:", file.name);
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log("Upload complete!");
        setIsUploading(false);
        onOpenChange(false); // Закриваємо діалог
        setFile(null); // Скидаємо файл
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Submit to: {challengeTitle}</DialogTitle>
                    <DialogDescription>
                        Select your solution file. The submission will be final.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="solution-file">Solution File (.csv)</Label>
                        <Input id="solution-file" type="file" onChange={handleFileChange} accept=".csv" />
                        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!file || isUploading}>
                        {isUploading ? "Uploading..." : "Submit Solution"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
