import React, { useState, useEffect } from 'react';
import { Settings, Trophy, Lightbulb, Star, ToggleLeft, ToggleRight, X, HelpCircle, Delete, ArrowRight } from 'lucide-react';

// Content catalogs with all themes
const mainContent = {
  name: 'בני נוער סטאף',
  id: 'teen-staff',
  slug: 'teen-staff-x7k9m',
  themes: {
    'אנימה': {
      name: 'אנימה',
      icon: '🎌',
      words: ['נארוטו', 'פיקאצו', 'גוקו', 'לופי', 'ססקה', 'דרגון', 'איציגו', 'יוגיו'],
      hints: {
        'נארוטו': 'נינג\'ה עם שועל בתוכו',
        'פיקאצו': 'פוקימון צהוב חמוד',
        'גוקו': 'לוחם סאיין חזק',
        'לופי': 'פיראט עם כובע קש',
        'ססקה': 'נינג\'ה עם שארינגן',
        'דרגון': 'כדור דרגון',
        'איציגו': 'שיניגמי תחליף',
        'יוגיו': 'מלך המשחקים'
      }
    },
    'קומיקס': {
      name: 'קומיקס',
      icon: '🦸',
      words: ['באטמן', 'ספיידר', 'הלק', 'תור', 'איקס', 'סופרמן', 'וולברין', 'קפטן'],
      hints: {
        'באטמן': 'גיבור עטלף מגותאם',
        'ספיידר': 'גיבור עכביש',
        'הלק': 'ענק ירוק כועס',
        'תור': 'אל נורדי עם פטיש',
        'איקס': 'צוות מוטנטים',
        'סופרמן': 'איש הפלדה',
        'וולברין': 'מוטנט עם טפרים',
        'קפטן': 'מגן אמריקה'
      }
    },
    'מדע בדיוני': {
      name: 'מדע בדיוני',
      icon: '🚀',
      words: ['רובוט', 'חללית', 'לייזר', 'כוכב', 'זמן', 'גלקסיה', 'חייזר', 'עתיד'],
      hints: {
        'רובוט': 'מכונה חכמה',
        'חללית': 'כלי טיס לחלל',
        'לייזר': 'קרן אור חזקה',
        'כוכב': 'גוף שמימי בוהק',
        'זמן': 'מימד רביעי',
        'גלקסיה': 'אוסף כוכבים',
        'חייזר': 'יצור מחלל',
        'עתיד': 'זמן שעוד לא הגיע'
      }
    },
    'משחקי תפקידים': {
      name: 'משחקי תפקידים',
      icon: '⚔️',
      words: ['דרקון', 'חרב', 'קוסם', 'לוחם', 'שריון', 'מגיה', 'כשף', 'אלף'],
      hints: {
        'דרקון': 'יצור אגדי עם כנפיים',
        'חרב': 'נשק חד',
        'קוסם': 'משתמש בקסמים',
        'לוחם': 'איש מלחמה',
        'שריון': 'הגנה על הגוף',
        'מגיה': 'כוח קסום',
        'כשף': 'לחש קסום',
        'אלף': 'יחידת אלפים'
      }
    },
    'ג\'אנק פוד': {
      name: 'ג\'אנק פוד',
      icon: '🍕',
      words: ['פיצה', 'המבור', 'נאגטס', 'ציפס', 'קוקה', 'שוקו', 'עוגה', 'גלידה'],
      hints: {
        'פיצה': 'מאכל איטלקי עגול',
        'המבור': 'כריך עם בשר',
        'נאגטס': 'חתיכות עוף מטוגנות',
        'ציפס': 'תפוחי אדמה מטוגנים',
        'קוקה': 'משקה מוגז מתוק',
        'שוקו': 'משקה חם מתוק',
        'עוגה': 'קינוח מתוק',
        'גלידה': 'קינוח קר ומתוק'
      }
    }
  },
  dailyWords: [
    'שלום', 'תודה', 'בבקשה', 'סליחה', 'איך', 'מה', 'איפה', 'מתי', 'למה',
    'טוב', 'רע', 'יפה', 'גדול', 'קטן', 'חם', 'קר', 'מהיר', 'איטי',
    'בית', 'משפחה', 'חברים', 'ילד', 'ילדה', 'אמא', 'אבא', 'מורה',
    'ספר', 'מחברת', 'עט', 'מחשב', 'טלפון', 'רכב', 'אוטובוס', 'רכבת'
  ],
  dailyHints: {
    'שלום': 'ברכה בפגישה',
    'תודה': 'ביטוי הכרת טובה',
    'בבקשה': 'נימוס בבקשה',
    'סליחה': 'התנצלות',
    'איך': 'שאלה על דרך',
    'מה': 'שאלה על דבר',
    'איפה': 'שאלה על מקום',
    'מתי': 'שאלה על זמן',
    'למה': 'שאלה על סיבה',
    'טוב': 'איכות חיובית',
    'רע': 'איכות שלילית',
    'יפה': 'נעים למראה',
    'גדול': 'גודל מרשים',
    'קטן': 'גודל מועט',
    'חם': 'טמפרטורה גבוהה',
    'קר': 'טמפרטורה נמוכה',
    'מהיר': 'מהירות גבוהה',
    'איטי': 'מהירות נמוכה',
    'בית': 'מקום מגורים',
    'משפחה': 'קרובים יקרים',
    'חברים': 'אנשים קרובים',
    'ילד': 'אדם צעיר',
    'ילדה': 'אדם צעיר נקבה',
    'אמא': 'הורה נקבה',
    'אבא': 'הורה זכר',
    'מורה': 'מלמד בבית ספר',
    'ספר': 'כלי לקריאה',
    'מחברת': 'כלי לכתיבה',
    'עט': 'כלי כתיבה',
    'מחשב': 'מכונה חכמה',
    'טלפון': 'כלי תקשורת',
    'רכב': 'כלי תחבורה',
    'אוטובוס': 'תחבורה ציבורית',
    'רכבת': 'תחבורה על פסים'
  }
};

const trashContent = {
  name: 'טראש ישראלי',
  id: 'israeli-trash',
  slug: 'israeli-trash-p3n8q',
  themes: {
    'ריאליטי': {
      name: 'ריאליטי',
      icon: '📺',
      words: ['האח', 'חתונה', 'המירוץ', 'לאב', 'הישרדות', 'מאסטרשף', 'הכוכב', 'ביגברדר', 'הבאצלור', 'אקספקטור'],
      hints: {
        'האח': 'האח הגדול - ריאליטי בבית משותף',
        'חתונה': 'חתונה ממבט ראשון',
        'המירוץ': 'המירוץ למיליון',
        'לאב': 'לאב איילנד ישראל',
        'הישרדות': 'תוכנית הישרדות בטבע',
        'מאסטרשף': 'תחרות בישול מקצועית',
        'הכוכב': 'הכוכב הבא - תחרות זמרים',
        'ביגברדר': 'האח הגדול בלועזית',
        'הבאצלור': 'הרווק - חיפוש אהבה',
        'אקספקטור': 'X Factor - תחרות שירה'
      }
    },
    'מוזיקה': {
      name: 'מוזיקה 2024',
      icon: '🎤',
      words: ['עומראדם', 'נועהקירל', 'איתילוי', 'אושרכהן', 'עדןבןזקן', 'יסמין', 'סטטיק', 'אנהזק', 'אודיה', 'עידןעמדי'],
      hints: {
        'עומראדם': 'הזמר הכי מצליח בישראל',
        'נועהקירל': 'כוכבת פופ צעירה',
        'איתילוי': 'זמר מזרחי עולה',
        'אושרכהן': 'זמר "מנגן ושר"',
        'עדןבןזקן': 'זמרת "חיפשתי אותו בנרות"',
        'יסמין': 'יסמין מועלם - זמרת',
        'סטטיק': 'סטטיק ובן אל - ראפרים',
        'אנהזק': 'זמרת פופ ישראלית',
        'אודיה': 'זמרת "צמוד צמוד"',
        'עידןעמדי': 'זמר "לאן שלא תלכי"'
      }
    },
    'סלנג': {
      name: 'סלנג נוער',
      icon: '💬',
      words: ['פיקמי', 'גרינות', 'רדפלאג', 'סיצואיישן', 'ליטוב', 'אחושילינג', 'ברמות', 'דפוקיטו', 'פיוריו', 'קרינג'],
      hints: {
        'פיקמי': 'בחורה שמתחננת לתשומת לב',
        'גרינות': 'דגלים ירוקים - סימנים טובים',
        'רדפלאג': 'דגל אדום - סימן אזהרה',
        'סיצואיישן': 'מערכת יחסים לא מוגדרת',
        'ליטוב': 'משהו מגניב וטוב',
        'אחושילינג': 'אחי + צילינג - רגוע לגמרי',
        'ברמות': 'ברמות של... - בסגנון של',
        'דפוקיטו': 'גרסה חמודה של מטורף',
        'פיוריו': 'FOMO - פחד להחמיץ',
        'קרינג': 'משהו מביך מאוד'
      }
    }
  },
  dailyWords: [
    'טינדר', 'באמבל', 'סטורי', 'ריל', 'טיקטוק', 'ווייב', 'פיד', 'פולואר'
  ],
  dailyHints: {
    'טינדר': 'אפליקציית היכרויות פופולרית',
    'באמבל': 'אפליקציה שבה נשים פונות ראשונות',
    'סטורי': 'סיפור באינסטגרם',
    'ריל': 'סרטון קצר באינסטגרם',
    'טיקטוק': 'אפליקציית סרטונים קצרים',
    'ווייב': 'אווירה או תחושה',
    'פיד': 'עמוד הבית ברשת חברתית',
    'פולואר': 'עוקב ברשתות חברתיות'
  }
};

function App() {
  // URL slug detection
  const detectCatalogFromURL = () => {
    const path = window.location.pathname;
    const slug = path.split('/').pop();
    
    // Check if slug matches any catalog
    if (slug === mainContent.slug) return 'main';
    if (slug === trashContent.slug) return 'trash';
    
    // Default to main if no valid slug found
    return 'main';
  };

  // Content catalog system
  const [currentCatalog, setCurrentCatalog] = useState(detectCatalogFromURL());
  const [slugMode, setSlugMode] = useState(window.location.pathname.includes('-'));
  const catalogs = {
    main: mainContent,
    trash: trashContent
  };
  
  const activeContent = catalogs[currentCatalog];
  const themes = activeContent.themes;
  const dailyWords = activeContent.dailyWords;

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
  const [showHints, setShowHints] = useState(false);
  const [enabledCatalogs, setEnabledCatalogs] = useState(['main']);
  const [darkMode, setDarkMode] = useState(false);

  const maxGuesses = 6;
  const wordLength = targetWord.length;

  const hebrewKeyboard = [
    ['ף', 'פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק', '\''],
    ['↵', 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש'],
    ['⌫', 'ץ', 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז']
  ];

  // Initialize used words tracking ONCE
  useEffect(() => {
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
        Object.keys(catalog.themes).forEach(theme => {
          initialUsed[`${catalogKey}_${theme}`] = [];
        });
        initialUsed[`${catalogKey}_daily`] = [];
      });
      setUsedWords(initialUsed);
    }
    
    if (savedSolved) {
      setSolvedWords(JSON.parse(savedSolved));
    } else {
      const initialSolved = {};
      Object.keys(catalogs).forEach(catalogKey => {
        const catalog = catalogs[catalogKey];
        Object.keys(catalog.themes).forEach(theme => {
          initialSolved[`${catalogKey}_${theme}`] = [];
        });
        initialSolved[`${catalogKey}_daily`] = [];
      });
      setSolvedWords(initialSolved);
    }
    
    if (savedEasyMode) {
      setEasyMode(JSON.parse(savedEasyMode));
    }
    
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    setInitialized(true);
  }, []);

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
        setCategoryCompleted(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
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
    localStorage.removeItem('hebrew-wordle-progress');
    localStorage.removeItem('hebrew-wordle-solved');
    
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

  const submitGuess = () => {
    if (currentGuess.length !== wordLength) return;
    if (guesses.includes(currentGuess)) return;

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setGameWon(true);
      setShowWinAnimation(true);
      markWordAsUsed(targetWord, isDailyWord);
      markWordAsSolved(targetWord, isDailyWord);
    } else if (newGuesses.length >= maxGuesses) {
      setGameLost(true);
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

  const handleKeyPress = (key) => {
    if (gameWon || gameLost || categoryCompleted) return;

    if (key === 'מחק' || key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (key === 'שלח' || key === '↵') {
      submitGuess();
    } else if (currentGuess.length < wordLength) {
      // Handle geresh character - accept both ׳ and '
      const normalizedKey = key === "'" ? '׳' : key;
      setCurrentGuess(prev => prev + normalizedKey);
    }
  };

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
    <div className={`max-w-md mx-auto p-1 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-slate-50 to-slate-100'} relative flex flex-col`} dir="rtl" style={{height: '100vh', height: '100dvh', paddingBottom: 'env(safe-area-inset-bottom)'}}>
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-pulse">
          <div className="text-4xl sm:text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            🎉✨🎊✨🎉
          </div>
        </div>
      )}


      <div className="flex justify-between items-center mb-2 px-1 sm:px-2">
        <div className="flex gap-1 sm:gap-2">
          <button onClick={() => setShowHelp(true)} className={`p-1.5 sm:p-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg transition-colors`}>
            <HelpCircle size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
        
        <h1 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>וורדעלישס</h1>
        
        <button onClick={() => setShowSettings(true)} className={`p-1.5 sm:p-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-slate-200 hover:bg-slate-300'} rounded-lg transition-colors`}>
          <Settings size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {debugMode && (
        <div className={`mb-2 p-2 ${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-100 border-yellow-300'} border rounded text-center`}>
          <p className={`text-xs ${darkMode ? 'text-yellow-200' : 'text-yellow-800'} mb-1`}>🧪 מצב פיתוח (Cmd/Ctrl+D להסתרה)</p>
          <div className={`text-xs mb-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>מילה: {targetWord} | {activeContent.name}</div>
          <div className="flex gap-1 justify-center flex-wrap mb-1">
            <button onClick={() => {setGameWon(true); setShowWinAnimation(true);}} className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">ניצחון</button>
            <button onClick={() => setGameLost(true)} className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">הפסד</button>
            <button onClick={() => setCurrentGuess(targetWord)} className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-bold">מילא</button>
            <button onClick={() => {setGameWon(false); setGameLost(false); setShowWinAnimation(false); setGuesses([]); setCurrentGuess('');}} className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-bold">איפוס</button>
          </div>
          <div className="flex gap-1 justify-center">
            <button onClick={() => setCurrentCatalog('main')} className={`px-2 py-1 rounded text-xs ${currentCatalog === 'main' ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300'}`}>עיקרי</button>
            <button onClick={() => setCurrentCatalog('trash')} className={`px-2 py-1 rounded text-xs ${currentCatalog === 'trash' ? 'bg-purple-500 text-white' : darkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-300'}`}>טראש</button>
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
                  <div key={j} className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold rounded transition-all duration-300 ${
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
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-30">
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg text-center shadow-xl border-4 border-purple-500 max-w-xs`}>
              <Trophy className="mx-auto mb-3 text-purple-600" size={48} />
              <p className={`${darkMode ? 'text-purple-300' : 'text-purple-800'} font-bold text-lg mb-2`}>מדהים!</p>
              <p className={`${darkMode ? 'text-purple-400' : 'text-purple-600'} text-sm mb-4`}>סיימת את כל המילים בקטגוריה {themes[currentTheme]?.icon}!</p>
              <button onClick={() => {setCategoryCompleted(false); setTimeout(() => startNewGame(), 100);}} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold text-sm transition-colors">המשך</button>
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

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6`}>
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
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'} mb-4`}>
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
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'} mb-4`} style={{ minHeight: '1.5rem' }}>
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
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'} mb-4`}>
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
                  גרסה 1.1.2
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
              <button onClick={() => {setGameWon(false); setGameLost(false); setShowWinAnimation(false); setTimeout(() => startNewGame(), 100);}} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors">המילה הבאה</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
