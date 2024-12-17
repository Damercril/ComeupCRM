## Send Invite Email Function

Cette Edge Function est déclenchée automatiquement via un webhook lorsqu'une nouvelle invitation est créée dans la table `workspace_invites`.

### Configuration requise

1. Configurer les variables d'environnement dans le projet Supabase :
   - `PUBLIC_APP_URL`: L'URL de votre application (ex: https://votre-app.com)

2. Activer l'envoi d'emails dans les paramètres de votre projet Supabase.

3. Créer le déclencheur de base de données :

```sql
create trigger on_invite_created
  after insert on workspace_invites
  for each row execute function supabase_functions.http_request(
    'send-invite',
    'POST',
    '{"Content-Type":"application/json"}',
    '{"record":{"id":"' || new.id || '","email":"' || new.email || '","workspace_id":"' || new.workspace_id || '","role":"' || new.role || '"}}'
  );
```

### Déploiement

```bash
supabase functions deploy send-invite
```