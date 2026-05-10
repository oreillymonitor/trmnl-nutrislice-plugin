const axios = require('axios');

module.exports = async (req, res) => {
  const { district, school, meal_type } = req.query;

  if (!district || !school || !meal_type) {
    return res.status(400).json({ error: 'Missing parameters: district, school, and meal_type are required.' });
  }

  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  // If Saturday or Sunday, fetch the menu for the upcoming Monday to get next week's data
  if (dayOfWeek === 6 || dayOfWeek === 0) {
    const daysToAdd = dayOfWeek === 6 ? 2 : 1;
    now.setDate(now.getDate() + daysToAdd);
  }
  
  const currentDate = now.toISOString().split('T')[0].replace(/-/g, '/');
  const url = `https://${district}.api.nutrislice.com/menu/api/weeks/school/${school}/menu-type/${meal_type}/${currentDate}/?format=json`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    const formattedSchool = school.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const simplified = {
      school_name: data.school_name || formattedSchool || "School Menu",
      days: data.days
        .filter(day => day.menu_items && day.menu_items.length > 0)
        .map(day => {
          const mainFood = day.menu_items.find(item => item.food !== null);
          
          // Prioritize specific banner images over generic food images
          const specificImage = day.menu_items.find(item => item.image && item.image !== "")?.image;
          const genericImage = day.menu_items.find(item => item.food?.image_url && item.food.image_url !== "")?.food.image_url;
          const selectedImage = specificImage || genericImage || "";

          return {
            date: day.date,
            main: mainFood ? mainFood.food.name : "No Lunch",
            image: selectedImage,
            sides: day.menu_items
              .filter(item => item.food !== null && item.food.name !== (mainFood ? mainFood.food.name : ""))
              .map(item => item.food.name)
              .join(", ")
              .substring(0, 200) + (day.menu_items.filter(item => item.food !== null && item.food.name !== (mainFood ? mainFood.food.name : "")).map(item => item.food.name).join(", ").length > 200 ? "..." : "")
          };
        })
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(simplified);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch menu from Nutrislice.' });
  }
};
