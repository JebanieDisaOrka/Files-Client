let uurl = "https://files.co.pl/api/v1/upload"
let durl = "https://files.co.pl/api/v1/delete"

const fetch = require('node-fetch');
const fs = require('fs');
const FormData = require('form-data');
var argv = require('minimist')(process.argv.slice(2));

var token = argv.t
var file = argv.f
var del = argv.d
var upload = argv.u

if (token) {
    if (upload) {
        fs.stat(`./${file}`, function (err, stats) {
            if (stats) {
                const filePath = `./${file}`
                const form = new FormData();
                const stats = fs.statSync(filePath);
                const fileSizeInBytes = stats.size;
                const fileStream = fs.createReadStream(filePath);
                form.append('field-name', fileStream, { knownLength: fileSizeInBytes });

                fetch(uurl, {
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
                console.log("Specify the file that you want to upload using -f <filename>")
            }
        })
    }
    else if (del){
        if (file) {
            fetch(durl, {
                method: 'DELETE', 
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "auth": token
                },
                body: JSON.stringify({
                    delete: file
                })
            }).then(response => {
                return response.json();
            }).then(data => {
                if (data.status == "403") {
                    console.error(`Token "${token}" is invalid`)
                }
                else if (data.status == "422") {
                    console.log(`There is no file named ${file}`)
                }
                else if (data.status == "404") {
                    console.log(`There is no file named ${file}`)
                }
                else {
                    console.log(`File has been successfully deleted`)
                }
            });
        }
        else {
            console.log("Specify the file that you want to delete using -f <filename>")
        }
    }
    else {
        console.log("Specify what you want to do. Use -u to upload file or -d to delete file")
    }
}
else {
    console.error("You must supply your service token using -t <token>!")
}