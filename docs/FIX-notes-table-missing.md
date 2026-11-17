# Fix: "Could not find the 'file_path' column of 'notes' in the schema cache"

## Problem Diagnosis
The `notes` table **does not exist** in your Supabase database. The frontend code is trying to insert data into a non-existent table.

## Root Cause
- Your Prisma schema (in `backend/prisma/schema.prisma`) doesn't have a `notes` model
- The frontend uses Supabase directly (bypassing Prisma)
- The `notes` table was never created in Supabase

## Solution: Create the Notes Table

### Step 1: Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Table Creation Script
Copy and paste the **ENTIRE contents** of the file `docs/create-notes-table.sql` into the SQL editor and click **Run**.

This script will:
- ✅ Create the `notes` table with all required columns including `file_path`
- ✅ Create the `note_upvotes` table for the upvote system
- ✅ Set up proper indexes for performance
- ✅ Enable Row Level Security (RLS)
- ✅ Create security policies for students and admins
- ✅ Create the `notes` storage bucket
- ✅ Set up storage access policies
- ✅ Add helper functions and triggers

### Step 3: Verify the Setup
After running the script, run these verification queries **one at a time**:

#### Verify the table exists:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'notes'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Expected result:** You should see 17 columns including:
- `id`, `title`, `description`, `subject`, `semester`, `course_code`
- `file_url`, `file_path` ← **This is the missing column**
- `file_type`, `file_size`, `uploaded_by`, `uploader_name`
- `status`, `reviewed_by`, `reviewed_at`, `rejection_reason`
- `downloads_count`, `upvotes_count`, `created_at`, `updated_at`

#### Verify the storage bucket exists:
```sql
SELECT id, name, public
FROM storage.buckets
WHERE id = 'notes';
```

**Expected result:** One row with `id='notes'`, `name='notes'`, `public=false`

### Step 4: Test the Upload Feature
1. Go to your app: `http://localhost:3000/notes/upload`
2. Fill out the form and upload a test file
3. The error should be **gone** and the upload should succeed

### Step 5: Verify the Data
Check that the note was inserted:
```sql
SELECT id, title, status, file_path, created_at
FROM public.notes
ORDER BY created_at DESC
LIMIT 5;
```

You should see your test upload with `status='PENDING_REVIEW'` and a `file_path` like `{user-id}/{timestamp}-filename.pdf`

## What Each Column Does

| Column | Purpose |
|--------|---------|
| `file_url` | Public URL to access the file (from Supabase Storage) |
| `file_path` | Internal storage path in the bucket (e.g., `user123/1234567890-notes.pdf`) |
| `status` | Approval status: `PENDING_REVIEW`, `APPROVED`, or `REJECTED` |
| `reviewed_by` | UUID of the admin who reviewed the note |
| `reviewed_at` | Timestamp when the note was approved/rejected |
| `rejection_reason` | Explanation provided by admin when rejecting |

## Common Issues After Setup

### Issue: "permission denied for table notes"
**Solution:** Make sure you're logged in as an authenticated user. The RLS policies require authentication.

### Issue: Storage upload fails
**Solution:** Check that the storage bucket was created:
- Go to **Storage** in Supabase Dashboard
- You should see a bucket named `notes`
- If not, create it manually: Click **New bucket**, name it `notes`, set Public = **OFF**

### Issue: Admin can't see pending notes
**Solution:** Verify your user has the correct role:
```sql
SELECT id, email, role FROM public.users WHERE email = 'your-admin-email@example.com';
```
The role should be `SYSTEM_ADMIN` or `DEPARTMENT_ADMIN`.

## Files Modified in This Implementation

- ✅ `src/services/notes.ts` - Updated to use `file_path` and new status values
- ✅ `src/services/adminNotes.ts` - New admin service for approval workflow
- ✅ `src/components/notes/UploadForm.tsx` - Updated to store `file_path`
- ✅ `src/components/admin/NoteReviewQueue.tsx` - New admin review UI
- ✅ `src/routes/admin.notes.tsx` - New admin route
- ✅ `src/types/index.ts` - Updated `StudyNote` interface
- ✅ `docs/create-notes-table.sql` - Complete table creation script

## Next Steps After Table Creation

1. **Test student upload** at `/notes/upload`
2. **Test admin review** at `/admin/notes`
3. **Approve a test note** and verify it appears in `/notes` browse list
4. **Test rejection** with a reason and verify the student sees it
