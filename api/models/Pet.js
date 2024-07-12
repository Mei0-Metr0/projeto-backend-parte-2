import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  age: { 
    type: Number, 
    required: true 
  },
  breed: { 
    type: String, 
    required: true 
  },
  adopted: { 
    type: Boolean, 
    default: false 
  },
  description: { 
    type: String, 
    required: true 
  }
})

const Pet = mongoose.model('Pet', ServiceSchema)

export default Pet;