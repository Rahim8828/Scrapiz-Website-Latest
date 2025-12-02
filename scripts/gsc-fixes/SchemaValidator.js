import axios from 'axios';
import * as cheerio from 'cheerio';
import { isValidUrl } from './utils.js';

/**
 * Schema Validator Module
 * Validates and detects issues in structured data (JSON-LD, Microdata, RDFa)
 */
class SchemaValidator {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true
    });
  }

  /**
   * Extract JSON-LD from HTML
   * @param {string} html - HTML content
   * @returns {Array<Object>} Array of JSON-LD objects
   */
  extractJsonLd(html) {
    if (!html) {
      return [];
    }

    try {
      const $ = cheerio.load(html);
      const jsonLdScripts = [];

      $('script[type="application/ld+json"]').each((_, elem) => {
        try {
          const content = $(elem).html();
          if (content) {
            const parsed = JSON.parse(content);
            jsonLdScripts.push(parsed);
          }
        } catch (error) {
          this.logger.warn('Failed to parse JSON-LD script', { error: error.message });
        }
      });

      return jsonLdScripts;
    } catch (error) {
      this.logger.error('Error extracting JSON-LD', { error: error.message });
      return [];
    }
  }

  /**
   * Detect schema type from JSON-LD object
   * @param {Object} schema - JSON-LD object
   * @returns {string|null} Schema type
   */
  detectSchemaType(schema) {
    if (!schema || typeof schema !== 'object') {
      return null;
    }

    // Handle @type as string or array
    const type = schema['@type'];
    if (!type) {
      return null;
    }

    if (Array.isArray(type)) {
      return type[0];
    }

    return type;
  }

  /**
   * Validate LocalBusiness schema
   * @param {Object} schema - LocalBusiness schema object
   * @returns {Array<Object>} Array of validation errors
   */
  validateLocalBusiness(schema) {
    const errors = [];

    // Required fields for LocalBusiness
    const requiredFields = ['name', 'address', 'telephone'];

    requiredFields.forEach(field => {
      if (!schema[field]) {
        errors.push({
          field,
          message: `Missing required field: ${field}`,
          severity: 'error'
        });
      }
    });

    // Validate name
    if (schema.name && typeof schema.name !== 'string') {
      errors.push({
        field: 'name',
        message: 'Name must be a string',
        severity: 'error'
      });
    }

    // Validate address
    if (schema.address) {
      if (typeof schema.address === 'string') {
        // String address is valid but not recommended
        errors.push({
          field: 'address',
          message: 'Address should be a PostalAddress object for better structure',
          severity: 'warning'
        });
      } else if (typeof schema.address === 'object') {
        // Validate PostalAddress structure
        const addressRequired = ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode', 'addressCountry'];
        addressRequired.forEach(field => {
          if (!schema.address[field]) {
            errors.push({
              field: `address.${field}`,
              message: `Missing recommended address field: ${field}`,
              severity: 'warning'
            });
          }
        });
      }
    }

    // Validate telephone
    if (schema.telephone) {
      if (typeof schema.telephone !== 'string') {
        errors.push({
          field: 'telephone',
          message: 'Telephone must be a string',
          severity: 'error'
        });
      } else if (!schema.telephone.match(/^\+?[\d\s\-()]+$/)) {
        errors.push({
          field: 'telephone',
          message: 'Telephone format appears invalid. Use international format (e.g., +1-555-555-5555)',
          severity: 'warning'
        });
      }
    }

    // Validate optional but recommended fields
    const recommendedFields = ['url', 'image', 'priceRange', 'openingHours'];
    recommendedFields.forEach(field => {
      if (!schema[field]) {
        errors.push({
          field,
          message: `Missing recommended field: ${field}`,
          severity: 'warning'
        });
      }
    });

    // Validate URL if present
    if (schema.url && !isValidUrl(schema.url)) {
      errors.push({
        field: 'url',
        message: 'URL is not valid',
        severity: 'error'
      });
    }

    // Validate image if present
    if (schema.image) {
      if (typeof schema.image === 'string' && !isValidUrl(schema.image)) {
        errors.push({
          field: 'image',
          message: 'Image URL is not valid',
          severity: 'error'
        });
      } else if (Array.isArray(schema.image)) {
        schema.image.forEach((img, index) => {
          if (typeof img === 'string' && !isValidUrl(img)) {
            errors.push({
              field: `image[${index}]`,
              message: 'Image URL is not valid',
              severity: 'error'
            });
          }
        });
      }
    }

    return errors;
  }

  /**
   * Validate FAQPage schema
   * @param {Object} schema - FAQPage schema object
   * @returns {Array<Object>} Array of validation errors
   */
  validateFAQPage(schema) {
    const errors = [];

    // Required field: mainEntity
    if (!schema.mainEntity) {
      errors.push({
        field: 'mainEntity',
        message: 'Missing required field: mainEntity',
        severity: 'error'
      });
      return errors;
    }

    // mainEntity should be an array of Question objects
    if (!Array.isArray(schema.mainEntity)) {
      errors.push({
        field: 'mainEntity',
        message: 'mainEntity must be an array of Question objects',
        severity: 'error'
      });
      return errors;
    }

    // Validate each Question
    schema.mainEntity.forEach((question, index) => {
      // Check @type
      if (question['@type'] !== 'Question') {
        errors.push({
          field: `mainEntity[${index}].@type`,
          message: 'Each item in mainEntity must have @type: "Question"',
          severity: 'error'
        });
      }

      // Check name (the question text)
      if (!question.name) {
        errors.push({
          field: `mainEntity[${index}].name`,
          message: 'Question is missing required field: name',
          severity: 'error'
        });
      }

      // Check acceptedAnswer
      if (!question.acceptedAnswer) {
        errors.push({
          field: `mainEntity[${index}].acceptedAnswer`,
          message: 'Question is missing required field: acceptedAnswer',
          severity: 'error'
        });
      } else {
        // Validate acceptedAnswer structure
        if (question.acceptedAnswer['@type'] !== 'Answer') {
          errors.push({
            field: `mainEntity[${index}].acceptedAnswer.@type`,
            message: 'acceptedAnswer must have @type: "Answer"',
            severity: 'error'
          });
        }

        if (!question.acceptedAnswer.text) {
          errors.push({
            field: `mainEntity[${index}].acceptedAnswer.text`,
            message: 'acceptedAnswer is missing required field: text',
            severity: 'error'
          });
        }
      }
    });

    return errors;
  }

  /**
   * Validate Article schema
   * @param {Object} schema - Article schema object
   * @returns {Array<Object>} Array of validation errors
   */
  validateArticle(schema) {
    const errors = [];

    // Required fields for Article
    const requiredFields = ['headline', 'author', 'datePublished'];

    requiredFields.forEach(field => {
      if (!schema[field]) {
        errors.push({
          field,
          message: `Missing required field: ${field}`,
          severity: 'error'
        });
      }
    });

    // Validate headline
    if (schema.headline && typeof schema.headline !== 'string') {
      errors.push({
        field: 'headline',
        message: 'Headline must be a string',
        severity: 'error'
      });
    }

    // Validate author
    if (schema.author) {
      if (typeof schema.author === 'string') {
        errors.push({
          field: 'author',
          message: 'Author should be a Person or Organization object',
          severity: 'warning'
        });
      } else if (typeof schema.author === 'object') {
        if (!schema.author['@type']) {
          errors.push({
            field: 'author.@type',
            message: 'Author object must have @type (Person or Organization)',
            severity: 'error'
          });
        }
        if (!schema.author.name) {
          errors.push({
            field: 'author.name',
            message: 'Author object must have name',
            severity: 'error'
          });
        }
      }
    }

    // Validate datePublished
    if (schema.datePublished && !this.isValidDate(schema.datePublished)) {
      errors.push({
        field: 'datePublished',
        message: 'datePublished must be in ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)',
        severity: 'error'
      });
    }

    // Recommended fields
    const recommendedFields = ['image', 'dateModified', 'publisher'];
    recommendedFields.forEach(field => {
      if (!schema[field]) {
        errors.push({
          field,
          message: `Missing recommended field: ${field}`,
          severity: 'warning'
        });
      }
    });

    return errors;
  }

  /**
   * Validate BreadcrumbList schema
   * @param {Object} schema - BreadcrumbList schema object
   * @returns {Array<Object>} Array of validation errors
   */
  validateBreadcrumbList(schema) {
    const errors = [];

    // Required field: itemListElement
    if (!schema.itemListElement) {
      errors.push({
        field: 'itemListElement',
        message: 'Missing required field: itemListElement',
        severity: 'error'
      });
      return errors;
    }

    if (!Array.isArray(schema.itemListElement)) {
      errors.push({
        field: 'itemListElement',
        message: 'itemListElement must be an array',
        severity: 'error'
      });
      return errors;
    }

    // Validate each ListItem
    schema.itemListElement.forEach((item, index) => {
      if (item['@type'] !== 'ListItem') {
        errors.push({
          field: `itemListElement[${index}].@type`,
          message: 'Each item must have @type: "ListItem"',
          severity: 'error'
        });
      }

      if (!item.position) {
        errors.push({
          field: `itemListElement[${index}].position`,
          message: 'ListItem is missing required field: position',
          severity: 'error'
        });
      }

      if (!item.item) {
        errors.push({
          field: `itemListElement[${index}].item`,
          message: 'ListItem is missing required field: item',
          severity: 'error'
        });
      } else if (typeof item.item === 'string' && !isValidUrl(item.item)) {
        errors.push({
          field: `itemListElement[${index}].item`,
          message: 'item URL is not valid',
          severity: 'error'
        });
      }

      if (!item.name) {
        errors.push({
          field: `itemListElement[${index}].name`,
          message: 'ListItem is missing required field: name',
          severity: 'error'
        });
      }
    });

    return errors;
  }

  /**
   * Check if date string is valid ISO 8601 format
   * @param {string} dateString - Date string to validate
   * @returns {boolean} True if valid
   */
  isValidDate(dateString) {
    if (!dateString || typeof dateString !== 'string') {
      return false;
    }

    // Check ISO 8601 format
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
    if (!iso8601Regex.test(dateString)) {
      return false;
    }

    // Try to parse the date
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  /**
   * Validate schema based on type
   * @param {Object} schema - Schema object
   * @returns {Array<Object>} Array of validation errors
   */
  validateSchemaByType(schema) {
    const schemaType = this.detectSchemaType(schema);

    if (!schemaType) {
      return [{
        field: '@type',
        message: 'Missing or invalid @type field',
        severity: 'error'
      }];
    }

    switch (schemaType) {
      case 'LocalBusiness':
        return this.validateLocalBusiness(schema);
      case 'FAQPage':
        return this.validateFAQPage(schema);
      case 'Article':
      case 'BlogPosting':
      case 'NewsArticle':
        return this.validateArticle(schema);
      case 'BreadcrumbList':
        return this.validateBreadcrumbList(schema);
      default:
        // For unknown types, just check for @context
        if (!schema['@context']) {
          return [{
            field: '@context',
            message: 'Missing @context field',
            severity: 'error'
          }];
        }
        return [];
    }
  }

  /**
   * Fetch page and validate all schemas
   * @param {string} url - URL to validate
   * @returns {Promise<Object|null>} Schema validation result
   */
  async validateSchema(url) {
    try {
      const response = await this.httpClient.get(url);

      if (response.status !== 200) {
        this.logger.warn(`Cannot validate schema for ${url} - status ${response.status}`);
        return null;
      }

      const schemas = this.extractJsonLd(response.data);

      if (schemas.length === 0) {
        return {
          url,
          hasSchema: false,
          schemas: [],
          issues: [],
          recommendation: 'No structured data found. Consider adding schema markup'
        };
      }

      const schemaIssues = [];

      schemas.forEach((schema, index) => {
        const schemaType = this.detectSchemaType(schema);
        const errors = this.validateSchemaByType(schema);

        if (errors.length > 0) {
          schemaIssues.push({
            schemaIndex: index,
            schemaType,
            schema,
            errors
          });
        }
      });

      if (schemaIssues.length === 0) {
        return null; // No issues found
      }

      return {
        url,
        hasSchema: true,
        schemas,
        issues: schemaIssues,
        recommendation: this.getSchemaRecommendation(schemaIssues)
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `validateSchema: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation based on schema issues
   * @param {Array<Object>} schemaIssues - Array of schema issues
   * @returns {string} Recommendation
   */
  getSchemaRecommendation(schemaIssues) {
    const errorCount = schemaIssues.reduce((count, issue) => {
      return count + issue.errors.filter(e => e.severity === 'error').length;
    }, 0);

    const warningCount = schemaIssues.reduce((count, issue) => {
      return count + issue.errors.filter(e => e.severity === 'warning').length;
    }, 0);

    const parts = [];
    if (errorCount > 0) {
      parts.push(`Fix ${errorCount} error(s)`);
    }
    if (warningCount > 0) {
      parts.push(`address ${warningCount} warning(s)`);
    }

    return `${parts.join(' and ')} in structured data to improve search appearance`;
  }

  /**
   * Batch validate schemas for multiple URLs
   * @param {Array<string>} urls - URLs to validate
   * @returns {Promise<Array<Object>>} Array of schema issues
   */
  async validateSchemas(urls) {
    this.logger.info(`Validating schemas for ${urls.length} URLs`);

    const issues = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.validateSchema(url))
      );

      issues.push(...batchResults.filter(issue => issue !== null));

      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Schema validation complete. Found ${issues.length} pages with issues`);
    return issues;
  }
}

export default SchemaValidator;
