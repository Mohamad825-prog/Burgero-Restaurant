// config/supabase.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing!');
    console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in .env');
    process.exit(1);
}

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