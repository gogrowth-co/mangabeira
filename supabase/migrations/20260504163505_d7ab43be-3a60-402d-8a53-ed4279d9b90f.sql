-- Revoke PUBLIC (default) EXECUTE from all three functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.page_exists(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;

-- Re-grant has_role to authenticated (needed for RLS policies and edge function auth checks)
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;