# Gestion Clinique

Application de gestion clinique avec Spring Boot, React, Tailwind CSS, JWT et Gemini pour l'extraction assistée des données d'une carte d'identité.

## Configuration backend

Les secrets ne sont plus stockés dans Git. Copier les variables de `backend/.env.example` dans les variables d'environnement de la machine qui lance Spring Boot.

Variables obligatoires :

- `GEMINI_API_KEY`
- `JWT_SECRET` : clé Base64 représentant au moins 32 octets
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DB_USERNAME`
- `DB_PASSWORD`

Exemple PowerShell :

```powershell
$env:GEMINI_API_KEY="..."
$env:JWT_SECRET="..."
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="..."
$env:DB_USERNAME="clinique"
$env:DB_PASSWORD="..."
cd backend
./mvnw spring-boot:run
```

## Configuration frontend

Copier `frontend/.env.example` vers `frontend/.env` et adapter :

```env
VITE_API_URL=http://localhost:8080
```

Puis :

```bash
cd frontend
npm ci
npm run dev
```

## Flux IA

1. Le secrétaire ou l'administrateur sélectionne une image depuis son ordinateur.
2. Le backend valide le type et la taille du fichier.
3. Gemini extrait les informations disponibles.
4. Les données sont pré-remplies dans le formulaire patient.
5. L'utilisateur vérifie et complète les informations.
6. Le patient est ensuite enregistré.

L'IA ne crée donc pas directement un patient en base sans validation humaine.
