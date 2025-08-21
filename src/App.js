import React, { useState, useEffect } from 'react';
import { Settings, Trophy, Lightbulb, Star, ToggleLeft, ToggleRight, X, HelpCircle, Delete, ArrowRight, RefreshCw, Database } from 'lucide-react';

// App version - update this when releasing new versions
const APP_VERSION = '1.4.1';

// Content catalog file path - update this if the file location changes
const CONTENT_CATALOG_PATH = '/hebrew-wordle/contentCatalog.json';

// Content catalog loading and validation
const loadContentCatalog = async () => {
  try {
    const response = await fetch(CONTENT_CATALOG_PATH);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Response is not JSON - likely a 404 page');
    }
    
    const catalogData = await response.json();
    
    // Validate catalog structure
    if (!catalogData.catalogs || typeof catalogData.catalogs !== 'object') {
      throw new Error('Invalid catalog structure: missing catalogs object');
    }
    
    // Validate each catalog
    for (const [catalogKey, catalog] of Object.entries(catalogData.catalogs)) {
      if (!catalog.name || !catalog.id || !catalog.themes) {
        throw new Error(`Invalid catalog structure for ${catalogKey}: missing required fields`);
      }
      
      // Validate themes
      for (const [themeKey, theme] of Object.entries(catalog.themes)) {
        if (!theme.name || !theme.words || !Array.isArray(theme.words) || !theme.hints) {
          throw new Error(`Invalid theme structure for ${catalogKey}.${themeKey}: missing required fields`);
        }
      }
      
      // Validate daily words
      if (!catalog.dailyWords || !Array.isArray(catalog.dailyWords) || !catalog.dailyHints) {
        throw new Error(`Invalid daily words structure for ${catalogKey}: missing required fields`);
      }
    }
    
    console.log('Content catalog loaded and validated successfully:', catalogData.version);
    return catalogData;
  } catch (error) {
    console.error('Failed to load content catalog:', error);
    throw error;
  }
};

// No hardcoded content - always load from external files

function App() {
  // Content catalog system - always require external files
  const [currentCatalog, setCurrentCatalog] = useState('main');
  const [slugMode, setSlugMode] = useState(window.location.pathname.includes('-'));
  const [loadedCatalogs, setLoadedCatalogs] = useState(null);
  
  // Only use loaded catalogs - no fallback
  const catalogs = loadedCatalogs || {};
  
  const activeContent = catalogs[currentCatalog] || { themes: {}, dailyWords: [], name: 'Loading...' };
  const themes = activeContent.themes || {};
  const dailyWords = activeContent.dailyWords || [];

  const [currentTheme, setCurrentTheme] = useState(Object.keys(themes)[0]);
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [usedWords, setUsedWords] = useState({});
  const [solvedWords, setSolvedWords] = useState({});
  const [isDailyWord, setIsDailyWord] = useState(false);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [categoryCompleted, setCategoryCompleted] = useState(false);
  const [allCategoriesCompleted, setAllCategoriesCompleted] = useState(false);
  const [dailyWordsUsed, setDailyWordsUsed] = useState([]);
  const [easyMode, setEasyMode] = useState(false);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [enabledCatalogs, setEnabledCatalogs] = useState(['main']);
  const [darkMode, setDarkMode] = useState(false);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0], // Index 0 = 1 guess, Index 1 = 2 guesses, etc.
    gamesLost: 0 // Track failed games for X row
  });
  const [gameLog, setGameLog] = useState([]);
  const [showGameLog, setShowGameLog] = useState(false);
  const [showGameCompleted, setShowGameCompleted] = useState(false);
  const [contentCatalog, setContentCatalog] = useState(null);
  const [catalogLoadError, setCatalogLoadError] = useState(null);
  const [showContentCatalog, setShowContentCatalog] = useState(false);
  const [selectedWordHint, setSelectedWordHint] = useState(null);
  const [showWordHintDialog, setShowWordHintDialog] = useState(false);
  const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);
  const [pendingCategoryCompletion, setPendingCategoryCompletion] = useState(false);

  const maxGuesses = 6;
  const wordLength = targetWord.length;

  // Calculate optimal square size based on word length (for words ≤ 8 chars)
  const getSquareSize = (wordLength) => {
    if (wordLength <= 4) return 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
    if (wordLength <= 6) return 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl';
    if (wordLength <= 8) return 'w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl';
    // Fallback for invalid long words (should not occur after filtering)
    return 'w-10 h-10 text-base';
  };

  // Filter words during catalog loading to prevent words longer than 8 characters
  const validateAndFilterWords = (words) => {
    return words.filter(word => {
      if (word.length > 8) {
        console.warn(`Word "${word}" is too long (${word.length} chars) and will be excluded`);
        return false;
      }
      return true;
    });
  };

  const hebrewKeyboard = [
    ['⌫', 'פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק', '\''],  // Backspace moved to top
    ['ף', 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש'],   // ף moved down from top row
    ['↵', 'ץ', 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז']    // Enter moved down from middle row
  ];

  // Logging system
  const addToGameLog = (event, details = {}) => {
    const timestamp = new Date().toLocaleString('he-IL');
    
    // Get current stats at the time of logging (after any updates)
    setGameLog(prev => {
      const logEntry = {
        timestamp,
        event,
        details: {
          ...details,
          catalog: activeContent.name,
          theme: currentTheme,
          targetWord: targetWord,
          guesses: guesses.length + 1,
          gameStats: { ...gameStats }
        }
      };
      return [logEntry, ...prev];
    });
  };

  // Generate random wrong word for debug
  const generateRandomWrongWord = () => {
    const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
    let randomWord = '';
    for (let i = 0; i < wordLength; i++) {
      let randomLetter;
      do {
        randomLetter = hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)];
      } while (targetWord[i] === randomLetter); // Ensure it's not the correct letter
      randomWord += randomLetter;
    }
    return randomWord;
  };

  // Load external content catalog on startup
  useEffect(() => {
    const loadExternalCatalog = async () => {
      try {
        const catalogData = await loadContentCatalog();
        console.log('External catalog loaded successfully, integrating into game...');
        
        
        setLoadedCatalogs(catalogData.catalogs);
        addToGameLog('CATALOG_LOADED_ON_STARTUP', { version: catalogData?.version || 'unknown' });
      } catch (error) {
        console.log('External catalog not available:', error.message);
        // Don't set error state on startup - just show loading state
      }
    };

    loadExternalCatalog();
  }, []);

  // Initialize used words tracking ONCE - wait for catalogs to load
  useEffect(() => {
    if (!loadedCatalogs) return; // Wait for catalogs to load
    
    const savedProgress = localStorage.getItem('hebrew-wordle-progress');
    const savedSolved = localStorage.getItem('hebrew-wordle-solved');
    const savedEasyMode = localStorage.getItem('hebrew-wordle-easy-mode');
    const savedDarkMode = localStorage.getItem('hebrew-wordle-dark-mode');
    
    if (savedProgress) {
      setUsedWords(JSON.parse(savedProgress));
    } else {
      const initialUsed = {};
      Object.keys(catalogs).forEach(catalogKey => {
        const catalog = catalogs[catalogKey];
        if (catalog && catalog.themes) {
          Object.keys(catalog.themes).forEach(theme => {
            initialUsed[`${catalogKey}_${theme}`] = [];
          });
          initialUsed[`${catalogKey}_daily`] = [];
        }
      });
      setUsedWords(initialUsed);
    }
    
    if (savedSolved) {
      setSolvedWords(JSON.parse(savedSolved));
    } else {
      const initialSolved = {};
      Object.keys(catalogs).forEach(catalogKey => {
        const catalog = catalogs[catalogKey];
        if (catalog && catalog.themes) {
          Object.keys(catalog.themes).forEach(theme => {
            initialSolved[`${catalogKey}_${theme}`] = [];
          });
          initialSolved[`${catalogKey}_daily`] = [];
        }
      });
      setSolvedWords(initialSolved);
    }
    
    if (savedEasyMode) {
      setEasyMode(JSON.parse(savedEasyMode));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    const savedStats = localStorage.getItem('hebrew-wordle-stats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
    
    setInitialized(true);
  }, [loadedCatalogs, catalogs]);

  // Debug mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'd') {
        event.preventDefault();
        setDebugMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (initialized && Object.keys(usedWords).length > 0) {
      localStorage.setItem('hebrew-wordle-progress', JSON.stringify(usedWords));
    }
  }, [usedWords, initialized]);

  // Save solved words to localStorage
  useEffect(() => {
    if (initialized && Object.keys(solvedWords).length > 0) {
      localStorage.setItem('hebrew-wordle-solved', JSON.stringify(solvedWords));
    }
  }, [solvedWords, initialized]);

  // Save easy mode preference
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('hebrew-wordle-easy-mode', JSON.stringify(easyMode));
    }
  }, [easyMode, initialized]);

  // Save dark mode preference
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('hebrew-wordle-dark-mode', JSON.stringify(darkMode));
    }
  }, [darkMode, initialized]);

  // Save game stats
  useEffect(() => {
    if (initialized) {
      localStorage.setItem('hebrew-wordle-stats', JSON.stringify(gameStats));
    }
  }, [gameStats, initialized]);

  // Initialize game when catalog changes
  useEffect(() => {
    if (initialized) {
      const firstTheme = Object.keys(themes)[0];
      setCurrentTheme(firstTheme);
      startNewGameForTheme(firstTheme);
    }
  }, [currentCatalog, initialized]);

  // Initialize game when theme changes
  useEffect(() => {
    if (initialized && !gameWon && !gameLost) {
      startNewGameForTheme(currentTheme);
    }
  }, [currentTheme, initialized]);

  const getAvailableWords = (theme) => {
    const allWords = themes[theme]?.words || [];
    const usedKey = `${currentCatalog}_${theme}`;
    const used = usedWords[usedKey] || [];
    return allWords.filter(word => !used.includes(word));
  };

  const getAvailableDailyWords = () => {
    return dailyWords.filter(word => !dailyWordsUsed.includes(word));
  };

  const getNextAvailableTheme = () => {
    const themeKeys = Object.keys(themes);
    for (const theme of themeKeys) {
      const available = getAvailableWords(theme);
      if (available.length > 0) {
        return theme;
      }
    }
    return null;
  };

  const areAllCategoriesComplete = () => {
    return Object.keys(themes).every(theme => getAvailableWords(theme).length === 0);
  };

  const startNewGameForTheme = (themeToUse = currentTheme) => {
    if (!initialized) return;
    
    const availableWords = getAvailableWords(themeToUse);
    
    if (availableWords.length === 0) {
      // If no words available in this theme, try to find next available theme
      const nextTheme = getNextAvailableTheme();
      if (nextTheme) {
        setCurrentTheme(nextTheme);
        const nextAvailableWords = getAvailableWords(nextTheme);
        if (nextAvailableWords.length > 0) {
          const selectedWord = nextAvailableWords[Math.floor(Math.random() * nextAvailableWords.length)];
          setTargetWord(selectedWord);
          setIsDailyWord(false);
          setGuesses([]);
          setCurrentGuess('');
          setGameWon(false);
          setGameLost(false);
          setShowHintDialog(false);
          setCategoryCompleted(false);
          setAllCategoriesCompleted(false);
          setShowWinAnimation(false);
          return;
        }
      }
      
      // If no themes have available words, try daily words
      const availableDaily = getAvailableDailyWords();
      if (availableDaily.length > 0) {
        const selectedWord = availableDaily[Math.floor(Math.random() * availableDaily.length)];
        setTargetWord(selectedWord);
        setIsDailyWord(true);
        setGuesses([]);
        setCurrentGuess('');
        setGameWon(false);
        setGameLost(false);
        setShowHintDialog(false);
        setCategoryCompleted(false);
        setAllCategoriesCompleted(false);
        setShowWinAnimation(false);
        return;
      }
      
      // If absolutely no words available anywhere, show all categories completed
      setAllCategoriesCompleted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      return;
    }
    
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    setTargetWord(selectedWord);
    setIsDailyWord(false);
    setGuesses([]);
    setCurrentGuess('');
    setGameWon(false);
    setGameLost(false);
    setShowHintDialog(false);
    setCategoryCompleted(false);
    setAllCategoriesCompleted(false);
    setShowWinAnimation(false);
  };

  const startNewGame = () => {
    if (!initialized) return;

    // Check if we should show a daily word (after completing a category word or when starting)
    const shouldShowDaily = !isDailyWord && wordsCompleted > 0;
    
    let selectedWord = '';
    let isDaily = false;

    if (shouldShowDaily) {
      const availableDaily = getAvailableDailyWords();
      if (availableDaily.length > 0) {
        // Pick a random daily word, but avoid the last one if we're cycling
        let candidateWords = availableDaily;
        if (dailyWordsUsed.length === dailyWords.length && availableDaily.length > 1) {
          // We've used all daily words, exclude the last one used to avoid repetition
          const lastUsed = dailyWordsUsed[dailyWordsUsed.length - 1];
          candidateWords = availableDaily.filter(word => word !== lastUsed);
        }
        selectedWord = candidateWords[Math.floor(Math.random() * candidateWords.length)];
        isDaily = true;
      }
    }

    if (!selectedWord) {
      // Try current theme first
      let availableWords = getAvailableWords(currentTheme);
      let themeToUse = currentTheme;
      
      // If current theme is complete, find next available theme
      if (availableWords.length === 0) {
        const nextTheme = getNextAvailableTheme();
        if (nextTheme) {
          themeToUse = nextTheme;
          setCurrentTheme(nextTheme);
          availableWords = getAvailableWords(nextTheme);
        } else {
          // All categories are complete
          setAllCategoriesCompleted(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
          return;
        }
      }
      
      selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      isDaily = false;
    }

    setTargetWord(selectedWord);
    setIsDailyWord(isDaily);
    setGuesses([]);
    setCurrentGuess('');
    setGameWon(false);
    setGameLost(false);
    setShowHintDialog(false);
    setCategoryCompleted(false);
    setAllCategoriesCompleted(false);
    setShowWinAnimation(false);
  };

  const markWordAsUsed = (word, isDaily) => {
    if (isDaily) {
      setDailyWordsUsed(prev => {
        const updated = [...prev, word];
        // If we've used all daily words, reset the list but keep the last word to avoid immediate repetition
        if (updated.length >= dailyWords.length) {
          return [word];
        }
        return updated;
      });
    } else {
      setUsedWords(prev => {
        const key = `${currentCatalog}_${currentTheme}`;
        const updated = {
          ...prev,
          [key]: [...(prev[key] || []), word]
        };
        return updated;
      });
      setWordsCompleted(prev => prev + 1);
      
      // Check if current category is now complete (only after the word is actually used in a game)
      const currentUsed = usedWords[`${currentCatalog}_${currentTheme}`] || [];
      const allWordsInCategory = themes[currentTheme]?.words || [];
      if (currentUsed.length + 1 >= allWordsInCategory.length) {
        // Category is complete when all words have been played (not necessarily solved)
        setPendingCategoryCompletion(true);
        setTimeout(() => {
          setCategoryCompleted(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }, 100); // Small delay to ensure game result dialog shows first
      }
    }
  };

  const markWordAsSolved = (word, isDaily) => {
    setSolvedWords(prev => {
      const key = isDaily ? `${currentCatalog}_daily` : `${currentCatalog}_${currentTheme}`;
      const updated = {
        ...prev,
        [key]: [...(prev[key] || []), word]
      };
      return updated;
    });
  };

  const updateGameStats = (won, guessCount, onStatsUpdated) => {
    setGameStats(prev => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: won ? prev.gamesWon + 1 : prev.gamesWon,
        currentStreak: won ? prev.currentStreak + 1 : 0,
        maxStreak: won ? Math.max(prev.maxStreak, prev.currentStreak + 1) : prev.maxStreak,
        guessDistribution: [...prev.guessDistribution],
        gamesLost: won ? (prev.gamesLost || 0) : (prev.gamesLost || 0) + 1
      };
      
      if (won && guessCount >= 1 && guessCount <= 6) {
        newStats.guessDistribution[guessCount - 1]++;
      }
      
      // Call the callback with the new stats
      if (onStatsUpdated) {
        setTimeout(() => onStatsUpdated(newStats), 0);
      }
      
      return newStats;
    });
  };

  const resetProgress = () => {
    const resetUsed = {};
    Object.keys(catalogs).forEach(catalogKey => {
      const catalog = catalogs[catalogKey];
      Object.keys(catalog.themes).forEach(theme => {
        resetUsed[`${catalogKey}_${theme}`] = [];
      });
      resetUsed[`${catalogKey}_daily`] = [];
    });
    setUsedWords(resetUsed);
    setSolvedWords({});
    setDailyWordsUsed([]);
    setWordsCompleted(0);
    setCategoryCompleted(false);
    setAllCategoriesCompleted(false);
    setGameStats({
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0, 0, 0, 0, 0, 0],
      gamesLost: 0
    });
    localStorage.removeItem('hebrew-wordle-progress');
    localStorage.removeItem('hebrew-wordle-solved');
    localStorage.removeItem('hebrew-wordle-stats');
    
    // Reset to first theme
    const firstTheme = Object.keys(themes)[0];
    setCurrentTheme(firstTheme);
    startNewGameForTheme(firstTheme);
  };

  const getHint = () => {
    if (isDailyWord) {
      return activeContent.dailyHints[targetWord] || 'מילה שימושית!';
    }
    
    for (const themeKey in themes) {
      if (themes[themeKey].hints && themes[themeKey].hints[targetWord]) {
        return themes[themeKey].hints[targetWord];
      }
    }
    
    return 'מילה מעניינת!';
  };

  const getWordHint = (word, catalogKey, isDaily = false) => {
    if (isDaily) {
      const catalog = catalogs[catalogKey];
      return catalog?.dailyHints?.[word] || 'מילה שימושית!';
    }
    
    const catalog = catalogs[catalogKey];
    if (!catalog) return 'מילה מעניינת!';
    
    for (const themeKey in catalog.themes) {
      if (catalog.themes[themeKey].hints && catalog.themes[themeKey].hints[word]) {
        return catalog.themes[themeKey].hints[word];
      }
    }
    
    return 'מילה מעניינת!';
  };

  const handleWordClick = (word, catalogKey, isDaily = false) => {
    const hint = getWordHint(word, catalogKey, isDaily);
    setSelectedWordHint({ word, hint });
    setShowWordHintDialog(true);
  };

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) return;
    if (guesses.includes(currentGuess)) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    // Normalize both words for comparison to handle geresh/apostrophe variations
    const normalizedGuess = normalizeWord(currentGuess);
    const normalizedTarget = normalizeWord(targetWord);

    if (normalizedGuess === normalizedTarget) {
      setGameWon(true);
      setShowWinAnimation(true);
      markWordAsUsed(targetWord, isDailyWord);
      markWordAsSolved(targetWord, isDailyWord);
      updateGameStats(true, newGuesses.length, (updatedStats) => {
        // Create a custom logging function that uses the updated stats
        const timestamp = new Date().toLocaleString('he-IL');
        const logEntry = {
          timestamp,
          event: 'WORD_GUESS_SUCCESS',
          details: {
            guessedWord: currentGuess, 
            guessNumber: newGuesses.length,
            isCorrect: true,
            catalog: activeContent.name,
            theme: currentTheme,
            targetWord: targetWord,
            guesses: newGuesses.length,
            gameStats: updatedStats
          }
        };
        setGameLog(prev => [logEntry, ...prev]);
      });
    } else if (newGuesses.length >= maxGuesses) {
      setGameLost(true);
      // Mark failed word as used so it doesn't appear again
      markWordAsUsed(targetWord, isDailyWord);
      updateGameStats(false, newGuesses.length, (updatedStats) => {
        // Create a custom logging function that uses the updated stats
        const timestamp = new Date().toLocaleString('he-IL');
        const logEntry = {
          timestamp,
          event: 'WORD_GUESS_FAILURE',
          details: {
            guessedWord: currentGuess, 
            guessNumber: newGuesses.length,
            isCorrect: false,
            gameEnded: true,
            catalog: activeContent.name,
            theme: currentTheme,
            targetWord: targetWord,
            guesses: newGuesses.length,
            gameStats: updatedStats
          }
        };
        setGameLog(prev => [logEntry, ...prev]);
      });
    } else {
      addToGameLog('WORD_GUESS_FAILURE', { 
        guessedWord: currentGuess, 
        guessNumber: newGuesses.length,
        isCorrect: false,
        gameEnded: false 
      });
    }

    setCurrentGuess('');
  };

  const isDuplicateGuess = currentGuess.length === wordLength && guesses.includes(currentGuess);

  const getLetterStatus = (letter, position, guess) => {
    if (guess === targetWord) return 'correct';
    if (targetWord[position] === letter) return 'correct-position';
    if (targetWord.includes(letter)) return 'correct-letter';
    return 'incorrect';
  };

  const getKeyboardLetterStatus = (letter) => {
    if (!easyMode) return '';
    
    for (const guess of guesses) {
      if (guess.includes(letter)) {
        const position = guess.indexOf(letter);
        return getLetterStatus(letter, position, guess);
      }
    }
    return '';
  };

  // Enhanced character normalization function
  const normalizeGeresh = (key) => {
    // Handle various representations of geresh/apostrophe
    if (key === "'" || key === '׳' || key === '\u05F3' || key === '\u0027') {
      return '׳'; // Hebrew geresh (U+05F3)
    }
    return key;
  };

  // Normalize entire word for comparison
  const normalizeWord = (word) => {
    return word.split('').map(char => normalizeGeresh(char)).join('');
  };

  const handleKeyPress = (key) => {
    if (gameWon || gameLost || categoryCompleted) return;

    if (key === 'מחק' || key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'שלח' || key === '↵') {
      submitGuess();
    } else if (currentGuess.length < wordLength) {
      // Enhanced geresh character handling - accept both ׳ and ' and normalize to ׳
      const normalizedKey = normalizeGeresh(key);
      setCurrentGuess(prev => prev + normalizedKey);
    }
  };

  // Add desktop keyboard support
  useEffect(() => {
    const handlePhysicalKeyDown = (event) => {
      if (gameWon || gameLost || categoryCompleted) return;
      
      // Prevent default behavior for game keys
      const gameKeys = ['Backspace', 'Enter', 'Delete'];
      const hebrewKeys = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת', 'ך', 'ם', 'ן', 'ף', 'ץ'];
      
      if (gameKeys.includes(event.key) || hebrewKeys.includes(event.key) || event.key === "'" || event.key === '׳') {
        event.preventDefault();
      }

      // Handle backspace/delete
      if (event.key === 'Backspace' || event.key === 'Delete') {
        handleKeyPress('⌫');
        return;
      }

      // Handle enter
      if (event.key === 'Enter') {
        handleKeyPress('↵');
        return;
      }

      // Handle Hebrew characters and apostrophe/geresh
      if (hebrewKeys.includes(event.key) || event.key === "'" || event.key === '׳') {
        handleKeyPress(event.key);
        return;
      }

      // Handle English to Hebrew mapping for QWERTY users
      const englishToHebrew = {
        'q': '/', 'w': '\'', 'e': 'ק', 'r': 'ר', 't': 'א', 'y': 'ט', 'u': 'ו', 'i': 'ן', 'o': 'ם', 'p': 'פ',
        'a': 'ש', 's': 'ד', 'd': 'ג', 'f': 'כ', 'g': 'ע', 'h': 'י', 'j': 'ח', 'k': 'ל', 'l': 'ך', ';': 'ף',
        'z': 'ז', 'x': 'ס', 'c': 'ב', 'v': 'ה', 'b': 'נ', 'n': 'מ', 'm': 'צ', ',': 'ת', '.': 'ץ',
        "'": '׳'
      };

      const hebrewChar = englishToHebrew[event.key.toLowerCase()];
      if (hebrewChar) {
        handleKeyPress(hebrewChar);
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  }, [gameWon, gameLost, categoryCompleted, currentGuess.length, wordLength]);

  const availableInTheme = getAvailableWords(currentTheme).length;
  const totalInTheme = themes[currentTheme]?.words?.length || 0;
  const solvedKey = `${currentCatalog}_${currentTheme}`;
  const solvedInTheme = solvedWords[solvedKey]?.length || 0;

  const getPraiseMessage = (guessCount) => {
    if (guessCount === 1) return "מדהים! ניחוש מושלם בניסיון הראשון! 🏆";
    if (guessCount === 2) return "מעולה! פתרת במהירות רק בשני ניסיונות! ⚡";
    if (guessCount === 3) return "כל הכבוד! פתרת בשלושה ניסיונות! 🌟";
    if (guessCount === 4) return "יפה מאוד! פתרת בארבעה ניסיונות! 👍";
    if (guessCount === 5) return "טוב מאוד! פתרת בחמישה ניסיונות! 🎯";
    if (guessCount === 6) return "נהדר! פתרת ברגע האחרון! 😅";
    return "כל הכבוד! ניחשת נכון! 🎉";
  };

  // Don't render until initialized
  if (!initialized) {
    return (
      <div className={`max-w-md mx-auto p-2 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-slate-100'} h-screen flex items-center justify-center`} dir="rtl">
        <div className="text-center">
          <div className="text-2xl mb-2">🎮</div>
          <p className={darkMode ? 'text-white' : 'text-gray-800'}>טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-md mx-auto p-1 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-slate-100'} relative flex flex-col`} dir="rtl" style={{minHeight: '100vh', minHeight: '100dvh', paddingBottom: 'max(env(safe-area-inset-bottom), 20px)'}}>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-pulse">
          <div className="text-4xl sm:text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            🎉✨🎊✨🎉
          </div>
        </div>
      )}


      <div className="flex items-center mb-3 px-2 sm:px-3">
        <div className="flex gap-2 sm:gap-3 w-24 justify-start">
          <button onClick={() => setShowHelp(true)} className={`p-3 sm:p-3 min-w-[44px] min-h-[44px] ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg transition-colors flex items-center justify-center`}>
            <HelpCircle size={24} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setShowStats(true)} className={`p-3 sm:p-3 min-w-[44px] min-h-[44px] ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg transition-colors flex items-center justify-center`}>
            <Trophy size={24} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        
        <div className="flex-1 flex justify-center">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>וורדעלישס</h1>
        </div>
        
        <div className="flex gap-2 sm:gap-3 w-24 justify-end">
          <button onClick={() => setShowSettings(true)} className={`p-3 sm:p-3 min-w-[44px] min-h-[44px] ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg transition-colors flex items-center justify-center`}>
            <Settings size={24} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {debugMode && (
        <div className={`mb-2 p-2 ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-100 border-yellow-300'} border rounded text-center`}>
          <p className={`text-xs ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} mb-1`}>🧪 מצב פיתוח (Cmd/Ctrl+D להסתרה)</p>
          <div className={`text-xs mb-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>מילה: {targetWord} | {activeContent.name}</div>
          <div className="flex gap-1 justify-center flex-wrap mb-1">
            <button onClick={() => {
              addToGameLog('DEBUG_WIN_TRIGGERED', { method: 'debug_button' });
              setGameWon(true); 
              setShowWinAnimation(true);
            }} className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">ניצחון</button>
            <button onClick={() => {
              addToGameLog('DEBUG_LOSS_TRIGGERED', { method: 'debug_button' });
              setGameLost(true);
            }} className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">הפסד</button>
            <button onClick={() => {
              addToGameLog('DEBUG_CORRECT_WORD_FILLED', { word: targetWord });
              setCurrentGuess(targetWord);
            }} className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold">מילה נכונה</button>
            <button onClick={() => {
              const wrongWord = generateRandomWrongWord();
              addToGameLog('DEBUG_WRONG_WORD_FILLED', { word: wrongWord });
              setCurrentGuess(wrongWord);
            }} className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-bold">מילה שגויה</button>
          </div>
          <div className="flex gap-1 justify-center flex-wrap mb-1">
            <button onClick={() => {
              addToGameLog('DEBUG_GAME_RESET', {});
              setGameWon(false); 
              setGameLost(false); 
              setShowWinAnimation(false); 
              setGuesses([]); 
              setCurrentGuess('');
            }} className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold">איפוס</button>
            <button onClick={() => {
              addToGameLog('DEBUG_GAME_COMPLETED_TRIGGERED', { method: 'debug_button' });
              setShowGameCompleted(true);
            }} className="px-2 py-1 bg-purple-500 text-white rounded text-xs font-bold">משחק הושלם</button>
            <button onClick={() => setShowGameLog(true)} className="px-2 py-1 bg-indigo-500 text-white rounded text-xs font-bold">יומן</button>
          </div>
          <div className="flex gap-1 justify-center flex-wrap">
            <button onClick={() => setCurrentCatalog('main')} className={`px-2 py-1 rounded text-xs ${currentCatalog === 'main' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300'}`}>עיקרי</button>
            <button onClick={() => setCurrentCatalog('trash')} className={`px-2 py-1 rounded text-xs ${currentCatalog === 'trash' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300'}`}>טראש</button>
            <button onClick={() => setShowContentCatalog(true)} className="px-2 py-1 bg-teal-500 text-white rounded text-xs font-bold">קטלוג תוכן</button>
          </div>
        </div>
      )}

      <div className={`mb-2 p-2 ${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} rounded-lg shadow-sm border h-12 sm:h-14 flex items-center`}>
        <div className="w-full h-10 flex items-center">
          {isDailyWord ? (
            <div className={`w-full h-full ${darkMode ? 'bg-gradient-to-r from-amber-900 to-yellow-900 border-amber-700' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'} border rounded flex items-center justify-center`}>
              <Star className={`inline-block ml-1 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} size={14} />
              <span className={`${darkMode ? 'text-amber-200' : 'text-amber-800'} font-medium text-xs sm:text-sm`}>מילה יומיומית לתרגול</span>
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <select 
                value={currentTheme} 
                onChange={(e) => setCurrentTheme(e.target.value)} 
                className={`text-xs sm:text-sm p-1 h-8 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-slate-300 bg-white'} rounded text-right font-medium focus:ring-1 focus:ring-blue-500`}
                dir="rtl"
              >
                {Object.keys(themes).map(theme => {
                  const available = getAvailableWords(theme).length;
                  return (
                    <option key={theme} value={theme} disabled={available === 0}>
                      {themes[theme]?.icon} {themes[theme]?.name} {available === 0 ? '(הושלם)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="mb-2 relative flex-shrink-0 space-y-1">
        {Array.from({length: maxGuesses}).map((_, i) => (
          <div key={i} className="flex justify-center gap-1" dir="rtl">
            {Array.from({length: wordLength}).map((_, j) => {
              const guess = guesses[i] || '';
              const letter = i === guesses.length ? currentGuess[j] || '' : guess[j] || '';
              const status = guesses[i] ? getLetterStatus(letter, j, guess) : '';
              
              return (
                <div key={j} className={`${getSquareSize(wordLength)} border-2 flex items-center justify-center font-bold rounded transition-all duration-300 ${
                  status === 'correct' ? 'bg-green-500 text-white border-green-500 animate-pulse' :
                  status === 'correct-position' ? 'bg-green-500 text-white border-green-500' :
                  status === 'correct-letter' ? 'bg-yellow-400 text-white border-yellow-400' :
                  status === 'incorrect' ? 'bg-slate-400 text-white border-slate-400' :
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-slate-300'}`}>
                {letter}
              </div>
            );
            })}
          </div>
        ))}

        {categoryCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30" style={{top: 0}}>
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg text-center shadow-xl border-4 border-purple-500 max-w-xs`}>
              <Trophy className="mx-auto mb-3 text-purple-600" size={48} />
              <p className={`${darkMode ? 'text-purple-300' : 'text-purple-800'} font-bold text-lg mb-2`}>מדהים!</p>
              <p className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} text-sm mb-4`}>סיימת את כל המילים בקטגוריה {themes[currentTheme]?.icon}!</p>
              <button onClick={() => {console.log('DEBUG: Category completed dialog - Continue button clicked'); setCategoryCompleted(false); setTimeout(() => startNewGame(), 100);}} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-sm transition-colors">המשך</button>
            </div>
          </div>
        )}

        {allCategoriesCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-30">
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg text-center shadow-xl border-4 border-gold-500 max-w-xs`}>
              <div className="text-6xl mb-3">🏆</div>
              <p className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'} font-bold text-xl mb-2`}>כל הכבוד!</p>
              <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} text-sm mb-4`}>סיימת את כל המילים בכל הקטגוריות!</p>
              <div className="space-y-2">
                <button onClick={() => {resetProgress(); setAllCategoriesCompleted(false);}} className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-bold text-sm transition-colors">התחל מחדש</button>
                <button onClick={() => setAllCategoriesCompleted(false)} className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-bold text-sm transition-colors">סגור</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!categoryCompleted && !allCategoriesCompleted && (
        <div className="space-y-1 mt-auto flex-shrink-0 pb-8 mb-4">
          {hebrewKeyboard.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.map(key => {
                const keyStatus = getKeyboardLetterStatus(key);
                const isActionKey = key === '⌫' || key === '↵';
                return (
                  <button 
                    key={key} 
                    onClick={() => handleKeyPress(key)} 
                    className={`px-1 py-2 ${isActionKey ? 'min-w-[50px]' : 'min-w-[32px]'} h-12 rounded-lg text-base font-bold transition-all touch-manipulation ${
                      isActionKey 
                        ? `${darkMode ? 'bg-gray-700 hover:bg-gray-600 active:bg-gray-500' : 'bg-slate-600 hover:bg-slate-700 active:bg-slate-800'} text-white ${
                            key === '↵' && (currentGuess.length !== wordLength || isDuplicateGuess)
                              ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`
                        : keyStatus === 'correct' || keyStatus === 'correct-position'
                        ? 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white'
                        : keyStatus === 'correct-letter'
                        ? 'bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-white'
                        : keyStatus === 'incorrect'
                        ? 'bg-slate-400 hover:bg-slate-500 active:bg-slate-600 text-white'
                        : darkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800'
                    } cursor-pointer`}
                    disabled={key === '↵' && (currentGuess.length !== wordLength || isDuplicateGuess)}
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Hint Dialog */}
      {showHintDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>רמז</h2>
              <button onClick={() => setShowHintDialog(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-700'} text-lg`}>{getHint()}</p>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => setShowHintDialog(false)} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-colors">הבנתי!</button>
            </div>
          </div>
        </div>
      )}

      {/* Help Dialog */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 max-h-[85vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>איך משחקים?</h2>
              <button onClick={() => setShowHelp(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className={`text-right space-y-3 text-sm ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
              <p><strong>המטרה:</strong> לנחש את המילה העברית בתוך 6 ניסיונות.</p>
              <p><strong>איך לשחק:</strong> הקלד מילה באורך הנכון ולחץ "שלח". המשחק יראה לך אילו אותיות נכונות.</p>
              <div className={`border ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-slate-200 bg-slate-50'} rounded p-3`}>
                <p className="font-medium mb-2">משמעות הצבעים:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded"></div>
                    <span>אות נכונה במקום הנכון</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-400 rounded"></div>
                    <span>אות נכונה במקום הלא נכון</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-400 rounded"></div>
                    <span>אות לא קיימת במילה</span>
                  </div>
                </div>
              </div>
              <p><strong>מצב קל:</strong> כאשר מופעל, המקלדת תראה באילו אותיות כבר השתמשת ובאילו צבעים.</p>
              <p><strong>מילים יומיומיות:</strong> מדי פעם המשחק יציג מילה שימושית לשיחות יום-יום.</p>
              <p><strong>טיפ:</strong> התחל עם מילים שיש בהן אותיות נפוצות כמו א, ה, ו, ל, מ, נ, ר, ש, ת.</p>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => setShowHelp(false)} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">הבנתי!</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dialog */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>סטטיסטיקות</h2>
              <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            
            {/* Main Stats Row - Top 3 */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {gameStats.gamesPlayed}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  משחקים
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {gameStats.gamesWon}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ניצחונות
                </div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100) : 0}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  % הצלחה
                </div>
              </div>
            </div>

            {/* Secondary Stats Row - Bottom 2 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {gameStats.currentStreak}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  סטרייק נוכחי
                </div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
                  {gameStats.maxStreak}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  סטרייק מקס׳
                </div>
              </div>
            </div>

            {/* Guess Distribution */}
            <div className="mb-6">
              <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-black'} mb-3 text-center`}>
                התפלגות ניחושים
              </h3>
              <div className="space-y-1">
                {gameStats.guessDistribution.map((count, index) => {
                  const maxCount = Math.max(...gameStats.guessDistribution, gameStats.gamesLost || 0);
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const isCurrentGuess = gameWon && guesses.length === index + 1;
                  
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`text-sm font-bold w-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 relative">
                        <div 
                          className={`h-5 rounded text-white text-xs flex items-center justify-end px-2 font-bold transition-all duration-300 ${
                            isCurrentGuess 
                              ? 'bg-green-500' 
                              : darkMode ? 'bg-gray-600' : 'bg-gray-400'
                          }`}
                          style={{ 
                            width: count > 0 ? `${Math.max(percentage, 8)}%` : '8%',
                            minWidth: '20px'
                          }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* X row for failed games */}
                <div className="flex items-center gap-2">
                  <div className={`text-sm font-bold w-4 ${darkMode ? 'text-white' : 'text-black'}`}>
                    X
                  </div>
                  <div className="flex-1 relative">
                    <div 
                      className={`h-5 rounded text-white text-xs flex items-center justify-end px-2 font-bold transition-all duration-300 ${
                        gameLost && !gameWon
                          ? 'bg-red-500' 
                          : darkMode ? 'bg-gray-600' : 'bg-gray-400'
                      }`}
                      style={{ 
                        width: (gameStats.gamesLost || 0) > 0 ? `${Math.max((gameStats.gamesLost || 0) / Math.max(...gameStats.guessDistribution, gameStats.gamesLost || 0) * 100, 8)}%` : '8%',
                        minWidth: '20px'
                      }}
                    >
                      {gameStats.gamesLost || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowResetConfirmDialog(true)}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
            >
              מחק הישגים
            </button>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>הגדרות</h2>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className={`${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>מצב קל</span>
                <button 
                  onClick={() => setEasyMode(!easyMode)} 
                  className="flex items-center"
                >
                  {easyMode ? 
                    <ToggleRight className="text-green-600" size={28} /> : 
                    <ToggleLeft className="text-gray-400" size={28} />
                  }
                </button>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'} mb-4`}>
                במצב קל, המקלדת מראה אילו אותיות כבר השתמשת ובאילו צבעים
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className={`${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>הצגת רמזים</span>
                <button 
                  onClick={() => setShowHints(!showHints)} 
                  className="flex items-center"
                >
                  {showHints ? 
                    <ToggleRight className="text-green-600" size={28} /> : 
                    <ToggleLeft className="text-gray-400" size={28} />
                  }
                </button>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'} mb-4`} style={{ minHeight: '1.5rem' }}>
                {showHints ? `רמז למילה הנוכחית: ${getHint()}` : ''}
              </div>

              <div className="flex justify-between items-center pb-3 border-b">
                <span className={`${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>מצב כהה</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)} 
                  className="flex items-center"
                >
                  {darkMode ? 
                    <ToggleRight className="text-green-600" size={28} /> : 
                    <ToggleLeft className="text-gray-400" size={28} />
                  }
                </button>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'} mb-4`}>
                מצב כהה נוח יותר לעיניים בתאורה חלשה
              </div>
              
              {!slugMode && (
                <div className="border-t pt-4">
                  <div className={`${darkMode ? 'text-gray-200' : 'text-slate-700'} font-medium mb-3`}>אוספי תוכן</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>בני נוער סטאף</span>
                      <button 
                        onClick={() => setCurrentCatalog('main')} 
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentCatalog === 'main' 
                          ? 'bg-blue-500 text-white' 
                          : darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {currentCatalog === 'main' ? 'פעיל' : 'בחר'}
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>טראש ישראלי</span>
                      <button 
                        onClick={() => setCurrentCatalog('trash')} 
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          currentCatalog === 'trash' 
                          ? 'bg-purple-500 text-white' 
                          : darkMode ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {currentCatalog === 'trash' ? 'פעיל' : 'בחר'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
                  <div className="border-t pt-4 mt-4">
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  גרסה {APP_VERSION}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Result Dialog */}
      {(gameWon || gameLost) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6 text-center transform transition-all duration-300 scale-100 relative ${gameWon ? 'border-4 border-green-500' : 'border-4 border-red-500'}`}>
            <button onClick={() => {setGameWon(false); setGameLost(false); setShowWinAnimation(false);}} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            <div className="text-6xl mb-4">{gameWon ? '🎉' : '😞'}</div>
            <h2 className={`text-2xl font-bold mb-3 ${gameWon ? (darkMode ? 'text-green-400' : 'text-green-800') : (darkMode ? 'text-red-400' : 'text-red-800')}`}>
              {gameWon ? 'כל הכבוד!' : 'לא הצלחת הפעם'}
            </h2>
            <div className="mb-4">
              {gameWon ? (
                <>
                  <p className={`text-lg mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{getPraiseMessage(guesses.length)}</p>
                  {!isDailyWord && (
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'} mb-2`}>
                      פתרת {solvedInTheme} מתוך {totalInTheme} מילים בקטגוריה {themes[currentTheme]?.icon}
                    </p>
                  )}
                  {isDailyWord && <p className={`${darkMode ? 'text-amber-400' : 'text-amber-600'} text-sm`}>תרגלת מילה יומיומית! 📚</p>}
                </>
              ) : (
                <>
                  <p className={`${darkMode ? 'text-red-400' : 'text-red-700'} text-lg mb-3`}>המילה הייתה:</p>
                  <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-100 border-red-300'} border-2 rounded-lg p-3 mb-3`}>
                    <span className={`${darkMode ? 'text-red-200' : 'text-red-800'} font-bold text-2xl font-mono`}>{targetWord}</span>
                  </div>
                  <p className={`${darkMode ? 'text-red-400' : 'text-red-600'} text-sm`}>נסה שוב במילה הבאה! 💪</p>
                </>
              )}
            </div>
            <div className="flex justify-center">
              <button onClick={() => {
                setGameWon(false); 
                setGameLost(false); 
                setShowWinAnimation(false); 
                // Check if category completion is pending
                if (pendingCategoryCompletion) {
                  // Don't start new game yet, let category completion dialog show first
                  setPendingCategoryCompletion(false);
                } else {
                  // No pending category completion, start new game normally
                  setTimeout(() => startNewGame(), 100);
                }
              }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">המילה הבאה</button>
            </div>
          </div>
        </div>
      )}

      {/* Game Log Dialog */}
      {showGameLog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[80vh] overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>יומן משחק</h2>
              <button onClick={() => setShowGameLog(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {gameLog.length === 0 ? (
                <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>אין אירועים ביומן</p>
              ) : (
                <div className="space-y-3">
                  {gameLog.map((entry, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                          {entry.event}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {entry.timestamp}
                        </span>
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div><strong>קטלוג:</strong> {entry.details.catalog}</div>
                        <div><strong>נושא:</strong> {entry.details.theme}</div>
                        <div><strong>מילה:</strong> {entry.details.targetWord}</div>
                        <div><strong>ניחושים:</strong> {entry.details.guesses}</div>
                        {entry.details.word && <div><strong>מילה:</strong> {entry.details.word}</div>}
                        {entry.details.method && <div><strong>שיטה:</strong> {entry.details.method}</div>}
                        <div><strong>סטטיסטיקות:</strong> {entry.details.gameStats.gamesPlayed} משחקים, {entry.details.gameStats.gamesWon} ניצחונות</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              {gameLog.length > 0 && (
                <button 
                  onClick={() => {
                    addToGameLog('LOG_CLEARED', { method: 'manual_clear' });
                    setGameLog([]);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
                >
                  נקה יומן
                </button>
              )}
              <button onClick={() => setShowGameLog(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-sm transition-colors">סגור</button>
            </div>
          </div>
        </div>
      )}

      {/* Game Completed Dialog */}
      {showGameCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg text-center shadow-xl border-4 border-gold-500 max-w-xs`}>
            <div className="text-6xl mb-3">🏆</div>
            <p className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'} font-bold text-xl mb-2`}>משחק הושלם!</p>
            <p className={`${darkMode ? 'text-yellow-400' : 'text-yellow-700'} text-sm mb-4`}>זהו דיאלוג סימולציה למשחק שהושלם במלואו!</p>
            <div className="text-center">
              <button onClick={() => {
                addToGameLog('GAME_COMPLETED_ACKNOWLEDGED', { method: 'dialog_button' });
                setShowGameCompleted(false);
              }} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded font-bold text-sm transition-colors">הבנתי</button>
            </div>
          </div>
        </div>
      )}

      {/* Word Hint Dialog */}
      {showWordHintDialog && selectedWordHint && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>רמז למילה</h2>
              <button onClick={() => setShowWordHintDialog(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💡</div>
              <div className={`text-2xl font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {selectedWordHint.word}
              </div>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-700'} text-lg`}>
                {selectedWordHint.hint}
              </p>
            </div>
            <div className="mt-6 text-center">
              <button onClick={() => setShowWordHintDialog(false)} className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-colors">הבנתי!</button>
            </div>
          </div>
        </div>
      )}

      {/* Content Catalog Dialog */}
      {showContentCatalog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 max-h-[85vh] overflow-hidden flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>קטלוג תוכן</h2>
              <div className="flex gap-2">
                <button 
                  onClick={async () => {
                    console.log('DEBUG: Refresh button clicked - checking for external catalog');
                    try {
                      setCatalogLoadError(null);
                      
                      // Try to load the external catalog using the same function as startup
                      const catalogData = await loadContentCatalog();
                      
                      console.log('DEBUG: External catalog loaded and validated successfully');
                      setContentCatalog(catalogData);
                      setLoadedCatalogs(catalogData.catalogs);
                      addToGameLog('CATALOG_REFRESHED', { 
                        version: catalogData?.version || 'unknown',
                        previousCatalog: currentCatalog,
                        previousTheme: currentTheme 
                      });
                      
                      // Reset game state to use the new content
                      console.log('DEBUG: Resetting game state with new catalog content');
                      
                      // Clear current game state
                      setGameWon(false);
                      setGameLost(false);
                      setShowWinAnimation(false);
                      setGuesses([]);
                      setCurrentGuess('');
                      setShowHintDialog(false);
                      setCategoryCompleted(false);
                      setAllCategoriesCompleted(false);
                      
                      // Reset to first available theme in current catalog
                      const newCatalogData = catalogData.catalogs[currentCatalog];
                      if (newCatalogData && newCatalogData.themes) {
                        const firstTheme = Object.keys(newCatalogData.themes)[0];
                        if (firstTheme) {
                          console.log(`DEBUG: Setting theme to ${firstTheme} and starting new game`);
                          setCurrentTheme(firstTheme);
                          
                          // Force a complete game restart with new content
                          setTimeout(() => {
                            startNewGameForTheme(firstTheme);
                          }, 100);
                        }
                      }
                      
                      console.log('DEBUG: Content catalog refresh completed successfully');
                      
                    } catch (error) {
                      console.log('DEBUG: Expected behavior - external catalog not available:', error.message);
                      
                      // Only show errors for truly unexpected issues, not for missing external files
                      if (!error.message.includes('HTTP error') && !error.message.includes('Response is not JSON')) {
                        setCatalogLoadError(`שגיאה בטעינת קטלוג: ${error.message}`);
                      }
                      addToGameLog('CATALOG_REFRESH_SKIPPED', { 
                        reason: 'external_catalog_not_available',
                        error: error.message 
                      });
                    }
                  }}
                  className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  title="רענן קטלוג"
                >
                  <RefreshCw size={16} />
                </button>
                <button onClick={() => setShowContentCatalog(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {catalogLoadError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                  <p className="text-red-800 text-sm font-bold">שגיאה בטעינת הקטלוג:</p>
                  <p className="text-red-700 text-xs">{catalogLoadError}</p>
                </div>
              )}
              
              {Object.entries(catalogs).map(([catalogKey, catalog]) => {
                const catalogName = catalog.name;
                return (
                  <div key={catalogKey} className={`mb-6 p-4 border rounded-lg ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                    <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {catalogName} ({catalogKey})
                    </h3>
                    
                    {/* Themes */}
                    <div className="space-y-3">
                      {Object.entries(catalog.themes).map(([themeKey, theme]) => {
                        const usedKey = `${catalogKey}_${themeKey}`;
                        const solvedKey = `${catalogKey}_${themeKey}`;
                        const usedWordsInTheme = usedWords[usedKey] || [];
                        const solvedWordsInTheme = solvedWords[solvedKey] || [];
                        
                        return (
                          <div key={themeKey} className={`p-3 rounded border ${darkMode ? 'border-gray-500 bg-gray-600' : 'border-gray-300 bg-white'}`}>
                            <h4 className={`font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {theme.icon} {theme.name} ({theme.words.length} מילים)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs">
                              {theme.words.map((word) => {
                                const wasPlayed = usedWordsInTheme.includes(word);
                                const wasSolved = solvedWordsInTheme.includes(word);
                                
                                return (
                                  <div 
                                    key={word}
                                    onClick={() => handleWordClick(word, catalogKey, false)}
                                    className={`p-1 rounded text-center font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                      wasSolved 
                                        ? 'bg-green-500 text-white' 
                                        : wasPlayed 
                                        ? 'bg-red-500 text-white'
                                        : darkMode 
                                        ? 'bg-gray-500 text-gray-200' 
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {word}
                                  </div>
                                );
                              })}
                            </div>
                            <div className={`mt-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <span className="text-green-500 font-bold">{solvedWordsInTheme.length}</span> נוחשו | <span className="text-red-500 font-bold">{usedWordsInTheme.length - solvedWordsInTheme.length}</span> לא נוחשו | <span className={darkMode ? 'text-gray-400 font-bold' : 'text-gray-600 font-bold'}>{theme.words.length - usedWordsInTheme.length}</span> נותרו
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Daily Words */}
                      <div className={`p-3 rounded border ${darkMode ? 'border-gray-500 bg-gray-600' : 'border-gray-300 bg-white'}`}>
                        <h4 className={`font-bold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          ⭐ מילים יומיומיות ({catalog.dailyWords.length} מילים)
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 text-xs">
                          {catalog.dailyWords.map((word) => {
                            const wasUsed = dailyWordsUsed.includes(word);
                            const dailySolvedKey = `${catalogKey}_daily`;
                            const wasSolved = (solvedWords[dailySolvedKey] || []).includes(word);
                            
                            return (
                              <div 
                                key={word}
                                onClick={() => handleWordClick(word, catalogKey, true)}
                                className={`p-1 rounded text-center font-bold cursor-pointer hover:opacity-80 transition-opacity ${
                                  wasSolved 
                                    ? 'bg-green-500 text-white' 
                                    : wasUsed 
                                    ? 'bg-red-500 text-white'
                                    : darkMode 
                                    ? 'bg-gray-500 text-gray-200' 
                                    : 'bg-gray-200 text-gray-700'
                                }`}
                              >
                                {word}
                              </div>
                            );
                          })}
                        </div>
                        <div className={`mt-2 text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {(() => {
                            const dailySolvedKey = `${catalogKey}_daily`;
                            const dailySolved = (solvedWords[dailySolvedKey] || []).length;
                            // Fix: Use the correct dailyWordsUsed array for this specific catalog
                            const catalogDailyWords = catalog.dailyWords;
                            const dailyUsedForThisCatalog = dailyWordsUsed.filter(word => catalogDailyWords.includes(word));
                            const dailyUsed = dailyUsedForThisCatalog.length;
                            const dailyFailed = Math.max(0, dailyUsed - dailySolved);
                            const dailyRemaining = Math.max(0, catalogDailyWords.length - dailyUsed);
                            
                            return (
                              <>
                                <span className="text-green-500 font-bold">{dailySolved}</span> נוחשו | <span className="text-red-500 font-bold">{dailyFailed}</span> לא נוחשו | <span className={darkMode ? 'text-gray-400 font-bold' : 'text-gray-600 font-bold'}>{dailyRemaining}</span> נותרו
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 flex justify-center">
              <button onClick={() => setShowContentCatalog(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-bold text-sm transition-colors">סגור</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>אישור מחיקה</h2>
              <button onClick={() => setShowResetConfirmDialog(false)} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <p className={`${darkMode ? 'text-gray-200' : 'text-slate-700'} text-lg mb-4`}>
                האם אתה בטוח שברצונך למחוק את כל ההישגים ולהתחיל מחדש?
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-slate-500'} text-sm mb-6`}>
                פעולה זו תמחק את כל הסטטיסטיקות, ההתקדמות והמילים שפתרת. לא ניתן לבטל פעולה זו.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => setShowResetConfirmDialog(false)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
              >
                ביטול
              </button>
              <button 
                onClick={() => {
                  resetProgress();
                  setShowStats(false);
                  setShowResetConfirmDialog(false);
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
              >
                מחק הכל
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
