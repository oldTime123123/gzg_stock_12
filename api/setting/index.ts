// 
import request from "~/api/request.ts";


/**
 * @description 用户实名信息
 */
export function getUserRealInfo(params) {
  return request({
    url: "/user/realInfo",
    method: "GET",
    params,
  });
}

/**
 * @returns 实名
 * @param {
 *  type 1身份证 2护照 3驾照
 *  name
 *  number 号码
 *  id_front 正面
 *  id_back
 * }
 */
export function realNameService(data) {
  return request({
    url: "/user/real",
    method: "POST",
    data
  });
}

/**
 * @returns 修改密码
 * @param    {
 * old_password, password, password2 ,type: 0 登陆密码 1支付密码}
 */
export function updatePwdApi(data) {
  return request({
    url: "/user/attribute/password",
    method: "POST",
    data,
  });
}