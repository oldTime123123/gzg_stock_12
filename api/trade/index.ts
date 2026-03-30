//
import request from "~/api/request.ts";

/**
 * @description 大宗交易可申请列表 1.大宗交易 2.日内交易
 */
export function getTradeList(params) {
  return request({
    url: "/trade/gzg/list",
    method: "GET",
    params,
  });
}

/**
 * @description 大宗交易已申请列表 1.大宗交易 2.日内交易
 */
export function getTradeLog(params) {
  return request({
    url: "/trade/gzg/log",
    method: "GET",
    params,
  });
}

/**
 * @description 大宗交易申请 1.大宗交易 2.日内交易
 */
export function subTradeHandle(data) {
  return request({
    url: "/trade/gzg/apply",
    method: "POST",
    data,
  });
}

/**
 * @description 交易协议日志
 */
export function getTradeDealLog(page: number, size: number, status: number) {
  return request({
    url: "/trade/dealLog",
    method: "POST",
    data: { page, size, status }
  });
}

/**
 * @description 购买仓位
 * */
export function subBuyStockHandle(data) {
  return request({
    url: "/trade/dealBuy",
    method: "POST",
    data,
  });
}
//

/**
 * @description 平仓
 * */
export function subCloseStockHandle(data) {
  return request({
    url: "/trade/dealSell",
    method: "POST",
    data,
  });
}

//
/**
 * @description 订单详情
 * */
export function getRecordDetails(params) {
  return request({
    url: "/trade/dealDetail",
    method: "GET",
    params,
  });
}

/**
 * @description 利息宝信息
 * */
export function getLixibaoInfo(params) {
  return request({
    url: "/lixibao/index",
    method: "GET",
    params,
  });
}

/**
 * @description 利息宝中断
 * */
export function interruptLixibaoHandle(data) {
  return request({
    url: "/lixibao/interrupt",
    method: "POST",
    data,
  });
}
/**
 * @description 利息宝记录
 * */
export function getLixibaoLog(params) {
  return request({
    url: "/lixibao/log",
    method: "GET",
    params,
  });
}
/**
 * @param id  amount
 * @description 投资利息宝
 * */
export function investLixibaoHandle(data) {
  return request({
    url: "/lixibao/invest",
    method: "POST",
    data,
  });
}

//
/**
 * @description 利息宝详情
 * */
export function getLixibaoDetail(params) {
  return request({
    url: "/lixibao/info",
    method: "GET",
    params,
  });
}
