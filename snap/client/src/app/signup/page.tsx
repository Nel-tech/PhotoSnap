import { Suspense } from "react";
import SignUp from "@/app/signup/Signup";

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading sign-in form...</div>}>
            <SignUp />
        </Suspense>
    );
}
