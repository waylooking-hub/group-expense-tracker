-- Group Expense Tracker — Database Schema
-- Run this in Supabase SQL Editor

-- Groups table
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  pin_hash text not null,
  default_currency text not null default 'PLN',
  created_at timestamptz default now()
);

-- Members table
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Expenses table
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  paid_by uuid not null references members(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'PLN',
  description text not null,
  receipt_url text,
  split_between uuid[] default null,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_members_group_id on members(group_id);
create index if not exists idx_expenses_group_id on expenses(group_id);
create index if not exists idx_expenses_paid_by on expenses(paid_by);

-- Disable RLS (simple app with PIN-based access, no Supabase Auth)
alter table groups enable row level security;
alter table members enable row level security;
alter table expenses enable row level security;

-- Allow all operations via anon key (PIN verification happens in API layer)
create policy "Allow all on groups" on groups for all using (true) with check (true);
create policy "Allow all on members" on members for all using (true) with check (true);
create policy "Allow all on expenses" on expenses for all using (true) with check (true);

-- Storage: Create 'receipts' bucket in Supabase Dashboard
-- Settings: Public bucket, allow image uploads
