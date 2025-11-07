import mongoose from 'mongoose';

const visualizationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    algorithm: { type: String, required: true },
    inputSize: { type: Number, required: true },
    steps: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model('Visualization', visualizationSchema);




