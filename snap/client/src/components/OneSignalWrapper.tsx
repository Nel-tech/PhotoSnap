'use client'

import { useEffect, ReactNode } from "react";

interface SignalProps {
    children: ReactNode;
}

const OneSignalWrapper = ({ children }: SignalProps) => {
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.OneSignal = window.OneSignal || [];
            window.OneSignal.push(() => {
                window.OneSignal.init({
                    appId: process.env.NEXT_PUBLIC_ONE_SIGNAL_APP_ID,
                    notifyButton: { enable: false },
                    allowLocalhostAsSecureOrigin: true,
                });

                window.OneSignal.sendTag?.("role", "admin");
            });
        }
    }, []);

    return <>{children}</>;
};

export default OneSignalWrapper;