import { useState, useEffect } from "react";
import { Mail, Save, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { useApi } from "../hooks/useApi";

interface EmailSettings {
  serviceId: string;
  templateId: string;
  publicKey: string;
  enabled: boolean;
}

export function EmailConfig() {
  const [settings, setSettings] = useState<EmailSettings>({
    serviceId: "",
    templateId: "",
    publicKey: "",
    enabled: false,
  });
  const [showKeys, setShowKeys] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    loadSettings();
  }, [api.currentProperty]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const loadedSettings = await api.getEmailConfig();
      if (loadedSettings) {
        setSettings(loadedSettings);
      }
    } catch (error) {
      console.error("Error loading email settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.saveEmailConfig(settings);
      setSaveMessage("Email settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving email settings:", error);
      setSaveMessage("Failed to save email settings.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Mail className="w-6 h-6 text-blue-600" />
          Email Notifications Setup
        </h3>
        <p className="text-sm text-slate-600">
          Configure EmailJS to automatically send end-of-day reports to Owner and Management
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-blue-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Setup Instructions
        </h4>
        <ol className="text-sm text-blue-800 space-y-2 ml-5 list-decimal">
          <li>
            Create a free account at{" "}
            <a
              href="https://www.emailjs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              EmailJS.com
            </a>
          </li>
          <li>
            Add an email service (Gmail, Outlook, etc.) in the Email Services section
          </li>
          <li>
            Create an email template with these variables:
            <ul className="ml-5 mt-1 list-disc">
              <li><code className="bg-blue-100 px-1 rounded">{"{to_email}"}</code> - Recipient email</li>
              <li><code className="bg-blue-100 px-1 rounded">{"{shift_date}"}</code> - Date of shift</li>
              <li><code className="bg-blue-100 px-1 rounded">{"{csv_data}"}</code> - Table performance CSV data</li>
              <li><code className="bg-blue-100 px-1 rounded">{"{summary}"}</code> - Quick summary</li>
            </ul>
          </li>
          <li>Copy your Service ID, Template ID, and Public Key from EmailJS dashboard</li>
          <li>Paste them below and enable email notifications</li>
        </ol>
      </div>

      {/* Email Template Example */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-slate-900 mb-2">Email Template Example:</h4>
        <pre className="text-xs text-slate-700 whitespace-pre-wrap">
{`Subject: End of Day Report - {{shift_date}}

Dear Management,

Please find the end of day table performance report below:

{{summary}}

Table Performance Data (CSV):
{{csv_data}}

Best regards,
MF-Intel CMS
`}
        </pre>
      </div>

      {/* Configuration Form */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="emailEnabled"
            checked={settings.enabled}
            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="emailEnabled" className="text-sm font-medium text-slate-700">
            Enable automatic email notifications on shift roll
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            EmailJS Service ID *
          </label>
          <input
            type={showKeys ? "text" : "password"}
            value={settings.serviceId}
            onChange={(e) => setSettings({ ...settings, serviceId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="service_xxxxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            EmailJS Template ID *
          </label>
          <input
            type={showKeys ? "text" : "password"}
            value={settings.templateId}
            onChange={(e) => setSettings({ ...settings, templateId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="template_xxxxxxxxx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            EmailJS Public Key *
          </label>
          <input
            type={showKeys ? "text" : "password"}
            value={settings.publicKey}
            onChange={(e) => setSettings({ ...settings, publicKey: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="xxxxxxxxxxxxxx"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowKeys(!showKeys)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showKeys ? (
              <>
                <EyeOff className="w-4 h-4" /> Hide Keys
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" /> Show Keys
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Email Settings
        </button>

        {saveMessage && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Email notifications will only be sent when enabled and all
          credentials are configured. If email sending fails, a CSV download will be provided as
          fallback.
        </p>
      </div>
    </div>
  );
}