import { WritableSignal } from '@angular/core';
import { Nullable } from '@curseit/types';

export const addStoreCollectionItems = <T>(
  collection: WritableSignal<Nullable<Array<T>>>,
  items: Array<T>,
) => {
  collection.update(collection => [...collection ?? [], ...items]);
};

export const getStoreCollectionItems = <T>(
  collection: WritableSignal<Nullable<Array<T>>>,
  comparator: (item: T) => boolean,
) => {
  return collection()?.filter(item => comparator(item)) ?? [];
};

export const getStoreCollectionItemById = <T extends { id: unknown }>(
  collection: WritableSignal<Nullable<Array<T>>>,
  id: T['id'],
) => {
  return getStoreCollectionItems(collection, item => item.id === id)?.[0];
};

export const getStoreCollectionItemsByIds = <T extends { id: unknown }>(
  collection: WritableSignal<Nullable<Array<T>>>,
  ids: Array<T['id']>,
) => {
  return getStoreCollectionItems(collection, item => ids.includes(item.id));
};

export const updateStoreCollectionItems = <T>(
  collection: WritableSignal<Nullable<Array<T>>>,
  comparator: (item: T) => boolean,
  update: Partial<T>,
) => {
  collection.update(items => {
    return items?.map(item => comparator(item) ? { ...item, ...update } : item) ?? null;
  });
};

export const updateStoreCollectionItemById = <T extends { id: unknown }>(
  collection: WritableSignal<Nullable<Array<T>>>,
  id: T['id'],
  update: Partial<T>,
) => {
  updateStoreCollectionItems(collection, item => item.id === id, update);
};

export const removeStoreCollectionItems = <T>(
  collection: WritableSignal<Nullable<Array<T>>>,
  comparator: (item: T) => boolean,
) => {
  collection.set(collection()?.filter(item => !comparator(item)) ?? null);
};

export const removeStoreCollectionItemById = <T extends { id: unknown }>(
  collection: WritableSignal<Nullable<Array<T>>>,
  id: T['id'],
) => {
  removeStoreCollectionItems(collection, item => item.id === id);
};

export const removeStoreCollectionItemsByIds = <T extends { id: unknown }>(
  collection: WritableSignal<Nullable<Array<T>>>,
  ids: Array<T['id']>,
) => {
  removeStoreCollectionItems(collection, item => ids.includes(item.id));
}
