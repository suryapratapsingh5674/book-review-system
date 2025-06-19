Book Review Platform
A full-stack book review platform. Users can browse, review, and rate books.

Key Features
Responsive UI: Adapts to all screen sizes.

Book Management: Browse, view details, and admin can add books.

Reviews: Read and submit book reviews.

User Profiles: Manage user information.

Robust APIs: RESTful endpoints for all data.

Technologies
Frontend: Next.js, TypeScript, React Context, Tailwind CSS.

Backend: Node.js, Express.js, PostgreSQL/MongoDB, Authentication (JWT).

Setup
Prerequisites
Node.js, npm/Yarn, Git, optional DB server.

Backend
cd backend

Configure backend/.env (DB, JWT_SECRET, Admin).

npm install

npm run dev (Runs on http://localhost:5000)

Frontend
cd ../frontend

Create frontend/.env.local with NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api.

npm install

npm run dev (Accessible at http://localhost:3000)

API Endpoints (Examples)
GET /api/books

GET /api/books/:id

POST /api/books/:id/reviews

POST /api/auth/login

Database Schema (Key Entities)
Books: id, title, author, genre, averageRating, coverImageUrl.

Reviews: id, bookId, userId, rating, comment.

Users: id, username, email, password, isAdmin.

