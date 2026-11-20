# Live Demo Recording Guide

The included `Output/demo-walkthrough.mp4` is a visual walkthrough of the API sequence. It is not a screen recording of a live server or Postman session. Record the real workflow below after starting MongoDB and the API, then replace/add your own capture if the internship evaluator specifically requires live evidence.

## Recommended 2–3 minute live recording
1. Show the project folder and `.env` configured locally (keep the secret value hidden).
2. Start the API with `npm run dev`; show the MongoDB connection and listening message.
3. Open the imported Postman collection.
4. Run health check and signup; show `201 Created`.
5. Show the MongoDB user document with `passwordHash` only; do not reveal any real password or production data.
6. Run login; show `200 OK` and the JWT field (blur/crop the token before sharing publicly).
7. Call `/api/users/me` with the Bearer token; show `200 OK` and the public profile.
8. Call `/api/users/me` without a token; show `401 Unauthorized`.
9. Try a wrong password and duplicate email; show `401` and `409`.
10. End with the test summary from `npm test`.

## Recording options
- Windows: press `Win + Alt + R` to start/stop Xbox Game Bar recording, or use OBS Studio.
- Keep the terminal and Postman readable. Do not show `.env` secret values or full JWTs.
