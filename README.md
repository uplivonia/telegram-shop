# Telegram Shop v8

- Clean UI with global styles.css
- Order detail page `/#order/<id>`
- JSON request logs with masking of secrets
- Deployment notes for Render & Vercel/CF Pages

## Deployment (quick)

### Backend on Render
- Start: `node server.js`
- Env: `PORT=4000`, `CORS_ORIGIN=https://your-frontend-domain`

### Frontend on Vercel/CF
- Build: `npm --prefix frontend run build`
- Output: `frontend/dist`
