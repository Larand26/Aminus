import mongoose from "mongoose";
import MongoConfig from "../config/MongoConfig.js";

class MongoDB {
  static pool = mongoose.connect(MongoConfig.uri, MongoConfig.options);

  static formatId(id) {
    if (id && typeof id === "object" && id.buffer) {
      return new mongoose.Types.ObjectId(Buffer.from(id.buffer));
    }
    return id;
  }

  static find(model, filters = {}) {
    return model.find(filters).lean().exec();
  }

  static findOne(model, filters = {}) {
    return model.findOne(filters).lean().exec();
  }

  static update(model, id, newData) {
    return model
      .findByIdAndUpdate(MongoDB.formatId(id), newData, { new: true })
      .lean()
      .exec();
  }

  static create(model, data) {
    const instance = new model(data);
    return instance.save().then((doc) => doc.toObject());
  }

  static delete(model, id) {
    return model.findByIdAndDelete(MongoDB.formatId(id)).lean().exec();
  }
}

export default MongoDB;
