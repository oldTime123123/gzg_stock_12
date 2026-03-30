// 
import request from "~/api/request.ts";


/**
 * @description 新股接口
 */
export function getIpoRecordList(params) {
  return request({
    url: "/ipo/list",
    method: "GET",
    params,
  });
}

interface submitIpo {
  ipoId: number;
  number:number
}
/**
 * @description 购买新股
 */
export function submitIpoBuyApi(data: submitIpo) {
  return request({
    url: "/ipo/submit",
    method: "POST",
    data,
  });
}


// ipo/apply
export function ipoApplyDataApi(params) {
  return request({
    url: "/ipo/apply",
    method: "GET",
    params,
  });
}

// ipa 支付
export function ipoApplyPayApi(data) {
  return request({
    url: "/ipo/pay",
    method: "POST",
    data,
  });
}
// ipo中签通知
export function ipoNoticeApi() {
  return request({
    url: "/ipo/notify",
  });
}