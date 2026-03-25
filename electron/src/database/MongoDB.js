import mongoose from "mongoose";
import MongoConfig from "../config/MongoConfig.js";

class MongoDB {
  static pool = mongoose.connect(MongoConfig.uri, MongoConfig.options);

  formatId(id) {
    if (id && typeof id === "object" && id.buffer) {
      return new mongoose.Types.ObjectId(Buffer.from(id.buffer));
    }
    return id;
  }

  static find(model, filters = {}) {
    return model.find(filters).lean().exec();
  }

  static update(model, id, newData) {
    return model
      .findByIdAndUpdate(this.formatId(id), newData, { new: true })
      .lean()
      .exec();
  }

  static create(model, data) {
    const instance = new model(data);
    return instance.save().then((doc) => doc.toObject());
  }
}

export default MongoDB;
