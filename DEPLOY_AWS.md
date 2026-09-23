# Deploy CeylonCalling on AWS

This project can run as one Dockerized web service:

- `my-app` builds to static Vite files.
- `server` runs Express, connects to MongoDB Atlas, and serves `my-app/dist` in production.

## Recommended AWS Option: App Runner

1. Push this repository to GitHub.
2. In AWS, open **App Runner** and create a service.
3. Choose **Source code repository** or **Container registry**.
4. If using source code, set:
   - Runtime: Dockerfile
   - Dockerfile path: `Dockerfile`
   - Port: `5000`
5. Add these environment variables in App Runner:

```env
NODE_ENV=production
PORT=5000
DB_URL=mongodb+srv://...
SESSION_SECRET=use-a-long-random-secret
JWT_SECRET=use-a-long-random-secret
CLIENT_URL=https://your-app-runner-url-or-domain
EMAIL_HOST=...
EMAIL_PORT=...
EMAIL_USER=...
EMAIL_PASS=...
EMAIL_FROM=noreply@your-domain.com
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

6. Deploy.
7. After App Runner gives you the public URL, update `CLIENT_URL` to that exact URL and redeploy.

## Local Docker Check

From this folder:

```bash
docker build -t ceyloncalling .
docker run --env-file server/config/.env -p 5000:5000 ceyloncalling
```

Open:

```text
http://localhost:5000
```

## Important Notes

- Do not upload real `.env` files to GitHub. This repo's `.dockerignore` excludes them from Docker images.
- MongoDB Atlas must allow inbound connections from AWS. For a quick test you can allow `0.0.0.0/0`, then tighten it later.
- Because this app uses cookies/sessions, keep `CLIENT_URL` exactly matched to the browser URL.
- For a custom domain, add the domain in App Runner, then set `CLIENT_URL=https://your-domain.com`.
