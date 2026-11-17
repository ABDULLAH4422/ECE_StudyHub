# Supabase Setup Guide

## Database Schema Updates

Run these SQL commands in your Supabase SQL Editor (Dashboard → SQL Editor → New Query):

### 1. Add Approval Fields to study_notes Table

```sql
-- Add approval workflow columns
ALTER TABLE study_notes 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING_REVIEW',
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS file_path TEXT; -- Storage path

-- Add check constraint for status values
ALTER TABLE study_notes 
ADD CONSTRAINT status_check 
CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED'));

-- Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_notes_status ON study_notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_reviewed_by ON study_notes(reviewed_by);

-- Add comment for documentation
COMMENT ON COLUMN study_notes.status IS 'Note approval status: PENDING_REVIEW, APPROVED, REJECTED';
COMMENT ON COLUMN study_notes.file_path IS 'Path to file in Supabase Storage bucket';
```

### 2. Create Storage Bucket

Run this in Supabase SQL Editor:

```sql
-- Create notes bucket (if not exists via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', false)
ON CONFLICT (id) DO NOTHING;
```

**Or create via Dashboard:**
1. Go to **Storage** in left sidebar
2. Click **New bucket**
3. Name: `notes`
4. Public: **Disabled** (files require authentication)
5. Click **Create bucket**

### 3. Storage Security Policies

Run these policies in SQL Editor:

```sql
-- Allow authenticated users to upload notes
CREATE POLICY "Students can upload notes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'notes' AND
  (storage.foldername(name))[1] IN (
    SELECT semester FROM study_notes WHERE user_id = auth.uid()
  )
);

-- Allow users to read approved notes
CREATE POLICY "Anyone can view approved notes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes' AND
  EXISTS (
    SELECT 1 FROM study_notes 
    WHERE file_path = name AND status = 'APPROVED'
  )
);

-- Allow admins to read all notes (for review)
CREATE POLICY "Admins can view all notes"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'notes' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
  )
);

-- Allow admins to delete rejected notes
CREATE POLICY "Admins can delete notes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'notes' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
  )
);
```

### 4. Row Level Security Policies for study_notes

```sql
-- Enable RLS if not already enabled
ALTER TABLE study_notes ENABLE ROW LEVEL SECURITY;

-- Students can insert their own notes
CREATE POLICY "Students can create notes"
ON study_notes FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Students can view their own notes (any status)
CREATE POLICY "Students can view own notes"
ON study_notes FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Everyone can view approved notes
CREATE POLICY "Anyone can view approved notes"
ON study_notes FOR SELECT
TO authenticated
USING (status = 'APPROVED');

-- Admins can view all notes
CREATE POLICY "Admins can view all notes"
ON study_notes FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
  )
);

-- Admins can update notes (for approval/rejection)
CREATE POLICY "Admins can update notes"
ON study_notes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
  )
);

-- Admins can delete notes
CREATE POLICY "Admins can delete notes"
ON study_notes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('SYSTEM_ADMIN', 'DEPARTMENT_ADMIN')
  )
);
```

## Verification Steps

After running the SQL commands:

1. **Check columns exist:**
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'study_notes' 
AND column_name IN ('status', 'reviewed_by', 'reviewed_at', 'rejection_reason', 'file_path');
```

2. **Check bucket exists:**
```sql
SELECT * FROM storage.buckets WHERE id = 'notes';
```

3. **Check policies:**
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'study_notes';
```

## Next Steps

After running these SQL commands:
1. The database schema will be updated
2. Storage bucket will be created
3. Security policies will be in place
4. Ready to use the upload and approval features in the app
