import { listen } from '@tauri-apps/api/event';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Ban, Search } from 'lucide-react';
import { useEffect } from 'react';
import {
  bigFilesAtom,
  bigFilesRowSelectionAtom,
  currentToolAtom,
  duplicateFilesAtom,
  duplicateFilesRowSelectionAtom,
  emptyFilesAtom,
  emptyFilesRowSelectionAtom,
  emptyFoldersAtom,
  emptyFoldersRowSelectionAtom,
  logsAtom,
  progressAtom,
  similarImagesAtom,
  similarImagesRowSelectionAtom,
  temporaryFilesAtom,
  temporaryFilesRowSelectionAtom,
} from '~/atom/primitive';
import { settingsAtom } from '~/atom/settings';
import { OperationButton } from '~/components';
import { Tools, getDefaultProgress } from '~/consts';
import { ipc } from '~/ipc';
import type { AllScanResult, ProgressData, ScanCmd } from '~/types';
import {
  convertDuplicateEntries,
  convertFileEntries,
  convertFolderEntries,
  convertImagesEntries,
  convertTemporaryFileEntries,
} from '~/utils/common';

const scanCmdMap: Record<string, ScanCmd> = {
  [Tools.DuplicateFiles]: 'scan_duplicate_files',
  [Tools.EmptyFolders]: 'scan_empty_folders',
  [Tools.BigFiles]: 'scan_big_files',
  [Tools.EmptyFiles]: 'scan_empty_files',
  [Tools.TemporaryFiles]: 'scan_temporary_files',
  [Tools.SimilarImages]: 'scan_similar_images',
  [Tools.SimilarVideos]: 'scan_similar_videos',
  [Tools.MusicDuplicates]: 'scan_music_duplicates',
  [Tools.InvalidSymlinks]: 'scan_invalid_symlinks',
  [Tools.BrokenFiles]: 'scan_broken_files',
  [Tools.BadExtensions]: 'scan_bad_extensions',
};

export function ScanButton() {
  const currentTool = useAtomValue(currentToolAtom);
  const settings = useAtomValue(settingsAtom);
  const [progress, setProgress] = useAtom(progressAtom);
  const setLogs = useSetAtom(logsAtom);
  const setDuplicateFiles = useSetAtom(duplicateFilesAtom);
  const setDuplicateFilesRowSelection = useSetAtom(
    duplicateFilesRowSelectionAtom,
  );
  const setEmptyFolders = useSetAtom(emptyFoldersAtom);
  const setEmptyFoldersRowSelection = useSetAtom(emptyFoldersRowSelectionAtom);
  const setBigFiles = useSetAtom(bigFilesAtom);
  const setBigFilesRowSelection = useSetAtom(bigFilesRowSelectionAtom);
  const setEmptyFiles = useSetAtom(emptyFilesAtom);
  const setEmptyFilesRowSelection = useSetAtom(emptyFilesRowSelectionAtom);
  const setTemporaryFiles = useSetAtom(temporaryFilesAtom);
  const setTemporaryFilesRowSelection = useSetAtom(
    temporaryFilesRowSelectionAtom,
  );
  const setSimilarImages = useSetAtom(similarImagesAtom);
  const setSimilarImagesRowSelection = useSetAtom(
    similarImagesRowSelectionAtom,
  );

  useEffect(() => {
    listen<AllScanResult>('scan-result', (e) => {
      const { cmd, message, list } = e.payload;
      setLogs(message);
      if (cmd === 'scan_duplicate_files') {
        setDuplicateFiles(convertDuplicateEntries(list));
        setDuplicateFilesRowSelection({});
      } else if (cmd === 'scan_empty_folders') {
        setEmptyFolders(convertFolderEntries(list));
        setEmptyFoldersRowSelection({});
      } else if (cmd === 'scan_big_files') {
        setBigFiles(convertFileEntries(list));
        setBigFilesRowSelection({});
      } else if (cmd === 'scan_empty_files') {
        setEmptyFiles(convertFileEntries(list));
        setEmptyFilesRowSelection({});
      } else if (cmd === 'scan_temporary_files') {
        setTemporaryFiles(convertTemporaryFileEntries(list));
        setTemporaryFilesRowSelection({});
      } else if (cmd === 'scan_similar_images') {
        setSimilarImages(convertImagesEntries(list));
        setSimilarImagesRowSelection({});
      }
      setProgress(getDefaultProgress());
    });
    ipc.listenScanProgress();
    listen<ProgressData>('scan-progress', (e) => {
      setProgress((old) => {
        return { ...old, data: e.payload };
      });
    });
  }, []);

  const handleScan = () => {
    if (progress.tool) {
      return;
    }
    setProgress({ ...progress, tool: currentTool });
    ipc.scan(scanCmdMap[currentTool], settings);
  };

  const handleStopScan = () => {
    if (progress.stopping) {
      return;
    }
    setProgress({ ...progress, stopping: true });
    ipc.stopScan();
  };

  return (
    <>
      {progress.tool ? (
        <OperationButton disabled={progress.stopping} onClick={handleStopScan}>
          <Ban />
          Stop
        </OperationButton>
      ) : (
        <OperationButton
          disabled={!settings.includedDirectories.length}
          onClick={handleScan}
        >
          <Search />
          Scan
        </OperationButton>
      )}
    </>
  );
}
