import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

/**
 * Schema Fixer Module
 * Fixes structured data errors by adding missing fields and correcting invalid values
 */
class SchemaFixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix LocalBusiness schema errors
   * @param {Object} schema - LocalBusiness schema object
   * @param {Array<Object>} errors - Array of validation errors
   * @returns {Object} Fixed schema
   */
  fixLocalBusiness(schema, errors) {
    const fixed = { ...schema };

    errors.forEach(error => {
      switch (error.field) {
        case 'name':
          if (!fixed.name) {
            fixed.name = 'Business Name'; // Placeholder
            this.logger.warn('Added placeholder name to LocalBusiness schema');
          }
          break;

        case 'address':
          if (!fixed.address) {
            fixed.address = {
              '@type': 'PostalAddress',
              streetAddress: 'Street Address',
              addressLocality: 'City',
              addressRegion: 'State',
              postalCode: '00000',
              addressCountry: 'Country'
            };
            this.logger.warn('Added placeholder address to LocalBusiness schema');
          } else if (typeof fixed.address === 'string') {
            // Convert string address to PostalAddress object
            fixed.address = {
              '@type': 'PostalAddress',
              streetAddress: fixed.address,
              addressLocality: 'City',
              addressRegion: 'State',
              postalCode: '00000',
              addressCountry: 'Country'
            };
            this.logger.info('Converted string address to PostalAddress object');
          }
          break;

        case 'telephone':
          if (!fixed.telephone) {
            fixed.telephone = '+1-555-555-5555'; // Placeholder
            this.logger.warn('Added placeholder telephone to LocalBusiness schema');
          }
          break;

        case 'url':
          if (!fixed.url && error.severity === 'warning') {
            // Don't add placeholder URL, just log
            this.logger.info('Consider adding URL to LocalBusiness schema');
          }
          break;

        case 'image':
          if (!fixed.image && error.severity === 'warning') {
            this.logger.info('Consider adding image to LocalBusiness schema');
          }
          break;

        case 'priceRange':
          if (!fixed.priceRange && error.severity === 'warning') {
            this.logger.info('Consider adding priceRange to LocalBusiness schema');
          }
          break;

        case 'openingHours':
          if (!fixed.openingHours && error.severity === 'warning') {
            this.logger.info('Consider adding openingHours to LocalBusiness schema');
          }
          break;

        default:
          // Handle nested fields like address.streetAddress
          if (error.field.startsWith('address.')) {
            const addressField = error.field.split('.')[1];
            if (!fixed.address || typeof fixed.address !== 'object') {
              fixed.address = { '@type': 'PostalAddress' };
            }
            if (!fixed.address[addressField]) {
              fixed.address[addressField] = 'Placeholder';
              this.logger.warn(`Added placeholder ${addressField} to address`);
            }
          }
          break;
      }
    });

    return fixed;
  }

  /**
   * Fix FAQPage schema errors
   * @param {Object} schema - FAQPage schema object
   * @param {Array<Object>} errors - Array of validation errors
   * @returns {Object} Fixed schema
   */
  fixFAQPage(schema, errors) {
    const fixed = { ...schema };

    // Ensure mainEntity exists and is an array
    if (!fixed.mainEntity) {
      fixed.mainEntity = [];
      this.logger.warn('Added empty mainEntity array to FAQPage schema');
    } else if (!Array.isArray(fixed.mainEntity)) {
      fixed.mainEntity = [fixed.mainEntity];
      this.logger.info('Converted mainEntity to array');
    }

    // Fix each question
    errors.forEach(error => {
      if (error.field.startsWith('mainEntity[')) {
        // Extract index from field like "mainEntity[0].name"
        const match = error.field.match(/mainEntity\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          
          // Ensure question exists at this index
          if (!fixed.mainEntity[index]) {
            fixed.mainEntity[index] = {
              '@type': 'Question',
              name: 'Question text',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Answer text'
              }
            };
            this.logger.warn(`Added placeholder question at index ${index}`);
            return;
          }

          const question = fixed.mainEntity[index];

          // Fix @type for Question
          if (error.field === `mainEntity[${index}].@type`) {
            question['@type'] = 'Question';
          }

          // Fix name
          if (error.field === `mainEntity[${index}].name`) {
            if (!question.name) {
              question.name = 'Question text';
              this.logger.warn(`Added placeholder name to question ${index}`);
            }
          }

          // Fix acceptedAnswer
          if (error.field === `mainEntity[${index}].acceptedAnswer`) {
            if (!question.acceptedAnswer) {
              question.acceptedAnswer = {
                '@type': 'Answer',
                text: 'Answer text'
              };
              this.logger.warn(`Added placeholder acceptedAnswer to question ${index}`);
            }
          }

          // Fix acceptedAnswer @type
          if (error.field === `mainEntity[${index}].acceptedAnswer.@type`) {
            if (!question.acceptedAnswer) {
              question.acceptedAnswer = { '@type': 'Answer' };
            } else {
              question.acceptedAnswer['@type'] = 'Answer';
            }
          }

          // Fix acceptedAnswer text
          if (error.field === `mainEntity[${index}].acceptedAnswer.text`) {
            if (!question.acceptedAnswer) {
              question.acceptedAnswer = { '@type': 'Answer', text: 'Answer text' };
            } else if (!question.acceptedAnswer.text) {
              question.acceptedAnswer.text = 'Answer text';
              this.logger.warn(`Added placeholder text to answer ${index}`);
            }
          }
        }
      }
    });

    return fixed;
  }

  /**
   * Fix Article schema errors
   * @param {Object} schema - Article schema object
   * @param {Array<Object>} errors - Array of validation errors
   * @returns {Object} Fixed schema
   */
  fixArticle(schema, errors) {
    const fixed = { ...schema };

    errors.forEach(error => {
      switch (error.field) {
        case 'headline':
          if (!fixed.headline) {
            fixed.headline = 'Article Headline';
            this.logger.warn('Added placeholder headline to Article schema');
          }
          break;

        case 'author':
          if (!fixed.author) {
            fixed.author = {
              '@type': 'Person',
              name: 'Author Name'
            };
            this.logger.warn('Added placeholder author to Article schema');
          } else if (typeof fixed.author === 'string') {
            fixed.author = {
              '@type': 'Person',
              name: fixed.author
            };
            this.logger.info('Converted string author to Person object');
          }
          break;

        case 'datePublished':
          if (!fixed.datePublished) {
            fixed.datePublished = new Date().toISOString().split('T')[0];
            this.logger.warn('Added current date as datePublished');
          }
          break;

        case 'image':
          if (!fixed.image && error.severity === 'warning') {
            this.logger.info('Consider adding image to Article schema');
          }
          break;

        case 'dateModified':
          if (!fixed.dateModified && error.severity === 'warning') {
            this.logger.info('Consider adding dateModified to Article schema');
          }
          break;

        case 'publisher':
          if (!fixed.publisher && error.severity === 'warning') {
            this.logger.info('Consider adding publisher to Article schema');
          }
          break;

        default:
          // Handle nested fields like author.name
          if (error.field.startsWith('author.')) {
            const authorField = error.field.split('.')[1];
            if (!fixed.author || typeof fixed.author !== 'object') {
              fixed.author = { '@type': 'Person' };
            }
            if (authorField === '@type' && !fixed.author['@type']) {
              fixed.author['@type'] = 'Person';
            }
            if (authorField === 'name' && !fixed.author.name) {
              fixed.author.name = 'Author Name';
              this.logger.warn('Added placeholder author name');
            }
          }
          break;
      }
    });

    return fixed;
  }

  /**
   * Fix BreadcrumbList schema errors
   * @param {Object} schema - BreadcrumbList schema object
   * @param {Array<Object>} errors - Array of validation errors
   * @returns {Object} Fixed schema
   */
  fixBreadcrumbList(schema, errors) {
    const fixed = { ...schema };

    // Ensure itemListElement exists and is an array
    if (!fixed.itemListElement) {
      fixed.itemListElement = [];
      this.logger.warn('Added empty itemListElement array to BreadcrumbList schema');
    } else if (!Array.isArray(fixed.itemListElement)) {
      fixed.itemListElement = [fixed.itemListElement];
      this.logger.info('Converted itemListElement to array');
    }

    // Fix each list item
    errors.forEach(error => {
      if (error.field.startsWith('itemListElement[')) {
        const match = error.field.match(/itemListElement\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[1]);
          
          if (!fixed.itemListElement[index]) {
            fixed.itemListElement[index] = {
              '@type': 'ListItem',
              position: index + 1,
              name: 'Item Name',
              item: 'https://example.com'
            };
            this.logger.warn(`Added placeholder list item at index ${index}`);
            return;
          }

          const item = fixed.itemListElement[index];

          if (error.field.includes('.@type')) {
            item['@type'] = 'ListItem';
          }
          if (error.field.includes('.position') && !item.position) {
            item.position = index + 1;
          }
          if (error.field.includes('.name') && !item.name) {
            item.name = 'Item Name';
            this.logger.warn(`Added placeholder name to list item ${index}`);
          }
          if (error.field.includes('.item') && !item.item) {
            item.item = 'https://example.com';
            this.logger.warn(`Added placeholder item URL to list item ${index}`);
          }
        }
      }
    });

    return fixed;
  }

  /**
   * Fix schema errors based on type
   * @param {Object} schema - Schema object
   * @param {Array<Object>} errors - Array of validation errors
   * @returns {Object} Fixed schema
   */
  fixSchemaErrors(schema, errors) {
    if (!schema || !errors || errors.length === 0) {
      return schema;
    }

    const schemaType = schema['@type'];
    if (!schemaType) {
      this.logger.error('Cannot fix schema without @type');
      return schema;
    }

    const type = Array.isArray(schemaType) ? schemaType[0] : schemaType;

    switch (type) {
      case 'LocalBusiness':
        return this.fixLocalBusiness(schema, errors);
      case 'FAQPage':
        return this.fixFAQPage(schema, errors);
      case 'Article':
      case 'BlogPosting':
      case 'NewsArticle':
        return this.fixArticle(schema, errors);
      case 'BreadcrumbList':
        return this.fixBreadcrumbList(schema, errors);
      default:
        this.logger.warn(`No automatic fix available for schema type: ${type}`);
        return schema;
    }
  }

  /**
   * Update schema in HTML file
   * @param {string} filePath - Path to HTML/JSX file
   * @param {Object} oldSchema - Old schema object
   * @param {Object} newSchema - New fixed schema object
   * @returns {Promise<boolean>} True if successful
   */
  async updateSchemaInFile(filePath, oldSchema, newSchema) {
    try {
      // Create backup
      const backupPath = `${filePath}.backup.${Date.now()}`;
      await fs.copyFile(filePath, backupPath);
      this.logger.info(`Created backup: ${backupPath}`);

      // Read file content
      const content = await fs.readFile(filePath, 'utf-8');

      // Convert schemas to formatted JSON strings
      const oldSchemaStr = JSON.stringify(oldSchema, null, 2);
      const newSchemaStr = JSON.stringify(newSchema, null, 2);

      // Replace old schema with new schema
      const updatedContent = content.replace(oldSchemaStr, newSchemaStr);

      if (updatedContent === content) {
        this.logger.warn(`Schema not found in file: ${filePath}`);
        // Remove backup since no changes were made
        await fs.unlink(backupPath);
        return false;
      }

      // Write updated content
      await fs.writeFile(filePath, updatedContent, 'utf-8');
      this.logger.info(`Updated schema in file: ${filePath}`);

      return true;
    } catch (error) {
      this.logger.error(`Failed to update schema in file: ${filePath}`, { error: error.message });
      
      // Attempt rollback if backup exists
      const backupPath = `${filePath}.backup.${Date.now()}`;
      try {
        await fs.access(backupPath);
        await fs.copyFile(backupPath, filePath);
        await fs.unlink(backupPath);
        this.logger.info('Rolled back changes');
      } catch (rollbackError) {
        // Backup doesn't exist or rollback failed
      }

      return false;
    }
  }

  /**
   * Fix schema issues for a URL
   * @param {Object} schemaIssue - Schema issue object from SchemaValidator
   * @param {string} filePath - Path to file containing the schema
   * @returns {Promise<Object>} Fix result
   */
  async fixSchemaIssue(schemaIssue, filePath) {
    try {
      if (!schemaIssue || !schemaIssue.issues || schemaIssue.issues.length === 0) {
        return {
          success: false,
          message: 'No issues to fix'
        };
      }

      const fixedSchemas = [];
      let totalFixed = 0;

      for (const issue of schemaIssue.issues) {
        const { schema, errors } = issue;
        
        // Only fix errors, not warnings
        const criticalErrors = errors.filter(e => e.severity === 'error');
        
        if (criticalErrors.length === 0) {
          this.logger.info(`No critical errors for schema type ${issue.schemaType}`);
          continue;
        }

        const fixedSchema = this.fixSchemaErrors(schema, criticalErrors);
        fixedSchemas.push({
          original: schema,
          fixed: fixedSchema,
          schemaType: issue.schemaType
        });
        totalFixed++;
      }

      if (totalFixed === 0) {
        return {
          success: false,
          message: 'No critical errors to fix'
        };
      }

      // If filePath is provided, update the file
      if (filePath) {
        for (const { original, fixed } of fixedSchemas) {
          await this.updateSchemaInFile(filePath, original, fixed);
        }
      }

      return {
        success: true,
        message: `Fixed ${totalFixed} schema(s)`,
        fixedSchemas
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `fixSchemaIssue: ${schemaIssue.url}`);
      return {
        success: false,
        message: `Failed to fix schema: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Batch fix schema issues
   * @param {Array<Object>} schemaIssues - Array of schema issues
   * @param {Function} filePathResolver - Function to resolve file path from URL
   * @returns {Promise<Object>} Fix result summary
   */
  async fixSchemaIssues(schemaIssues, filePathResolver = null) {
    this.logger.info(`Fixing schema issues for ${schemaIssues.length} pages`);

    const results = {
      total: schemaIssues.length,
      fixed: 0,
      failed: 0,
      skipped: 0,
      details: []
    };

    for (const issue of schemaIssues) {
      let filePath = null;
      
      if (filePathResolver) {
        try {
          filePath = filePathResolver(issue.url);
        } catch (error) {
          this.logger.warn(`Could not resolve file path for ${issue.url}`);
        }
      }

      const result = await this.fixSchemaIssue(issue, filePath);

      if (result.success) {
        results.fixed++;
      } else if (result.message.includes('No')) {
        results.skipped++;
      } else {
        results.failed++;
      }

      results.details.push({
        url: issue.url,
        status: result.success ? 'fixed' : 'failed',
        message: result.message
      });
    }

    this.logger.info(`Schema fix complete. Fixed: ${results.fixed}, Failed: ${results.failed}, Skipped: ${results.skipped}`);

    return results;
  }
}

export default SchemaFixer;
