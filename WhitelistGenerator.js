const {
  keccak256,
  toBuffer,
  ecsign,
  bufferToHex,
} = require("ethereumjs-utils");
const {ethers} = require('ethers');

// const privateKey = "";
const privateKey = process.env.PRIVATE_WALLET_KEY;
const signerPvtKey = Buffer.from(privateKey, "hex")  // create an object to match the contracts struct

const CouponTypeEnum = {
  PrivateSales: 0,
  WhiteListSales: 1
};

var CouponTypeCount = {
  BasicCount,
  UltrarareCount,
  LegendaireCount,
  eggCount
};

var CouponClaim = {
  user,
  legCount,
  urEggCount,
  urCount,
  basicEggCount,
  basicCount
}

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

const getCoupon = (address, BasicCount, UltrarareCount, LegendaireCount, eggCount, couponType) => {
  const userAddress = ethers.utils.getAddress(address);
  const hashBuffer = generateHashBuffer(
    ["uint256", "uint256", "uint256", "uint256", "uint256", "address"],
    [couponType, BasicCount, UltrarareCount, LegendaireCount, eggCount, userAddress]
  );
  const coupon = createCoupon(hashBuffer, signerPvtKey);
  return serializeCoupon(coupon)
};

module.exports = {
  getCoupon,
  CouponTypeEnum
}