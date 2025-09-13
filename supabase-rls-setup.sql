-- Activate Row Level Security on chat tables
ALTER TABLE public."ChatThread" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ChatMessage" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "read_threads_if_participant" ON public."ChatThread";
DROP POLICY IF EXISTS "create_threads_if_authorized" ON public."ChatThread";
DROP POLICY IF EXISTS "read_messages_if_participant" ON public."ChatMessage";
DROP POLICY IF EXISTS "insert_messages_if_participant" ON public."ChatMessage";

-- Policy 1: Users can only read threads they participate in
CREATE POLICY "read_threads_if_participant"
ON public."ChatThread" FOR SELECT
USING (
  -- Check if current user ID is in participants JSON array
  (participants::jsonb ? (current_setting('request.jwt.claims', true)::json->>'uid'))
);

-- Policy 2: Users can create threads (for cargo owners or quoters)
CREATE POLICY "create_threads_if_authorized"
ON public."ChatThread" FOR INSERT
WITH CHECK (
  -- Allow creation if user is in participants array
  (participants::jsonb ? (current_setting('request.jwt.claims', true)::json->>'uid'))
);

-- Policy 3: Users can only read messages from threads they participate in
CREATE POLICY "read_messages_if_participant"
ON public."ChatMessage" FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public."ChatThread" t
    WHERE t.id = "ChatMessage"."threadId"
      AND (t.participants::jsonb ? (current_setting('request.jwt.claims', true)::json->>'uid'))
  )
);

-- Policy 4: Users can only insert messages in threads they participate in
CREATE POLICY "insert_messages_if_participant"
ON public."ChatMessage" FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."ChatThread" t
    WHERE t.id = "threadId"
      AND (t.participants::jsonb ? (current_setting('request.jwt.claims', true)::json->>'uid'))
  )
);

-- Policy 5: Users can update threads they participate in (for lastMessageAt)
CREATE POLICY "update_threads_if_participant"
ON public."ChatThread" FOR UPDATE
USING (
  (participants::jsonb ? (current_setting('request.jwt.claims', true)::json->>'uid'))
);

-- Enable realtime for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE public."ChatThread";
ALTER PUBLICATION supabase_realtime ADD TABLE public."ChatMessage";