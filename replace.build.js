var replace = require('replace-in-file');
var apiKey = process.argv[2];
const options1 = {
  files: 'src/environments/environment.ts',
  from: /{API_KEY}/g,
  to: apiKey,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options1);
  console.log('API Key set: ' + apiKey);
}
catch (error) {
  console.error('Error occurred:', error);
}