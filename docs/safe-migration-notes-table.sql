-- ============================================================================
-- SAFE MIGRATION: Fix notes table and add missing columns/policies
-- This script is safe to run multiple times - it checks what exists first
-- ============================================================================

-- ============================================================================
-- STEP 1: Create or alter the notes table
-- ============================================================================

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    course_code TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    uploader_name TEXT NOT NULL,
    downloads_count INTEGER NOT NULL DEFAULT 0,
    upvotes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add missing columns if they don't exist (safe to run multiple times)
DO $$
BEGIN
    -- Add file_path column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'file_path'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN file_path TEXT;
    END IF;

    -- Add uploaded_by column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'uploaded_by'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN uploaded_by UUID;
    END IF;

    -- Add status column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN status TEXT NOT NULL DEFAULT 'PENDING_REVIEW';
    END IF;

    -- Add reviewed_by column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'reviewed_by'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN reviewed_by UUID;
    END IF;

    -- Add reviewed_at column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'reviewed_at'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN reviewed_at TIMESTAMPTZ;
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'notes' AND column_name = 'rejection_reason'
    ) THEN
        ALTER TABLE public.notes ADD COLUMN rejection_reason TEXT;
    END IF;
END $$;

-- Add status check constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'status_check' AND conrelid = 'public.notes'::regclass
    ) THEN
        ALTER TABLE public.notes
        ADD CONSTRAINT status_check
        CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED'));
    END IF;
END $$;

-- ============================================================================
-- STEP 2: Create indexes (safe - IF NOT EXISTS prevents duplicates)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_notes_status ON public.notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_uploaded_by ON public.notes(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_notes_reviewed_by ON public.notes(reviewed_by);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON public.notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_course_code ON public.notes(course_code);

-- ============================================================================
-- STEP 3: Add comments for documentation
-- ============================================================================

COMMENT ON TABLE public.notes IS 'Student-uploaded study notes with admin approval workflow';
COMMENT ON COLUMN public.notes.status IS 'Note approval status: PENDING_REVIEW, APPROVED, REJECTED';
COMMENT ON COLUMN public.notes.file_path IS 'Path to file in Supabase Storage bucket';
COMMENT ON COLUMN public.notes.reviewed_by IS 'UUID of admin who reviewed the note';
COMMENT ON COLUMN public.notes.reviewed_at IS 'Timestamp when the note was reviewed';
COMMENT ON COLUMN public.notes.rejection_reason IS 'Reason provided by admin for rejection';

-- ============================================================================
-- STEP 4: Create note_upvotes table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.note_upvotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT note_upvotes_unique UNIQUE (note_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_note_upvotes_note_id ON public.note_upvotes(note_id);
CREATE INDEX IF NOT EXISTS idx_note_upvotes_user_id ON public.note_upvotes(user_id);

-- ============================================================================
-- STEP 5: Enable Row Level Security
-- ============================================================================

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_upvotes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Drop existing policies (to avoid conflicts) and recreate them
-- ============================================================================

-- Drop existing notes policies if they exist
DROP POLICY IF EXISTS "Students can create notes" ON public.notes;
DROP POLICY IF EXISTS "Students can view own notes" ON public.notes;
DROP POLICY IF EXISTS "Anyone can view approved notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can update notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can delete notes" ON public.notes;

-- Drop existing note_upvotes policies if they exist
DROP POLICY IF EXISTS "Users can upvote notes" ON public.note_upvotes;
DROP POLICY IF EXISTS "Users can view upvotes" ON public.note_upvotes;
DROP POLICY IF EXISTS "Users can remove their upvotes" ON public.note_upvotes;

-- ============================================================================
-- STEP 7: Create RLS policies for notes table
-- ============================================================================

-- Policy: Students can insert their own notes
CREATE POLICY "Students can create notes"
ON public.notes FOR INSERT
TO authenticated
WITH CHECK (true);

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

-- Policy: Admins can view all notes
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

-- ============================================================================
-- STEP 8: Create RLS policies for note_upvotes table
-- ============================================================================

CREATE POLICY "Users can upvote notes"
ON public.note_upvotes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view upvotes"
ON public.note_upvotes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can remove their upvotes"
ON public.note_upvotes FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- ============================================================================
-- STEP 9: Create Storage bucket
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 10: Drop and recreate storage policies
-- ============================================================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Students can upload notes" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view approved notes files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all note files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete note files" ON storage.objects;

-- Create storage policies
CREATE POLICY "Students can upload notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes');

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

-- ============================================================================
-- STEP 11: Create helper functions
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_downloads(note_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.notes
    SET downloads_count = downloads_count + 1
    WHERE id = note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON public.notes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VERIFICATION: Show what was created
-- ============================================================================

-- Show all columns in notes table
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'notes'
AND table_schema = 'public'
ORDER BY ordinal_position;
