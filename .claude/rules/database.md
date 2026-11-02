# Database Rules

- Use MongoDB with Mongoose.
- Keep MongoDB connection logic in `backend/config/db.js`.
- Keep schemas/models in `backend/models/`.
- Use Mongoose validation where appropriate.
- Do not create models before the related feature requires them.
- Do not store sensitive information unnecessarily.
- Use environment variables for database credentials.
- Never hardcode MongoDB credentials.
- Keep database operations simple and readable.