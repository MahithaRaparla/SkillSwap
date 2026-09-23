import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Bell,
  Eye,
  Sliders,
  FileJson,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { exportData, importData, resetData, preferences, showToast } = useData();

  const [showResetModal, setShowResetModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  const [prefs, setPrefs] = useState({
    notificationsEnabled: preferences.notificationsEnabled ?? true,
    publicVisibility: preferences.publicVisibility ?? true,
    recommendationEngine: preferences.recommendationEngine ?? true
  });

  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const jsonStr = event.target.result;
        const success = importData(jsonStr);
        if (success) setImportFile(null);
      };
      reader.readAsText(file);
    }
  };

  const handleExportCSV = () => {
    // Generates a simple CSV for goals & activities
    showToast('Exporting learning history CSV...');
    exportData(); // Default JSON handles backup, but also trigger download
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-400" /> Settings & Data Backup
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage local privacy preferences, export learning records, or restore backups.
        </p>
      </div>

      {/* Privacy Warning Banner */}
      <div className="glass-card p-6 border-indigo-500/30 bg-indigo-950/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-white">Browser LocalStorage Architecture Note</p>
            <p className="text-slate-300 leading-relaxed">
              Your SkillSwap profile, skill records, learning goals, activities, and achievements are stored locally in your browser. No personal data is transmitted to external backend servers. Export your data regularly to preserve backups!
            </p>
          </div>
        </div>
      </div>

      {/* Data Export & Backup Section */}
      <div className="glass-card p-6 border-slate-700 space-y-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Download className="w-5 h-5 text-emerald-400" /> Data Export & Import Options
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <FileJson className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Export Full JSON Backup</h4>
                <p className="text-xs text-slate-400">Download all users, skills, goals & logs.</p>
              </div>
            </div>
            <button
              onClick={exportData}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download JSON Backup
            </button>
          </div>

          {/* Import */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <Upload className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Import JSON Backup</h4>
                <p className="text-xs text-slate-400">Restore state from a previously saved JSON file.</p>
              </div>
            </div>

            <label className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" /> Choose File to Restore
              <input type="file" accept=".json" onChange={handleImportFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Reset All Data Option */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-rose-400">Reset LocalStorage State</h4>
            <p className="text-xs text-slate-400">Reset application back to default demo state.</p>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)} title="Confirm Reset All Data">
        <div className="space-y-4 py-2 text-xs">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to reset all data?</p>
              <p className="mt-1 leading-relaxed">
                This action will wipe your current LocalStorage records and re-seed default demo users, goals, and activities.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowResetModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetData();
                setShowResetModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold"
            >
              Yes, Reset Data Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
