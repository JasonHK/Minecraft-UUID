"use strict";

import { INDEXEDDB, createInstance } from "localforage";

import { Filter } from "../types/Helpers";

export class Database<T> {

    private readonly database: LocalForage;

    constructor(name: string, table?: string) {

        table = (table || name);

        this.database = createInstance({
            driver:    INDEXEDDB,
            name:      name,
            storeName: table
        });
    }

    public clear(): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.database.clear().then(() => {
                resolve(true);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public get<K extends keyof T>(key: Filter<K, string>): Promise<T[K]> {

        return new Promise((resolve, reject) => {
            this.database.getItem(key).then((value: T[K]) => {
                resolve(value);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public includes<K extends keyof T>(key: Filter<K, string>): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.get(key).then((value: T[K]) => {
                resolve(value !== null);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public iterate(iteration: Database.IterationCallback<T>): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.database.iterate(iteration).then(() => {
                resolve(true);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public length(): Promise<number> {

        return new Promise((resolve, reject) => {
            this.database.length().then((length: number) => {
                resolve(length);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public remove<K extends keyof T>(key: Filter<K, string>): Promise<boolean> {

        return new Promise((resolve, reject) => {
            this.database.removeItem(key).then(() => {
                resolve(true);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public set<K extends keyof T>(key: Filter<K, string>, value: T[K]): Promise<T[K]> {

        return new Promise((resolve, reject) => {
            this.database.setItem(key, value).then((value: T[K]) => {
                resolve(value);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }
}

export namespace Database {

    export interface IterationCallback<T, K extends keyof T = keyof T> {
        (value: T[K], key: Filter<K, string>, index: number): any;
    }
}

export default Database;
