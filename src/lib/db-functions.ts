// This file provides the database functions that were previously in @/lib/db
// It uses the server storage layer to maintain compatibility

import { 
  getVendors as getVendorsFromStorage,
  getBids as getBidsFromStorage,
  getBidById as getBidByIdFromStorage,
  getBidByIdForVendor as getBidByIdForVendorFromStorage,
  createBid as createBidFromStorage,
  updateBid as updateBidFromStorage,
  deleteBid as deleteBidFromStorage,
  extendBidDueDate as extendBidDueDateFromStorage,
  addVendorsToBid as addVendorsToBidFromStorage,
  submitVendorResponse as submitVendorResponseFromStorage,
  sendReminders as sendRemindersFromStorage,
} from '@/lib/server/db-operations';

// Re-export the functions with the same names
export const getVendors = getVendorsFromStorage;
export const getBids = getBidsFromStorage;
export const getBidById = getBidByIdFromStorage;
export const getBidByIdForVendor = getBidByIdForVendorFromStorage;
export const createBid = createBidFromStorage;
export const updateBid = updateBidFromStorage;
export const deleteBid = deleteBidFromStorage;
export const extendBidDueDate = extendBidDueDateFromStorage;
export const addVendorsToBid = addVendorsToBidFromStorage;
export const submitVendorResponse = submitVendorResponseFromStorage;
export const sendReminders = sendRemindersFromStorage; 