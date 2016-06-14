const express = require('express');
const fs = require('fs');
const exec = require('child_process').exec;
const app = express();
const port = 8899;
const branch = 'master';

function build(){
    const command = 'gulp build';
    const options = {
        cwd: '../../'
    };
    return new Promise( (resolve, reject) => {
        const build = exec(command, options, err => {
            if (err) throw err;
            resolve();
        });

        build.stdout.pipe(fs.createWriteStream('access.log', { flags: 'a'}));
        build.stderr.pipe(fs.createWriteStream('error.log', { flags: 'a'}));
    });
}

app.get('/', (req, res) => {
    Promise.resolve()
        .then(build)
        .then( () => {
            res.send(`${branch} has been released!`);
        })
        .catch( err => {
            res.send(`The following error occured during the release: ${err}`);
        });
});

app.listen(port, () => {
    console.log(`Release script listening on port ${port}`);
})