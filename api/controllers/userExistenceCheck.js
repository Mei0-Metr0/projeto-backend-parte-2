import User from '../models/User.js';

const checkUserExistence = async (data) => {
  const { email } = data;
  const user = await User.findOne({ email });
  return user !== null;
};

export default checkUserExistence;
