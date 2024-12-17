import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ylnvzqazqtrbnorispha.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsbnZ6cWF6cXRyYm5vcmlzcGhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NjczMzAsImV4cCI6MjA0ODA0MzMzMH0.f6KPCpn_TJLJICVdY2tCknMY8YX4a6P9RpcwAY6kjCE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
