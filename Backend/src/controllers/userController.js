import { User } from "../models/index.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "createdAt"],
    });

    return res.json({ user });
  } catch (err) {
    console.error("GET MY PROFILE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email", "createdAt"],
      order: [["id", "ASC"]],
    });

    return res.json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};
