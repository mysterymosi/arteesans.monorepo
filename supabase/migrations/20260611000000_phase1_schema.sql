-- Phase 1: core schema, RLS, and seed data

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'artisan', 'admin');
create type public.user_status as enum ('active', 'suspended', 'deleted');
create type public.verification_status as enum ('pending', 'approved', 'rejected', 'more_info');
create type public.availability as enum (
  'full_time',
  'part_time',
  'weekends_only',
  'flexible',
  'on_demand'
);
create type public.urgency_level as enum ('emergency', 'urgent', 'normal', 'flexible');
create type public.request_status as enum (
  'submitted',
  'matching',
  'matched',
  'confirmed',
  'accepted',
  'on_the_way',
  'arrived',
  'in_progress',
  'completed',
  'cancelled',
  'disputed'
);

-- ---------------------------------------------------------------------------
-- Users (extends auth.users)
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role,
  first_name text,
  last_name text,
  phone text,
  email text,
  profile_photo_url text,
  status public.user_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_role_idx on public.users (role);
create index users_email_idx on public.users (email);

-- ---------------------------------------------------------------------------
-- Service categories
-- ---------------------------------------------------------------------------
create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  starting_price_min numeric(12, 2),
  starting_price_max numeric(12, 2),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Customer profiles
-- ---------------------------------------------------------------------------
create table public.customer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  default_address_id uuid,
  total_bookings int not null default 0,
  average_rating_given numeric(3, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Artisan profiles
-- ---------------------------------------------------------------------------
create table public.artisan_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  primary_skill_category_id uuid references public.service_categories (id),
  additional_skill_category_ids uuid[] not null default '{}',
  years_experience text,
  bio text,
  state text,
  city_lga text,
  address text,
  location geography (point, 4326),
  availability public.availability,
  verification_status public.verification_status not null default 'pending',
  average_rating numeric(3, 2) not null default 0,
  completed_jobs int not null default 0,
  cancellation_rate numeric(5, 4) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index artisan_profiles_location_idx on public.artisan_profiles using gist (location);
create index artisan_profiles_verification_idx on public.artisan_profiles (verification_status);

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city_lga text,
  state text not null,
  location geography (point, 4326),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses (user_id);
create index addresses_location_idx on public.addresses using gist (location);

alter table public.customer_profiles
  add constraint customer_profiles_default_address_fkey
  foreign key (default_address_id) references public.addresses (id) on delete set null;

-- ---------------------------------------------------------------------------
-- Service requests
-- ---------------------------------------------------------------------------
create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.users (id) on delete restrict,
  category_id uuid not null references public.service_categories (id),
  description text not null,
  urgency public.urgency_level not null default 'normal',
  preferred_time timestamptz,
  budget numeric(12, 2),
  address text not null,
  location geography (point, 4326),
  status public.request_status not null default 'submitted',
  assigned_artisan_id uuid references public.users (id) on delete set null,
  media_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index service_requests_customer_idx on public.service_requests (customer_id);
create index service_requests_status_idx on public.service_requests (status);
create index service_requests_assigned_artisan_idx on public.service_requests (assigned_artisan_id);
create index service_requests_location_idx on public.service_requests using gist (location);

-- ---------------------------------------------------------------------------
-- Verification documents
-- ---------------------------------------------------------------------------
create table public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  artisan_profile_id uuid not null references public.artisan_profiles (id) on delete cascade,
  doc_type text not null,
  storage_path text not null,
  file_name text,
  uploaded_at timestamptz not null default now()
);

create index verification_documents_artisan_idx on public.verification_documents (artisan_profile_id);

-- ---------------------------------------------------------------------------
-- Admin actions (audit trail)
-- ---------------------------------------------------------------------------
create table public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.users (id) on delete restrict,
  action_type text not null,
  entity_type text not null,
  entity_id uuid not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index admin_actions_entity_idx on public.admin_actions (entity_type, entity_id);

-- ---------------------------------------------------------------------------
-- Push tokens
-- ---------------------------------------------------------------------------
create table public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  expo_push_token text not null,
  device_name text,
  platform text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, expo_push_token)
);

create index push_tokens_user_idx on public.push_tokens (user_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_approved_artisan()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.artisan_profiles ap
    where ap.user_id = auth.uid()
      and ap.verification_status = 'approved'
  );
$$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

create trigger customer_profiles_updated_at
  before update on public.customer_profiles
  for each row execute function public.handle_updated_at();

create trigger artisan_profiles_updated_at
  before update on public.artisan_profiles
  for each row execute function public.handle_updated_at();

create trigger service_requests_updated_at
  before update on public.service_requests
  for each row execute function public.handle_updated_at();

create trigger push_tokens_updated_at
  before update on public.push_tokens
  for each row execute function public.handle_updated_at();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.artisan_profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.service_categories enable row level security;
alter table public.service_requests enable row level security;
alter table public.verification_documents enable row level security;
alter table public.admin_actions enable row level security;
alter table public.push_tokens enable row level security;

-- users
create policy users_select_own on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy users_insert_own on public.users
  for insert to authenticated
  with check (id = auth.uid());

create policy users_update_own on public.users
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Public artisan fields for matched artisans (customers see assigned artisan)
create policy users_select_matched_artisan on public.users
  for select to authenticated
  using (
    role = 'artisan'
    and exists (
      select 1
      from public.service_requests sr
      where sr.customer_id = auth.uid()
        and sr.assigned_artisan_id = users.id
    )
  );

-- service_categories (read-only for authenticated users)
create policy service_categories_select on public.service_categories
  for select to authenticated
  using (is_active = true or public.is_admin());

create policy service_categories_admin_all on public.service_categories
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- customer_profiles
create policy customer_profiles_select_own on public.customer_profiles
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy customer_profiles_insert_own on public.customer_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

create policy customer_profiles_update_own on public.customer_profiles
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- artisan_profiles
create policy artisan_profiles_select_own on public.artisan_profiles
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy artisan_profiles_select_matched on public.artisan_profiles
  for select to authenticated
  using (
    verification_status = 'approved'
    and exists (
      select 1
      from public.service_requests sr
      where sr.customer_id = auth.uid()
        and sr.assigned_artisan_id = artisan_profiles.user_id
    )
  );

create policy artisan_profiles_insert_own on public.artisan_profiles
  for insert to authenticated
  with check (user_id = auth.uid());

create policy artisan_profiles_update_own on public.artisan_profiles
  for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- addresses
create policy addresses_own on public.addresses
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- service_requests
create policy service_requests_customer_select on public.service_requests
  for select to authenticated
  using (customer_id = auth.uid() or public.is_admin());

create policy service_requests_artisan_select on public.service_requests
  for select to authenticated
  using (
    assigned_artisan_id = auth.uid()
    and public.is_approved_artisan()
  );

create policy service_requests_customer_insert on public.service_requests
  for insert to authenticated
  with check (
    customer_id = auth.uid()
    and public.current_user_role() = 'customer'
  );

create policy service_requests_customer_update on public.service_requests
  for update to authenticated
  using (customer_id = auth.uid() or public.is_admin())
  with check (customer_id = auth.uid() or public.is_admin());

-- verification_documents
create policy verification_documents_own on public.verification_documents
  for all to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.artisan_profiles ap
      where ap.id = verification_documents.artisan_profile_id
        and ap.user_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.artisan_profiles ap
      where ap.id = verification_documents.artisan_profile_id
        and ap.user_id = auth.uid()
    )
  );

-- admin_actions (admin read/write only via service role in practice; allow admin select/insert)
create policy admin_actions_admin on public.admin_actions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- push_tokens
create policy push_tokens_own on public.push_tokens
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Seed service categories (PRD section 13)
-- ---------------------------------------------------------------------------
insert into public.service_categories (slug, name, starting_price_min, starting_price_max, sort_order)
values
  ('plumbing', 'Plumbing', 3000, 25000, 1),
  ('electrical', 'Electrical', 3500, 30000, 2),
  ('carpentry', 'Carpentry', 4000, 35000, 3),
  ('cleaning', 'Cleaning', 2500, 15000, 4),
  ('driving', 'Driving', 5000, 40000, 5),
  ('general-repairs', 'General Repairs', 3000, 20000, 6),
  ('hair-styling', 'Hair Styling', 2000, 12000, 7);
