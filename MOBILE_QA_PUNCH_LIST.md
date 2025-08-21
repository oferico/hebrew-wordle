# Mobile QA Issues - Version 1.3.1 Punch List

## Overview
This document tracks the 5 mobile QA issues identified during testing of the Hebrew Wordle game. Each issue includes technical analysis, implementation approach, and progress tracking.

**Version:** 1.3.1  
**Created:** 8/21/2025  
**Status:** Planning Phase  

---

## Issue #1: Character Handling for ' and ׳ (Geresh) - CRITICAL
**Status:** 🔴 Not Started  
**Priority:** High  
**Complexity:** Medium  

### Problem Description
The character handling for both apostrophe (') and Hebrew geresh (׳) is no longer working properly. Users cannot input these characters correctly.

### Current Implementation Analysis
```javascript
// Current code in handleKeyPress function (line ~1080):
const normalizedKey = key === "'" ? '׳' : key;
setCurrentGuess(prev => prev + normalizedKey);
```

### Root Cause Analysis
- The normalization logic converts ' to ׳ but may not handle all input scenarios
- Virtual keyboard might not be sending the correct character codes
- Mobile keyboard input might bypass the handleKeyPress function

### Technical Solution
1. **Enhanced Character Normalization:**
   - Add bidirectional mapping: both ' and ׳ should be accepted and normalized to ׳
   - Handle different Unicode representations of geresh
   - Add fallback for mobile keyboard input

2. **Implementation Steps:**
   ```javascript
   // Enhanced normalization function
   const normalizeGeresh = (key) => {
     // Handle various representations of geresh/apostrophe
     if (key === "'" || key === '׳' || key === '\u05F3' || key === '\u0027') {
       return '׳'; // Hebrew geresh
     }
     return key;
   };
   ```

3. **Testing Requirements:**
   - Test on iOS Safari
   - Test on Android Chrome
   - Test with Hebrew keyboard
   - Test with English keyboard
   - Test copy/paste functionality

### Files to Modify
- `src/App.js` - handleKeyPress function
- Add comprehensive character handling tests

---

## Issue #2: Enlarge Header for Better Visibility and Tap Targets
**Status:** 🔴 Not Started  
**Priority:** Medium  
**Complexity:** Low  

### Problem Description
Header elements (help, stats, settings buttons) are too small for comfortable mobile interaction. Need larger tap targets and better visibility. Also need to increase the font size of the game name label "וורדעלישס".

### Current Implementation Analysis
```javascript
// Current header structure (line ~1140):
<div className="flex items-center mb-2 px-1 sm:px-2">
  <button className="p-1.5 sm:p-2 ... rounded-lg">
    <HelpCircle size={18} className="sm:w-5 sm:h-5" />
  </button>
</div>

// Current game title (line ~1150):
<h1 className="text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}">וורדעלישס</h1>
```

### Technical Solution
1. **Increase Button Sizes:**
   - Minimum 44px tap target (iOS HIG recommendation)
   - Increase padding and icon sizes
   - Better spacing between elements

2. **Enlarge Game Title:**
   - Increase font size for better visibility on mobile
   - Ensure proper scaling across devices
   - Maintain visual hierarchy

3. **Implementation Changes:**
   ```javascript
   // Enhanced header with larger tap targets
   <div className="flex items-center mb-3 px-2 sm:px-3">
     <button className="p-3 sm:p-3 ... rounded-lg min-w-[44px] min-h-[44px]">
       <HelpCircle size={24} className="sm:w-6 sm:h-6" />
     </button>
   </div>
   
   // Enlarged game title
   <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}">וורדעלישס</h1>
   ```

4. **Visual Improvements:**
   - Increase header height
   - Better contrast for dark mode
   - Add subtle hover/active states for mobile

### Files to Modify
- `src/App.js` - Header section styling and game title

---

## Issue #3: Keyboard Layout Reorganization and Anchoring
**Status:** 🔴 Not Started  
**Priority:** High  
**Complexity:** High  

### Problem Description
Two main issues: 1) Virtual keyboard doesn't anchor properly to the bottom of the screen, leaving excessive white space, and 2) Keyboard layout needs reorganization - move Enter and ף keys one row down each, and move backspace button to the top row.

### Current Implementation Analysis
```javascript
// Current keyboard layout (line ~1080):
const hebrewKeyboard = [
  ['ף', 'פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק', '\''],
  ['↵', 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש'],
  ['⌫', 'ץ', 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז']
];

// Current keyboard structure (line ~1200):
<div className="space-y-1 mt-auto flex-shrink-0 pb-8 mb-4">
  {hebrewKeyboard.map((row, i) => (
    // Keyboard rows
  ))}
</div>
```

### Technical Solution
1. **Keyboard Layout Reorganization:**
   ```javascript
   // New improved keyboard layout
   const hebrewKeyboard = [
     ['⌫', 'פ', 'ם', 'ן', 'ו', 'ט', 'א', 'ר', 'ק', '\''],  // Backspace moved to top
     ['ף', 'ך', 'ל', 'ח', 'י', 'ע', 'כ', 'ג', 'ד', 'ש'],   // ף moved down from top row
     ['↵', 'ץ', 'ת', 'צ', 'מ', 'נ', 'ה', 'ב', 'ס', 'ז']    // Enter moved down from middle row
   ];
   ```

2. **CSS Viewport Units:**
   - Use `100dvh` (dynamic viewport height) instead of `100vh`
   - Implement proper safe area handling
   - Use CSS environment variables for mobile browsers

3. **Layout Improvements:**
   ```css
   /* Enhanced mobile layout */
   .game-container {
     min-height: 100dvh;
     display: flex;
     flex-direction: column;
     padding-bottom: max(env(safe-area-inset-bottom), 20px);
   }
   
   .keyboard-container {
     position: sticky;
     bottom: env(safe-area-inset-bottom, 0);
     margin-top: auto;
     padding-bottom: 0;
   }
   ```

4. **JavaScript Enhancements:**
   - Detect virtual keyboard appearance
   - Adjust layout dynamically
   - Handle orientation changes

### Files to Modify
- `src/App.js` - Keyboard layout array and container styling
- `src/App.css` - Add mobile-specific CSS rules

---

## Issue #4: Increase Board Square Sizes for Words Shorter Than 8 Characters
**Status:** 🔴 Not Started  
**Priority:** Medium  
**Complexity:** Medium  

### Problem Description
Game board squares are too small when displaying words shorter than 8 characters, making them hard to read and interact with on mobile devices. Words longer than 8 characters should not be allowed/loaded from the catalog.

### Current Implementation Analysis
```javascript
// Current square sizing (line ~1160):
<div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 border-2 flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold rounded">
```

### Technical Solution
1. **Content Filtering:**
   - Add validation to prevent words longer than 8 characters from being loaded
   - Filter catalog data during initialization
   - Add warnings for invalid words in content catalog

2. **Dynamic Sizing Logic for Shorter Words:**
   ```javascript
   // Calculate optimal square size based on word length (for words ≤ 8 chars)
   const getSquareSize = (wordLength) => {
     if (wordLength <= 4) return 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl';
     if (wordLength <= 6) return 'w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl';
     if (wordLength <= 8) return 'w-12 h-12 sm:w-14 sm:h-14 text-lg sm:text-xl';
     // Fallback for invalid long words (should not occur after filtering)
     return 'w-10 h-10 text-base';
   };
   ```

3. **Content Validation:**
   ```javascript
   // Filter words during catalog loading
   const validateAndFilterWords = (words) => {
     return words.filter(word => {
       if (word.length > 8) {
         console.warn(`Word "${word}" is too long (${word.length} chars) and will be excluded`);
         return false;
       }
       return true;
     });
   };
   ```

4. **Responsive Breakpoints:**
   - Mobile: Larger squares for better touch interaction
   - Tablet: Balanced approach with good readability
   - Desktop: Maintain generous sizing

5. **Implementation:**
   ```javascript
   const squareClasses = `${getSquareSize(wordLength)} border-2 flex items-center justify-center font-bold rounded transition-all duration-300`;
   ```

### Files to Modify
- `src/App.js` - Game board rendering logic and content validation
- Content catalog validation during loading

---

## Issue #5: Fix 7-Letter Word in Anime Category Showing Fallback Hint
**Status:** 🔴 Not Started  
**Priority:** Low  
**Complexity:** Low  

### Problem Description
A 7-letter word in the Anime category is showing the fallback hint "מילה מעניינת!" instead of its proper hint.

### Current Implementation Analysis
```javascript
// Current hint lookup logic (line ~950):
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
```

### Root Cause Analysis
1. **Check Anime Category Data:**
   - Verify all words have corresponding hints
   - Check for typos in word/hint mapping
   - Ensure proper Hebrew character encoding

2. **Current Anime Words (from code):**
   ```javascript
   'אנימה': {
     words: ['נארוטו', 'פיקאצ׳ו', 'גוקו', 'לופי', 'ססקה', 'דרגון', 'איצ׳יגו', 'יוגיו'],
     hints: {
       'נארוטו': 'נינג\'ה עם שועל בתוכו',
       'פיקאצ׳ו': 'פוקימון צהוב חמוד',
       'גוקו': 'לוחם סאיין חזק',
       'לופי': 'פיראט עם כובע קש',
       'ססקה': 'נינג\'ה עם שארינגן',
       'דרגון': 'כדור דרגון',
       'איצ׳יגו': 'שיניגמי תחליף',  // 7 letters - check this one
       'יוגיו': 'מלך המשחקים'
     }
   }
   ```

### Technical Solution
1. **Data Verification:**
   - Count characters in each word
   - Verify hint mapping exists
   - Check for Unicode issues

2. **Enhanced Debugging:**
   ```javascript
   const getHint = () => {
     console.log('DEBUG: Getting hint for word:', targetWord, 'Length:', targetWord.length);
     
     if (isDailyWord) {
       const hint = activeContent.dailyHints[targetWord];
       console.log('DEBUG: Daily word hint:', hint);
       return hint || 'מילה שימושית!';
     }
     
     for (const themeKey in themes) {
       if (themes[themeKey].hints && themes[themeKey].hints[targetWord]) {
         const hint = themes[themeKey].hints[targetWord];
         console.log('DEBUG: Found hint in theme', themeKey, ':', hint);
         return hint;
       }
     }
     
     console.log('DEBUG: No hint found, using fallback');
     return 'מילה מעניינת!';
   };
   ```

### Files to Modify
- `src/App.js` - Hint lookup logic and data verification
- Content catalog files if data issues found

---

## Implementation Plan

### Phase 1: Critical Issues (Week 1)
- [ ] Issue #1: Fix character handling (׳ and ')
- [ ] Issue #3: Anchor virtual keyboard properly

### Phase 2: User Experience (Week 2)  
- [ ] Issue #2: Enlarge header elements
- [ ] Issue #4: Dynamic board square sizing

### Phase 3: Polish (Week 3)
- [ ] Issue #5: Fix anime category hint
- [ ] Comprehensive testing across devices
- [ ] Performance optimization

## Testing Checklist

### Devices to Test
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Android Tablet (Chrome)

### Test Scenarios
- [ ] Character input with Hebrew keyboard
- [ ] Character input with English keyboard
- [ ] Portrait and landscape orientations
- [ ] Different word lengths (4-10+ characters)
- [ ] Virtual keyboard appearance/disappearance
- [ ] Touch targets and accessibility
- [ ] Dark mode functionality

## Progress Tracking

**Overall Progress:** 0/5 issues completed (0%)

### Completion Criteria
Each issue is considered complete when:
1. ✅ Code implementation finished
2. ✅ Unit tests pass (if applicable)
3. ✅ Manual testing on target devices
4. ✅ User acceptance criteria met
5. ✅ Documentation updated

---

*This punch list will be updated as work progresses. Each issue should be tackled systematically with proper testing before moving to the next.*
