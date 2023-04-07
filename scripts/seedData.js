// scripts/seedData.js
const mongoose = require('mongoose');
const Organization = require('../models/Organization');
const Initiative = require('../models/Initiative');

const path = require('path');
require('dotenv').config({ path: './.env' });
console.log(process.env);


const organizations = [
  {
    name: 'Sustainable Conservation',
    image: 'https://suscon.org/wp-content/themes/sustainable/images/suscon_logo_white.svg',
    description: "The sustainable observation's watershed project aims to restore and expand integrated water supply to drought-affected areas in California and other parts of the state.",
    website: 'https://suscon.org/about-us/',
    email: '',
    socialhandle: '',
    contactNumber: '',
    location: {
      type: 'Point',
      coordinates: [-122.399370,37.792080], // [longitude, latitude]
    },
  },
  {
    name: 'Pacific Environment',
    image: 'https://lever-client-logos.s3.us-west-2.amazonaws.com/04290ad2-bc20-4cba-96ab-04cda7ffd0c8-1665004125052.png',
    description: "The sustainable observation's watershed project aims to restore and expand integrated water supply to drought-affected areas in California and other parts of the state.",
    website: 'https://www.pacificenvironment.org/what-we-do/ ',
    email: '',
    socialhandle: 'http://twitter.com/pacenvironment',
    contactNumber: '',
    location: {
      type: 'Point',
      coordinates: [-122.403720, 37.791660], // [longitude, latitude]
    },
  },
  {
    name: 'Save the Bay',
    image: 'https://savesfbay.org/wp-content/uploads/2022/03/STB_New_Logo-17.png',
    description: "The sustainable observation's watershed project aims to restore and expand integrated water supply to drought-affected areas in California and other parts of the state.",
    website: 'https://savesfbay.org/what-we-do/',
    email: '',
    socialhandle: '',
    contactNumber: '',
    location: {
      type: 'Point',
      coordinates: [-122.2742593, 37.8056466], // [longitude, latitude]
    },
  },
  {
	name: 'Earthjustice',
	image: 'https://earthjustice.org/wp-content/uploads/ej_logo.svg',
	description: "Earthjustice advocates for the use of legal action and partnerships among environmental stakeholders to protect human health, preserve forests and wildlife, promote clean energy, and reduce climate pollution.",
	website: 'https://earthjustice.org/about',
	email: '',
	socialhandle: '',
	contactNumber: '',
	location: {
	  type: 'Point',
	  coordinates: [-122.3973798,37.7940648], // [longitude, latitude]
	},

  }, 
  {
	name: 'WildAid',
	image: 'https://wildaid.org/wp-content/themes/wildaidtheme/svgs/wildaid-logo-white.svg',
	description: "WildAid works to reduce the demand for endangered animals in the market by raising public awareness and changing buyer behavior. They emphasize the consequences of the continual trade and consumption of animals like elephants, sharks, parrots, etc. to stop the demand.",
	website: 'https://wildaid.org/about/',
	email: '',
	socialhandle: '',
	contactNumber: '',
	location: {
	  type: 'Point',
	  coordinates: [-122.3973798,37.7940648], // [longitude, latitude]
	},

  }, 
  // Add more organizations
];

const initiatives = [
  {
    name: 'Initiative 1',
    description: 'Description for initiative 1',
    startDate: '2023-05-01',
    endDate: '2023-08-31',
  },
  // Add more initiatives
];

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to database.');

    // Clear existing data
    await Organization.deleteMany({});
    await Initiative.deleteMany({});
    console.log('Cleared existing data.');
  })
  .catch((err) => {
    console.log('Database connection failed.');
    console.error(err);
  });

  async function seedData() {
  try {
    // Seed organizations
    const createdOrganizations = await Organization.insertMany(organizations);
    console.log('Organizations seeded successfully.');

    // Seed initiatives (assigning an organization to each initiative)
    /*for (let i = 0; i < initiatives.length; i++) {
      initiatives[i].organizationId =
        createdOrganizations[i % createdOrganizations.length]._id;
    }
    await Initiative.insertMany(initiatives);
    console.log('Initiatives seeded successfully.');
	*/
    // Close the database connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// Call the seedData function
seedData();
