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

        const generateVideo = (vid, practitioners, refFromName) => {
            const vidClone = { ...vid };
            if (vidClone.practitioner){
                vidClone.practitioner = practitioners.find(p => p.name === vidClone.practitioner )._id
            }
            
            vidClone._id = new mongoose.Types.ObjectId();
            vidClone.clips = vidClone.namedClips.map(nclip => {
                const clipClone = {
                    ...nclip,
                    ref: refFromName(nclip.name)
                };
                delete clipClone.name;
                return clipClone;
            });
            delete vidClone.namedClips;
            return vidClone;
        };

        fs.readdir('testdata/forms', (err, files) => {
            files.forEach(f => fs.readFile(`testdata/forms/${f}`, 'utf8', async (err, data) => {
                var { form, movements, formVideos, movementVideos } = JSON.parse(data);
    
                form._id = new mongoose.Types.ObjectId();
                form.videos = [];
                form.movements = [];

                // Don't use forEach as an async func which will cause things still unpopulated at save
                for (var movement of movements) {
                    movement._id = new mongoose.Types.ObjectId();
                    movement.videos = [];

                    // Don't use forEach as an async func which will cause things still unpopulated at save
                    for (var vid of movementVideos) {  
                        const vidClone = generateVideo(vid, practitioners, name => name);
                        await Video(vidClone).save();
                        movement.videos.push(vidClone._id);
                    }
                    
                    console.log(`movement: ${movement.name} videos: ${movement.videos}`);
                    await new Movement(movement).save();
                    form.movements.push(movement._id);
                }                
                
                // Don't use forEach as an async func which will cause things still unpopulated at save
                for (var vid of formVideos) {
                    const vidClone = generateVideo(vid, practitioners, name => movements.find(m => m.name === name )._id);
                    await Video(vidClone).save();
                    form.videos.push(vidClone._id);
                }
                
                await new Form(form).save();
                
                console.log(`${form.name} movements: ${form.movements} videos: ${form.videos}`);
            }))
        });
    });
};

reset();