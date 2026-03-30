import request from "~/api/request.ts";
/**
 * @description 手机号注册
 */
export function joinRegister(data) {
  return request({
    url: "/join/account/register",
    method: "POST",
    data,
  });
}
/**
 * @description 邮箱注册
 */
export function emailRegister(data) {
  return request({
    url: "/join/email/register",
    method: "POST",
    data,
  });
}
/**
 * @description 手机发送验证码
 */
export function sendPhoneCode(data) {
  return request({
    url: "/join/sms",
    method: "POST",
    data: data,
  });
}
/**
 * @description 邮箱发送验证码
 */
export function sendEmailCode(data) {
  return request({
    url: "/join/email/sms",
    method: "POST",
    data,
  });
}
/**
 * @description 获取注册信息
 */
export function registerSetting() {
  return request({
    url: "/setting/register",
  });
}
/**
 * @returns 隐私协议
 */
export function getUserAgent() {
  return request({
    url: "/setting/userAgreement",
  });
}
/**
 * @description 登陆
 */
export function joinLogin(data) {
  return request({
    url: "/join/account/login",
    method: "POST",
    data,
  });
}
/**
 * @description 邮箱登陆
 */
export function emailLogin(data) {
  return request({
    url: "/join/email/login",
    method: "POST",
    data,
  });
}
/**
 * @description 获取区号
 */
export function countryApi() {
  return request({
    url: "/setting/country",
  });
}

/**
 * @description 获取网站app内容
 */
export function getWebSite() {
  return request({
    url: "/setting/website",
  });
}
/**
 * @description 用户信息
 */
export function getUserInfo() {
  return request({
    url: "/user/index",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 用户账户资金
 */
export function getUserAccountBalance() {
  return request({
    url: "/user/attribute/userAccountBalance",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 语言列表
 */
export function langListApi() {
  return request({
    url: "/setting/lang",
  });
}
/**
 * @description 获取上传配置
 */
export function getUploadHostService() {
  return request({
    url: "/setting/upload",
  });
}

/**
 * @description 获取平台货币符号  /setting/userAgreement
 */
export function getPlantCurrency() {
  return request({
    url: "/setting/currency",
  });
}

// /**
//  * @description 图片验证码
//  */
// export function imgVerifyConfigApi() {
//   return request({
//     url: "/join/imgVerifyConfig",
//     params,
//   });
// }

//

/**
 * @description 获取验证码
 */
export function sendCodeHandle(data) {
  return request({
    url: "user/send",
    method: "POST",
    data,
  });
}

/**
 * @description 账号注册
 */
export function joinAccountRegister(data) {
  return request({
    url: "join/accountRegister",
    method: "POST",
    data,
  });
}

/**
 * @description 用户提现银行卡列表
 */
export function getUserBankcardList() {
  return request({
    url: "/user/attribute/bankcardList",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 用户提现银行卡详情
 */
export function getUserBankcardInfo(bankId?: number) {
  return request({
    url: "/user/attribute/bankcardInfo" + (bankId ? `?bankId=${bankId}` : ""),
    cancelable: false, // 不可取消
  });
}

/**
 * @description 用户提现银行卡编辑和新增
 */
export function postUserBankcard(data: {
  id?: number;
  bank_num: string;
  bank_name: string;
  account_holder: string;
  other_param_1: string;
  street: string;
  balance_type: number;
}) {
  return request({
    url: "/user/attribute/setCard",
    method: "POST",
    data,
    cancelable: true, // 不可取消
  });
}

/**
 * @description 用户提现银行卡删除
 */
export function delUserBankcard(id: number) {
  return request({
    url: "/user/attribute/delCard",
    method: "POST",
    data: { id },
    cancelable: true, // 不可取消
  });
}

/**
 * @description 首页滚动通知
 */
export function homeNoitceBarInfo() {
  return request({
    url: "/home/marquee",
  });
}

/**
 * @description 新闻列表
 */
export function getNewsList(params) {
  return request({
    url: "/page/article/lists",
    params,
  });
}

/**
 * @description 新闻详情
 */
export function getNewsDetail(params) {
  return request({
    url: "/page/article/detail",
    params,
  });
}
/**
 * @param market_type vol
 * @description 获取市场列表
 */
export function getTradeProduct(data) {
  return request({
    url: "/trade/productList",
    method: "POST",
    data: {
      ...data,
    },
  });
}

/**
 * @param market_type vol
 * @description 获取市场列表
 */
export function getCollectList(page: number, limit: number) {
  return request({
    url: `/user/collectList?page=${page}&size=${limit}`,
    method: "GET",
  });
}

/**
 * @description 股市信息
 */
export function getStockIndexList() {
  return request({
    url: "/stock/indexList",
  });
}

//
/**
 * @description 股票详情
 */
export function getProductInfo(data) {
  return request({
    url: "/trade/productInfo",
    method: "POST",
    data,
  });
}

/**
 * @description 用户余额流水记录
 */
export function getUserBalanceRecord(
  page: number,
  limit: number,
  type: number
) {
  return request({
    url: `/user/record/balance?page=${page}&size=${limit}&type=${type}`,
    method: "GET",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 用户充值记录
 */
export function getUserPaymentRecord(page: number, limit: number) {
  return request({
    url: `/user/record/recharge?page=${page}&size=${limit}`,
    method: "GET",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 用户提现记录
 */
export function getUserWithdrawalRecord(page: number, limit: number) {
  return request({
    url: `/user/record/withdraw?page=${page}&size=${limit}`,
    method: "GET",
    cancelable: false, // 不可取消
  });
}

/**
 * @description 股票收藏
*/
export function stockCollect(data) {
  return request({
    url: "/user/collect",
    method: "POST",
    data,
  });
}

//
/**
 * @description 股票搜索
*/
export function stockSearch(params) {
  return request({
    url: "/stock/search",
    params,
  });
}
/**
 * 协议
 * */
//
export function getUserAgreement() {
  return request({
    url: "/setting/userAgreement",
  });
}
