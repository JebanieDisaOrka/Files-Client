let url = "https://files.co.pl/api/upload"

const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
var argv = require('minimist')(process.argv.slice(2));

var token = argv.token
var file = argv.file

if (token) {
    if (file) {
        const filePath = `./${file}`
        const form = new FormData();
        const stats = fs.statSync(filePath);
        const fileSizeInBytes = stats.size;
        const fileStream = fs.createReadStream(filePath);
        form.append('field-name', fileStream, { knownLength: fileSizeInBytes });

        fetch(url, {
            method: 'POST', 
            body: form,
            headers: {
                "auth": token
            },
        }).then(response => {
            return response.json();
        }).then(data => {
            if (data.status == "403") {
                console.error(`Token "${token}" is invalid`)
            }
            else {
                console.log(`File has been successfully uploaded, and it available at ${data.url}`)
            }
        });
    }
    else {
        console.error("You did not specifed file to send by using --file=<filename>")
    }
}
else {
    console.error("You must supply your service token using --token=<token>!")
}