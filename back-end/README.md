## Backend Features

The backend of **DocSync** is a scalable and secure API built with Express.js, integrated with MongoDB, and designed to support real-time collaborative document editing.

### Authentication

* User registration with:

  * Full name, email, avatar, and password
  * Email format validation and password strength enforcement
  * Duplicate email prevention
  * Password hashing using bcrypt
* User login with:

  * Email/password verification
  * JSON Web Token (JWT) generation for session management
* Authentication middleware:

  * Supports both `Authorization: Bearer <token>` and custom `token` headers
  * Decodes and attaches user identity to requests

### Document Management

* Create new documents with title and content
* Retrieve:

  * All documents created by the authenticated user
  * Documents shared with the authenticated user
* Update document content:

  * Allowed for owners and users with `editor` access
* Delete documents:

  * Restricted to document owners only

### Sharing and Permissions

* Share documents with other registered users by email
* Assign roles: `viewer` or `editor`
* Enforce role-based access control:

  * `editor`: can edit
  * `viewer`: read-only access
* Prevent duplicate sharing and allow role updates

### Authorization and Access Control

* Secure all document routes using JWT-based authentication
* Enforce ownership checks on sensitive operations such as delete and share
* Restrict editing to authorized roles only

### Real-Time Collaboration

* Integrated Socket.IO for real-time document editing
* Join document-specific rooms
* Broadcast and receive text updates instantly among connected users

### Security and Production Readiness

* Uses security-focused middleware: `helmet`, `xss-clean`, `hpp`, `express-mongo-sanitize`
* Rate limiting to protect against brute-force attacks
* CORS support and large payload handling with body size limits
* Clean MVC folder structure with modular controllers, services, models, and middleware

### Deployment

* Backend is deployed on [Render](https://render.com) at:
  **[https://docsyncbackend.onrender.com](https://docsyncbackend.onrender.com)**
* Continuous deployment is enabled via GitHub CI/CD integration, automatically redeploying on push to the main branch