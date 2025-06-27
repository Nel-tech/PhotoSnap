import { Suspense } from "react";
import SignUp from "@/app/signup/Signup";

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading sign-in form...</div>}>
            <SignUp />
        </Suspense>
    );
}
