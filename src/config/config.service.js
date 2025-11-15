const db = require("../db/database");

module.exports = {
  get(key) {
    const row = db.prepare("SELECT value FROM config WHERE key = ?").get(key);
    return row ? row.value : null;
  },

  set(key, value) {
    db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)").run(key, value);
  }
};
