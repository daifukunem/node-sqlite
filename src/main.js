/**
 * SQLite client library for Node.js applications
 *
 * Copyright © 2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sqlite3 from 'sqlite3';
import Database from './Database';

const promise = global.Promise;
const db = new Database(null, { Promise: promise });

/**
 * Opens SQLite database.
 *
 * @returns Promise<Database> A promise that resolves to an instance of SQLite database client.
 */
db.open = (filename, {
  mode = null,
  verbose = false,
  Promise = promise,
  cached = false } = {}) => {
  let driver;
  let DBDriver = sqlite3.Database;

  if (cached) {
    DBDriver = sqlite3.cached.Database;
  }

  if (verbose) {
    sqlite3.verbose();
  }

  return new Promise((resolve, reject) => {
    if (mode !== null) {
      driver = new DBDriver(filename, mode, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      driver = new DBDriver(filename, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }
  }).then(() => {
    db.driver = driver;
    db.Promise = Promise;
    return new Database(driver, { Promise });
  });
};

export default db;
