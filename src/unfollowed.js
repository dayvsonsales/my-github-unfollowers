require("dotenv/config");

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const api = axios.create({
  baseURL: "https://api.github.com/",
});

async function whoUnfollowedMe() {
  try {
    const { data: followers } = await api.get(
      `/users/${process.env.USERNAME}/followers`
    );

    const location = path.join(__dirname, "..", "followers", "current.json");

    const current = fs.existsSync(location);

    if (!current) {
      fs.writeFileSync(location, JSON.stringify(followers), {
        flag: "w",
      });
      console.log("Followers list initialized");

      return;
    } else {
      const data = JSON.parse(fs.readFileSync(location));

      const usersThatUnfollowedMe = data.filter(
        (user) => followers.findIndex((value) => user.id == value.id) === -1
      );

      console.log("Users that unfollowed you: ");
      console.log(usersThatUnfollowedMe.map((user) => user.login));

      fs.writeFileSync(location, JSON.stringify(followers));
    }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = whoUnfollowedMe;
