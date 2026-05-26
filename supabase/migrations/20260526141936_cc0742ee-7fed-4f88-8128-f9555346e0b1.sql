
-- Fix search_path on set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Restrict EXECUTE on SECURITY DEFINER functions (still callable from server with service_role)
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;
-- We still need RLS policies to call has_role; policies run as definer, so this is fine.
-- Re-grant to authenticated for use inside RLS policies (policies execute as the calling role).
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Replace broad storage SELECT with read-by-path (clients fetch by exact URL, no listing)
DROP POLICY IF EXISTS "Downloads bucket public read" ON storage.objects;
DROP POLICY IF EXISTS "Products bucket public read" ON storage.objects;
-- Public buckets serve files by URL even without a SELECT policy. No replacement needed for read.
