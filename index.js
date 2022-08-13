const { getCoupon, CouponTypeEnum } = require("./WhitelistGenerator");

const coupon = getCoupon("0x5E5871153763645D552Ba5D9082597f3be3D0788", 0, 0, 0, 0, CouponTypeEnum.PrivateSales);
console.log(coupon);
