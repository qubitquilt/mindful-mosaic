# **Security**

* **Authentication:** Handled by NextAuth.js, which provides CSRF protection, secure cookie management, and standard OAuth 2.0 flows.
* **Authorization:** All API endpoints must be protected and will only operate on data owned by the authenticated user, enforced by checking userId in all Prisma queries.
* **Data Encryption:** The requirement for encryption at rest will be fulfilled by filesystem-level encryption on the host server. The application logic does not need to handle encryption itself.
* **Secrets Management:** All secrets (database URLs, NEXTAUTH\_SECRET, SSO provider keys) must be managed via environment variables and never hardcoded.
