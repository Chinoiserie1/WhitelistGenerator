const {
  keccak256,
  toBuffer,
  ecsign,
  bufferToHex,
} = require("ethereumjs-utils");
const {ethers} = require('ethers');

const privateKey = "";
const privateKeyV2 = process.env.PRIVATE_WALLET_KEY;
const signerPvtKey = Buffer.from(privateKey, "hex")  // create an object to match the contracts struct

const CouponTypeEnum = {
  HQWL: 0,
  MuseumWL: 1,
  MansionWL: 2,
  PrivateWL: 3,
  PublicWL: 4,
  ReservedWL: 5
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

const getCoupon = (address, couponType) => {
  const userAddress = ethers.utils.getAddress(address);
  const hashBuffer = generateHashBuffer(
    ["uint256", "address"],
    [couponType, userAddress]
  );
  const coupon = createCoupon(hashBuffer, signerPvtKey);
  return serializeCoupon(coupon)
};

module.exports = {
  getCoupon,
  CouponTypeEnum
}