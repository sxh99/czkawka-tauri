import type { Preset, Settings } from '~/types';

export const Theme = {
  Dark: 'dark',
  Light: 'light',
  System: 'system',
} as const;

export const DARK_MODE_MEDIA = '(prefers-color-scheme: dark)';

export function getDefaultPreset(): Preset {
  return {
    name: 'Default',
    active: true,
    changed: false,
    settings: getDefaultSettings(),
  };
}

export const MAXIMUM_FILE_SIZE = Math.floor((2 ** 31 - 1) / 1024);

export const BigFilesSearchMode = {
  BiggestFiles: 'BiggestFiles',
  SmallestFiles: 'SmallestFiles',
} as const;

export function getDefaultSettings(): Settings {
  return {
    includedDirectories: [],
    excludedDirectories: [],
    excludedItems: '',
    allowedExtensions: '',
    excludedExtensions: '',
    minimumFileSize: 16,
    maximumFileSize: MAXIMUM_FILE_SIZE,
    recursiveSearch: true,
    useCache: true,
    saveAlsoAsJson: false,
    moveDeletedFilesToTrash: true,
    threadNumber: 1,
    availableThreadNumber: 1,
    duplicateImagePreview: true,
    duplicateHideHardLinks: true,
    duplicateUsePrehash: true,
    duplicateMinimalHashCacheSize: 100,
    duplicateMinimalPrehashCacheSize: 100,
    duplicateDeleteOutdatedEntries: true,
    similarImagesHideHardLinks: true,
    similarImagesShowImagePreview: true,
    similarImagesDeleteOutdatedEntries: true,
    similarVideosDeleteOutdatedEntries: true,
    similarMusicDeleteOutdatedEntries: true,
    similarImagesSubHashSize: 0,
    similarImagesSubHashAlg: '',
    similarImagesSubResizeAlgorithm: '',
    similarImagesSubIgnoreSameSize: true,
    similarImagesSubSimilarity: 0,
    duplicatesSubCheckMethod: '',
    duplicatesSubAvailableHashType: '',
    duplicatesSubNameCaseSensitive: false,
    biggestFilesSubMethod: BigFilesSearchMode.BiggestFiles,
    biggestFilesSubNumberOfFiles: 50,
    similarVideosHideHardLinks: true,
    similarVideosSubIgnoreSameSize: true,
    similarVideosSubSimilarity: 0,
    similarMusicSubAudioCheckType: '',
    similarMusicSubApproximateComparison: true,
    similarMusicCompareFingerprintsOnlyWithSimilarTitles: true,
    similarMusicSubTitle: true,
    similarMusicSubArtist: true,
    similarMusicSubYear: true,
    similarMusicSubBitrate: true,
    similarMusicSubGenre: true,
    similarMusicSubLength: true,
    similarMusicSubMaximumDifferenceValue: 0,
    similarMusicSubMinimalFragmentDurationValue: 0,
    brokenFilesSubAudio: true,
    brokenFilesSubPdf: true,
    brokenFilesSubArchive: true,
    brokenFilesSubImage: true,
  };
}

export const Tools = {
  DuplicateFiles: 'Duplicate Files',
  EmptyFolders: 'Empty Folders',
  BigFiles: 'Big Files',
  EmptyFiles: 'Empty Files',
  TemporaryFiles: 'Temporary Files',
  SimilarImages: 'Similar Images',
  SimilarVideos: 'Similar Videos',
  MusicDuplicates: 'Music Duplicates',
  InvalidSymlinks: 'Invalid Symlinks',
  BrokenFiles: 'Broken Files',
  BadExtensions: 'Bad Extensions',
} as const;
