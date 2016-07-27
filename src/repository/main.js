'use strict'

const fs = require('fs');

module.exports ={
  update(request, reply) {
    let file_name = "./data/repositories.json";
      fs.readFile(file_name, 'utf8', (err, data) => {
        if (err) throw err;
        let list = JSON.parse(data);
        list.push(request.payload);
        fs.writeFile(file_name, JSON.stringify(list));
      });
      return reply('succes');
   }
};
