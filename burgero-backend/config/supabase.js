const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing!');
    console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in environment variables');

    // Create a mock supabase client for development
    const mockSupabase = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: null }),
            insert: () => Promise.resolve({ data: [], error: null }),
            update: () => Promise.resolve({ data: [], error: null }),
            delete: () => Promise.resolve({ error: null }),
            eq: () => ({
                select: () => Promise.resolve({ data: [], error: null }),
                update: () => Promise.resolve({ data: [], error: null }),
                delete: () => Promise.resolve({ error: null }),
                single: () => Promise.resolve({ data: null, error: null })
            }),
            single: () => Promise.resolve({ data: null, error: null })
        })
    };

    module.exports = {
        supabase: mockSupabase,
        testConnection: async () => {
            console.log('⚠️ Using mock Supabase client');
            return true;
        }
    };
} else {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: false
        }
    });

    // Test connection
    async function testConnection() {
        try {
            const { data, error } = await supabase
                .from('menu_items')
                .select('count')
                .limit(1);

            if (error) {
                console.error('❌ Failed to connect to Supabase:', error.message);
                return false;
            }

            console.log('✅ Successfully connected to Supabase!');
            return true;
        } catch (error) {
            console.error('❌ Connection error:', error.message);
            return false;
        }
    }

    module.exports = { supabase, testConnection };
}