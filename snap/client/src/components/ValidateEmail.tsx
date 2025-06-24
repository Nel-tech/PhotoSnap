export const validateEmailClient = (email: string): { isValid: boolean; message: string } => {
    if (!email) {
        return { isValid: false, message: "Email is required" };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: "Please enter a valid email address" };
    }

    const allowedDomains = [
        '@gmail.com',
        '@yahoo.com',
        '@outlook.com',
        '@hotmail.com'
    ];

    const isAllowedDomain = allowedDomains.some(domain =>
        email.toLowerCase().endsWith(domain)
    );

    if (!isAllowedDomain) {
        return {
            isValid: false,
            message: "Only Gmail, Yahoo, Outlook, and Hotmail email addresses are allowed"
        };
    }

    return { isValid: true, message: "" };
};