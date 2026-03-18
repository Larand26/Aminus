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

  static create(model, data) {
    const instance = new model(data);
    return instance.save();
  }
}

export default MongoDB;
