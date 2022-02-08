import mongoose, { Types } from 'mongoose';

const Schema = mongoose.Schema;

interface User {
  email: string;
  password: string;
  name: string;
  imageURL: string;
  places: Types.DocumentArray<mongoose.Types.ObjectId>;
}

const userSchema = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: 'jeff.jpg',
    required: true,
  },
  places: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
    ],
  },
});

export default mongoose.model('User', userSchema);
