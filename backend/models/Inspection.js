import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  questionId: { type: String },
  answer: { type: String, enum: ["YES","NO"] },
  remarks: { type: String }
}, { _id: false });

const inspectionSchema = new mongoose.Schema({
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  inspectorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inspectionType: { type: String, enum: ["TYPE_A","TYPE_B","TYPE_C"], required: true },
  responses: { type: [responseSchema], default: [] },
  geoMeta: {
    latitude: Number,
    longitude: Number,
    timestamp: Date
  },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Inspection = mongoose.models.Inspection || mongoose.model('Inspection', inspectionSchema);
export default Inspection;
