import request from "~/api/request.ts";

/**
 * @description 充值列表
 */
export function getRechargeTypeList(params) {
  return request({
    url: "/finance/product/list",
    method: "GET",
    params,
  });
}

/**
 * @description 充值详情
 */
export function getRechargeInfo(params) {
  return request({
    url: "/finance/product/info",
    method: "GET",
    params,
  });
}

//
/**
 * @description 提现详情
 */
export function getWithdrawInfo(params) {
  return request({
    url: "/finance/product/withdraw/info",
    method: "GET",
    params,
  });
}

/**
 * @description 检查用户信息
 */
export function getWithdrawAddressInfo(params) {
  return request({
    url: "/finance/product/withdraw/address",
    method: "GET",
    params,
  });
}
//

/**
 * @description 提交提现
 */
export function submitWithdraw(data) {
  return request({
    url: "/finance/product/withdraw/submit",
    method: "POST",
    data,
  });
}
/**
 * @description 充值提现配置
 */
export function getSettingFinanceWay(data) {
  return request({
    url: "/setting/financeWay",
    method: "GET",
    data,
  });
}
/**
 * @description 客服列表
 */
export function getSettingService(params) {
  return request({
    url: "/setting/customerService",
    method: "GET",
    params,
  });
}
// 
/**
 * @description 银行卡提现信息
 */
export function getBankWithdrawInfo() {
  return request({
    url: "/finance/withdraw/bank/index",
    method: "GET",
  });
}

// 
/**
 * @description 银行卡提现
 */
export function submitBankWithdraw(data) {
  return request({
    url: "/finance/withdraw/bank/submit",
    method: "POST",
    data
  });
}

//  贷款信息
export function getLoanInfo() {
  return request({
    url: "/activity/loan/index",
  });
}

//  贷款
export function subLoanhandle(data) {
  return request({
    url: "/activity/loan/submit",
    method: 'POST',
    data
  });
}
// ?market_type=2
//  贷款
export function getLoanLogs(params) {
  return request({
    url: "/activity/loan/log",
    method: "GET",
    params,
  });
}