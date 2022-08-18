const {
  keccak256,
  toBuffer,
  ecsign,
  bufferToHex,
} = require("ethereumjs-utils");
const { ethers } = require('ethers');
require("dotenv").config();

const privateKey = process.env.PRIVATE_WALLET_KEY;
const signerPvtKey = Buffer.from(privateKey, "hex")  // create an object to match the contracts struct

const CouponTypeEnum = {
  PrivateSales: 0,
  WhiteListSales: 1
};

// HELPER FUNCTIONS
function createCoupon(hash, signerPvtKey) {
  return ecsign(hash, signerPvtKey);
}

function generateHashBuffer(typesArray, valueArray) {
  return keccak256(
    toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
      valueArray))
  );
}

function serializeCoupon(coupon) {
  return {
    r: bufferToHex(coupon.r),
    s: bufferToHex(coupon.s),
    v: coupon.v,
  };
}

function concatCoupon(coupon) {
  let res = coupon.r;
  for (let i = 2; i < coupon.s.length; i++) {
    res = res + coupon.s[i];
  }
  if (coupon.v == 27) {
    res = res + "1b";
  }
  if (coupon.v == 28) {
    res = res + "1c";
  }
  return res;
}

const getCoupon = (address, BasicCount, UltrarareCount, LegendaireCount, eggCount, couponType) => {
  const userAddress = ethers.utils.getAddress(address);
  const hashBuffer = generateHashBuffer(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "address"],
    [couponType, BasicCount, UltrarareCount, LegendaireCount, eggCount, userAddress]
  );
  const coupon = createCoupon(hashBuffer, signerPvtKey);
  const serialize = serializeCoupon(coupon);
  return concatCoupon(serialize);
};


module.exports = {
  getCoupon,
  CouponTypeEnum,
}