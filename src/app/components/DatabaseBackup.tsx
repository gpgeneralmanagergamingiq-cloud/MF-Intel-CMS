import { useState, useEffect } from "react";
import { Database, Download, Upload, Calendar, HardDrive, AlertTriangle, Check, Clock, Trash2 } from "lucide-react";

interface BackupMetadata {
  id: string;
  date: string;
  timestamp: number;
  size: number;
  tables: string[];
  recordCounts: Record<string, number>;
}

interface SavedBackup extends BackupMetadata {
  data: string; // JSON string of the backup data
}

export function DatabaseBackup() {
  const [backups, setBackups] = useState<SavedBackup[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  useEffect(() => {
    loadSavedBackups();
    checkLastBackupDate();
    
    // Check if auto-backup is needed (once per day)
    if (autoBackupEnabled) {
      checkAndPerformAutoBackup();
    }
  }, []);

  const loadSavedBackups = () => {
    const saved = localStorage.getItem("casino_backups");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBackups(parsed);
      } catch (e) {
        console.error("Error loading backups:", e);
      }
    }
  };

  const checkLastBackupDate = () => {
    const lastBackup = localStorage.getItem("casino_last_backup_date");
    if (lastBackup) {
      setLastBackupDate(lastBackup);
    }
  };

  const checkAndPerformAutoBackup = () => {
    const lastBackup = localStorage.getItem("casino_last_backup_date");
    const today = new Date().toISOString().split("T")[0];
    
    // If no backup today, create one automatically
    if (lastBackup !== today) {
      console.log("Performing automatic daily backup...");
      createBackup(true);
    }
  };

  const getAllDatabaseTables = () => {
    return {
      casino_users: localStorage.getItem("casino_users"),
      casino_players: localStorage.getItem("casino_players"),
      casino_ratings: localStorage.getItem("casino_ratings"),
      casino_tables: localStorage.getItem("casino_tables"),
      casino_floats: localStorage.getItem("casino_floats"),
      casino_float_transactions: localStorage.getItem("casino_float_transactions"),
      casino_properties: localStorage.getItem("casino_properties"),
      casino_email_config: localStorage.getItem("casino_email_config"),
      casino_last_backup_date: localStorage.getItem("casino_last_backup_date"),
    };
  };

  const createBackup = (isAuto = false) => {
    setIsCreatingBackup(true);
    
    try {
      // Collect all database tables
      const data = getAllDatabaseTables();
      
      // Calculate record counts
      const recordCounts: Record<string, number> = {};
      const tables: string[] = [];
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          tables.push(key);
          try {
            const parsed = JSON.parse(value);
            recordCounts[key] = Array.isArray(parsed) ? parsed.length : 1;
          } catch {
            recordCounts[key] = 1;
          }
        }
      });
      
      const backup: SavedBackup = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        timestamp: Date.now(),
        size: JSON.stringify(data).length,
        tables,
        recordCounts,
        data: JSON.stringify(data),
      };
      
      // Save backup to localStorage backups array
      const updatedBackups = [backup, ...backups].slice(0, 30); // Keep last 30 backups
      setBackups(updatedBackups);
      localStorage.setItem("casino_backups", JSON.stringify(updatedBackups));
      
      // Update last backup date
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("casino_last_backup_date", today);
      setLastBackupDate(today);
      
      if (!isAuto) {
        alert("✅ Backup created successfully!");
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("❌ Error creating backup. Please try again.");
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const downloadBackup = (backup: SavedBackup) => {
    try {
      const blob = new Blob([backup.data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `casino-backup-${new Date(backup.date).toISOString().split("T")[0]}-${backup.id.slice(0, 8)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading backup:", error);
      alert("❌ Error downloading backup.");
    }
  };

  const downloadAllBackups = () => {
    try {
      const allBackupsData = JSON.stringify(backups, null, 2);
      const blob = new Blob([allBackupsData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `casino-all-backups-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading all backups:", error);
      alert("❌ Error downloading backups.");
    }
  };

  const restoreBackup = (backup: SavedBackup) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will restore the database to ${new Date(backup.date).toLocaleString()}.\n\n` +
      `All current data will be replaced!\n\n` +
      `Are you sure you want to continue?`
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.confirm(
      "🔴 FINAL CONFIRMATION\n\n" +
      "This action CANNOT be undone!\n\n" +
      "Click OK to restore the backup."
    );
    
    if (!doubleConfirm) return;
    
    try {
      const data = JSON.parse(backup.data);
      
      // Restore each table
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          localStorage.setItem(key, value as string);
        }
      });
      
      alert(`✅ Database restored successfully to ${new Date(backup.date).toLocaleString()}!\n\nPlease refresh the page.`);
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error restoring backup:", error);
      alert("❌ Error restoring backup. The backup file may be corrupted.");
    }
  };

  const uploadBackup = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const content = event.target.result;
          const parsed = JSON.parse(content);
          
          // Check if it's a single backup or multiple backups
          if (Array.isArray(parsed)) {
            // Multiple backups
            const updatedBackups = [...parsed, ...backups];
            setBackups(updatedBackups);
            localStorage.setItem("casino_backups", JSON.stringify(updatedBackups));
            alert(`✅ Imported ${parsed.length} backup(s) successfully!`);
          } else if (parsed.data) {
            // Single backup
            const updatedBackups = [parsed, ...backups];
            setBackups(updatedBackups);
            localStorage.setItem("casino_backups", JSON.stringify(updatedBackups));
            alert("✅ Backup imported successfully!");
          } else {
            alert("❌ Invalid backup file format.");
          }
        } catch (error) {
          console.error("Error importing backup:", error);
          alert("❌ Error importing backup. Please check the file format.");
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const deleteBackup = (backupId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this backup?");
    if (!confirmed) return;
    
    const updatedBackups = backups.filter(b => b.id !== backupId);
    setBackups(updatedBackups);
    localStorage.setItem("casino_backups", JSON.stringify(updatedBackups));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getDaysSinceLastBackup = () => {
    if (!lastBackupDate) return null;
    const last = new Date(lastBackupDate);
    const today = new Date();
    const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysSinceBackup = getDaysSinceLastBackup();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Database Backup & Restore
          </h2>
          <p className="text-slate-600 mt-2">
            Protect your data with automatic daily backups and restore points
          </p>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Backup Status
            </h3>
            {lastBackupDate ? (
              <div>
                <p className="text-blue-100 mb-1">Last Backup:</p>
                <p className="text-2xl font-bold">
                  {new Date(lastBackupDate).toLocaleDateString()}
                </p>
                {daysSinceBackup !== null && (
                  <p className="text-sm text-blue-100 mt-1">
                    {daysSinceBackup === 0 ? "Today" : `${daysSinceBackup} day${daysSinceBackup > 1 ? "s" : ""} ago`}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-blue-100">No backups created yet</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => createBackup()}
              disabled={isCreatingBackup}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold disabled:opacity-50"
            >
              {isCreatingBackup ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Create Backup Now
                </>
              )}
            </button>
            
            <button
              onClick={uploadBackup}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/30 rounded-lg hover:bg-white/20 transition-colors font-semibold"
            >
              <Upload className="w-5 h-5" />
              Import Backup
            </button>
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {daysSinceBackup !== null && daysSinceBackup > 1 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-900">Backup Reminder</p>
            <p className="text-sm text-orange-700 mt-1">
              It's been {daysSinceBackup} days since your last backup. Consider creating a new backup to protect your data.
            </p>
          </div>
        </div>
      )}

      {/* Auto-Backup Setting */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Automatic Daily Backup
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              System will automatically create a backup once per day when you access the app
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoBackupEnabled}
              onChange={(e) => {
                setAutoBackupEnabled(e.target.checked);
                localStorage.setItem("casino_auto_backup", e.target.checked ? "true" : "false");
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
      </div>

      {/* Quick Actions */}
      {backups.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <HardDrive className="w-4 h-4" />
              <span>{backups.length} backup{backups.length !== 1 ? "s" : ""} available</span>
              <span className="text-slate-400">•</span>
              <span>Total size: {formatBytes(backups.reduce((sum, b) => sum + b.size, 0))}</span>
            </div>
            <button
              onClick={downloadAllBackups}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download All Backups
            </button>
          </div>
        </div>
      )}

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Available Backups ({backups.length})
          </h3>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No backups available</p>
            <p className="text-slate-400 mt-1">Create your first backup to protect your data</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {backups.map((backup) => (
              <div key={backup.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {new Date(backup.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {new Date(backup.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 ml-8">
                      <div>
                        <p className="text-xs text-slate-500">Size</p>
                        <p className="font-medium text-slate-900">{formatBytes(backup.size)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Tables</p>
                        <p className="font-medium text-slate-900">{backup.tables.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Players</p>
                        <p className="font-medium text-slate-900">
                          {backup.recordCounts.casino_players || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Ratings</p>
                        <p className="font-medium text-slate-900">
                          {backup.recordCounts.casino_ratings || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => downloadBackup(backup)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      title="Download backup file"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => restoreBackup(backup)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      title="Restore this backup"
                    >
                      <Upload className="w-4 h-4" />
                      Restore
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete backup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-3">📋 How to Use Backup & Restore</h3>
        <div className="space-y-2 text-sm text-slate-700">
          <p>
            <strong>• Automatic Backups:</strong> The system creates a backup once per day automatically when enabled.
          </p>
          <p>
            <strong>• Manual Backup:</strong> Click "Create Backup Now" to create an immediate backup of all data.
          </p>
          <p>
            <strong>• Download Backups:</strong> Save backup files to your computer for safekeeping (recommended weekly).
          </p>
          <p>
            <strong>• Import Backups:</strong> Upload previously downloaded backup files back into the system.
          </p>
          <p>
            <strong>• Restore:</strong> Replace all current data with a previous backup point. ⚠️ This cannot be undone!
          </p>
          <p>
            <strong>• Storage:</strong> The system keeps the last 30 backups automatically. Older backups are removed.
          </p>
        </div>
      </div>
    </div>
  );
}
