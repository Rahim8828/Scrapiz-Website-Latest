import { describe, test, expect, beforeEach } from 'vitest';
import CanonicalDetector from './CanonicalDetector.js';
import CanonicalFixer from './CanonicalFixer.js';

// Mock logger
const mockLogger = {
  info: () => {},
  error: () => {},
  logIssue: () => {},
  logFix: () => {}
};

// Mock error handler
const mockErrorHandler = {
  handleError: (error, context) => ({ action: 'skip' }),
  createBackup: async (filePath) => `${filePath}.backup`,
  rollback: async (backupPath, originalPath) => {}
};

describe('CanonicalDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new CanonicalDetector(mockLogger, mockErrorHandler);
  });

  describe('extractCanonicalTag', () => {
    test('extracts canonical tag from HTML', () => {
      const html = '<html><head><link rel="canonical" href="https://example.com/page" /></head></html>';
      const canonical = detector.extractCanonicalTag(html, 'https://example.com/page');
      expect(canonical).toBe('https://example.com/page');
    });

    test('returns null when no canonical tag exists', () => {
      const html = '<html><head><title>Test</title></head></html>';
      const canonical = detector.extractCanonicalTag(html, 'https://example.com/page');
      expect(canonical).toBeNull();
    });

    test('resolves relative canonical URLs', () => {
      const html = '<html><head><link rel="canonical" href="/page" /></head></html>';
      const canonical = detector.extractCanonicalTag(html, 'https://example.com/other');
      expect(canonical).toBe('https://example.com/page');
    });

    test('handles empty HTML', () => {
      const canonical = detector.extractCanonicalTag('', 'https://example.com/page');
      expect(canonical).toBeNull();
    });

    test('handles null HTML', () => {
      const canonical = detector.extractCanonicalTag(null, 'https://example.com/page');
      expect(canonical).toBeNull();
    });
  });

  describe('calculateContentSimilarity', () => {
    test('returns 1 for identical content', () => {
      const html1 = '<html><body><p>This is test content</p></body></html>';
      const html2 = '<html><body><p>This is test content</p></body></html>';
      const similarity = detector.calculateContentSimilarity(html1, html2);
      expect(similarity).toBeGreaterThan(0.9);
    });

    test('returns 0 for completely different content', () => {
      const html1 = '<html><body><p>First content</p></body></html>';
      const html2 = '<html><body><p>Completely different text here</p></body></html>';
      const similarity = detector.calculateContentSimilarity(html1, html2);
      expect(similarity).toBeLessThan(0.5);
    });

    test('returns 0 for empty HTML', () => {
      const similarity = detector.calculateContentSimilarity('', '<html><body>Content</body></html>');
      expect(similarity).toBe(0);
    });

    test('returns 0 for null HTML', () => {
      const similarity = detector.calculateContentSimilarity(null, null);
      expect(similarity).toBe(0);
    });

    test('detects high similarity for similar content', () => {
      const html1 = '<html><body><p>This is a test page with some content</p></body></html>';
      const html2 = '<html><body><p>This is a test page with similar content</p></body></html>';
      const similarity = detector.calculateContentSimilarity(html1, html2);
      expect(similarity).toBeGreaterThan(0.7);
    });
  });

  describe('getCanonicalRecommendation', () => {
    test('provides recommendation for invalid URL', () => {
      const validation = { reason: 'invalid-url', status: null };
      const recommendation = detector.getCanonicalRecommendation(validation);
      expect(recommendation).toContain('invalid');
    });

    test('provides recommendation for non-200 status', () => {
      const validation = { reason: 'non-200-status', status: 404 };
      const recommendation = detector.getCanonicalRecommendation(validation);
      expect(recommendation).toContain('404');
    });

    test('provides recommendation for noindex target', () => {
      const validation = { reason: 'noindex', status: 200 };
      const recommendation = detector.getCanonicalRecommendation(validation);
      expect(recommendation).toContain('noindex');
    });

    test('provides recommendation for fetch error', () => {
      const validation = { reason: 'fetch-error', status: null };
      const recommendation = detector.getCanonicalRecommendation(validation);
      expect(recommendation).toContain('accessible');
    });
  });
});

describe('CanonicalFixer', () => {
  let fixer;

  beforeEach(() => {
    fixer = new CanonicalFixer(mockLogger, mockErrorHandler);
  });

  describe('insertCanonicalInHelmet', () => {
    test('inserts canonical tag into Helmet component', () => {
      const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
      </Helmet>
    </div>
  );
}
`;
      const canonicalUrl = 'https://example.com/page';
      const updated = fixer.insertCanonicalInHelmet(content, canonicalUrl);
      
      expect(updated).toContain('rel="canonical"');
      expect(updated).toContain(canonicalUrl);
    });

    test('does not insert if canonical already exists', () => {
      const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
        <link rel="canonical" href="https://example.com/existing" />
      </Helmet>
    </div>
  );
}
`;
      const canonicalUrl = 'https://example.com/page';
      const updated = fixer.insertCanonicalInHelmet(content, canonicalUrl);
      
      expect(updated).toBe(content);
    });

    test('returns unchanged content if no Helmet found', () => {
      const content = `
function Page() {
  return <div>No Helmet here</div>;
}
`;
      const canonicalUrl = 'https://example.com/page';
      const updated = fixer.insertCanonicalInHelmet(content, canonicalUrl);
      
      expect(updated).toBe(content);
    });
  });

  describe('replaceCanonicalInHelmet', () => {
    test('replaces existing canonical tag', () => {
      const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
        <link rel="canonical" href="https://example.com/old" />
      </Helmet>
    </div>
  );
}
`;
      const oldCanonical = 'https://example.com/old';
      const newCanonical = 'https://example.com/new';
      const updated = fixer.replaceCanonicalInHelmet(content, oldCanonical, newCanonical);
      
      expect(updated).toContain(newCanonical);
      expect(updated).not.toContain(oldCanonical);
    });

    test('returns unchanged content if no canonical found', () => {
      const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
      </Helmet>
    </div>
  );
}
`;
      const oldCanonical = 'https://example.com/old';
      const newCanonical = 'https://example.com/new';
      const updated = fixer.replaceCanonicalInHelmet(content, oldCanonical, newCanonical);
      
      expect(updated).toBe(content);
    });
  });
});
