# Review Consultation Tabs Setup

## Overview
Configured the Management component to display different tabs based on the consultation flow type. When a lecturer is reviewing a consultation, they see the review-specific tabs instead of the student submission tabs.

## Tab Configuration

### For Review Flow (version_type === "review")
Reviewers see:
1. **Management** - View and review management recommendations
2. **Management Plan** - Review the management plan details (maps to case_guide)
3. **Logs** - View consultation history and logs
4. **Complete** - Finalize and complete the review

**Note:** The "Submit" tab is hidden in review mode since reviewers don't submit - they complete.

### For Student/Professional Flow
Students see:
1. **Management** - Add management recommendations
2. **Management Plan** - Review case management guide
3. **Logs** - View logs
4. **Submit** - Submit consultation for review

Clinicians see:
1. **Management** - Add management
2. **Complete** - Complete the consultation

## Implementation Details

### Files Modified
- `src/components/Management.jsx`

### Key Changes

1. **Version Type Detection**
```jsx
const versionType = useSelector((s) => s.consultation.versionType);
const isReviewMode = versionType === "review";
```

2. **Dynamic Tab Visibility**
```jsx
if (isReviewMode) {
  // Show: Management, Management Plan, Logs, Complete
  visibleTabs = ALL_TABS.filter(
    (tab) => ["management", "case_guide", "logs", "complete"].includes(tab.key)
  );
}
```

3. **Tab Label Customization**
- "case_guide" displays as "Management Plan" for clarity in review mode
- The underlying component (CaseManagementGuide) remains the same

## How It Works

1. **On Review Initiation** (ReviewButton → ReviewModal → useInitiateReview)
   - Redux state is updated with `versionType: "review"`
   - User navigates to `/consultation/{appointmentId}?version={reviewVersionId}`

2. **In Management Component**
   - Reads `versionType` from Redux
   - Detects if `versionType === "review"`
   - Filters visible tabs accordingly
   - Hides "Submit" tab, shows "Complete" tab

3. **Tab Navigation**
   - Reviewers can navigate between all four tabs
   - "Complete" tab allows final review completion
   - Logs tab shows consultation history for reference

## Tab Mapping

| Student View | Reviewer View | Component |
|---|---|---|
| Management | Management | ManagementForm |
| Management Plan | Management Plan | CaseManagementGuide |
| Logs | Logs | LogsTab |
| Submit | - | SubmitTab (hidden) |
| - | Complete | CompleteTab |

## Testing Checklist

- [ ] Start review consultation (ReviewButton → ReviewModal → useInitiateReview)
- [ ] Verify versionType is "review" in Redux
- [ ] Verify 4 tabs visible: Management, Management Plan, Logs, Complete
- [ ] Verify Submit tab is hidden
- [ ] Navigate between tabs without errors
- [ ] View management data in Management tab
- [ ] View case guide in Management Plan tab
- [ ] View logs in Logs tab
- [ ] Complete consultation from Complete tab

## Related Files

- `src/hooks/useInitiateReview.js` - Sets version_type to "review"
- `src/components/ui/buttons/ReviewButton.jsx` - Initiates review flow
- `src/components/ReviewModal.jsx` - Orchestrates review initiation
- `src/redux/slices/consultationSlice.js` - Manages versionType state

## Notes

- The tab keys remain unchanged for backward compatibility
- Only the visibility logic changes based on review mode
- All existing tab components work as-is (no changes needed)
- The "Management Plan" label is just a UI label, the underlying key is still "case_guide"
