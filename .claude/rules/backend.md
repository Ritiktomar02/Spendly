# Backend Rules

- Use Node.js + Express.js.
- Use ES Modules.
- Keep `server.js` as the application entry point.
- Keep database connection logic in `config/db.js`.
- Use this flow:

`Route → Controller → Model → Database`

- Create controllers, routes, models, and middleware only when required.
- Keep API responses consistent and understandable.
- Validate user input before processing it.
- Handle errors properly.
- Do not put unnecessary business logic inside routes.
- Do not over-engineer the backend.