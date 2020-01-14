const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
  async index (req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username }); 

    if (!dev) {
      const response = await axios.get(`https://api.github.com/users/${github_username}`);
      const { name = login, avatar_url, bio } = response.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
    }

    return res.json(dev);
  },

  async update(req, res) {
    const { id } = req.params;
    const { nome, avatar_url, bio, techs, latitude, longitude } = req.body;

    const techsArray = parseStringAsArray(techs);
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
    let dev = await Dev.updateOne(
      {
        _id: id
      }, {
        $set: {
          nome,
          avatar_url,
          bio,
          techs: techsArray,
          location, 
        }
      }
    )
    return res.json({ dev });
  },

  async destroy (req, res) {
    const { id } = req.params;

    let dev = await Dev.deleteOne({ _id: id });
    return res.json({ dev: "REMOVED" });
  }

}