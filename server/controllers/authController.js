const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  res.json({
    message: "Data Received Successfully",
    name,
    email,
    password,
  });
};

module.exports = {
  registerUser,
};