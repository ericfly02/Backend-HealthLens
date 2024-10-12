// controllers/userController.js
const userModel = require('../models/userModel');
const { supabase } = require('../controllers/supabaseClient');


// Function to get user details by ID
exports.getUserInfo = async (req, res) => {
  try {
    const userId = req.user.userId;  // req.user is assumed to be populated by the JWT middleware
    const { data: user, error } = await userModel.findUserById(userId);

    if (error || !user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// controllers/userController.js
exports.updateUser = async (req, res) => {
    const { name, last_name, email, username, height, weight, sex } = req.body;
    const userId = req.user.userId;  
  
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          name, 
          last_name, 
          email, 
          username, 
          height, 
          weight, 
          sex,
          updated_at: new Date()
        })
        .eq('id', userId);
  
      if (error) {
        return res.status(400).json({ message: 'Error updating user', error });
      }
  
      res.status(200).json({ message: 'User updated successfully', data });
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  