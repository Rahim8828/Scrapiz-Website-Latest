/**
 * Test script to verify GSC Fix System setup
 */

import { initializeSystem } from './index.js';

async function testSetup() {
  console.log('Testing GSC Fix System setup...\n');
  
  try {
    // Initialize system
    console.log('1. Initializing system...');
    const { logger, errorHandler, utils } = await initializeSystem();
    console.log('✓ System initialized successfully\n');
    
    // Test logger
    console.log('2. Testing logger...');
    await logger.info('Test info message');
    await logger.warn('Test warning message');
    await logger.debug('Test debug message');
    console.log('✓ Logger working\n');
    
    // Test error handler
    console.log('3. Testing error handler...');
    const testError = new Error('Test error');
    testError.code = 'ENOENT';
    const recovery = errorHandler.handleError(testError, 'test-context');
    console.log(`✓ Error handler working (recovery: ${recovery.action})\n`);
    
    // Test utilities
    console.log('4. Testing utilities...');
    const url = 'https://example.com/page/';
    const normalized = utils.normalizeUrl(url);
    console.log(`   Normalized URL: ${normalized}`);
    
    const text = '<p>Hello world</p>';
    const extracted = utils.extractTextFromHtml(text);
    console.log(`   Extracted text: ${extracted}`);
    
    const wordCount = utils.countWords('This is a test sentence');
    console.log(`   Word count: ${wordCount}`);
    console.log('✓ Utilities working\n');
    
    // Test dependencies
    console.log('5. Testing dependencies...');
    
    // Test cheerio
    const cheerio = await import('cheerio');
    const $ = cheerio.load('<div>Test</div>');
    console.log(`   Cheerio: ${$('div').text()}`);
    
    // Test xml2js
    const xml2js = await import('xml2js');
    const parser = new xml2js.Parser();
    console.log('   xml2js: Parser created');
    
    // Test axios
    const axios = await import('axios');
    console.log('   axios: Module loaded');
    
    // Test fast-check
    const fc = await import('fast-check');
    console.log('   fast-check: Module loaded');
    
    console.log('✓ All dependencies working\n');
    
    // Get log summary
    console.log('6. Getting log summary...');
    const logs = await logger.readLogs();
    console.log(`   Total log entries: ${logs.length}`);
    console.log('✓ Log reading working\n');
    
    console.log('✅ All tests passed! GSC Fix System is ready.\n');
    console.log(`Log file: ${logger.getLogFilePath()}`);
    
  } catch (error) {
    console.error('❌ Setup test failed:', error);
    process.exit(1);
  }
}

testSetup();
