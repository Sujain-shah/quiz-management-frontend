# Quiz Platform Frontend

This is the React frontend for the Quiz Management & Online Assessment Platform.

## Run

1. Open a terminal in this folder.
2. Run:

```bash
npm install
npm run dev
```

3. Open the URL Vite prints, normally:
   http://localhost:5173

The Vite development server proxies `/api` requests to:

http://localhost:5000

So keep the backend running with:

```bash
node server.js
```

## Important

The frontend expects the backend endpoints created during the project work, including:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/quizzes/published
- GET /api/quizzes/:id
- POST /api/quizzes/:quizId/start
- POST /api/attempts/:attemptId/answers
- POST /api/attempts/:attemptId/submit
- GET /api/attempts/:attemptId
- GET /api/attempts/:attemptId/result
- GET /api/attempts/:attemptId/detailed-result
- Admin quiz/category/user endpoints used by the Admin pages.

If a backend endpoint returns a different JSON property name, only `src/api.js` or the corresponding page may need a small adjustment.

## Note about quiz attempt refresh

The backend start endpoint currently returns questions together with a newly-created attempt. The attempt page therefore assumes the start response supplies questions. For a production-grade refresh-safe implementation, add a backend endpoint that returns the questions for an existing attempt without creating another attempt, then point `QuizAttempt.jsx` to that endpoint.