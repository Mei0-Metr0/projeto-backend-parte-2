import mongoose from "mongoose";

const SchedulingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  pet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pet',
    required: true 
  },
  adoptionDate: { 
    type: Date, 
    default: Date.now
  }
})

const Adoption = mongoose.model('Adoption', SchedulingSchema)

export default Adoption