/**
 * GSC Fix System - Core Utilities
 * Main entry point for the Google Search Console indexing fix system
 */

import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import IssueDetector from './IssueDetector.js';
import CrawlAnalyzer from './CrawlAnalyzer.js';
import * as utils from './utils.js';

/**
 * Initialize the GSC Fix System
 * @returns {Promise<Object>} Initialized system components
 */
export async function initializeSystem() {
  // Initialize logger
  const logger = new Logger();
  await logger.initialize();
  
  // Initialize error handler
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  
  // Initialize issue detector
  const issueDetector = new IssueDetector(logger, errorHandler);
  
  // Initialize crawl analyzer
  const crawlAnalyzer = new CrawlAnalyzer(logger, errorHandler);
  
  logger.info('GSC Fix System initialized successfully');
  
  return {
    logger,
    errorHandler,
    issueDetector,
    crawlAnalyzer,
    utils
  };
}

export { Logger, ErrorHandler, IssueDetector, CrawlAnalyzer, utils };
