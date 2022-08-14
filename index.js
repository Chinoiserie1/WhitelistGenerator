const { getCoupon, CouponTypeEnum } = require("./WhitelistGenerator");
var csv = require('jquery-csv');
fs = require("fs");

var legendaires = fs.readFileSync("./legendairesId.csv", "utf-8");
var snapshotTimeout = fs.readFileSync("./holder-snapshot-timeout.csv", "utf-8");

var legendaire = csv.toObjects(legendaires);
var snapshot = csv.toObjects(snapshotTimeout);
console.log(legendaire);

const coupon = getCoupon("0x5E5871153763645D552Ba5D9082597f3be3D0788", 0, 0, 0, 0, CouponTypeEnum.PrivateSales);
// console.log(coupon);

var res = [];
for (let i = 0; i < snapshot.length; ++i) {
  var obj = {};
  obj.owner = snapshot[i].owner;
  obj.tokenId = [i];
  res.push(obj);
}

var digest = [];
var counter = 0;

for (let i = 0; i < res.length; i++) {
  digest.push(res[i]);
  for (let y = i + 1; y < res.length; y++) {
    if (digest[counter].owner == res[y].owner) {
      digest[counter].tokenId.push(res[y].tokenId[0]);
      res.splice(y, 1);
      y--;
    }
  }
  counter++;
}

// console.log(digest);

var res = [];
var counter2 = 0;

for (let i = 0; i < digest.length; ++i) {
  var obj = {};
  obj.owner = digest[i].owner;
  obj.legendaire = 0;
  obj.urEgg = 0;
  obj.ur = 0;
  obj.basicEgg = 0;
  obj.basic = 0;
  res.push(obj);
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < legendaire.length; z++) {
      if (digest[i].tokenId[y] == legendaire[z].Legendaires) {
        console.log("ok");
        res[counter2].legendaire++;
      }
    }
  }
  counter2++;
}

console.log(res);