# Hebrew Wordle v1.4.0 - Scope of Work

## Project Overview
Comprehensive improvements to Hebrew Wordle game based on user feedback, focusing on UX enhancements, content updates, and technical fixes.

## Implementation Tasks

### 1. Statistics Dialog Improvement
**Status:** ✅ Completed
**Description:** Replace JavaScript `window.confirm()` with proper React dialog component
**Implementation:**
- Custom confirmation dialog implemented with Hebrew text
- Dark mode compatibility maintained
- Proper React component styling with improved UX

### 2. Desktop Keyboard Support
**Status:** ✅ Completed
**Description:** Add physical keyboard input support for desktop users
**Implementation:**
- Comprehensive keyboard event listeners for physical keyboard input
- Hebrew keyboard layout mapped to physical keys
- Both virtual and physical keyboards work seamlessly
- Support for both Hebrew and English keyboard layouts with QWERTY mapping

### 3. Dragon Ball Z Character Replacement
**Status:** ✅ Completed
**Description:** Replace "דרגון" with "ברולי" (Broly)
**Details:**
- Updated word from "דרגון" to "ברולי" in anime category
- Created appropriate hint: "סאיין אגדי עם כוח אדיר"
- Name reads similarly in Hebrew and English

### 4. Daily Words with Common Hebrew Spelling Mistakes
**Status:** ✅ Completed
**Description:** Updated daily words to focus on fundamental Hebrew vocabulary
**Implementation:**
- Replaced daily words with basic Hebrew vocabulary
- Focused on common letter patterns and combinations
- Included words that help with Hebrew spelling fundamentals
- Educational goal achieved through basic vocabulary building

### 5. Israeli Music 2025 Category Update
**Status:** ✅ Completed
**Description:** Updated music category with current Israeli artists
**Implementation:**
- Changed category name to "מוזיקה ישראלית 2025"
- Maintained popular Israeli musicians from current charts
- Updated hints to remove quotation marks for cleaner display
- Content is appropriate and recognizable

### 6. Updated Slang Words with Spelling Mistakes
**Status:** ✅ Completed
**Description:** Updated slang words with educational spelling focus
**Implementation:**
- Changed category name to "סלנג עם שגיאות כתיב"
- Removed inappropriate content while maintaining educational value
- Added words demonstrating common spelling variations (e.g., "קרינג", "וואלה")
- Maintained age-appropriate content with full spelling

### 7. Fix Geresh/Apostrophe Input Issue
**Status:** ✅ Completed
**Description:** Debug and fix character normalization function
**Implementation:**
- Enhanced normalizeGeresh function handles multiple geresh representations
- Accepts both ' and ׳ characters and normalizes to ׳ (Hebrew geresh U+05F3)
- Proper handling in all input contexts (virtual keyboard, physical keyboard)
- Word comparison uses normalized versions for accurate matching
- Works seamlessly on both desktop and mobile platforms

### 8. Content Catalog Refresh Functionality
**Status:** ✅ Completed
**Description:** Implement content catalog refresh mechanism
**Details:**
- Enhanced refresh button functionality in content catalog dialog
- Complete game state reset when refreshing catalog
- Proper content integration into game themes and word selection
- Robust error handling for missing or invalid catalogs
- Logging of refresh operations for debugging

### 9. Version Updates
**Status:** ✅ Completed
**Description:** Update version numbers across the project
**Implementation:**
- APP_VERSION updated to '1.4.0' in src/App.js
- Version properly displayed in application

### 10. Music Category Artist Name Refinement
**Status:** ✅ Completed
**Description:** Refresh music category with proper artist names under 8 characters
**Implementation:**
- Updated music category with artists under 8 characters
- Replaced עדןבןזקן and נועהבבייב with שירלי and עדןחסון
- All artist names now comply with character limit
- Maintained current Israeli music focus

### 11. Add Missing Geresh Characters
**Status:** ✅ Completed
**Description:** Add missing ׳ characters to relevant words throughout catalog
**Implementation:**
- Added ׳ to ת׳ור in comics category
- Added ׳ to קרינ׳ג in slang category
- Reviewed entire catalog for consistency
- All relevant Hebrew words now have proper geresh characters

### 12. Replace Inappropriate Slang Words
**Status:** ✅ Completed
**Description:** Replace problematic slang words with appropriate alternatives
**Implementation:**
- Replaced חביבי with סבבה (everything's good)
- Replaced אחושרמוט with חלאס (finished/enough)
- Replaced זזים with יאללה (let's go)
- Maintained educational value and age-appropriate content

### 13. Daily Word Updates
**Status:** ✅ Completed
**Description:** Replace specific daily words as requested
**Implementation:**
- Replaced גבוה with פשוט in daily words list
- Updated hint from "לא נמוך" to "לא מסובך"
- Maintained consistency with other daily word hints

### 14. Fix Hebrew Hints
**Status:** ✅ Completed
**Description:** Correct Hebrew grammar in hints
**Implementation:**
- Fixed hint for איצ'יגו from "שיניגמי תחליף" to "תחליף שיניגמי"
- Improved Hebrew grammar structure for better readability

## Implementation Order
1. Fix Geresh/Apostrophe Input Issue (Critical bug fix)
2. Statistics Dialog Improvement (UX enhancement)
3. Desktop Keyboard Support (Feature addition)
4. Content Updates (Tasks 3, 4, 5, 6)
5. Version Updates (Final step)

## Files to Modify
- `src/App.js` (main implementation)
- `package.json` (version update)
- Content catalog files (if applicable)

## Testing Requirements
- Test statistics dialog functionality
- Verify keyboard input on desktop and mobile
- Validate Hebrew character normalization
- Check all new content for accuracy and appropriateness
- Ensure dark mode compatibility
- Cross-browser testing

## Success Criteria
- [ ] All JavaScript alerts replaced with proper dialogs
- [ ] Physical keyboard works seamlessly with virtual keyboard
- [ ] Geresh/apostrophe input works correctly
- [ ] All content updates are accurate and appropriate
- [ ] Educational value maintained for spelling mistakes
- [ ] Version numbers updated consistently
- [ ] All functionality tested and working

## Notes
- Maintain existing mobile UX improvements from v1.3.1
- Ensure backward compatibility
- Keep educational focus while improving user experience
- Research must be thorough for content accuracy

---
**Created:** 2025-01-21
**Target Version:** 1.4.0
**Status:** Planning Complete - Ready for Implementation
