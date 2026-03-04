#!/bin/bash
#
# MF-Intel CMS - Automated Backup Script
# Backs up PostgreSQL database and syncs to cloud
#
# Installation:
# 1. sudo nano /usr/local/bin/casino-backup.sh
# 2. sudo chmod +x /usr/local/bin/casino-backup.sh
# 3. Add to crontab: 0 */6 * * * /usr/local/bin/casino-backup.sh
#

set -e  # Exit on error

# Configuration
BACKUP_DIR="/backup/casino"
DB_NAME="casino_db"
DB_USER="postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30
LOG_FILE="/var/log/casino-backup.log"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Log start
echo "[$(date)] Starting backup..." | tee -a $LOG_FILE

# Database backup
echo "[$(date)] Backing up database..." | tee -a $LOG_FILE
pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_$DATE.sql

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "[$(date)] Database backup successful: db_$DATE.sql" | tee -a $LOG_FILE
    
    # Compress backup
    gzip $BACKUP_DIR/db_$DATE.sql
    echo "[$(date)] Backup compressed: db_$DATE.sql.gz" | tee -a $LOG_FILE
    
    # Calculate backup size
    BACKUP_SIZE=$(du -h $BACKUP_DIR/db_$DATE.sql.gz | cut -f1)
    echo "[$(date)] Backup size: $BACKUP_SIZE" | tee -a $LOG_FILE
else
    echo "[$(date)] ERROR: Database backup failed!" | tee -a $LOG_FILE
    exit 1
fi

# Clean up old backups (keep last 30 days)
echo "[$(date)] Cleaning up old backups (>$RETENTION_DAYS days)..." | tee -a $LOG_FILE
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Count remaining backups
BACKUP_COUNT=$(ls -1 $BACKUP_DIR/db_*.sql.gz 2>/dev/null | wc -l)
echo "[$(date)] Total backups retained: $BACKUP_COUNT" | tee -a $LOG_FILE

# Optional: Copy to remote location (NAS, cloud storage, etc.)
# Uncomment and configure if you have a remote backup location
# rsync -avz $BACKUP_DIR/db_$DATE.sql.gz user@remote-server:/backup/casino/

# Optional: Upload to cloud storage (AWS S3, Google Cloud, etc.)
# Uncomment if using AWS S3
# aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://your-bucket/casino-backups/

echo "[$(date)] Backup completed successfully!" | tee -a $LOG_FILE

# Send notification (optional)
# curl -X POST -H 'Content-type: application/json' \
#   --data "{\"text\":\"Casino CMS backup completed: $BACKUP_SIZE\"}" \
#   YOUR_SLACK_WEBHOOK_URL

exit 0
