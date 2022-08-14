const { getCoupon, CouponTypeEnum } = require("./WhitelistGenerator");
var csv = require('jquery-csv');
fs = require("fs");

var legendaires = fs.readFileSync("./legendairesId.csv", "utf-8");
var urEggs = fs.readFileSync("./urEgg.csv", "utf-8");
var urs = fs.readFileSync("./Ur.csv", "utf-8");
var basicEggs = fs.readFileSync("./basicEgg.csv", "utf-8");
var basics = fs.readFileSync("./basic.csv", "utf-8");
var snapshotTimeout = fs.readFileSync("./holder-snapshot-timeout.csv", "utf-8");

var legendaire = csv.toObjects(legendaires);
var urEgg = csv.toObjects(urEggs);
var ur = csv.toObjects(urs);
var basicEgg = csv.toObjects(basicEggs);
var basic = csv.toObjects(basics);
var snapshot = csv.toObjects(snapshotTimeout);
console.log(basics.length);

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
        res[i].legendaire++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < urEgg.length; z++) {
      if (digest[i].tokenId[y] == urEgg[z].URegg) {
        res[i].urEgg++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < ur.length; z++) {
      if (digest[i].tokenId[y] == ur[z].UR) {
        res[i].ur++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < basicEgg.length; z++) {
      if (digest[i].tokenId[y] == basicEgg[z].BasicEgg) {
        res[i].basicEgg++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < basic.length; z++) {
      if (digest[i].tokenId[y] == basic[z].Basic) {
        counter2++;
        res[i].basic++;
      }
    }
  }
}
console.log(res);
console.log(counter2);