require('dotenv').config();
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Form = require('../schemas/Form');
const Movement = require('../schemas/Movement');

const reset = async () => {
    await Movement.deleteMany({}).then(() => console.log("(Movement.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));
    await Form.deleteMany({}).then(() => console.log("(Form.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));

    fs.readdir('testdata/forms', (err, files) => {
        if(err) {
            console.log('error' + err.message);
            return;
        }
        console.log(files);
        files.forEach(f => fs.readFile(`testdata/forms/${f}`, 'utf8', async (err, data) => {
            await new Form(JSON.parse(data)).save();
            console.log(`${f} complete.`);
        }))
    });
};

reset();