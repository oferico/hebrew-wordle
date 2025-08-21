# Hebrew Wordle v1.4.1 Hotfix Requirements

## Version Information
- **Current Version:** 1.4.0
- **Target Version:** 1.4.1 (Hotfix)
- **Release Type:** Bug Fix Release
- **Priority:** High
- **Target Date:** ASAP

## Overview
This hotfix addresses two critical bugs identified in v1.4.0 that affect core gameplay functionality:
1. Incorrect English-to-Hebrew keyboard mapping
2. Category completion logic and dialog display issues

## Bug Fixes

### Bug #1: English-to-Hebrew Keyboard Mapping (Critical)
**Issue:** The English QWERTY to Hebrew keyboard mapping is reversed/incorrect.

**Current Behavior:**
- English 't' maps to Hebrew 'ו' (should be 'א')
- English 'y' maps to Hebrew 'ן' (should be 'ט')
- Other keys are similarly misaligned

**Expected Behavior:**
- English 't' should map to Hebrew 'א'
- English 'y' should map to Hebrew 'ט'
- Proper QWERTY-to-Hebrew layout alignment

**Technical Details:**
- Location: `src/App.js` - `englishToHebrew` mapping object in `handlePhysicalKeyDown` function
- Current mapping appears to be using incorrect Hebrew keyboard layout
- Need to verify against standard Hebrew QWERTY layout

**Acceptance Criteria:**
- [ ] English 't' types Hebrew 'א'
- [ ] English 'y' types Hebrew 'ט'
- [ ] All English keys map to correct Hebrew equivalents
- [ ] Mapping follows standard Hebrew QWERTY layout
- [ ] No regression in Hebrew keyboard functionality

### Bug #2: Category Completion Logic and Dialog Display (Critical)
**Issue:** When all words in a category have been played (with some failed), the category completion logic is incorrect.

**Current Behavior:**
- Regular word result dialog shows "X out of Y words solved" (e.g., "7 out of 8 words solved")
- Category completion dialog may not appear when the last word is played
- Logic doesn't properly detect when all words in category have been attempted

**Expected Behavior:**
- When the last word in a category is played (regardless of success/failure):
  1. Show appropriate word result dialog (success or failure)
  2. After closing word result dialog, show category completion dialog
  3. Category completion dialog should acknowledge all words have been attempted
  4. Statistics should reflect total words played vs. solved correctly

**Technical Details:**
- Location: `src/App.js` - Category completion logic in game result handling
- Need to distinguish between "words solved" and "words played"
- Category completion should trigger when all words attempted, not just solved
- Dialog sequence: Word Result → Category Completion

**Acceptance Criteria:**
- [ ] Last word in category triggers both dialogs in sequence
- [ ] Word result dialog shows correct statistics (played vs. solved)
- [ ] Category completion dialog appears after word result dialog is closed
- [ ] Category completion logic works for both successful and failed final words
- [ ] Statistics accurately reflect words played vs. words solved
- [ ] No duplicate or missing dialogs

## Technical Implementation Notes

### Keyboard Mapping Fix
- Review standard Hebrew QWERTY layout
- Update `englishToHebrew` object with correct mappings
- Test with both English and Hebrew physical keyboards
- Ensure no conflicts with existing Hebrew input

### Category Completion Fix
- Separate "words used/played" from "words solved" in logic
- Update category completion detection to use "words played" count
- Ensure proper dialog sequencing with state management
- Update statistics display to show both metrics clearly

## Testing Requirements

### Keyboard Mapping Testing
- [ ] Test all English letter keys map to correct Hebrew letters
- [ ] Test with English keyboard layout active
- [ ] Test with Hebrew keyboard layout active
- [ ] Verify no regression in direct Hebrew input
- [ ] Test special characters (apostrophe/geresh)

### Category Completion Testing
- [ ] Play through entire category with all words successful
- [ ] Play through entire category with some words failed
- [ ] Play through entire category with last word failed
- [ ] Play through entire category with last word successful
- [ ] Verify dialog sequence in all scenarios
- [ ] Check statistics accuracy in all scenarios

## Files to Modify
- `src/App.js` - Main application logic
- Update `APP_VERSION` constant to '1.4.1'

## Regression Testing
- [ ] Verify all existing functionality works
- [ ] Test both main and trash catalogs
- [ ] Test daily words functionality
- [ ] Test game statistics
- [ ] Test all dialog interactions
- [ ] Test mobile and desktop interfaces

## Release Notes Draft

### Hebrew Wordle v1.4.1 Hotfix
**Bug Fixes:**
- Fixed English-to-Hebrew keyboard mapping for QWERTY users
- Fixed category completion logic to properly handle mixed success/failure scenarios
- Improved dialog sequencing when completing categories

## Priority
**HIGH** - These bugs significantly impact user experience and core gameplay functionality.

## Dependencies
None - This is a pure bug fix release with no new features or external dependencies.
