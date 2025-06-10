# Bug: Task View Routing Issue

**Type**: Bug  
**Priority**: High  
**Status**: Open  

## Summary

Task "View" buttons use filtered array indices instead of proper task IDs, causing wrong tasks to open or 404 errors when filters are applied.

## Steps to Reproduce

1. Go to Tasks page and apply any filter
2. Click "View" on any task
3. Wrong task opens or 404 error occurs

## Expected Behavior

Clicking "View" should always open the correct task, regardless of active filters.

## Demo Value

Perfect example of array index vs proper ID usage in web applications.