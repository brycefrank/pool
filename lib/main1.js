const readXlsxFile = require('read-excel-file/node');

readXlsxFile('data/data.xlsx').then(rows => {
    console.log(rows);
});