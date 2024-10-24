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

// Increment user scan count
// Increment user scan count
exports.incrementScans = async (req, res) => {
  const userId = req.user.userId;  // Assuming JWT middleware sets req.user

  try {
    // Fetch the current scan count
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('scans')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return res.status(400).json({ message: 'Error fetching user data', fetchError });
    }

    // Increment the scan count
    const newScansCount = user.scans + 1;

    // Update the scan count in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ scans: newScansCount })
      .eq('id', userId);

    if (updateError) {
      return res.status(400).json({ message: 'Error updating scan count', updateError });
    }

    res.status(200).json({ message: 'Scan count incremented successfully' });
  } catch (err) {
    console.error('Error incrementing scan count:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addDiseaseToUser = async (req, res) => {
  const { disease } = req.body;
  const userId = req.user.userId;  // Assuming JWT middleware sets req.user

  try {
    // Fetch the current list of diseases
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('diseases')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      return res.status(400).json({ message: 'Error fetching user data', fetchError });
    }

    // Append the new disease to the list (or create a new list if none exists)
    const updatedDiseases = user.diseases ? [...user.diseases, disease] : [disease];

    // Update the user's disease list in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ diseases: updatedDiseases })
      .eq('id', userId);

    if (updateError) {
      return res.status(400).json({ message: 'Error updating diseases', updateError });
    }

    res.status(200).json({ message: 'Disease added successfully' });
  } catch (err) {
    console.error('Error updating diseases:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.incrementReports = async (req, res) => {
  const userId = req.user.userId;  // Assuming JWT middleware sets req.user

  try {
    // Fetch the current scan count
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('reports')
      .eq('id', userId)
      .single();

    if (fetchError) {
      return res.status(400).json({ message: 'Error fetching user data', fetchError });
    }

    // Increment the scan count
    const newReportsCount = user.reports + 1;

    // Update the scan count in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ reports: newReportsCount })
      .eq('id', userId);

    if (updateError) {
      return res.status(400).json({ message: 'Error updating reports count', updateError });
    }

    res.status(200).json({ message: 'Reports count incremented successfully' });
  } catch (err) {
    console.error('Error incrementing reports count:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  