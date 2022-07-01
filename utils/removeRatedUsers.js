const Votes = require("../models/Votes.model");

const removeExpiredRatedUsers = async (req, res) => {
  try {
    const appkey = req.header("Authorization").split(" ")[1];

    if (appkey !== process.env.APP_KEY) {
      return res.status(400).send(`Unauthenticated`);
    }

    await Votes.deleteMany({ expiryTime: { $lt: new Date().getTime() } });

    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(`${error.message}`);
  }
};

module.exports = removeExpiredRatedUsers;
