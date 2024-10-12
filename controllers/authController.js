// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { supabase } = require('./supabaseClient');
const { data } = require('framer-motion/client');

// User signup
exports.signup = async (req, res) => {
    const { name, last_name, email, username, password, height, weight, sex } = req.body;
  
    try {
      // Check if email or username already exists
      const { data: existingUser, error: findUserError } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${email},username.eq.${username}`)
        .single();
  
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email or username already exists' });
      }
  
      if (findUserError && findUserError.code !== 'PGRST116') {
        return res.status(500).json({ error: 'Error checking user existence' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ 
            name, 
            last_name, 
            email, 
            username, 
            password: hashedPassword, 
            height, 
            weight, 
            sex 
        }])
        .select('*')  // Explicitly ask for the inserted data
        .single();    // Ensure it returns a single row
    

      // Log the entire Supabase response
      console.log('Supabase insert response:', { data: newUser, error: error });
 
      // Check if insert had an error
      if (error) {
        console.error('Error creating user:', error);  // Debugging
        return res.status(500).json({ error: 'Error creating user' });
      }

      // Log the newly created user object
      console.log('newUser:', newUser);
      
      // Generate a JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET);
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (err) {
      console.error('Internal server error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};


// User login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(400).json({ error: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Internal server error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
