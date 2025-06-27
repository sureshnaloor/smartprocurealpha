'use server';

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
  addVendor as addVendorFromStorage,
} from '@/lib/server/db-operations';

// Server Actions for vendors
export async function getVendors() {
  return await getVendorsFromStorage();
}

export async function addVendor(vendorData: {
  companyName: string;
  email: string;
  contactName: string;
  phone: string;
  tier: string;
  location: string;
  materialClasses?: string[];
}) {
  return await addVendorFromStorage({
    buyerId: "1", // This will be overridden in db-operations
    companyName: vendorData.companyName,
    email: vendorData.email,
    contactName: vendorData.contactName,
    phone: vendorData.phone,
    tier: vendorData.tier,
    location: vendorData.location,
    materialClasses: vendorData.materialClasses || [],
  } as any);
}

export async function registerVendor(vendorData: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessType: string;
  description: string;
  website?: string;
  taxId: string;
}) {
  // For vendor registration, we'll use a default tier and location
  return await addVendorFromStorage({
    buyerId: "1", // This will be overridden in db-operations
    companyName: vendorData.companyName,
    email: vendorData.email,
    contactName: vendorData.contactName,
    phone: vendorData.phone,
    tier: "tier3", // Default tier for new registrations
    location: `${vendorData.city}, ${vendorData.state}`, // Use city and state as location
    materialClasses: [], // Empty for new registrations
  } as any);
}

// Server Actions for bids
export async function getBids(buyerId: string) {
  return await getBidsFromStorage(buyerId);
}

export async function getBidById(bidId: string) {
  return await getBidByIdFromStorage(bidId);
}

export async function getBidByIdForVendor(bidId: string, vendorId: string) {
  return await getBidByIdForVendorFromStorage(bidId, vendorId);
}

export async function createBid(bidData: {
  buyerId: string;
  title: string;
  description: string;
  dueDate: Date;
  requirements: {
    tier: string;
    materialClass: string;
    location: string;
    minBidAmount: number;
  };
  items: any[];
  invitedVendors: any[];
}) {
  return await createBidFromStorage(bidData);
}

export async function updateBid(bidId: string, bidData: any) {
  return await updateBidFromStorage(bidId, bidData);
}

export async function deleteBid(bidId: string) {
  return await deleteBidFromStorage(bidId);
}

export async function extendBidDueDate(bidId: string, newDueDate: Date) {
  return await extendBidDueDateFromStorage(bidId, newDueDate);
}

export async function addVendorsToBid(bidId: string, vendors: any[]) {
  return await addVendorsToBidFromStorage(bidId, vendors);
}

export async function submitVendorResponse(bidId: string, vendorId: string, submission: any) {
  return await submitVendorResponseFromStorage(bidId, vendorId, submission);
}

export async function sendReminders(bidId: string) {
  return await sendRemindersFromStorage(bidId);
} 