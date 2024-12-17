-- Enable the pg_net extension
create extension if not exists pg_net with schema extensions;

-- Create the trigger function
create or replace function public.handle_new_invite()
returns trigger as $$
begin
  perform
    net.http_post(
      url := 'https://<project-ref>.functions.supabase.co/send-invite',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}',
      body := json_build_object(
        'record', json_build_object(
          'id', NEW.id,
          'email', NEW.email,
          'workspace_id', NEW.workspace_id,
          'role', NEW.role
        )
      )::text
    );
  return NEW;
end;
$$ language plpgsql security definer;

-- Create the trigger
create trigger on_invite_created
  after insert on public.workspace_invites
  for each row execute function public.handle_new_invite();