export const get404 = async (req, res) => {
  res.status(404).json({
    message: 'not found',
  });
};
 