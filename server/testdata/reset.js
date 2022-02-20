if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const fs = require('fs');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

const Form = require('../schemas/Form');
const Movement = require('../schemas/Movement');
const Practitioner = require('../schemas/Practitioner');
const Video = require('../schemas/Video');

const reset = async () => {
    await Movement.deleteMany({}).then(() => console.log("(Movement.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));
    await Form.deleteMany({}).then(() => console.log("(Form.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));
    await Practitioner.deleteMany({}).then(() => console.log("(Practitioner.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));
    await Video.deleteMany({}).then(() => console.log("(Video.deleteMany) all fine here, nothing to see"), (err) => console.log(err.message));

    fs.readFile(`testdata/practitioners.json`, 'utf8', async (err, data) => {
        var practitioners = JSON.parse(data);
        practitioners.forEach(async p => {
            p._id = new mongoose.Types.ObjectId();
            if (p.teachers && p.teachers.length > 0) {
                p.teachers = p.teachers.map(t => practitioners.find(p => p.name === t )._id);
            }
            await new Practitioner(p).save();
        });

        fs.readdir('testdata/forms', (err, files) => {
            files.forEach(f => fs.readFile(`testdata/forms/${f}`, 'utf8', async (err, data) => {
                var { form, movements, videos } = JSON.parse(data);
    
                form._id = new mongoose.Types.ObjectId();
                form.videos = [];
                form.movements = [];
                
                // Don't use forEach as an async func which will cause things still unpopulated at save
                for (var vid of videos) {
                    if (vid.practitioner){
                        vid.practitioner = practitioners.find(p => p.name === vid.practitioner )._id
                    }
    
                    var vidClone = { ...vid };
                    vidClone._id = new mongoose.Types.ObjectId();
                    delete vidClone.movementClips;
                    await Video(vidClone).save();
                    form.videos.push(vidClone._id);
                }

                // Don't use forEach as an async func which will cause things still unpopulated at save
                for (var [movIndex, mov] of movements.entries()) { // A little hack to get index from array.entries (all a bit unnecessary when a good old fashioned for is there)
                    mov._id = new mongoose.Types.ObjectId();
                    mov.videos = [];

                    // Don't use forEach as an async func which will cause things still unpopulated at save
                    for (var vid of videos) { 
                        if (vid.movementClips && vid.movementClips.length > movIndex) {
                            var clip = vid.movementClips[movIndex];
                            var vidClone = { ...vid };
                                vidClone._id = new mongoose.Types.ObjectId();
                                delete vidClone.movementClips;
                                if (clip && clip.length > 0) {
                                    vidClone.start = clip[0];
                                }
                                if (clip && clip.length > 1) {
                                    vidClone.end = clip[1];
                                }

                                await Video(vidClone).save();
                                mov.videos.push(vidClone._id);
                        }
                    }
                    
                    console.log(`${mov.name} videos: ${mov.videos}`);
                    await new Movement(mov).save();
                    form.movements.push(mov._id);
                }
    
                console.log(`${form.name} videos: ${form.videos}`);
                console.log(`${form.name} movements: ${form.movements}`);
                await new Form(form).save();
            }))
        });
    });
};

reset();