# Extraction de Carte d'Identité — Frontend

Application React + Vite + Tailwind qui consomme le backend Spring Boot
`gemini_ocr_spring_ai` (endpoint `POST /gemini/process-image`).

## Installation

```bash
npm install
```

## Lancement (dev, port 5173)

```bash
npm run dev
```

Puis ouvrir http://localhost:5173

## Build production

```bash
npm run build
```

## Avant de lancer

Le backend Spring Boot doit tourner sur `http://localhost:8080` (ou modifier
`API_BASE_URL` dans `src/ExtractionCarteIdentite.jsx`) et autoriser le CORS
depuis `http://localhost:5173` :

```java
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/gemini")
public class GeminiApiController { ... }
```

Pensez aussi à augmenter la taille max d'upload dans `application.properties`
si vos images dépassent 1 Mo :

```properties
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```
