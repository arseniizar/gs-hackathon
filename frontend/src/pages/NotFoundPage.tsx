function NotFoundPage() {
    return (
        <div className="mx-auto max-w-6xl px-8 py-16 md:py-24 text-center">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="mt-4 text-3xl font-medium">Page Not Found</h2>
            <p className="mt-4 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
            <a href="/" className="mt-6 inline-block rounded bg-primary px-6 py-3 text-primary-foreground">
                Go Back Home
            </a>
        </div>
    );
}

export default NotFoundPage;