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

  static async findOne({ email, username }) {
    try {
      const { data: emailUser, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email?.toLowerCase())
        .maybeSingle();

      if (emailError && emailError.code !== 'PGRST116') throw emailError;
      if (emailUser) return emailUser;

      if (username) {
        const { data: usernameUser, error: usernameError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .maybeSingle();

        if (usernameError && usernameError.code !== 'PGRST116') throw usernameError;
        return usernameUser;
      }

      return null;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw error;
    }
  }

  static async comparePassword(enteredPassword, hashedPassword) {
    try {
      return await bcrypt.compare(enteredPassword, hashedPassword);
    } catch (error) {
      console.error('Password comparison error:', error);
      return false;
    }
  }
}

module.exports = User;
