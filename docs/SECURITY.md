# Security Policy

## Supported Versions

We actively provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🛡️ Security Features

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

## 🚨 Reporting Vulnerabilities

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

## 🔒 Security Best Practices

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

## 🔍 Security Considerations

### Data Privacy
- **Local Storage**: All conversations are stored locally on your device
- **No Cloud Sync**: AgentCHAT does not sync conversations to external servers
- **No Analytics**: No usage analytics or telemetry data is collected
- **User Control**: Users have full control over their data and conversations

### Third-Party Services
AgentCHAT integrates with third-party AI providers. Please review their individual privacy policies:
- [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- [OpenAI Privacy Policy](https://openai.com/policies/privacy-policy)
- [Google Gemini Privacy Policy](https://policies.google.com/privacy)
- [OpenRouter Privacy Policy](https://openrouter.ai/privacy)

## 🔧 Technical Security Details

### Electron Security
- **Context Isolation**: Enabled to prevent prototype pollution
- **Node.js Integration**: Disabled in renderer process
- **Sandbox**: Enabled for all web content
- **CSP Headers**: Content Security Policy implemented
- **Preload Script**: Secure bridge between main and renderer processes

### Cryptographic Implementation
- **Encryption**: AES-256 encryption for sensitive data
- **Key Derivation**: PBKDF2 for key derivation
- **Random Generation**: Cryptographically secure random number generation
- **Key Storage**: Operating system's secure storage where available

### Network Security
- **Certificate Validation**: Strict SSL/TLS certificate validation
- **Request Signing**: Where supported by providers
- **Timeout Protection**: Configurable timeouts for API requests
- **Rate Limiting**: Built-in protection against API abuse

## 📋 Security Checklist

### Before Release
- [ ] All dependencies scanned for vulnerabilities
- [ ] Security review completed
- [ ] Encryption implementation verified
- [ ] Network security tested
- [ ] User data protection validated

### For Users
- [ ] Update to latest version
- [ ] Review API key permissions
- [ ] Check AI provider security settings
- [ ] Secure your local device
- [ ] Backup important conversations

## 🚀 Security Updates

### Update Process
- Security updates are delivered through the standard update mechanism
- Critical security patches may require immediate updates
- Users will be notified of security updates through the application

### Verification
- All releases are cryptographically signed
- Update integrity is verified before installation
- Security patches are thoroughly tested

## 📞 Contact

For security-related questions or concerns:
- **Email**: security@agentchat.app
- **PGP Key**: Available upon request
- **Security Issues**: Report via email (do not use public issues)

## 🔗 Related Documentation

- [Architecture Documentation](docs/ARCHITECTURE.md) - Technical architecture and security design
- [API Documentation](docs/API.md) - API security considerations
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Security-related troubleshooting

---

**Note**: This security policy applies to AgentCHAT desktop application. For questions about third-party AI provider security, please contact the respective providers directly.

**Last Updated**: 2025-10-30
**Security Policy Version**: 1.0.0