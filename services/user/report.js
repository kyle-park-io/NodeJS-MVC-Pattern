import * as crypto from "../../utils/crypto.js";

import { reportModel } from "../../models/userModel/reportSchema.js";

import { sequelize } from "../../models/index.js";
import initModels from "../../models/init-models.js";
let models = initModels(sequelize);

// import { pool } from "../../models/index";

import { logger } from "../../utils/logger.js";

import {
  ERROR_MESSAGE,
  REQ_HEADER,
  SUCCESS_MESSAGE,
  HTTP_STATUS_CODE,
  // HEADER_KEY_TOKEN,
  MESSAGES,
} from "../../utils/constants.js";

/**
 * Register Report
 * @param {object} - Reports Data
 * @returns {object}
 **/
export const registerReport = async (data) => {
  let result;

  // Save report in the database
  try {
    result = await models.report.create(data);
  } catch (err) {
    logger.error(
      "registerReport Error : " + ERROR_MESSAGE.FETCHING_USER_ERROR + err
    );
    return { isSuccess: false, data: err };
  }
  return result;
};

export const checkReportByReportNumber = async (data) => {
  let cond = { reportNumber: data.reportNumber };

  try {
    const reportRecord = await models.report.findAndCountAll({
      where: cond,
    });

    logger.info(SUCCESS_MESSAGE.RECORD_CHECKED);
    return { isSuccess: true, data: reportRecord.count > 0 ? true : false };
  } catch (err) {
    logger.error("Error In Check Report");
    return { isSuccess: false, data: err };
  }
};

/**
 * Fetch report record
 * @param {object} data - "Fetch report record using reportNumber"
 * @returns {object}
 **/
export const fetchReportRecord = async (data) => {
  let cond = { reportNumber: data.reportNumber };

  logger.info("fetchReportRecord data : " + JSON.stringify(data));

  try {
    const reportRecord = await models.report.findOne({
      where: cond,
    });

    if (!reportRecord) {
      return { isSuccess: false, data: ERROR_MESSAGE.REPORT_NUMBER_NOT_EXIST };
    } else {
      //  데이터 정제 필요하면 ㄱㄱ
      const reportData = {
        reportNumber: reportRecord.reportNumber,
        carNumber: reportRecord.carNumber,
        detectionDate: reportRecord.detectionDate,
        location: reportRecord.location,
        imageMetadata: reportRecord.imageMetadata,
        imageFiles: reportRecord.imageFiles,
      };
      return { isSuccess: true, data: reportData };
    }
  } catch (err) {
    logger.error(ERROR_MESSAGE.FETCHING_USER_ERROR + err);
    return { isSuccess: false, data: err };
  }
};

/**
 * Fetch recent report record
 * @param {object} data - "Fetch recent report record"
 * @returns {object}
 **/
export const fetchRecentReportRecord = async (data) => {
  logger.info("fetchRecentReportRecord data : " + JSON.stringify(data));

  try {
    const recentReportRecord = await models.report.findAll({
      limit: 10,
      order: [["_id", "DESC"]],
    });

    if (!recentReportRecord) {
      return { isSuccess: false, data: ERROR_MESSAGE.REPORT_NUMBER_NOT_EXIST };
    } else {
      // 데이터 정제 필요하면 여기서
      // const reportData = {
      //   reportNumber: reportRecord.reportNumber,
      //   carNumber: reportRecord.carNumber,
      //   detectionDate: reportRecord.detectionDate,
      //   location: reportRecord.location,
      //   imageMetadata: reportRecord.imageMetadata,
      //   imageFiles: reportRecord.imageFiles,
      // };
      return { isSuccess: true, data: recentReportRecord };
    }
  } catch (err) {
    logger.error(ERROR_MESSAGE.FETCHING_USER_ERROR + err);
    return { isSuccess: false, data: err };
  }
};
