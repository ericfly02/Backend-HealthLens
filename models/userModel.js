const { supabase } = require('../controllers/supabaseClient');

// Create a new user
exports.createUser = async (userData) => {
  return await supabase.from('users').insert([userData]);
};

// Find a user by email
exports.findUserByEmail = async (email) => {
  return await supabase.from('users').select('*').eq('email', email).single();
};

// Find a user by ID, excluding the password field
exports.findUserById = async (id) => {
  return await supabase
    .from('users')
    .select('id, name, last_name, email, username, height, weight, sex, created_at, updated_at')
    .eq('id', id)
    .single();
};
