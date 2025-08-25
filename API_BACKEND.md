# Fleetopia API (backend) – Repository separat

Acest proiect UI funcționează împreună cu backend-ul dintr-un repo separat:

- Repo API: https://github.com/Cosmln23/fleetopia-api
- URL API (exemplu dev): http://localhost:4000
- Config UI: setați `NEXT_PUBLIC_API_BASE_URL` în `.env.local`

Integrare recomandată:
- Auth: JWT/Supabase (header `Authorization: Bearer <token>`)
- CORS: permite domeniul UI în API
- Tipuri comune: generate din OpenAPI/Swagger sau pachet privat
