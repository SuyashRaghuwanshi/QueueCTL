const db = require("../db/database");
const STATES = require("./job.types");

module.exports = {
  insert(id, command, maxRetries) {
    return db.prepare(`
      INSERT INTO jobs (id, command, max_retries)
      VALUES (?, ?, ?)
      RETURNING *
    `).get(id, command, maxRetries);
  },

  claimNext() {
    return db.prepare(`
      UPDATE jobs
      SET state = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = (
        SELECT id FROM jobs
        WHERE state = ?
        AND datetime(next_run_at) <= datetime('now')
        ORDER BY created_at ASC
        LIMIT 1
      )
      RETURNING *
    `).get(STATES.PROCESSING, STATES.PENDING);
  },

  markCompleted(id) {
    db.prepare(`
      UPDATE jobs
      SET state = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(STATES.COMPLETED, id);
  },

  updateOnFailure(id, attempts, error, nextRun) {
    db.prepare(`
      UPDATE jobs
      SET attempts = ?, last_error = ?, next_run_at = datetime('now', '+' || ? || ' seconds'),
          state = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(attempts, error, nextRun, STATES.PENDING, id);
  },

  moveToDLQ(id, attempts, error) {
    db.prepare(`
      UPDATE jobs
      SET state = ?, attempts = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(STATES.DEAD, attempts, error, id);
  },

  reset(id) {
    db.prepare(`
      UPDATE jobs
      SET state = 'pending', attempts = 0, next_run_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);
  }
};
