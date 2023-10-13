import { useRef, useState } from 'react';
import {
  type AlbumsOptions,
  type AssetsOptions,
  getAlbumsAsync,
  getAssetsAsync,
} from 'expo-media-library';
import type { InAppAlbumTypes } from '../components/shared-types';

export function useAlbumState() {
  // all albums
  const [currentAlbums, setCurrentAlbums] = useState<InAppAlbumTypes.Album[]>(
    []
  );
  // current album
  const [currentAlbum, setCurrentAlbum] =
    useState<InAppAlbumTypes.Album | null>(null);
  // current album media files
  const [mediaFiles, setMediaFiles] = useState<InAppAlbumTypes.Asset[]>([]);

  const paging = useRef({
    // Ensure it's a multiple of 3, because we have 3 columns
    pageSize: 3 * 10,
    endCursor: undefined as undefined | string,
    hasNextPage: false,
    total: 0,
  });

  /**
   * 初始化相册数据
   */
  const getAlbums = async () => {
    const mediaAlbums = await _getAlbums({ includeSmartAlbums: true });

    // 读取所有相册, 然后按数量排序
    const albums = mediaAlbums
      // 过滤掉没有媒体文件的相册
      .filter((album) => album.assetCount > 0)
      // 按照数量排序 assetCount 降序
      .sort((a, b) => b.assetCount - a.assetCount);

    // 把第一个作为默认值
    if (albums.length > 0) {
      const album = albums[0]!;
      setCurrentAlbum(album);
      getMediaFiles(album);
    }
    setCurrentAlbums(albums);
  };

  const getMediaFiles = async (album: InAppAlbumTypes.Album) => {
    const assets = await _getAssets({
      first: paging.current.pageSize,
      album: album,
      sortBy: ['creationTime'],
      after: paging.current.endCursor,
    });
    if (paging.current.endCursor) {
      setMediaFiles((state) => [...state, ...assets.assets]);
    } else {
      setMediaFiles(assets.assets);
    }
    paging.current.endCursor = assets.endCursor;
    paging.current.hasNextPage = assets.hasNextPage;
    paging.current.total = assets.totalCount;
  };

  return {
    albums: currentAlbums,
    album: currentAlbum,
    mediaFiles,
    getAlbums,
    getMediaFiles,
  };
}

const _getAlbums = (
  options?: AlbumsOptions
): Promise<InAppAlbumTypes.Album[]> => {
  return getAlbumsAsync(options).then((albums) => {
    return Promise.all(
      albums.map(async (album) => {
        const assets = await getAssetsAsync({
          first: 1,
          album: album,
          sortBy: ['creationTime'],
        });
        return {
          ...album,
          thumbnail: assets.assets[0],
        } as unknown as InAppAlbumTypes.Album;
      })
    );
  });
};

const _getAssets = (options: AssetsOptions) => {
  return getAssetsAsync(options);
};
