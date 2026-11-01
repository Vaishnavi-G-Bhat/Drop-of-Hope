MESSAGES = {
    'INVALID_CREDENTIALS': {'en': 'Invalid email or password', 'kn': 'ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್ ಸರಿ ಇಲ್ಲ'},
    'VALIDATION_ERROR': {'en': 'Validation failed', 'kn': 'ಮೌಲ್ಯೀಕರಣ ವಿಫಲವಾಯಿತು'},
    'UNAUTHORIZED': {'en': 'Authentication required', 'kn': 'ಪ್ರವೇಶಕ್ಕಾಗಿ ಲಾಗಿನ್ ಅಗತ್ಯ'},
    'FORBIDDEN': {'en': 'You do not have permission to access this resource', 'kn': 'ಈ ಸಂಪನ್ಮೂಲಕ್ಕೆ ನೀವು ಅನುಮತಿ ಹೊಂದಿಲ್ಲ'},
    'NOT_FOUND': {'en': 'Resource not found', 'kn': 'ಸಂಪನ್ಮೂಲ ಕಂಡುಬಂದಿಲ್ಲ'},
    'CONFLICT': {'en': 'Conflict with existing data', 'kn': 'ಹಲವು ದತ್ತಾಂಶಕ್ಕೆ ಸಂಘರ್ಷ'},
    'NOT_VERIFIED': {'en': 'Your account is pending verification', 'kn': 'ನಿಮ್ಮ ಖಾತೆ ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ'},
    'VERIFICATION_CREATED': {'en': 'Verification request created', 'kn': 'ಪರಿಶೀಲನೆ ವಿನಂತಿಯನ್ನು ರಚಿಸಲಾಗಿದೆ'},
    'REQUEST_CREATED': {'en': 'Request created successfully', 'kn': 'ವಿನಂತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ'},
    'RESPONSE_ADDED': {'en': 'Response recorded', 'kn': 'ಪ್ರತ್ಯುತ್ತರ ದಾಖಲಾಗಿದೆ'},
    'STATUS_UPDATED': {'en': 'Status updated', 'kn': 'ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ'},
    'STOCK_UPDATED': {'en': 'Stock updated', 'kn': 'ಸ್ಟಾಕ್ ನವೀಕರಿಸಲಾಗಿದೆ'},
    'VERIFICATION_NOTIFICATION': {'en': 'Your account has been verified', 'kn': 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ'},
}


def message_for(code, locale='en'):
    entry = MESSAGES.get(code, {'en': code, 'kn': code})
    return entry.get(locale, entry.get('en', code))
