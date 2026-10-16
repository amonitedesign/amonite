# Contributing to Amonite CAD

Thank you for your interest in contributing to **Amonite**, the high-performance browser-based CAD/CAM Micro-SaaS.

## Architectural Segregation Guidelines
Please note that this repository is the **Public Core Repository**. As such, the following invariants are strictly enforced:
1. **Zero Auth / Zero Billing:** Do not commit authentication gateways, paywalls, database schemas, or billing routes here. These are reserved for the private enterprise vault.
2. **Client-Side First:** All geometric computing, math calculations, and coordinate transformations must execute client-side utilizing browser hardware acceleration.
3. **Privacy First:** Never introduce remote telemetry or external user tracking scripts.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd Amonite_CAD
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify types and linting:**
   ```bash
   npx tsc --noEmit
   npm run lint
   ```

## Pull Request Guidelines
- Write clean, type-safe TypeScript code (`strict: true`).
- Follow the industrial dark-mode design system.
- Preserve backward compatibility for STL, DXF, and SVG vector parsers.
- Submit pull requests against the `master` or `main` branch.

## Support & Questions
For architectural questions or enterprise inquiries, contact the core team at `amoniteadmin@gmail.com`.
