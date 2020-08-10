const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Trade = require("../../models/Trade");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [auth, [check("status", "status is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { status, accounts } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) {
      profileFields.status = status;
    }
    profileFields.accounts = [];

    /*
    if (accounts) {
      let temp = accounts.split(",").map((account) => account.trim());
      // profileFields.accounts = {};
      for (var x = 0; x < temp.length; x++) {
        let i = {};
        i.name = temp[x];
        profileFields.accounts.push(i);
      }
    }
    console.log(profileFields.accounts);
    */

    try {
      let profile = await Profile.findOne({
        user: req.user.id,
      });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }
      // create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(config.get("errorMessageServer"));
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private

router.delete("/", auth, async (req, res) => {
  try {
    // remove trades
    await Trade.deleteMany({ user: req.user.id });
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "user deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

// @route   PUT api/profile/accounts
// @desc    Add an account to a profile
// @access  Private

router.put(
  "/accounts",
  [
    auth,
    [
      check("brokerage", "Brokerage is required").not().isEmpty(),
      check("nickname", "Nickname is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { brokerage, nickname } = req.body;
    const newAccount = {
      brokerage,
      nickname,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.accounts.unshift(newAccount);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send(config.get("errorMessageServer"));
    }
  }
);

// @route   DELETE api/profile/accounts/:acct_id
// @desc    Delete an account from a profile
// @access  Private

router.delete("/accounts/:acct_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    // get remove index
    const removeIndex = profile.accounts
      .map((item) => item.id)
      .indexOf(req.params.acct_id);
    profile.accounts.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send(config.get("errorMessageServer"));
  }
});

module.exports = router;
