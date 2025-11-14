import TouchID from 'react-native-touch-id';
import { Platform } from 'react-native';

class BiometricService {
  /**
   * Check if biometric authentication is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await TouchID.isSupported();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Authenticate using biometrics (Face ID / Touch ID / Fingerprint)
   */
  async authenticate(reason: string = 'Authenticate to access SmartHR'): Promise<boolean> {
    const optionalConfigObject = {
      title: 'Authentication Required',
      imageColor: '#1A73E8',
      imageErrorColor: '#EA4335',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: 'Cancel',
      fallbackLabel: 'Use Passcode',
      unifiedErrors: false,
      passcodeFallback: false,
    };

    try {
      await TouchID.authenticate(reason, optionalConfigObject);
      return true;
    } catch (error: any) {
      console.log('Biometric authentication failed:', error);
      return false;
    }
  }

  /**
   * Get the type of biometric authentication available
   */
  async getBiometricType(): Promise<'FaceID' | 'TouchID' | 'Fingerprint' | 'None'> {
    try {
      const biometryType = await TouchID.isSupported();
      if (Platform.OS === 'ios') {
        return biometryType as 'FaceID' | 'TouchID';
      }
      return 'Fingerprint';
    } catch (error) {
      return 'None';
    }
  }
}

export default new BiometricService();
