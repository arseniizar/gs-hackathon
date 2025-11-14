import { useParams } from "react-router-dom";

function ChallengeDetailsPage() {
    const { challengeId } = useParams();

    return (
        <div className="mx-auto max-w-6xl px-8 py-16 md:py-24 text-center">
            <h1 className="text-5xl font-medium">Challenge Details</h1>
            <p className="mt-4 text-2xl text-muted-foreground">
                You are viewing challenge with ID: <span className="text-primary">{challengeId}</span>
            </p>
        </div>
    );
}

export default ChallengeDetailsPage;