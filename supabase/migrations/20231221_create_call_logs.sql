-- Create table if it doesn't exist
create table if not exists public.call_logs (
    id uuid default gen_random_uuid() primary key,
    date timestamp with time zone not null,
    status text not null,
    duration text not null,
    note text,
    callback_date timestamp with time zone,
    driver_id text not null,
    workspace_id uuid not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Enable RLS if not already enabled
alter table public.call_logs enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view their workspace call logs" on public.call_logs;
drop policy if exists "Users can create call logs in their workspace" on public.call_logs;

-- Create policies
create policy "Users can view their workspace call logs"
    on public.call_logs for select
    using (workspace_id::text = auth.jwt()->>'workspace_id');

create policy "Users can create call logs in their workspace"
    on public.call_logs for insert
    with check (workspace_id::text = auth.jwt()->>'workspace_id');

-- Add indexes (if they don't exist)
create index if not exists call_logs_workspace_id_idx on public.call_logs(workspace_id);
create index if not exists call_logs_driver_id_idx on public.call_logs(driver_id);
