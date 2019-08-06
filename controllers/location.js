const Location = require('../models/locations');

// @route   POST /api/locations
// @desc    Create a location
// @access  Public
module.exports.createLocation = (req, res) => {

  const location = new Location(
    req.body
  );

  location.save()
    .then(() =>
      res.status(200).json({
        status: true,
        msg: 'Location created successfully'
      })
    )
    .catch(err => res.status(404).json(err));
}

// @route   GET /api/location/:id
// @desc    Get a location
// @access  Public
module.exports.getLocationById = (req, res) => {
  let id = req.params.id
  Location.findById(id)
    .then(location => res.status(200).json({
      status: true,
      msg: location
    }))
    .catch(err => res.send(err))

}

// @route   GET /api/locations
// @desc    Get all locations
// @access  Public
module.exports.getLocations = (req, res) => {

  const errors = {};
  Location.find()
    .then(locations => {
      if (!locations) {
        errors.nolocation = "There are no locations";
        return res.status(404).json(errors)
      }
      res.json(locations)
    })
    .catch(() => res.status(404).json({ location: "there are no locations" }))
}

// @route   PUT /api/locations/:id
// @desc    Update a location
// @access  Public
module.exports.updateLocation = (req, res) => {
  let id = req.params.id
  Location.findOneAndUpdate(id, req.body, { new: true })
    .then(updatedLocation => res.status(200)
      .json({
        status: true,
        msg: "Location Updated successfully"
      }))
    .catch(err => res.send(err));
}

// @route   DELETE /api/location/:id
// @desc    Delete a location
// @access  Public
module.exports.deleteLocation = (req, res) => {
  let id = req.params.id
  Location.deleteOne(id)
    .then(location => {
      console.log(location);
      res.status(200).json({
        status: true,
        msg: 'Location deleted successfully'
      })
    })
}

/**
 * Seed the database
 */
module.exports.seedLocations = (req, res) => {
  // create some events
  const places = [
    { name: 'Lagos' },
    { name: 'Apapa' },
    { name: 'Kano' },
    { name: 'Kogi' }
  ];

  // use the Event model to insert/save
  Location.deleteOne({}, () => {
    for (place of places) {
      var newLocation = new Location(place);
      newLocation.save();
    }
  });

  // seeded!
  res.send('Database seeded!');
}
