const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//update password
router.put("/changePassword/:email", async (req, res) => {
  if (req.body.email === req.params.email || req.body.isAdmin) {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json("This mail is not registered in our Database");
    } else {
      const validPassword = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!validPassword) {
        res.status(403).json("The password is Incorrect");
      } else {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
          try {
            const savedUser = await User.findByIdAndUpdate(user._id, {
              $set: req.body,
            });
            res.status(200).json("Password Updated succesfully");
          } catch (err) {
            return res.status(500).json(err);
          }
        } catch (err) {
          return res.status(500).json(err);
        }
      }
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//update user
router.put("/:email", async (req, res) => {
  if (req.body.email === req.params.email || req.body.isAdmin) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(404).json("This mail is not registered in our Database");
      } else {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPassword) {
          res.status(403).json("The password is Incorrect");
        } else {
          try {
            const savedUser = await User.findOneAndUpdate(
              { email: user.email },
              {
                username: req.body.username,
                profilePicture: req.body.profilePicture,
              },
              { new: true }
            );
            const { password, updatedAt, ...other } = savedUser._doc;
            res.status(200).json(other);
          } catch (err) {
            res.status(500).json("Sorry and error from our side occured");
          }
        }
      }
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    res.status(403).json("You can only Update your Profile");
  }
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});

module.exports = router;
