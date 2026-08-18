# Learniee Parent Dashboard

This is a responsive parent course-discovery dashboard called Learniee built using Next.js, TypeScript and Tailwind CSS. It includes basic parent authentication with session persistence, a protected dashboard, and a local JSON-based course API. Parents can search courses by name or subject, combine filters for grade, subject, price and teacher rating, sort the results and paginate through the courses. I kept the architecture simple without a database or external state-management libraries.

## Authentication

- Signup and login use Next.js Route Handlers.
- Users are stored in `data/users.json`.
- eg: {
    "id": "cc518c06-5f01-4516-b4cb-fde3610d347c",
    "name": "Risa Dias",
    "email": "risa#123@gmail.com",
    "password": "a962457eabec21a28621f2dbeb48c866038487448b00e79929e3ccb0d9e95687"
  }
- Courses are stored in `data/courses.json`.
- eg: {
    "id": 40,
    "name": "Java Problem Solving",
    "subject": "Programming",
    "grade": "Grade 8",
    "teacher": "Rohan Desai",
    "rating": 4.2,
    "price": 2600,
    "duration": "7 weeks",
    "description": "Practice programming logic and problem solving using Java with progressively challenging exercises."
  }
- Passwords are hashed with Node's built-in `crypto` module using sha256.
- A signed, HTTP-only cookie keeps the user logged in after refresh.
- `/dashboard` checks the session on the server and redirects to `/login` when unauthenticated.
- Logout removes the session cookie.

## Test

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

1. Open `/signup` and create an account.
2. You should be redirected to `/dashboard`.
3. Refresh the dashboard. Your name and email should still be visible.
4. Open a private/incognito window and visit `/dashboard`. You should be redirected to `/login`.
5. Log in with the account you created.
6. Click Logout and confirm you return to `/login`.
7. Try `/dashboard` again. It should redirect to `/login`.
8. Try signing up again with the same email. It should show an error.
9. Try logging in with a wrong password. It should show an error.


## Improvement:

For a production version, I would:
- Replace local JSON storage with a database such as PostgreSQL or MySQL.
- Use a production-grade authentication system with secure password hashing and session management.
- Add course details and enrollment functionality.
- Improve form validation and error handling.
- Add proper monitoring and logging for production environments.