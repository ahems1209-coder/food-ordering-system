import Food from "../models/Food.js"; // 👈 CRITICAL: Must have .js extension

// @desc    Get all food items
// @route   GET /api/foods
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new food item (Admin Only)
// @route   POST /api/foods
export const addFood = async (req, res) => {
  try {
    const { name, price, image, description, category, isVeg } = req.body;
    
    const food = new Food({
      name,
      price,
      image,
      description,
      category,
      isVeg,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item (Admin Only)
// @route   DELETE /api/foods/:id
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      await Food.findByIdAndDelete(req.params.id);
      res.json({ message: "Food item removed" });
    } else {
      res.status(404).json({ message: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a food item (Admin Only)
// @route   PATCH /api/foods/:id
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (food) {
      if (req.body.isAvailable !== undefined) {
        food.isAvailable = req.body.isAvailable;
      }
      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: "Food not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};