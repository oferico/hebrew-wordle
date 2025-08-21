# Hebrew Wordle v1.4.0 - Testing Checklist

## Overview
Comprehensive testing checklist for Hebrew Wordle v1.4.0 covering all new features, improvements, and content updates.

## Core Functionality Testing

### 1. Content Catalog Refresh Functionality ✅ **PRIMARY FEATURE**
- [ ] Open content catalog dialog
- [ ] Click refresh button
- [ ] Verify game state resets completely
- [ ] Confirm new content loads properly
- [ ] Test with different themes/catalogs
- [ ] Verify no errors in console during refresh
- [ ] Test refresh multiple times in succession

### 2. Statistics Dialog Improvement
- [ ] Trigger statistics dialog (complete a game)
- [ ] Verify custom React dialog appears (not browser alert)
- [ ] Check Hebrew text displays correctly
- [ ] Test dialog in dark mode
- [ ] Verify dialog styling matches game theme
- [ ] Test dialog responsiveness on mobile
- [ ] Confirm dialog closes properly

### 3. Desktop Keyboard Support
- [ ] Test physical keyboard input on desktop
- [ ] Verify Hebrew keyboard layout works
- [ ] Test English QWERTY keyboard mapping
- [ ] Check both virtual and physical keyboards work together
- [ ] Test special keys (Enter, Backspace)
- [ ] Verify keyboard input on different browsers
- [ ] Test keyboard shortcuts if any

### 4. Geresh/Apostrophe Input Handling
- [ ] Test words containing ׳ (like ת׳ור, קרינ׳ג)
- [ ] Input using ' (apostrophe) key
- [ ] Input using ׳ (Hebrew geresh) key
- [ ] Verify both inputs are accepted as equivalent
- [ ] Test on virtual keyboard
- [ ] Test on physical keyboard
- [ ] Confirm word matching works correctly

## Content Updates Testing

### 5. Updated Music Category "מוזיקה ישראלית 2025"
**Test these specific artists (all ≤8 characters):**
- [ ] עומראדם - hint: "תן לי לחיות את החיים שלי"
- [ ] נועהקירל - hint: "אני רוצה לרקוד איתך כל הלילה"
- [ ] איתילוי - hint: "אני בא הביתה מהמילואים"
- [ ] אושרכהן - hint: "זמר מנגן ושר"
- [ ] יסמין - hint: "אני לא רוצה להיות לבד"
- [ ] שירלי - hint: "אני רוצה לטוס עם הרוח"
- [ ] עדןחסון - hint: "אני אוהב אותך כמו שאת"
- [ ] אנהזק - hint: "בואי נרקוד עד הבוקר"

### 6. Updated Slang Category "סלנג עם שגיאות כתיב"
**Test these specific words:**
- [ ] סבבה - hint: "הכל בסדר, מעולה"
- [ ] חלאס - hint: "נגמר, די"
- [ ] יאללה - hint: "בואו, קדימה"
- [ ] מטורף - hint: "משהו מדהים או מטורף"
- [ ] כיף - hint: "משהו מהנה ונעים"
- [ ] דפוקיטו - hint: "גרסה חמודה של מטורף"
- [ ] קרינג׳ - hint: "משהו מביך מאוד" (verify ׳ works)
- [ ] וואלה - hint: "ביטוי הסכמה או הפתעה"

### 7. Anime Category Updates
**Test specific character:**
- [ ] ברולי - hint: "סאיין אגדי עם כוח אדיר" (replaced דרגון)

### 8. Comics Category Updates
**Test geresh character:**
- [ ] ת׳ור - hint: "אל נורדי עם פטיש" (verify ׳ works)

### 9. Daily Words Updates
**Test specific word:**
- [ ] פשוט - hint: "לא מסובך" (replaced גבוה)

### 10. Hebrew Grammar Fixes
**Test specific hint:**
- [ ] איצ'יגו - hint: "תחליף שיניגמי" (improved grammar)

### 11. Junk Food Category Updates
**Test specific word:**
- [ ] המבורגר - hint: "כריך עם בשר" (replaced המבור)

## Cross-Platform Testing

### 11. Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify touch interactions work
- [ ] Check virtual keyboard functionality
- [ ] Test geresh input on mobile keyboards
- [ ] Verify responsive design
- [ ] Test content catalog refresh on mobile

### 12. Desktop Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari (Mac)
- [ ] Test on Edge
- [ ] Verify physical keyboard works on all browsers
- [ ] Test different screen resolutions

### 13. Dark Mode Testing
- [ ] Switch to dark mode
- [ ] Verify all new dialogs work in dark mode
- [ ] Check content readability
- [ ] Test statistics dialog in dark mode
- [ ] Verify theme consistency

## Game Logic Testing

### 14. Word Validation
- [ ] Test all new words are accepted
- [ ] Verify hints display correctly
- [ ] Test word length validation
- [ ] Check Hebrew character validation
- [ ] Test geresh normalization in word matching

### 15. Theme Switching
- [ ] Switch between different themes
- [ ] Verify content loads correctly for each theme
- [ ] Test refresh functionality with different themes
- [ ] Check theme-specific words and hints

### 16. Game State Management
- [ ] Start new game
- [ ] Test game reset functionality
- [ ] Verify statistics tracking
- [ ] Test game completion flow
- [ ] Check local storage persistence

## Performance Testing

### 17. Loading Performance
- [ ] Measure initial load time
- [ ] Test content catalog loading speed
- [ ] Verify refresh operation performance
- [ ] Check memory usage during extended play

### 18. Error Handling
- [ ] Test with invalid content catalog
- [ ] Test network connectivity issues
- [ ] Verify graceful error handling
- [ ] Check console for any errors

## Accessibility Testing

### 19. Screen Reader Compatibility
- [ ] Test with screen reader software
- [ ] Verify Hebrew text is read correctly
- [ ] Check dialog accessibility
- [ ] Test keyboard navigation

### 20. Visual Accessibility
- [ ] Test color contrast in both themes
- [ ] Verify text readability
- [ ] Check font size scaling
- [ ] Test with high contrast mode

## Version Verification

### 21. Version Display
- [ ] Verify version shows as "1.4.0"
- [ ] Check version in app interface
- [ ] Confirm version consistency across files

## Content Accuracy Verification

### 22. Hebrew Language Accuracy
- [ ] Verify all Hebrew text is grammatically correct
- [ ] Check proper use of geresh characters
- [ ] Confirm hint accuracy for all words
- [ ] Validate educational content appropriateness

### 23. Cultural Content Appropriateness
- [ ] Verify all slang words are age-appropriate
- [ ] Check music references are current and accurate
- [ ] Confirm anime/comics references are correct
- [ ] Validate cultural sensitivity

## Final Integration Testing

### 24. End-to-End Game Flow
- [ ] Complete full game from start to finish
- [ ] Test multiple games in succession
- [ ] Verify statistics accumulation
- [ ] Test content refresh between games
- [ ] Confirm all features work together seamlessly

---

## Testing Priority Levels

**🔴 Critical (Must Pass):**
- Content catalog refresh functionality
- Geresh/apostrophe input handling
- All new content words and hints
- Cross-platform compatibility

**🟡 Important (Should Pass):**
- Statistics dialog improvements
- Desktop keyboard support
- Dark mode compatibility
- Performance benchmarks

**🟢 Nice to Have (Good to Pass):**
- Accessibility features
- Advanced error handling
- Extended browser support

---

## Bug Reporting Template

When reporting issues, include:
1. **Device/Browser:** [e.g., iPhone 13 Safari, Windows Chrome]
2. **Steps to Reproduce:** [Detailed steps]
3. **Expected Result:** [What should happen]
4. **Actual Result:** [What actually happened]
5. **Screenshots:** [If applicable]
6. **Console Errors:** [Any JavaScript errors]

---

**Testing Date:** ___________
**Tester:** ___________
**Version Tested:** 1.4.0
**Overall Status:** ⬜ Pass ⬜ Fail ⬜ Needs Review
