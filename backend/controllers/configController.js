import Config from "../models/Config.js";

// Initialize config if it doesn't exist, then return it
export const getConfig = async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({ totalTables: 20 });
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const { totalTables } = req.body;
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({ totalTables });
    } else {
      config.totalTables = totalTables;
      await config.save();
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
