import { Suspense } from "react";
import SignIn from "@/app/login/SignIn";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading sign-in form...</div>}>
            <SignIn />
        </Suspense>
    );
}
