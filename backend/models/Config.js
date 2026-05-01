import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  totalTables: { type: Number, default: 20 }
});

const Config = mongoose.model("Config", configSchema);
export default Config;
