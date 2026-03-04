import { useState, useEffect } from "react";
import { Users, UserCog, Mail, Receipt, Database, UtensilsCrossed } from "lucide-react";
import { EmailConfig } from "./EmailConfig";
import { DatabaseBackup } from "./DatabaseBackup";
import { ReceiptFieldsManagement } from "./ReceiptFieldsManagement";
import { Employees } from "./Employees";
import { CompsMenu } from "./CompsMenu";
import { useApi } from "../hooks/useApi";
import { useOutletContext } from "react-router";
import * as XLSX from "xlsx";
import { toast } from "sonner";

// Import the UserManagement component (all the user management code)
import { UserManagement } from "./UserManagement";

interface OutletContext {
  currentUser: any;
  hasAccess: (feature: string) => boolean;
  isViewOnly: boolean;
  currentProperty: string;
  currentPropertyDisplay: string;
  onPropertyChange: (name: string) => void;
}

export function Setup() {
  const { currentProperty, currentPropertyDisplay, onPropertyChange } = useOutletContext<OutletContext>();
  const [activeTab, setActiveTab] = useState<
    "users" | "employees" | "email" | "receipt" | "compsmenu" | "backup"
  >("users");
  const api = useApi();

  const tabs = [
    { id: "users" as const, label: "User Accounts", icon: Users },
    { id: "employees" as const, label: "Employees", icon: UserCog },
    { id: "email" as const, label: "Email Config", icon: Mail },
    { id: "receipt" as const, label: "Receipt Fields", icon: Receipt },
    { id: "compsmenu" as const, label: "Comps Menu", icon: UtensilsCrossed },
    { id: "backup" as const, label: "Backup & Restore", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "users" && <UserManagement />}
        {activeTab === "employees" && <Employees />}
        {activeTab === "email" && <EmailConfig />}
        {activeTab === "receipt" && <ReceiptFieldsManagement />}
        {activeTab === "compsmenu" && <CompsMenu />}
        {activeTab === "backup" && <DatabaseBackup />}
      </div>
    </div>
  );
}