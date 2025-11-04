exports.validateEmail = function(email) {
    let errors = [];

    if (!email || typeof email !== 'string' || email.trim() === '') {
        errors.push("Email is required.");
    } else if (
        !email.includes('@') ||
        !email.includes('.') ||
        email.startsWith('@') ||
        email.endsWith('@') ||
        email.endsWith('.')
    ) {
        errors.push("Email format is invalid.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

exports.validatePassword = function(password) {
    let errors = [];
    if (!password || password.length < 6) {
        errors.push("Password must be at least 6 characters long.");
    }
    return {
        valid: errors.length === 0,
        errors
    };
};
