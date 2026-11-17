-- ============================================================================
-- COMPLETE NOTES TABLE SETUP FOR SUPABASE
-- Run this entire script in Supabase SQL Editor to create the notes system
-- ============================================================================

-- Step 1: Create the notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    course_code TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_path TEXT,  -- Storage bucket path
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by UUID,  -- References users table (nullable for demo users)
    uploader_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    reviewed_by UUID,  -- References users table
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    downloads_count INTEGER NOT NULL DEFAULT 0,
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraint for valid status values
    CONSTRAINT status_check CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED'))
);

-- Step 2: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notes_status ON public.notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_uploaded_by ON public.notes(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_notes_reviewed_by ON public.notes(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON public.notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_course_code ON public.notes(course_code);

-- Step 3: Add comments for documentation
COMMENT ON TABLE public.notes IS 'Student-uploaded study notes with admin approval workflow';
COMMENT ON COLUMN public.notes.status IS 'Note approval status: PENDING_REVIEW, APPROVED, REJECTED';
COMMENT ON COLUMN public.notes.file_path IS 'Path to file in Supabase Storage bucket';
COMMENT ON COLUMN public.notes.reviewed_by IS 'UUID of admin who reviewed the note';
COMMENT ON COLUMN public.notes.reviewed_at IS 'Timestamp when the note was reviewed';
COMMENT ON COLUMN public.notes.rejection_reason IS 'Reason provided by admin for rejection';

-- Step 4: Create note_upvotes join table
CREATE TABLE IF NOT EXISTS public.note_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure each user can upvote a note only once
    CONSTRAINT note_upvotes_unique UNIQUE (note_id, user_id)
);

-- Step 5: Create index on note_upvotes
CREATE INDEX IF NOT EXISTS idx_note_upvotes_note_id ON public.note_upvotes(note_id);
CREATE INDEX IF NOT EXISTS idx_note_upvotes_user_id ON public.note_upvotes(user_id);

-- Step 6: Enable Row Level Security on notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for notes table

-- Policy: Students can insert their own notes
CREATE POLICY "Students can create notes"
ON public.notes FOR INSERT
TO authenticated
WITH CHECK (true);  -- Allow all authenticated users to upload

-- Policy: Students can view their own notes (any status)
CREATE POLICY "Students can view own notes"
ON public.notes FOR SELECT
TO authenticated
USING (uploaded_by = auth.uid());

-- Policy: Everyone can view approved notes
CREATE POLICY "Anyone can view approved notes"
ON public.notes FOR SELECT
TO authenticated
USING (status = 'APPROVED');

-- Policy: Admins can view all notes (check if users table exists first)
-- Note: Adjust this policy based on your actual users table structure
CREATE POLICY "Admins can view all notes"
ON public.notes FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
    )
);

-- Policy: Admins can update notes (for approval/rejection)
CREATE POLICY "Admins can update notes"
ON public.notes FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
    )
);

-- Policy: Admins can delete notes
CREATE POLICY "Admins can delete notes"
ON public.notes FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
    )
);

-- Step 8: Enable RLS on note_upvotes table
ALTER TABLE public.note_upvotes ENABLE ROW LEVEL SECURITY;

-- Step 9: Create RLS policies for note_upvotes

-- Policy: Users can insert their own upvotes
CREATE POLICY "Users can upvote notes"
ON public.note_upvotes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can view all upvotes (to check if they've upvoted)
CREATE POLICY "Users can view upvotes"
ON public.note_upvotes FOR SELECT
TO authenticated
USING (true);

-- Policy: Users can delete their own upvotes
CREATE POLICY "Users can remove their upvotes"
ON public.note_upvotes FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Step 10: Create Storage bucket for notes
-- Run this to create the bucket (or create it via Supabase Dashboard)
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', false)
ON CONFLICT (id) DO NOTHING;

-- Step 11: Create Storage policies for notes bucket

-- Policy: Allow authenticated users to upload notes
CREATE POLICY "Students can upload notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes');

-- Policy: Allow users to read approved notes
CREATE POLICY "Anyone can view approved notes files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'notes' AND
    EXISTS (
        SELECT 1 FROM public.notes
        WHERE file_path = name AND status = 'APPROVED'
    )
);

-- Policy: Allow admins to read all notes (for review)
CREATE POLICY "Admins can view all note files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'notes' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
    )
);

-- Policy: Allow admins to delete notes
CREATE POLICY "Admins can delete note files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'notes' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid()
        AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
    )
);

-- Step 12: Create helper function to increment downloads (optional but recommended)
CREATE OR REPLACE FUNCTION public.increment_downloads(note_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.notes
    SET downloads_count = downloads_count + 1
    WHERE id = note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 13: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after the above script to verify everything was created correctly
-- ============================================================================

-- Verify table exists and check columns
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'notes'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verify indexes exist
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'notes'
AND schemaname = 'public';

-- Verify RLS policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('notes', 'note_upvotes')
ORDER BY tablename, policyname;

-- Verify storage bucket exists
SELECT id, name, public
FROM storage.buckets
WHERE id = 'notes';

-- Verify storage policies exist
SELECT policyname, definition
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects';

-- Test insert (should work for authenticated users)
-- Uncomment to test:
-- INSERT INTO public.notes (title, subject, semester, course_code, file_url, file_type, file_size, uploader_name)
-- VALUES ('Test Note', 'Mathematics', '1', 'ECE 1101', 'https://example.com/test.pdf', 'pdf', 1024, 'Test User');
