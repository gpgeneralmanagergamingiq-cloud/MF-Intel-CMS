/**
 * MULTI-PROPERTY MANAGEMENT SYSTEM
 * 
 * This module handles multi-property operations for the MF-Intel Gaming IQ CMS.
 * Key Features:
 * - Automatic property initialization
 * - Cross-property data isolation
 * - Property-specific user management
 * - Centralized property configuration
 */

import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-68939c29`;

export interface PropertyConfig {
  id: string;
  name: string;
  displayName: string;
  currency: 'FCFA';
  timezone: string;
  isActive: boolean;
  createdAt: string;
  settings: {
    // Thermal printer settings
    printerEnabled: boolean;
    printerModel: 'Epson TM-T20III';
    printerIP?: string;
    
    // Comps system settings
    compsEnabled: boolean;
    compsTheoPercentage: number; // Default: 15%
    compsStaffDiscount: number; // Default: 50%
    
    // Casino settings
    minBuyIn: number;
    maxBuyIn: number;
    vipThreshold: number; // Theo amount for VIP status
    
    // Receipt customization
    receiptHeader?: string;
    receiptFooter?: string;
    logoUrl?: string;
  };
}

/**
 * Get all properties from the backend
 */
export async function getAllProperties(): Promise<PropertyConfig[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

/**
 * Create a new property with default configuration
 */
export async function createNewProperty(
  name: string,
  displayName: string,
  timezone: string = 'Africa/Douala'
): Promise<PropertyConfig> {
  const newProperty: PropertyConfig = {
    id: `property_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.replace(/\s+/g, '-'), // Convert spaces to hyphens for URL safety
    displayName,
    currency: 'FCFA',
    timezone,
    isActive: true,
    createdAt: new Date().toISOString(),
    settings: {
      printerEnabled: false,
      printerModel: 'Epson TM-T20III',
      compsEnabled: true,
      compsTheoPercentage: 15,
      compsStaffDiscount: 50,
      minBuyIn: 10000,
      maxBuyIn: 10000000,
      vipThreshold: 1000000,
    }
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(newProperty)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create property: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Initialize default users for this property
    await initializePropertyUsers(newProperty.name);
    
    return result.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

/**
 * Initialize default users for a new property
 */
async function initializePropertyUsers(propertyName: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/initialize/${encodeURIComponent(propertyName)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      console.warn('Failed to initialize property users:', response.statusText);
    }
  } catch (error) {
    console.error('Error initializing property users:', error);
  }
}

/**
 * Update property configuration
 */
export async function updatePropertyConfig(
  propertyId: string,
  updates: Partial<PropertyConfig>
): Promise<PropertyConfig> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update property: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
}

/**
 * Deactivate a property (soft delete)
 */
export async function deactivateProperty(propertyId: string): Promise<void> {
  try {
    await updatePropertyConfig(propertyId, { isActive: false });
  } catch (error) {
    console.error('Error deactivating property:', error);
    throw error;
  }
}

/**
 * Get property by name (URL-safe name)
 */
export async function getPropertyByName(name: string): Promise<PropertyConfig | null> {
  const properties = await getAllProperties();
  return properties.find(p => p.name === name) || null;
}

/**
 * Check if user has access to a property
 */
export async function verifyPropertyAccess(
  propertyName: string,
  username: string
): Promise<boolean> {
  // For now, all users have access to all properties
  // You can implement property-specific access control here
  return true;
}

/**
 * Clone property data from one property to another
 * (Useful for creating test environments or duplicating setups)
 */
export async function clonePropertyData(
  sourceProperty: string,
  targetProperty: string,
  includeUsers: boolean = false
): Promise<void> {
  console.log(`Cloning data from ${sourceProperty} to ${targetProperty}...`);
  
  // This would be implemented server-side for efficiency
  // For now, it's a placeholder for future functionality
  
  throw new Error('Property cloning not yet implemented. Contact system administrator.');
}

/**
 * Get system-wide statistics (across all properties)
 */
export async function getSystemWideStats(): Promise<{
  totalProperties: number;
  activeProperties: number;
  totalPlayers: number;
  totalUsers: number;
  lastActivity: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/system/stats`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch system stats: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching system stats:', error);
    // Return defaults if error
    return {
      totalProperties: 0,
      activeProperties: 0,
      totalPlayers: 0,
      totalUsers: 0,
      lastActivity: new Date().toISOString()
    };
  }
}

/**
 * Export property data for backup
 */
export async function exportPropertyData(propertyName: string): Promise<Blob> {
  try {
    const response = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(propertyName)}/export`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to export property data: ${response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting property data:', error);
    throw error;
  }
}

/**
 * Import property data from backup
 */
export async function importPropertyData(
  propertyName: string,
  dataFile: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('file', dataFile);
    
    const response = await fetch(`${API_BASE_URL}/properties/${encodeURIComponent(propertyName)}/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Failed to import property data: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error importing property data:', error);
    throw error;
  }
}
