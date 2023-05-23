import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'cr.sde.SD1Movil',
  appName: 'sd1movil',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
    },
  },
};

export default config;
