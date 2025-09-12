# Security Policy

## Supported Versions

We actively provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

AgentCHAT implements several security measures to protect user data:

### Data Protection
- **Encrypted Storage**: API keys are encrypted using `electron-store` with per-installation encryption keys
- **Context Isolation**: Renderer process runs in isolated context, cannot access Node.js APIs
- **Sandboxed Content**: Web content runs in sandboxed environment with strict security boundaries
- **Secure IPC**: All main/renderer communication goes through secure preload script bridge

### API Key Security
- API keys are never stored in plain text
- Keys are encrypted at rest with per-installation encryption
- No API keys are logged or transmitted except to their respective AI providers
- Users maintain full control over their API key storage and management

### Network Security
- HTTPS-only communication with AI providers
- No telemetry or analytics data collection
- All network requests are user-initiated through secure API clients

## Reporting Vulnerabilities

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Reporting Process
1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security reports to: `security@agentchat.app`
3. Include detailed information about the vulnerability
4. Provide steps to reproduce if possible
5. Include your contact information for follow-up

### What to Include
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Suggested fix (if you have one)
- Your contact information

### Response Timeline
- **Acknowledgment**: Within 24 hours of report
- **Initial Assessment**: Within 72 hours
- **Status Updates**: Weekly until resolution
- **Resolution**: Target 7-14 days for critical issues

## Security Best Practices

### For Users
- Keep AgentCHAT updated to the latest version
- Use strong, unique API keys from official AI provider dashboards
- Store API keys securely and don't share them
- Be cautious when sharing conversation data
- Report suspicious behavior immediately

### For Contributors
- Follow secure coding practices
- Never commit secrets or API keys to the repository
- Use dependency scanning tools
- Implement proper input validation
- Follow the principle of least privilege

## Security Disclosure

Once a vulnerability is fixed:
- We will publish a security advisory
- Credit will be given to the reporter (unless they prefer to remain anonymous)
- Details will be shared after users have had time to update

## Contact

For security-related questions or concerns:
- **Email**: security@agentchat.app
- **PGP Key**: Available upon request

---

**Note**: This security policy applies to AgentCHAT desktop application. For questions about third-party AI provider security, please contact the respective providers directly.