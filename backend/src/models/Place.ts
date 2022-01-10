import mongoose from 'mongoose';

const Schema = mongoose.Schema;

interface Place {
  imageURL: string;
  title: string;
  description: string;
  address: string;
  creatorId: mongoose.Types.ObjectId;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const placeSchema = new Schema<Place>({
  address: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  imageURL: {
    type: String,
    required: true,
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Place', placeSchema);
