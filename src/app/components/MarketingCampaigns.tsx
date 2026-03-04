import { useState, useEffect } from "react";
import { Target, Plus, Edit2, Eye, Calendar, DollarSign, Users, TrendingUp, Mail, MessageSquare, Gift, Megaphone, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { useOutletContext } from "react-router";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "Email" | "SMS" | "Event" | "Promotion" | "VIP" | "Birthday" | "Welcome" | "Reactivation";
  status: "Draft" | "Scheduled" | "Active" | "Completed" | "Cancelled";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  currency: string;
  targetAudience: string[]; // Player IDs
  targetCriteria: string; // Description of targeting
  createdBy: string;
  createdDate: string;
  results: {
    reached: number;
    responded: number;
    converted: number;
    revenue: number;
  };
  notes: string;
}

const campaignTypeIcons: Record<Campaign["type"], any> = {
  Email: Mail,
  SMS: MessageSquare,
  Event: Calendar,
  Promotion: Gift,
  VIP: TrendingUp,
  Birthday: Gift,
  Welcome: Users,
  Reactivation: Megaphone,
};

const campaignTypeColors: Record<Campaign["type"], string> = {
  Email: "bg-blue-100 text-blue-800",
  SMS: "bg-green-100 text-green-800",
  Event: "bg-purple-100 text-purple-800",
  Promotion: "bg-pink-100 text-pink-800",
  VIP: "bg-amber-100 text-amber-800",
  Birthday: "bg-rose-100 text-rose-800",
  Welcome: "bg-cyan-100 text-cyan-800",
  Reactivation: "bg-orange-100 text-orange-800",
};

const statusColors: Record<Campaign["status"], string> = {
  Draft: "bg-slate-100 text-slate-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Active: "bg-emerald-100 text-emerald-700",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-100 text-red-700",
};

export function MarketingCampaigns() {
  const { isViewOnly } = useOutletContext<{ isViewOnly: boolean }>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [currentUser] = useState(() => {
    const auth = sessionStorage.getItem("casino_auth");
    return auth ? JSON.parse(auth) : { username: "admin", userType: "Management" };
  });
  const api = useApi();

  // Form fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState<Campaign["type"]>("Promotion");
  const [formStatus, setFormStatus] = useState<Campaign["status"]>("Draft");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formBudget, setFormBudget] = useState("");
  const [formSpent, setFormSpent] = useState("");
  const [formCurrency, setFormCurrency] = useState("FCFA");
  const [formTargetCriteria, setFormTargetCriteria] = useState("");
  const [formSelectedPlayers, setFormSelectedPlayers] = useState<string[]>([]);
  const [formNotes, setFormNotes] = useState("");
  const [formReached, setFormReached] = useState("");
  const [formResponded, setFormResponded] = useState("");
  const [formConverted, setFormConverted] = useState("");
  const [formRevenue, setFormRevenue] = useState("");

  useEffect(() => {
    loadData();
  }, [api.currentProperty]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [loadedCampaigns, loadedPlayers] = await Promise.all([
        api.getCampaigns(),
        api.getPlayers(),
      ]);
      setCampaigns(loadedCampaigns);
      setPlayers(loadedPlayers);
    } catch (error) {
      console.error("Error loading campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setSelectedCampaign(null);
    setFormName("");
    setFormDescription("");
    setFormType("Promotion");
    setFormStatus("Draft");
    setFormStartDate("");
    setFormEndDate("");
    setFormBudget("");
    setFormSpent("0");
    setFormCurrency("FCFA");
    setFormTargetCriteria("");
    setFormSelectedPlayers([]);
    setFormNotes("");
    setFormReached("0");
    setFormResponded("0");
    setFormConverted("0");
    setFormRevenue("0");
    setIsFormOpen(true);
  };

  const openEditForm = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setFormName(campaign.name);
    setFormDescription(campaign.description);
    setFormType(campaign.type);
    setFormStatus(campaign.status);
    setFormStartDate(campaign.startDate.split("T")[0]);
    setFormEndDate(campaign.endDate.split("T")[0]);
    setFormBudget(campaign.budget.toString());
    setFormSpent(campaign.spent.toString());
    setFormCurrency(campaign.currency);
    setFormTargetCriteria(campaign.targetCriteria);
    setFormSelectedPlayers(campaign.targetAudience);
    setFormNotes(campaign.notes);
    setFormReached(campaign.results.reached.toString());
    setFormResponded(campaign.results.responded.toString());
    setFormConverted(campaign.results.converted.toString());
    setFormRevenue(campaign.results.revenue.toString());
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedCampaign(null);
  };

  const openView = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsViewOpen(true);
  };

  const closeView = () => {
    setIsViewOpen(false);
    setSelectedCampaign(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      alert("Please enter campaign name");
      return;
    }

    const budget = parseFloat(formBudget) || 0;
    const spent = parseFloat(formSpent) || 0;

    const campaignData: Campaign = {
      id: selectedCampaign?.id || crypto.randomUUID(),
      name: formName,
      description: formDescription,
      type: formType,
      status: formStatus,
      startDate: formStartDate ? new Date(formStartDate).toISOString() : new Date().toISOString(),
      endDate: formEndDate ? new Date(formEndDate).toISOString() : new Date().toISOString(),
      budget,
      spent,
      currency: formCurrency,
      targetAudience: formSelectedPlayers,
      targetCriteria: formTargetCriteria,
      createdBy: selectedCampaign?.createdBy || currentUser.username,
      createdDate: selectedCampaign?.createdDate || new Date().toISOString(),
      results: {
        reached: parseInt(formReached) || 0,
        responded: parseInt(formResponded) || 0,
        converted: parseInt(formConverted) || 0,
        revenue: parseFloat(formRevenue) || 0,
      },
      notes: formNotes,
    };

    try {
      if (selectedCampaign) {
        await api.updateCampaign(selectedCampaign.id, campaignData);
      } else {
        await api.createCampaign(campaignData);
      }
      await loadData();
      closeForm();
    } catch (error: any) {
      console.error("Error saving campaign:", error);
      alert(error.message || "Failed to save campaign");
    }
  };

  const handleQuickTargetAll = () => {
    setFormSelectedPlayers(players.map(p => p.id));
    setFormTargetCriteria("All Players");
  };

  const handleQuickTargetVIP = () => {
    const vipPlayers = players.filter(p => p.vipStatus === "VIP" || p.vipStatus === "Premium VIP");
    setFormSelectedPlayers(vipPlayers.map(p => p.id));
    setFormTargetCriteria("VIP Players Only");
  };

  const handleQuickTargetHighValue = () => {
    const highValuePlayers = players.filter(p => (p.totalWagered || 0) > 1000000);
    setFormSelectedPlayers(highValuePlayers.map(p => p.id));
    setFormTargetCriteria("High Value Players (>1M wagered)");
  };

  const exportCampaignReport = (campaign: Campaign) => {
    const csvContent = [
      ["Campaign Report"],
      [""],
      ["Campaign Name", campaign.name],
      ["Type", campaign.type],
      ["Status", campaign.status],
      ["Start Date", new Date(campaign.startDate).toLocaleDateString()],
      ["End Date", new Date(campaign.endDate).toLocaleDateString()],
      [""],
      ["Budget", `${campaign.budget.toLocaleString()} ${campaign.currency}`],
      ["Spent", `${campaign.spent.toLocaleString()} ${campaign.currency}`],
      ["Remaining", `${(campaign.budget - campaign.spent).toLocaleString()} ${campaign.currency}`],
      [""],
      ["Performance Metrics"],
      ["Players Reached", campaign.results.reached],
      ["Players Responded", campaign.results.responded],
      ["Players Converted", campaign.results.converted],
      ["Response Rate", `${campaign.results.reached > 0 ? ((campaign.results.responded / campaign.results.reached) * 100).toFixed(2) : 0}%`],
      ["Conversion Rate", `${campaign.results.responded > 0 ? ((campaign.results.converted / campaign.results.responded) * 100).toFixed(2) : 0}%`],
      ["Revenue Generated", `${campaign.results.revenue.toLocaleString()} ${campaign.currency}`],
      ["ROI", `${campaign.spent > 0 ? (((campaign.results.revenue - campaign.spent) / campaign.spent) * 100).toFixed(2) : 0}%`],
      [""],
      ["Target Audience", `${campaign.targetAudience.length} players`],
      ["Target Criteria", campaign.targetCriteria],
      [""],
      ["Notes", campaign.notes],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign_${campaign.name.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filterStatus !== "All" && campaign.status !== filterStatus) return false;
    if (filterType !== "All" && campaign.type !== filterType) return false;
    return true;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.results.revenue, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "Active").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            Marketing Campaigns
          </h2>
          <p className="text-slate-600 mt-1">Plan, execute, and track marketing campaigns</p>
        </div>
        {!isViewOnly && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Budget</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalBudget.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">FCFA</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Spent</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% of budget
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-amber-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ROI: {totalSpent > 0 ? (((totalRevenue - totalSpent) / totalSpent) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{activeCampaigns}</p>
              <p className="text-xs text-slate-500 mt-1">of {campaigns.length} total</p>
            </div>
            <Target className="w-10 h-10 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="All">All Types</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="Event">Event</option>
              <option value="Promotion">Promotion</option>
              <option value="VIP">VIP</option>
              <option value="Birthday">Birthday</option>
              <option value="Welcome">Welcome</option>
              <option value="Reactivation">Reactivation</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus("All");
                setFilterType("All");
              }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b">
          <h3 className="text-xl font-bold text-slate-900">
            Campaigns ({filteredCampaigns.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Campaign Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Budget / Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Target
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                  Performance
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No campaigns found. Create your first campaign!
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => {
                  const TypeIcon = campaignTypeIcons[campaign.type];
                  const responseRate =
                    campaign.results.reached > 0
                      ? ((campaign.results.responded / campaign.results.reached) * 100).toFixed(1)
                      : 0;
                  const conversionRate =
                    campaign.results.responded > 0
                      ? ((campaign.results.converted / campaign.results.responded) * 100).toFixed(1)
                      : 0;

                  return (
                    <tr key={campaign.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{campaign.name}</div>
                        <div className="text-sm text-slate-500">{campaign.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${
                            campaignTypeColors[campaign.type]
                          }`}
                        >
                          <TypeIcon className="w-3 h-3" />
                          {campaign.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                            statusColors[campaign.status]
                          }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                        <div className="text-xs text-slate-400">
                          to {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-900">
                          {campaign.budget.toLocaleString()} {campaign.currency}
                        </div>
                        <div className="text-xs text-slate-500">
                          Spent: {campaign.spent.toLocaleString()} (
                          {campaign.budget > 0
                            ? ((campaign.spent / campaign.budget) * 100).toFixed(0)
                            : 0}
                          %)
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-slate-900">
                          {campaign.targetAudience.length} players
                        </div>
                        <div className="text-xs text-slate-500">{campaign.targetCriteria}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-600">
                          <div>Reached: {campaign.results.reached}</div>
                          <div>Response: {responseRate}%</div>
                          <div>Conversion: {conversionRate}%</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openView(campaign)}
                            className="p-1 text-slate-600 hover:text-purple-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(campaign)}
                            className="p-1 text-slate-600 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => exportCampaignReport(campaign)}
                            className="p-1 text-slate-600 hover:text-emerald-600 transition-colors"
                            title="Export Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <div className="px-6 py-4 bg-purple-50 border-b flex items-center justify-between sticky top-0">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                {selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
              </h3>
              <button
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Summer VIP Promotion"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Describe the campaign objectives and details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Campaign Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as Campaign["type"])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Event">Event</option>
                    <option value="Promotion">Promotion</option>
                    <option value="VIP">VIP</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Welcome">Welcome</option>
                    <option value="Reactivation">Reactivation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Campaign["status"])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {/* Budget Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Budget</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Budget <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formBudget}
                      onChange={(e) => setFormBudget(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Amount Spent
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formSpent}
                      onChange={(e) => setFormSpent(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={formCurrency}
                      onChange={(e) => setFormCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="FCFA">FCFA</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Audience Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Target Audience</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quick Target
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleQuickTargetAll}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      All Players ({players.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickTargetVIP}
                      className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm"
                    >
                      VIP Only
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickTargetHighValue}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                    >
                      High Value (&gt;1M)
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Target Criteria Description
                  </label>
                  <input
                    type="text"
                    value={formTargetCriteria}
                    onChange={(e) => setFormTargetCriteria(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., VIP Players, High Rollers, New Players"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Selected Players ({formSelectedPlayers.length})
                  </label>
                  <div className="border border-slate-300 rounded-lg p-3 max-h-48 overflow-y-auto bg-slate-50">
                    <div className="space-y-2">
                      {players.map((player) => (
                        <label key={player.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formSelectedPlayers.includes(player.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormSelectedPlayers([...formSelectedPlayers, player.id]);
                              } else {
                                setFormSelectedPlayers(formSelectedPlayers.filter((id) => id !== player.id));
                              }
                            }}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm text-slate-900">{player.name}</span>
                          <span className="text-xs text-slate-500">({player.vipStatus || "Regular"})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Section */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Players Reached
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formReached}
                      onChange={(e) => setFormReached(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Players Responded
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formResponded}
                      onChange={(e) => setFormResponded(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Players Converted
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formConverted}
                      onChange={(e) => setFormConverted(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Revenue Generated
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formRevenue}
                      onChange={(e) => setFormRevenue(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Additional notes about this campaign"
                />
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white border-t">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {selectedCampaign ? "Update Campaign" : "Create Campaign"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewOpen && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-purple-50 border-b flex items-center justify-between sticky top-0">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                Campaign Details
              </h3>
              <button
                onClick={closeView}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Campaign Info */}
              <div>
                <h4 className="text-2xl font-bold text-slate-900">{selectedCampaign.name}</h4>
                <p className="text-slate-600 mt-2">{selectedCampaign.description}</p>
                <div className="flex gap-2 mt-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${
                      campaignTypeColors[selectedCampaign.type]
                    }`}
                  >
                    {React.createElement(campaignTypeIcons[selectedCampaign.type], {
                      className: "w-3 h-3",
                    })}
                    {selectedCampaign.type}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                      statusColors[selectedCampaign.status]
                    }`}
                  >
                    {selectedCampaign.status}
                  </span>
                </div>
              </div>

              {/* Duration */}
              <div className="border-t pt-4">
                <h5 className="font-bold text-slate-900 mb-2">Campaign Duration</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Start Date</p>
                    <p className="font-medium">
                      {new Date(selectedCampaign.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">End Date</p>
                    <p className="font-medium">
                      {new Date(selectedCampaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="border-t pt-4">
                <h5 className="font-bold text-slate-900 mb-2">Budget & Spending</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Total Budget</p>
                    <p className="font-medium">
                      {selectedCampaign.budget.toLocaleString()} {selectedCampaign.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Amount Spent</p>
                    <p className="font-medium">
                      {selectedCampaign.spent.toLocaleString()} {selectedCampaign.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Remaining</p>
                    <p className="font-medium text-emerald-600">
                      {(selectedCampaign.budget - selectedCampaign.spent).toLocaleString()}{" "}
                      {selectedCampaign.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="border-t pt-4">
                <h5 className="font-bold text-slate-900 mb-2">Target Audience</h5>
                <p className="text-slate-600 mb-2">{selectedCampaign.targetCriteria}</p>
                <p className="text-sm text-slate-600">
                  {selectedCampaign.targetAudience.length} players targeted
                </p>
              </div>

              {/* Performance Metrics */}
              <div className="border-t pt-4">
                <h5 className="font-bold text-slate-900 mb-3">Performance Metrics</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Reached</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedCampaign.results.reached}
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Responded</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedCampaign.results.responded}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedCampaign.results.reached > 0
                        ? (
                            (selectedCampaign.results.responded / selectedCampaign.results.reached) *
                            100
                          ).toFixed(1)
                        : 0}
                      % rate
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Converted</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedCampaign.results.converted}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedCampaign.results.responded > 0
                        ? (
                            (selectedCampaign.results.converted /
                              selectedCampaign.results.responded) *
                            100
                          ).toFixed(1)
                        : 0}
                      % rate
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs text-slate-600">Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedCampaign.results.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">
                      ROI:{" "}
                      {selectedCampaign.spent > 0
                        ? (
                            ((selectedCampaign.results.revenue - selectedCampaign.spent) /
                              selectedCampaign.spent) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedCampaign.notes && (
                <div className="border-t pt-4">
                  <h5 className="font-bold text-slate-900 mb-2">Notes</h5>
                  <p className="text-slate-600">{selectedCampaign.notes}</p>
                </div>
              )}

              {/* Created By */}
              <div className="border-t pt-4">
                <p className="text-sm text-slate-500">
                  Created by {selectedCampaign.createdBy} on{" "}
                  {new Date(selectedCampaign.createdDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    closeView();
                    openEditForm(selectedCampaign);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Edit Campaign
                </button>
                <button
                  onClick={() => exportCampaignReport(selectedCampaign)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
