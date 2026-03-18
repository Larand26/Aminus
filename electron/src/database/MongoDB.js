import mongoose from "mongoose";
import MongoConfig from "../config/MongoConfig.js";

class MongoDB {
  static pool = mongoose.connect(MongoConfig.uri, MongoConfig.options);

  static find(model, filters = {}) {
    return model.find(filters).exec();
  }

  static update(model, id, newData) {
    return model.findByIdAndUpdate(id, newData, { new: true }).exec();
  }
}

export default MongoDB;
