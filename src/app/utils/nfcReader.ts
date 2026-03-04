/**
 * ACR122U NFC Reader Utility
 * Supports Web USB API for direct browser communication with ACR122U
 */

// APDU Commands for ACR122U
const COMMANDS = {
  // Get UID command for Mifare/ISO14443A cards
  GET_UID: new Uint8Array([
    0xFF, 0xCA, 0x00, 0x00, 0x00
  ]),
  
  // LED and Buzzer control (optional)
  BUZZER_ON: new Uint8Array([
    0xFF, 0x00, 0x52, 0x00, 0x00
  ])
};

export class ACR122U {
  private device: USBDevice | null = null;
  private interfaceNumber: number = 0;
  private endpointIn: number = 0x82; // Bulk IN endpoint
  private endpointOut: number = 0x01; // Bulk OUT endpoint
  private onCardDetected: ((uid: string) => void) | null = null;
  private polling: boolean = false;

  constructor() {}

  /**
   * Request and connect to ACR122U device
   */
  async connect(): Promise<boolean> {
    try {
      // Request USB device with ACR122U vendor/product ID
      this.device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x072f, productId: 0x2200 } // ACR122U
        ]
      });

      await this.device.open();
      
      // Claim the first interface (CCID interface)
      if (this.device.configuration === null) {
        await this.device.selectConfiguration(1);
      }
      
      this.interfaceNumber = 0;
      await this.device.claimInterface(this.interfaceNumber);
      
      console.log("ACR122U connected successfully");
      return true;
    } catch (error) {
      console.error("Failed to connect to ACR122U:", error);
      return false;
    }
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    this.polling = false;
    
    if (this.device) {
      try {
        await this.device.releaseInterface(this.interfaceNumber);
        await this.device.close();
        console.log("ACR122U disconnected");
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
      this.device = null;
    }
  }

  /**
   * Check if device is connected
   */
  isConnected(): boolean {
    return this.device !== null && this.device.opened;
  }

  /**
   * Send CCID command and receive response
   */
  private async sendCommand(apdu: Uint8Array): Promise<Uint8Array> {
    if (!this.device) {
      throw new Error("Device not connected");
    }

    // Build CCID frame
    const ccidCommand = this.buildCCIDCommand(apdu);
    
    // Send command
    await this.device.transferOut(this.endpointOut, ccidCommand);
    
    // Receive response
    const result = await this.device.transferIn(this.endpointIn, 300);
    
    if (result.data) {
      return new Uint8Array(result.data.buffer);
    }
    
    throw new Error("No response from device");
  }

  /**
   * Build CCID frame for APDU command
   */
  private buildCCIDCommand(apdu: Uint8Array): Uint8Array {
    const length = apdu.length;
    const ccid = new Uint8Array(10 + length);
    
    ccid[0] = 0x6F; // PC_to_RDR_XfrBlock
    ccid[1] = length & 0xFF;
    ccid[2] = (length >> 8) & 0xFF;
    ccid[3] = (length >> 16) & 0xFF;
    ccid[4] = (length >> 24) & 0xFF;
    ccid[5] = 0x00; // Slot
    ccid[6] = 0x00; // Seq
    ccid[7] = 0x00; // BWI
    ccid[8] = 0x00; // Level parameter
    ccid[9] = 0x00; // RFU
    
    ccid.set(apdu, 10);
    
    return ccid;
  }

  /**
   * Parse CCID response to extract APDU data
   */
  private parseCCIDResponse(ccidResponse: Uint8Array): Uint8Array {
    // CCID response has 10 byte header
    if (ccidResponse.length < 10) {
      throw new Error("Invalid CCID response");
    }
    
    const dataLength = ccidResponse[1] | (ccidResponse[2] << 8) | 
                       (ccidResponse[3] << 16) | (ccidResponse[4] << 24);
    
    return ccidResponse.slice(10, 10 + dataLength);
  }

  /**
   * Read card UID
   */
  async readCardUID(): Promise<string | null> {
    try {
      const response = await this.sendCommand(COMMANDS.GET_UID);
      const apduData = this.parseCCIDResponse(response);
      
      // Check if response is valid (SW1 SW2 = 90 00)
      if (apduData.length < 2) {
        return null;
      }
      
      const sw1 = apduData[apduData.length - 2];
      const sw2 = apduData[apduData.length - 1];
      
      if (sw1 === 0x90 && sw2 === 0x00) {
        // Extract UID (remove status bytes)
        const uid = apduData.slice(0, apduData.length - 2);
        return this.bytesToHex(uid);
      }
      
      return null;
    } catch (error) {
      console.error("Error reading card UID:", error);
      return null;
    }
  }

  /**
   * Convert byte array to hex string
   */
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0').toUpperCase())
      .join('');
  }

  /**
   * Start polling for cards
   */
  startPolling(onCardDetected: (uid: string) => void): void {
    this.onCardDetected = onCardDetected;
    this.polling = true;
    this.pollForCard();
  }

  /**
   * Stop polling for cards
   */
  stopPolling(): void {
    this.polling = false;
  }

  /**
   * Poll for card presence
   */
  private async pollForCard(): Promise<void> {
    if (!this.polling) return;
    
    try {
      const uid = await this.readCardUID();
      
      if (uid && this.onCardDetected) {
        this.onCardDetected(uid);
      }
    } catch (error) {
      // Card not present or error reading - continue polling
    }
    
    // Poll again after 500ms
    if (this.polling) {
      setTimeout(() => this.pollForCard(), 500);
    }
  }
}

// Singleton instance
let readerInstance: ACR122U | null = null;

export function getACR122UReader(): ACR122U {
  if (!readerInstance) {
    readerInstance = new ACR122U();
  }
  return readerInstance;
}

// Check if Web USB is supported
export function isWebUSBSupported(): boolean {
  return 'usb' in navigator;
}
