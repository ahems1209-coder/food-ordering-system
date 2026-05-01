import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  totalTables: { type: Number, default: 20 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Config = mongoose.model("Config", configSchema);
export default Config;
