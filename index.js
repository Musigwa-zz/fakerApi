const express = require("express");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require("cors");
const { random, name, image, address } = require('faker');

const { PORT = 3000 } = process.env;

const { json, urlencoded } = express;
const app = express();
if (app.get('env') === 'development') app.use(morgan('dev'));

const phones = ['0727406865','0788467808','0789277275', '0785782928'];
const plateNos = ['RAB345R','RAC235F','RAE129W', 'RAA098Q'];

const people = Array.from({ length:10 }, ()=> ({
  name: `${name.firstName()} ${name.lastName()}`,
  nid_passport: random.number(123434567898763),
  ifoto: image.avatar(),
  phone: random.arrayElement(phones),
  from_location: address.state,
  to_location: address.state,
  plate_number: random.arrayElement(plateNos),
  reason: random.words(12)
}));

app.use(json(), urlencoded({ extended: true }), cors(), helmet()); 
app.use('/api', ({ body }, res) => {
  const { query = '' } = body;
  const matcher = query.toLowerCase();
  const person = people.find(p => { 
   return p.phone.toLowerCase() === matcher 
    || p.plate_number.toLowerCase() === matcher;
  });
  if(person) return res.status(200).json({ message: 'User found successfully', person });
  else return res.status(404).json({ message: 'User not found' });
});

const server = app.listen(PORT, ()=> {
  console.log(`Listening on port ${PORT}`)
});

module.exports = server;
