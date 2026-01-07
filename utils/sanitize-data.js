export const sanitizeUser = (user) => {
  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  return sanitizedUser;
};
