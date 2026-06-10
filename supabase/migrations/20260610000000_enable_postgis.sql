-- Phase 0: enable PostGIS for proximity matching (artisan <-> request distance scoring)
create extension if not exists postgis with schema extensions;
