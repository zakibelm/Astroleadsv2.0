# Test des Edge Functions - AstroLeads

## Test 1 : verify-email ✉️

```powershell
curl -i --location --request POST 'https://sxivnxnudvjhljpsmwpz.supabase.co/functions/v1/verify-email' `
  --header 'Authorization: Bearer sb_publishable_dFmVeMiKclabnPmaEaLRCQ_5JpRBKqN' `
  --header 'Content-Type: application/json' `
  --data '{\"email\":\"test@example.com\"}'
```

**Résultat attendu :** HTTP 200 + JSON avec `isValid`, `email`, `message`

---

## Test 2 : fetch-location 🌍

```powershell
curl -i --location --request POST 'https://sxivnxnudvjhljpsmwpz.supabase.co/functions/v1/fetch-location' `
  --header 'Authorization: Bearer sb_publishable_dFmVeMiKclabnPmaEaLRCQ_5JpRBKqN' `
  --header 'Content-Type: application/json' `
  --data '{\"latitude\":45.5017,\"longitude\":-73.5673}'
```

**Résultat attendu :** HTTP 200 + JSON avec `address`, `city`, `country`

---

## Test 3 : fetch-news 📰

```powershell
curl -i --location --request POST 'https://sxivnxnudvjhljpsmwpz.supabase.co/functions/v1/fetch-news' `
  --header 'Authorization: Bearer sb_publishable_dFmVeMiKclabnPmaEaLRCQ_5JpRBKqN' `
  --header 'Content-Type: application/json' `
  --data '{\"keywords\":\"technology\",\"limit\":5}'
```

**Résultat attendu :** HTTP 200 + JSON avec `articles`, `totalResults`

---

## ✅ Checklist de Vérification

Cochez après chaque test réussi :

- [ ] verify-email retourne HTTP 200
- [ ] fetch-location retourne HTTP 200
- [ ] fetch-news retourne HTTP 200
- [ ] Dashboard Supabase montre 3 functions
- [ ] Aucune erreur dans les logs Supabase

**Si tous les tests passent → ✅ DÉPLOIEMENT RÉUSSI !** 🎊
