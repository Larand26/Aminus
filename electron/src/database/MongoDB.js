import mongoose from "mongoose";
import MongoConfig from "../config/MongoConfig.js";

class MongoDB {
  static pool = mongoose.connect(MongoConfig.uri, MongoConfig.options);

  static query(model, filters = {}) {
    return model.find(filters).exec();
  }
}

export default MongoDB;
