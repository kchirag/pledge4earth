// seed.js
const mongoose = require('mongoose');
const Leader = require('./models/Leader');
const uri = 'mongodb+srv://kchirag:Belapur-123@pledge4earth.8he3kvu.mongodb.net/?retryWrites=true&w=majority';


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const leaders = [
  {
    name: 'Sara Lashanlo',
    image: 'https://saraforcouncil.com/wp-content/uploads/2022/08/PXL_20220823_002115613.PORTRAIT_2-scaled.jpg',
    statement: 'I pledge to protect the environment.',
  },
  {
    name: 'Sabina Zafar',
    image: 'https://images.squarespace-cdn.com/content/v1/5b1770795cfd79fa1308279e/1595410031454-NW0SDWWYUVACA0KWSOTH/76995552_2526580507589229_8441580425821814784_n.jpg?format=300w',
    statement: 'I am committed to fighting climate change.',
  },
  // Add more mock leaders here
];

Leader.insertMany(leaders)
  .then((res) => {
    console.log('Leaders inserted:', res);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error inserting leaders:', err);
  });
