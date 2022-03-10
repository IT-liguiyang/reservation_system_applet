/* eslint-disable import/no-commonjs */
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event) => {
  console.log(event.phone, event.code);
  try {
    const result = await cloud.openapi.cloudbase.sendSms({
      env: 'reservation-system-7diwnb2d9a3a5',
      content: '验证码为：' + event.code,
      phoneNumberList: [
        '+86' + event.phone
      ]
    });
    return result;
  } catch (err) {
    return err;
  }
};