import mongoose, { Schema } from "mongoose";
import { ICounter } from "../types";

const counterSchema = new Schema<ICounter>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  },
);


export default mongoose.model<ICounter>("Counter", counterSchema);
