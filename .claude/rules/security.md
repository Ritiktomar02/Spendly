# Security Rules

- Never hardcode secrets or credentials.
- Use environment variables for sensitive configuration.
- Never commit `.env` files.
- Validate and sanitize user input where appropriate.
- Never expose passwords or sensitive user data in API responses.
- Use secure password handling when authentication is implemented.
- Do not expose internal errors or secrets to clients.
- Do not disable security protections just to make code work.