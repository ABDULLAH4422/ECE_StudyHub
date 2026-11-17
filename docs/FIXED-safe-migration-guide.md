# FIXED: Safe Migration for Notes Table

## Problem
The original SQL script failed because it tried to create an index on `reviewed_by` column before verifying the column existed in a partially-created table.

## Solution: Run the Safe Migration Script

### Step 1: Run the Safe Migration
Open **Supabase Dashboard** → **SQL Editor** → **New Query**

Copy and paste **ALL** of this file:
```
docs/safe-migration-notes-table.sql
```

Click **RUN**

### Why This Script is Safe
- ✅ Uses `IF NOT EXISTS` checks for tables and columns
- ✅ Uses `DO $$ ... END $$` blocks to conditionally add columns
- ✅ Drops and recreates policies (avoiding duplicates)
- ✅ Safe to run multiple times
- ✅ Won't damage existing data
- ✅ Adds missing columns to partially-created tables

### What This Script Does

1. **Creates or fixes the `notes` table** with all required columns:
   - Basic info: id, title, description, subject, semester, course_code
   - Files: file_url, **file_path**, file_type, file_size
   - Users: uploaded_by, uploader_name
   - Approval: status, reviewed_by, reviewed_at, rejection_reason
   - Metrics: downloads_count, upvotes_count
   - Timestamps: created_at, updated_at

2. **Creates all indexes** for performance

3. **Creates `note_upvotes` table** for upvote functionality

4. **Enables Row Level Security (RLS)**

5. **Creates all security policies** for students and admins

6. **Creates storage bucket** named `notes`

7. **Creates storage policies** for file access

8. **Creates helper functions** (increment_downloads, update_updated_at)

### Step 2: Verify Success
After running the script, you should see output showing all columns in the notes table. Look for:
- ✅ **file_path** column (TEXT, nullable)
- ✅ **reviewed_by** column (UUID, nullable)
- ✅ **reviewed_at** column (TIMESTAMPTZ, nullable)
- ✅ **rejection_reason** column (TEXT, nullable)
- ✅ **status** column (TEXT, default 'PENDING_REVIEW')

### Step 3: Test the Upload
1. Go to your app: `http://localhost:3000/notes/upload`
2. Fill out the form and upload a test file
3. The error should be **GONE** ✅

### Step 4: Check the Data
Run this query to see your upload:
```sql
SELECT
    id,
    title,
    status,
    file_path,
    uploaded_by,
    created_at
FROM public.notes
ORDER BY created_at DESC
LIMIT 5;
```

You should see:
- Your uploaded note
- `status = 'PENDING_REVIEW'`
- `file_path` populated (e.g., `user-id/timestamp-filename.pdf`)

### Step 5: Test Admin Review
1. Go to: `http://localhost:3000/admin/notes`
2. You should see your pending note in the review queue
3. Try approving it

## What Was Wrong with the Original Script?

The original script had this sequence:
1. `CREATE TABLE IF NOT EXISTS` (Step 1)
2. `CREATE INDEX ... ON notes(reviewed_by)` (Step 2)

**Problem:** If Step 1 partially failed or the table existed without all columns, Step 2 would fail with "column reviewed_by does not exist".

**Fix:** The new script:
1. Creates the basic table first
2. Uses conditional logic (`DO $$ ... END $$`) to add each column only if missing
3. Only creates indexes after all columns are guaranteed to exist

## If You Still Get Errors

### Error: "relation public.notes already exists"
This is OK - the script handles this with `IF NOT EXISTS`. Continue to the next step.

### Error: "policy already exists"
This is why we `DROP POLICY IF EXISTS` first. If you see this, the script is working correctly.

### Error: "column already exists"
The `DO $$ ... END $$` blocks prevent this. If you see this, it means the conditional check didn't work. Try running just the column additions one at a time.

### Error: "permission denied"
Make sure you're logged into Supabase as the database owner or have sufficient privileges.

## Next Steps After Success

1. ✅ Upload feature at `/notes/upload` should work
2. ✅ Admin review at `/admin/notes` should show pending notes
3. ✅ After approval, notes appear in `/notes` browse list
4. ✅ Students can see their upload status in "My Uploads" (when implemented)

## Files Reference
- **Migration Script:** `docs/safe-migration-notes-table.sql` (Run this!)
- **Diagnostic Script:** `docs/diagnostic-notes-table.sql` (Optional - check current state)
- **Original Script:** `docs/create-notes-table.sql` (Don't use - has the bug)
