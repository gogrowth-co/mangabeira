-- Revoke public/anon EXECUTE on all three SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.page_exists(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;

-- page_exists and update_updated_at_column don't need to be called by regular authenticated users
REVOKE EXECUTE ON FUNCTION public.page_exists(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;