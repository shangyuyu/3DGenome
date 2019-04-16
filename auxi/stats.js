const gff = require('@gmod/gff').default;

let keyArray = [];
let count = [];
let totalCount = 0;
let flag = false;
let attri;

gff.parseFile('/Users/ziyizhang/Desktop/Joint Institude/BioStatistics/3D_Genome/data/ref_GRCh38.p12_top_level.gff3', { parseAll: true })
.on('data', data => {
  if (data.directive) {
    //console.log('got a directive',data)
  }
  else if (data.comment) {
    //console.log('got a comment',data)
  }
  else if (data.sequence) {
    //console.log('got a sequence from a FASTA section')
  }
  else {
      if (data[0]["type"] == "gene" || data[0]["type"] == "pseudogene") {

      
      attri = data[0]["attributes"];
      for (let key of Object.keys(attri)) {

          if (attri[key].length == 1)
              attri[key] = attri[key][0];
      }
      attriStr = JSON.stringify(attri);
      if (attri) {
          for (let key of Object.keys(attri)) {

              flag = false;
              for (let i=0; i<keyArray.length; i++) {

                  if (keyArray[i] == key) {

                      flag = true;
                      count[i]++;
                      totalCount++;
                      break;
                  }
              }
              if (flag == false) {

                  keyArray.push(key);
                  count[count.length] = 1;
                  totalCount++;
              }
          }

          }
      }
  }
})
.on("end", function () {
    console.log(">>>>>>>>>> keyArray");
    for (let i=0; i<keyArray.length; i++) {

        console.log(keyArray[i] + ": " + String(count[i]) );
    }

    console.log("total count " + String(totalCount));
    console.log("This is the end.");
});
