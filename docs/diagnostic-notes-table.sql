-- ============================================================================
-- DIAGNOSTIC: Check current state of notes table
-- Run this first to see what exists
-- ============================================================================

-- Check if notes table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'notes'
) as notes_table_exists;

-- If table exists, show all columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'notes'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check existing indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'notes'
AND schemaname = 'public';

-- Check existing policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'notes'
AND schemaname = 'public';

-- Check if note_upvotes table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'note_upvotes'
) as note_upvotes_table_exists;

-- Check if storage bucket exists
SELECT id, name, public
FROM storage.buckets
WHERE id = 'notes';
