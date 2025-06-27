import { Suspense } from "react";
import SignIn from "@/app/login/SignIn";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading sign-in form...</div>}>
            <SignIn />
        </Suspense>
    );
}
