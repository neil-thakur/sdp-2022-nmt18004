const https = require('https');

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log("Waiting for HTTPS request to return...");
        const result = await makeRequest('https://y3xs5g62z3.execute-api.us-east-1.amazonaws.com/test/getTextractResults?username=nmt18004&filename=Pasta_2023-03-26_04-20-24.jpg');
        console.log(result);
    console.log("HTTP request has returned");
  } catch (error) {
    console.error(error);
  }
}

main();


