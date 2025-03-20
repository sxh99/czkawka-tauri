import { invoke, isTauri } from '@tauri-apps/api/core';
import { mockIPC } from '@tauri-apps/api/mocks';
import type { ImageInfo, PlatformSettings, ScanCmd, Settings } from '~/types';

interface MoveFilesOptions {
  paths: string[];
  destination: string;
  copyMode: boolean;
  preserveStructure: boolean;
  overrideMode: boolean;
}

export const ipc = {
  getPlatformSettings(): Promise<PlatformSettings> {
    return invoke('get_platform_settings');
  },

  setupNumberOfThreads(numberOfThreads: number): Promise<number> {
    return invoke('setup_number_of_threads', { numberOfThreads });
  },

  scan(scanCmd: ScanCmd, settings: Settings) {
    return invoke(scanCmd, { settings });
  },

  startListenScanProgress() {
    return invoke('listen_scan_progress');
  },

  stopScan() {
    return invoke('stop_scan');
  },

  readImage(path: string): Promise<ImageInfo> {
    return invoke('read_image', { path });
  },

  moveFiles(options: MoveFilesOptions) {
    return invoke('move_files', { options });
  },
};

export function mockIPCForDev() {
  if (!isTauri()) {
    mockIPC((cmd) => {
      if (cmd === 'get_platform_settings') {
        const data: PlatformSettings = {
          includedDirectories: ['foo'],
          excludedDirectories: [
            'bar',
            'baz',
            'fjiefj',
            'jfiefjiej',
            'sjfie',
            'fjeifj',
          ],
          excludedItems: 'foo,bar,baz',
          availableThreadNumber: 8,
          cacheDirPath: '',
        };
        return Promise.resolve(data);
      }
      if (cmd === 'setup_number_of_threads') {
        return Promise.resolve(8);
      }
    });
  }
}
