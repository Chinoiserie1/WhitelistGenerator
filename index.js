const { getCoupon, CouponTypeEnum } = require("./WhitelistGenerator");
var csv = require('jquery-csv');
fs = require("fs");

var legendaires = fs.readFileSync("./legendairesId.csv", "utf-8");
var urEggs = fs.readFileSync("./urEgg.csv", "utf-8");
var urs = fs.readFileSync("./Ur.csv", "utf-8");
var basicEggs = fs.readFileSync("./basicEgg.csv", "utf-8");
var basics = fs.readFileSync("./basic.csv", "utf-8");

var snapshotTimeout = fs.readFileSync("./holder-snapshot-timeout.csv", "utf-8");
// var snapshotWhitelistSale = fs.readFileSync("./holder-snapshot-timeout.csv", "utf-8");

var legendaire = csv.toObjects(legendaires);
var urEgg = csv.toObjects(urEggs);
var ur = csv.toObjects(urs);
var basicEgg = csv.toObjects(basicEggs);
var basic = csv.toObjects(basics);
var snapshot = csv.toObjects(snapshotTimeout);
// var snapshotWLS = csv.toObjects(snapshotWhitelistSale);

// console.log(basic.length);
// console.log(basicEgg.length);
// console.log(ur.length);
// console.log(urEgg.length);
// console.log(legendaire.length);
// console.log(basic.length + basicEgg.length + ur.length + urEgg.length + legendaire.length);

const coupon = getCoupon("0x5E5871153763645D552Ba5D9082597f3be3D0788", 0, 0, 0, 0, CouponTypeEnum.PrivateSales);
console.log(coupon);

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
  obj.ur = 0;
  obj.basic = 0;
  obj.egg = 0;
  res.push(obj);
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < legendaire.length; z++) {
      if (digest[i].tokenId[y] == legendaire[z].Legendaires) {
        counter2++;
        res[i].legendaire++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < urEgg.length; z++) {
      if (digest[i].tokenId[y] == urEgg[z].URegg) {
        res[i].ur++;
        res[i].egg++;
        counter2++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < ur.length; z++) {
      if (digest[i].tokenId[y] == ur[z].UR) {
        res[i].ur++;
        counter2++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < basicEgg.length; z++) {
      if (digest[i].tokenId[y] == basicEgg[z].BasicEgg) {
        res[i].basic++;
        res[i].egg++;
        counter2++;
      }
    }
  }
  for (let y = 0; y < digest[i].tokenId.length; y++) {
    for (let z = 0; z < basic.length; z++) {
      if (digest[i].tokenId[y] == basic[z].Basic) {
        res[i].basic++;
        counter2++;
      }
    }
  }
}

// console.log(res);
// console.log(counter2);

var privateWLCoupon = [];
for (let i = 0; i < res.length; ++i) {
  var obj = {};
  obj.address = res[i].owner;
  obj.coupon = getCoupon(res[i].owner, res[i].basic, res[i].ur, res[i].legendaire, res[i].egg, CouponTypeEnum.PrivateSales);
  privateWLCoupon.push(obj);
}

console.log(privateWLCoupon);

// var whitelistSalesCoupon = [];
// for (let i = 0; i < snapshotWLS.length; ++i) {
//   var obj = {};
//   obj.address = snapshotWLS[i].address;
//   obj.coupon =  getCoupon(snapshotWLS[i].address, 0, 0, 0, 0, CouponTypeEnum.WhiteListSales);
//   whitelistSalesCoupon.push(obj);
// }