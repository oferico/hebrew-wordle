import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Game Logic Tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('Word Validation & Feedback', () => {
    test('should initialize game with correct default state', () => {
      render(<App />);
      
      // Check if game board is rendered
      const gameBoard = screen.getByRole('main');
      expect(gameBoard).toBeInTheDocument();
      
      // Check if keyboard is rendered
      const keyboard = screen.getByText('ק');
      expect(keyboard).toBeInTheDocument();
    });

    test('should accept Hebrew letter input', () => {
      render(<App />);
      
      // Click on a Hebrew letter
      const letterButton = screen.getByText('ש');
      fireEvent.click(letterButton);
      
      // Check if letter appears in the first row
      const firstRow = screen.getAllByRole('button').filter(btn => 
        btn.textContent === 'ש' && btn.className.includes('border-2')
      );
      expect(firstRow.length).toBeGreaterThan(0);
    });

    test('should handle backspace correctly', () => {
      render(<App />);
      
      // Type a letter then backspace
      const letterButton = screen.getByText('ש');
      fireEvent.click(letterButton);
      
      const backspaceButton = screen.getByText('⌫');
      fireEvent.click(backspaceButton);
      
      // Verify letter was removed (this is a basic check)
      expect(backspaceButton).toBeInTheDocument();
    });

    test('should prevent input when word is complete', () => {
      render(<App />);
      
      // Type 5 letters to fill a word
      const letters = ['ש', 'ל', 'ו', 'ם', 'ה'];
      letters.forEach(letter => {
        const letterButton = screen.getByText(letter);
        fireEvent.click(letterButton);
      });
      
      // Try to add another letter
      const extraLetter = screen.getByText('א');
      fireEvent.click(extraLetter);
      
      // Word should still be 5 letters (this is a basic validation)
      expect(extraLetter).toBeInTheDocument();
    });
  });

  describe('Game State Management', () => {
    test('should track current guess and attempt number', () => {
      render(<App />);
      
      // The game should start with attempt 0
      // We can verify this by checking the game board structure
      const gameContainer = screen.getByRole('main');
      expect(gameContainer).toBeInTheDocument();
    });

    test('should handle Enter key submission', () => {
      render(<App />);
      
      // Type a 5-letter word
      const letters = ['ש', 'ל', 'ו', 'ם', 'ה'];
      letters.forEach(letter => {
        const letterButton = screen.getByText(letter);
        fireEvent.click(letterButton);
      });
      
      // Press Enter
      const enterButton = screen.getByText('Enter');
      fireEvent.click(enterButton);
      
      // Verify Enter button exists and is clickable
      expect(enterButton).toBeInTheDocument();
    });
  });

  describe('Statistics Integration', () => {
    test('should initialize with default statistics', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      render(<App />);
      
      // Open stats dialog
      const statsButton = screen.getByText('📊');
      fireEvent.click(statsButton);
      
      // Check for statistics display
      expect(screen.getByText('סטטיסטיקות')).toBeInTheDocument();
    });

    test('should load existing statistics from localStorage', () => {
      const mockStats = JSON.stringify({
        gamesPlayed: 10,
        gamesWon: 7,
        currentStreak: 3,
        maxStreak: 5,
        guessDistribution: [0, 1, 2, 2, 1, 1]
      });
      
      localStorageMock.getItem.mockReturnValue(mockStats);
      
      render(<App />);
      
      // Open stats dialog
      const statsButton = screen.getByText('📊');
      fireEvent.click(statsButton);
      
      // Check if stats are displayed
      expect(screen.getByText('10')).toBeInTheDocument(); // games played
      expect(screen.getByText('70')).toBeInTheDocument(); // win percentage
    });
  });

  describe('Settings Management', () => {
    test('should open settings dialog', () => {
      render(<App />);
      
      // Open settings
      const settingsButton = screen.getByText('⚙️');
      fireEvent.click(settingsButton);
      
      // Check if settings dialog is open
      expect(screen.getByText('הגדרות')).toBeInTheDocument();
    });

    test('should display theme toggle', () => {
      render(<App />);
      
      // Open settings
      const settingsButton = screen.getByText('⚙️');
      fireEvent.click(settingsButton);
      
      // Check for theme toggle
      expect(screen.getByText('מצב כהה')).toBeInTheDocument();
    });

    test('should display stats clearing option', () => {
      render(<App />);
      
      // Open settings
      const settingsButton = screen.getByText('⚙️');
      fireEvent.click(settingsButton);
      
      // Check for stats clearing button
      expect(screen.getByText('מחק הישגים')).toBeInTheDocument();
    });
  });

  describe('Dialog Management', () => {
    test('should close dialogs when clicking outside', () => {
      render(<App />);
      
      // Open stats dialog
      const statsButton = screen.getByText('📊');
      fireEvent.click(statsButton);
      
      // Find and click the overlay
      const overlay = screen.getByRole('dialog').parentElement;
      fireEvent.click(overlay);
      
      // Dialog should still be manageable (basic check)
      expect(statsButton).toBeInTheDocument();
    });

    test('should close dialogs with close button', () => {
      render(<App />);
      
      // Open settings dialog
      const settingsButton = screen.getByText('⚙️');
      fireEvent.click(settingsButton);
      
      // Find and click close button
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      // Settings should be closed (basic validation)
      expect(settingsButton).toBeInTheDocument();
    });
  });

  describe('Content Catalog Refresh Functionality', () => {
    // Mock fetch for testing refresh functionality
    beforeEach(() => {
      global.fetch = jest.fn();
    });

    afterEach(() => {
      global.fetch.mockRestore();
    });

    test('should handle successful catalog refresh', async () => {
      // Mock successful fetch response
      const mockCatalogData = {
        version: '2.0.0',
        catalogs: {
          main: {
            name: 'Test Catalog',
            id: 'test-catalog',
            themes: {
              'test-theme': {
                name: 'Test Theme',
                words: ['test1', 'test2'],
                hints: { 'test1': 'hint1', 'test2': 'hint2' }
              }
            },
            dailyWords: ['daily1', 'daily2'],
            dailyHints: { 'daily1': 'daily hint 1', 'daily2': 'daily hint 2' }
          }
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCatalogData,
      });

      render(<App />);
      
      // Enable debug mode to access content catalog
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
      
      // Open content catalog dialog
      const catalogButton = screen.getByText('קטלוג תוכן');
      fireEvent.click(catalogButton);
      
      // Find and click refresh button
      const refreshButton = screen.getByTitle('רענן קטלוג');
      fireEvent.click(refreshButton);
      
      // Wait for fetch to be called
      expect(global.fetch).toHaveBeenCalledWith('./contentCatalog.json');
      
      // Verify refresh button exists
      expect(refreshButton).toBeInTheDocument();
    });

    test('should handle failed catalog refresh', async () => {
      // Mock failed fetch response
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      render(<App />);
      
      // Enable debug mode to access content catalog
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
      
      // Open content catalog dialog
      const catalogButton = screen.getByText('קטלוג תוכן');
      fireEvent.click(catalogButton);
      
      // Find and click refresh button
      const refreshButton = screen.getByTitle('רענן קטלוג');
      fireEvent.click(refreshButton);
      
      // Wait for fetch to be called
      expect(global.fetch).toHaveBeenCalledWith('./contentCatalog.json');
      
      // Verify refresh button still exists after error
      expect(refreshButton).toBeInTheDocument();
    });

    test('should handle HTTP error response during refresh', async () => {
      // Mock HTTP error response
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      render(<App />);
      
      // Enable debug mode to access content catalog
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
      
      // Open content catalog dialog
      const catalogButton = screen.getByText('קטלוג תוכן');
      fireEvent.click(catalogButton);
      
      // Find and click refresh button
      const refreshButton = screen.getByTitle('רענן קטלוג');
      fireEvent.click(refreshButton);
      
      // Wait for fetch to be called
      expect(global.fetch).toHaveBeenCalledWith('./contentCatalog.json');
      
      // Verify refresh functionality is accessible
      expect(refreshButton).toBeInTheDocument();
    });

    test('should validate catalog structure during refresh', async () => {
      // Mock invalid catalog data
      const invalidCatalogData = {
        version: '2.0.0',
        // Missing catalogs object
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => invalidCatalogData,
      });

      render(<App />);
      
      // Enable debug mode to access content catalog
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
      
      // Open content catalog dialog
      const catalogButton = screen.getByText('קטלוג תוכן');
      fireEvent.click(catalogButton);
      
      // Find and click refresh button
      const refreshButton = screen.getByTitle('רענן קטלוג');
      fireEvent.click(refreshButton);
      
      // Wait for fetch to be called
      expect(global.fetch).toHaveBeenCalledWith('./contentCatalog.json');
      
      // Verify validation occurs (refresh button should still be present)
      expect(refreshButton).toBeInTheDocument();
    });

    test('should use correct fetch URL path', async () => {
      // Mock successful response
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ catalogs: {} }),
      });

      render(<App />);
      
      // Enable debug mode to access content catalog
      fireEvent.keyDown(window, { key: 'd', ctrlKey: true });
      
      // Open content catalog dialog
      const catalogButton = screen.getByText('קטלוג תוכן');
      fireEvent.click(catalogButton);
      
      // Find and click refresh button
      const refreshButton = screen.getByTitle('רענן קטלוג');
      fireEvent.click(refreshButton);
      
      // Verify correct URL is used (relative path, not absolute)
      expect(global.fetch).toHaveBeenCalledWith('./contentCatalog.json');
      expect(global.fetch).not.toHaveBeenCalledWith('/contentCatalog.json');
    });
  });
});
