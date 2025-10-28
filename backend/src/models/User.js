const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, email, password }) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, role, created_at')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async findOne(query) {
    let supabaseQuery = supabase.from('users').select('*');

    if (query.email) {
      supabaseQuery = supabaseQuery.eq('email', query.email.toLowerCase());
    }
    if (query.username) {
      supabaseQuery = supabaseQuery.eq('username', query.username);
    }

    const { data, error } = await supabaseQuery.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;
