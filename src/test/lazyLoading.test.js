import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OptimizedImage from '../components/OptimizedImage';

// Mock the imageMap
vi.mock('@/utils/imageMap.json', () => ({
  default: {
    'test-image': {
      original: '/test-image.webp',
      srcSet: '/test-image-320w.webp 320w, /test-image-640w.webp 640w',
      sizes: '(max-width: 640px) 100vw, 640px',
      width: 640,
      height: 480
    }
  }
}));

describe('Lazy Loading Implementation', () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks();
  });

  it('should add loading="lazy" attribute to images by default', () => {
    const { container } = render(React.createElement(OptimizedImage, { src: "/test-image.webp", alt: "Test Image" }));
    const img = container.querySelector('img[alt="Test Image"]');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should add explicit width and height attributes', () => {
    const { container } = render(React.createElement(OptimizedImage, { src: "/test-image.webp", alt: "Test Image" }));
    const img = container.querySelector('img[alt="Test Image"]');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
  });

  it('should support eager loading for above-fold images', () => {
    const { container } = render(React.createElement(OptimizedImage, { src: "/test-image.webp", alt: "Test Image", loading: "eager" }));
    const img = container.querySelector('img[alt="Test Image"]');
    expect(img).toHaveAttribute('loading', 'eager');
  });

  it('should include srcset for responsive images', async () => {
    const { container } = render(React.createElement(OptimizedImage, { src: "/test-image.webp", alt: "Test Image" }));
    const img = container.querySelector('img[alt="Test Image"]');
    
    await waitFor(() => {
      expect(img).toHaveAttribute('srcset');
    });
  });

  it('should handle images without responsive versions', () => {
    const { container } = render(React.createElement(OptimizedImage, { src: "/unknown-image.webp", alt: "Unknown Image" }));
    const img = container.querySelector('img[alt="Unknown Image"]');
    expect(img).toBeInTheDocument();
  });

  it('should accept custom width and height props', () => {
    const { container } = render(
      React.createElement(OptimizedImage, { 
        src: "/test-image.webp", 
        alt: "Test Image", 
        width: 800, 
        height: 600 
      })
    );
    const img = container.querySelector('img[alt="Test Image"]');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '600');
  });
});
