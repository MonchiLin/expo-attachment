import type {
  PagedInfo,
  Asset as _Asset,
  Album as _Album,
} from 'expo-media-library';

export namespace InAppAlbumTypes {
  export type Asset = _Asset;
  export type PagedAsset = PagedInfo<Asset>;

  export type Album = _Album & {
    thumbnail: Asset;
  };
}
