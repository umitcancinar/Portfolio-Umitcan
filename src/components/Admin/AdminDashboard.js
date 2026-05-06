import React, { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Form, Button, Alert, Modal, Badge } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProjects as apiFetchProjects, addProject as apiAddProject,
  deleteProject as apiDeleteProject, updateProject as apiUpdateProject,
  fetchBlogPosts as apiFetchBlogPosts, addBlogPost as apiAddBlogPost,
  updateBlogPost as apiUpdateBlogPost, deleteBlogPost as apiDeleteBlogPost,
  fetchContactMessages as apiFetchMessages, markMessageRead as apiMarkRead,
  deleteContactMessage as apiDeleteMessage,
  fetchSettings as apiFetchSettings, updateSettings as apiUpdateSettings,
  fetchUsers as apiFetchUsers,
} from "../../services/api";
import {
  FiFolder, FiFileText, FiMessageSquare, FiSettings, FiUsers,
  FiLogOut, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiMail,
  FiBell, FiBarChart2, FiChevronLeft, FiChevronRight, FiSearch,
  FiEye, FiStar,
} from "react-icons/fi";
import { MdDashboard, MdDarkMode, MdLightMode } from "react-icons/md";

// ─── Sidebar Menu Items ───
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: <MdDashboard size={18} /> },
  { id: "projects", label: "Projeler", icon: <FiFolder size={18} /> },
  { id: "blog", label: "Blog", icon: <FiFileText size={18} /> },
  { id: "messages", label: "Mesajlar", icon: <FiMessageSquare size={18} /> },
  { id: "settings", label: "Ayarlar", icon: <FiSettings size={18} /> },
  { id: "users", label: "Kullanıcılar", icon: <FiUsers size={18} /> },
];

// ─── Mini Card Component for Stats ───
function StatCard({ title, value, icon, color, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ background: "rgba(255, 255, 255, 0.04)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px",
        padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div style={{ width: "48px", height: "48px", borderRadius: "12px",
        background: `${color}22`, display: "flex", alignItems: "center",
        justifyContent: "center", color: color, flexShrink: 0, border: `1px solid ${color}44` }}>
        {icon}
      </div>
      <div>
        <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.8rem" }}>{title}</p>
        <h3 style={{ color: "#f1f5f9", margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>{value}</h3>
      </div>
    </motion.div>
  );
}

// ─── Search Bar ───
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", maxWidth: "320px" }}>
      <FiSearch size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }} />
      <input type="text" value={value} onChange={onChange}
        placeholder={placeholder || "Ara..."}
        style={{ width: "100%", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "10px", color: "#f1f5f9", padding: "0.6rem 1rem 0.6rem 2.5rem",
          fontSize: "0.85rem", outline: "none" }} />
    </div>
  );
}

// ─── Glass Table ───
function GlassTable({ columns, data, renderActions, onRowClick, searchable }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 10;

  const filtered = searchable && search
    ? data.filter(row => columns.some(col =>
        String(row[col.key]).toLowerCase().includes(search.toLowerCase())))
    : data;

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const tableStyle = {
    width: "100%", borderCollapse: "separate", borderSpacing: "0 4px",
    fontSize: "0.85rem",
  };

  return (
    <div>
      {searchable && (
        <div style={{ marginBottom: "1rem" }}>
          <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} style={{ padding: "0.75rem 1rem", textAlign: "left",
                  color: "#94a3b8", fontWeight: 600, fontSize: "0.75rem",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {col.label}
                </th>
              ))}
              {renderActions && <th style={{ width: "120px", padding: "0.75rem 1rem" }}>İşlem</th>}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={row.id || i}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ transition: "all 0.2s ease", cursor: onRowClick ? "pointer" : "default" }}>
                {columns.map((col, j) => (
                  <td key={j} style={{ padding: "0.75rem 1rem", color: "#f1f5f9",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: "rgba(255,255,255,0.02)" }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {renderActions && (
                  <td style={{ padding: "0.5rem 1rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={columns.length + (renderActions ? 1 : 0)}
                style={{ textAlign: "center", padding: "2rem", color: "#64748b" }}>
                Veri bulunamadı</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center",
          gap: "0.5rem", marginTop: "1rem" }}>
          <Button variant="link" disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            style={{ color: "#94a3b8", padding: "0.25rem" }}>
            <FiChevronLeft size={16} /></Button>
          <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
            {page + 1} / {totalPages}</span>
          <Button variant="link" disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            style={{ color: "#94a3b8", padding: "0.25rem" }}>
            <FiChevronRight size={16} /></Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ───
export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data States
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "project" | "blog" | "settings"
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});

  const showNotif = useCallback((text, type = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ─── Load Data ───
  const loadData = useCallback(async () => {
    try {
      const [projs, posts, msgs, s, usrs] = await Promise.all([
        apiFetchProjects(), apiFetchBlogPosts(), apiFetchMessages(),
        apiFetchSettings(), apiFetchUsers().catch(() => []),
      ]);
      setProjects(projs || []);
      setBlogPosts(posts || []);
      setMessages(msgs || []);
      setSettings(s || null);
      setUsers(usrs || []);
    } catch (err) {
      console.error("Load error:", err);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ─── Handlers ───
  const handleLogout = async () => {
    try { await logout(); navigate("/login"); }
    catch { setError("Logout failed"); }
  };

  // Project CRUD
  const handleProjectSubmit = async () => {
    setLoading(true); setError("");
    try {
      if (editItem) {
        await apiUpdateProject(editItem.id, formData);
        showNotif("Proje güncellendi");
      } else {
        await apiAddProject(formData);
        showNotif("Proje eklendi");
      }
      setShowModal(false); setEditItem(null); setFormData({});
      loadData();
    } catch (err) { setError(err.response?.data?.error || "İşlem başarısız"); }
    setLoading(false);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try { await apiDeleteProject(id); showNotif("Proje silindi"); loadData(); }
    catch { setError("Silme başarısız"); }
  };

  // Blog CRUD
  const handleBlogSubmit = async () => {
    setLoading(true); setError("");
    try {
      const data = {
        ...formData,
        slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        tags: typeof formData.tags === "string" ? formData.tags.split(",").map(t => t.trim()) : formData.tags,
      };
      if (editItem) {
        await apiUpdateBlogPost(editItem.id, data);
        showNotif("Blog yazısı güncellendi");
      } else {
        await apiAddBlogPost(data);
        showNotif("Blog yazısı eklendi");
      }
      setShowModal(false); setEditItem(null); setFormData({});
      loadData();
    } catch (err) { setError(err.response?.data?.error || "İşlem başarısız"); }
    setLoading(false);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Bu blog yazısını silmek istediğinize emin misiniz?")) return;
    try { await apiDeleteBlogPost(id); showNotif("Blog yazısı silindi"); loadData(); }
    catch { setError("Silme başarısız"); }
  };

  // Messages
  const handleMarkRead = async (id) => {
    try { await apiMarkRead(id); showNotif("Mesaj okundu olarak işaretlendi"); loadData(); }
    catch { setError("İşlem başarısız"); }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    try { await apiDeleteMessage(id); showNotif("Mesaj silindi"); loadData(); }
    catch { setError("Silme başarısız"); }
  };

  // Settings
  const handleSettingsSubmit = async () => {
    setLoading(true); setError("");
    try {
      await apiUpdateSettings(formData);
      showNotif("Ayarlar güncellendi");
      setShowModal(false); loadData();
    } catch (err) { setError(err.response?.data?.error || "Güncelleme başarısız"); }
    setLoading(false);
  };

  // ─── Render Content ───
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard": return <DashboardView data={{ projects, blogPosts, messages, users }} />;
      case "projects": return <ProjectsView projects={projects}
        onAdd={() => { setEditItem(null); setFormData({}); setModalType("project"); setShowModal(true); }}
        onEdit={(p) => { setEditItem(p); setFormData(p); setModalType("project"); setShowModal(true); }}
        onDelete={handleDeleteProject} />;
      case "blog": return <BlogView posts={blogPosts}
        onAdd={() => { setEditItem(null); setFormData({}); setModalType("blog"); setShowModal(true); }}
        onEdit={(p) => { setEditItem(p); setFormData(p); setModalType("blog"); setShowModal(true); }}
        onDelete={handleDeleteBlog} />;
      case "messages": return <MessagesView messages={messages}
        onMarkRead={handleMarkRead} onDelete={handleDeleteMessage} />;
      case "settings": return <SettingsView settings={settings}
        onEdit={() => { setFormData(settings || {}); setModalType("settings"); setShowModal(true); }} />;
      case "users": return <UsersView users={users} />;
      default: return null;
    }
  };

  // ─── Render Modal ───
  const renderModal = () => {
    if (!showModal) return null;
    let title = "", content = null;

    if (modalType === "project") {
      title = editItem ? "Projeyi Düzenle" : "Yeni Proje";
      content = <ProjectForm formData={formData} setFormData={setFormData}
        onSubmit={handleProjectSubmit} loading={loading} error={error} />;
    } else if (modalType === "blog") {
      title = editItem ? "Blog Yazısını Düzenle" : "Yeni Blog Yazısı";
      content = <BlogForm formData={formData} setFormData={setFormData}
        onSubmit={handleBlogSubmit} loading={loading} error={error} />;
    } else if (modalType === "settings") {
      title = "Site Ayarlarını Düzenle";
      content = <SettingsForm formData={formData} setFormData={setFormData}
        onSubmit={handleSettingsSubmit} loading={loading} error={error} />;
    }

    return (
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditItem(null); }}
        size="lg" centered>
        <Modal.Header closeButton style={{ background: "rgba(28, 22, 64, 0.98)",
          backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(139, 63, 217, 0.2)" }}>
          <Modal.Title style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "1.1rem" }}>
            {title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "rgba(20, 16, 42, 0.98)", backdropFilter: "blur(24px)" }}>
          {content}
        </Modal.Body>
      </Modal>
    );
  };

  // ─── Main Render ───
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0c0a1a", paddingTop: "70px" }}>
      {/* Sidebar */}
      <motion.aside animate={{ width: sidebarCollapsed ? "72px" : "260px" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ background: "rgba(20, 16, 42, 0.8)", backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex",
          flexDirection: "column", flexShrink: 0, overflow: "hidden",
          position: "fixed", left: 0, top: "70px", bottom: 0, zIndex: 100 }}>
        
        {/* Toggle Button */}
        <div style={{ padding: "1rem", display: "flex", justifyContent: sidebarCollapsed ? "center" : "flex-end" }}>
          <Button variant="link" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ color: "#94a3b8", padding: "0.25rem" }}>
            {sidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </Button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: "0 0.75rem" }}>
          {menuItems.map((item) => (
            <motion.button key={item.id} onClick={() => setActiveMenu(item.id)}
              whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                width: "100%", padding: sidebarCollapsed ? "0.75rem" : "0.75rem 1rem",
                marginBottom: "0.25rem", border: "none", borderRadius: "10px",
                background: activeMenu === item.id ? "rgba(139, 63, 217, 0.15)" : "transparent",
                color: activeMenu === item.id ? "#f1f5f9" : "#94a3b8",
                fontSize: "0.85rem", fontWeight: activeMenu === item.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s ease",
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                borderLeft: activeMenu === item.id ? "3px solid #8b3fd9" : "3px solid transparent",
              }}>
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </motion.button>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div style={{ padding: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {!sidebarCollapsed && (
            <p style={{ color: "#64748b", fontSize: "0.7rem", margin: "0 0 0.5rem 0.5rem" }}>
              {currentUser?.email}</p>
          )}
          <Button variant="link" onClick={handleLogout}
            style={{ color: "#ef4444", textDecoration: "none", fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              justifyContent: sidebarCollapsed ? "center" : "flex-start",
              padding: "0.5rem", width: "100%", borderRadius: "8px" }}>
            <FiLogOut size={16} />
            {!sidebarCollapsed && "Çıkış Yap"}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarCollapsed ? "72px" : "260px",
        transition: "margin-left 0.3s ease", padding: "1.5rem 2rem", minHeight: "100vh" }}>
        
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
              style={{ position: "fixed", top: "90px", right: "2rem", zIndex: 9999,
                background: notification.type === "success"
                  ? "rgba(52, 211, 153, 0.15)" : "rgba(239, 68, 68, 0.15)",
                border: notification.type === "success"
                  ? "1px solid rgba(52, 211, 153, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                color: notification.type === "success" ? "#34d399" : "#ef4444",
                borderRadius: "12px", padding: "0.75rem 1.25rem", fontSize: "0.85rem",
                backdropFilter: "blur(12px)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {notification.type === "success" ? <FiCheck size={16} /> : <FiX size={16} />}
              {notification.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && <Alert variant="danger" dismissible onClose={() => setError("")}
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444", borderRadius: "12px", marginBottom: "1rem" }}>
          {error}</Alert>}

        {/* Content Area */}
        <motion.div key={activeMenu} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {renderContent()}
        </motion.div>

        {renderModal()}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════
// Dashboard View
// ═══════════════════════════════════════
function DashboardView({ data }) {
  const { projects, blogPosts, messages, users } = data;
  const unread = messages.filter(m => !m.read).length;

  const stats = [
    { title: "Toplam Proje", value: projects.length, icon: <FiFolder size={20} />, color: "#8b3fd9" },
    { title: "Blog Yazıları", value: blogPosts.length, icon: <FiFileText size={20} />, color: "#f472b6" },
    { title: "Okunmamış Mesaj", value: unread, icon: <FiMail size={20} />, color: "#60a5fa" },
    { title: "Kullanıcılar", value: users.length, icon: <FiUsers size={20} />, color: "#34d399" },
  ];

  return (
    <div>
      <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Dashboard
      </h2>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Admin paneline hoşgeldiniz. İşte sitenizin genel durumu.
      </p>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} index={i} />
        ))}
      </div>

      {/* Mini Charts Area (Activity Bar) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.5rem" }}>
          <h4 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
            <FiBarChart2 size={16} style={{ marginRight: "0.5rem" }} /> Son Aktiviteler
          </h4>
          {[...projects.slice(0, 3), ...blogPosts.slice(0, 3)].sort(() => Math.random() - 0.5).slice(0, 5).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px",
                background: "rgba(139, 63, 217, 0.1)", display: "flex", alignItems: "center",
                justifyContent: "center", color: "#8b3fd9", flexShrink: 0 }}>
                {item.title ? <FiFileText size={14} /> : <FiFolder size={14} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#f1f5f9", margin: 0, fontSize: "0.8rem", fontWeight: 500,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.title || item.name}
                </p>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.7rem" }}>
                  {new Date(item.createdAt || Date.now()).toLocaleDateString("tr-TR")}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Messages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
            WebkitBackdropFilter: "blur(12px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.5rem" }}>
          <h4 style={{ color: "#f1f5f9", fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" }}>
            <FiMessageSquare size={16} style={{ marginRight: "0.5rem" }} /> Son Mesajlar
          </h4>
          {messages.slice(0, 5).map((msg, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%",
                background: msg.read ? "#64748b" : "#8b3fd9", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#f1f5f9", margin: 0, fontSize: "0.8rem", fontWeight: msg.read ? 400 : 600,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.name} - {msg.subject}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Projects View
// ═══════════════════════════════════════
function ProjectsView({ projects, onAdd, onEdit, onDelete }) {
  const columns = [
    { key: "title", label: "Başlık" },
    { key: "description", label: "Açıklama",
      render: (v) => <span style={{ color: "#94a3b8" }}>{v?.substring(0, 60)}...</span> },
    { key: "published", label: "Durum",
      render: (v) => v ? <span style={{ color: "#34d399" }}>Yayında</span> :
        <span style={{ color: "#ef4444" }}>Taslak</span> },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Projeler</h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {projects.length} proje
          </p>
        </div>
        <Button onClick={onAdd} style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)",
          border: "none", borderRadius: "10px", padding: "0.5rem 1.25rem", fontSize: "0.85rem",
          fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <FiPlus size={16} /> Yeni Proje
        </Button>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem" }}>
        <GlassTable columns={columns} data={projects} searchable
          renderActions={(row) => (
            <>
              <Button variant="link" size="sm" onClick={() => onEdit(row)}
                style={{ color: "#60a5fa", padding: "0.25rem" }} title="Düzenle">
                <FiEdit2 size={14} /></Button>
              <Button variant="link" size="sm" onClick={() => onDelete(row.id)}
                style={{ color: "#ef4444", padding: "0.25rem" }} title="Sil">
                <FiTrash2 size={14} /></Button>
            </>
          )} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Blog View
// ═══════════════════════════════════════
function BlogView({ posts, onAdd, onEdit, onDelete }) {
  const columns = [
    { key: "title", label: "Başlık" },
    { key: "excerpt", label: "Özet",
      render: (v) => <span style={{ color: "#94a3b8" }}>{v?.substring(0, 60)}...</span> },
    { key: "published", label: "Durum",
      render: (v) => v ? <span style={{ color: "#34d399" }}>Yayında</span> :
        <span style={{ color: "#f59e0b" }}>Taslak</span> },
    { key: "readTime", label: "Okuma" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Blog</h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            {posts.length} yazı
          </p>
        </div>
        <Button onClick={onAdd} style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)",
          border: "none", borderRadius: "10px", padding: "0.5rem 1.25rem", fontSize: "0.85rem",
          fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <FiPlus size={16} /> Yeni Yazı
        </Button>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem" }}>
        <GlassTable columns={columns} data={posts} searchable
          renderActions={(row) => (
            <>
              <Button variant="link" size="sm" onClick={() => onEdit(row)}
                style={{ color: "#60a5fa", padding: "0.25rem" }} title="Düzenle">
                <FiEdit2 size={14} /></Button>
              <Button variant="link" size="sm" onClick={() => onDelete(row.id)}
                style={{ color: "#ef4444", padding: "0.25rem" }} title="Sil">
                <FiTrash2 size={14} /></Button>
            </>
          )} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Messages View
// ═══════════════════════════════════════
function MessagesView({ messages, onMarkRead, onDelete }) {
  const columns = [
    { key: "name", label: "İsim" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Konu" },
    { key: "message", label: "Mesaj",
      render: (v) => <span style={{ color: "#94a3b8" }}>{v?.substring(0, 50)}...</span> },
    { key: "read", label: "Durum",
      render: (v) => v ? <span style={{ color: "#64748b" }}>Okundu</span> :
        <Badge bg="none" style={{ background: "rgba(139,63,217,0.15)", color: "#8b3fd9", borderRadius: "6px" }}>
          Yeni</Badge> },
    { key: "createdAt", label: "Tarih",
      render: (v) => <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
        {new Date(v).toLocaleDateString("tr-TR")}</span> },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Mesajlar</h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          {messages.filter(m => !m.read).length} okunmamış · {messages.length} toplam
        </p>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem" }}>
        <GlassTable columns={columns} data={messages} searchable
          onRowClick={(row) => !row.read && onMarkRead(row.id)}
          renderActions={(row) => (
            <>
              {!row.read && (
                <Button variant="link" size="sm" onClick={() => onMarkRead(row.id)}
                  style={{ color: "#60a5fa", padding: "0.25rem" }} title="Okundu İşaretle">
                  <FiEye size={14} /></Button>
              )}
              <Button variant="link" size="sm" onClick={() => onDelete(row.id)}
                style={{ color: "#ef4444", padding: "0.25rem" }} title="Sil">
                <FiTrash2 size={14} /></Button>
            </>
          )} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Settings View
// ═══════════════════════════════════════
function SettingsView({ settings, onEdit }) {
  if (!settings) return <p style={{ color: "#64748b" }}>Ayarlar yükleniyor...</p>;

  const fields = [
    { label: "Site Adı", value: settings.siteName },
    { label: "Açıklama", value: settings.siteDescription },
    { label: "Hero Başlık", value: settings.heroTitle },
    { label: "Hero Alt Başlık", value: settings.heroSubtitle },
    { label: "Email", value: settings.email },
    { label: "Konum", value: settings.location },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Site Ayarları</h2>
          <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
            Web sitesi genel ayarları
          </p>
        </div>
        <Button onClick={onEdit} style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)",
          border: "none", borderRadius: "10px", padding: "0.5rem 1.25rem", fontSize: "0.85rem",
          fontWeight: 600, display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <FiEdit2 size={16} /> Düzenle
        </Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {fields.map((field, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
              WebkitBackdropFilter: "blur(12px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <p style={{ color: "#64748b", margin: 0, fontSize: "0.75rem", fontWeight: 500 }}>{field.label}</p>
            <p style={{ color: "#f1f5f9", margin: "0.25rem 0 0", fontSize: "0.9rem" }}>{field.value || "—"}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Users View
// ═══════════════════════════════════════
function UsersView({ users }) {
  const columns = [
    { key: "username", label: "Kullanıcı Adı" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rol",
      render: (v) => v === "admin" ?
        <Badge bg="none" style={{ background: "rgba(139,63,217,0.15)", color: "#8b3fd9", borderRadius: "6px" }}>Admin</Badge> :
        <Badge bg="none" style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa", borderRadius: "6px" }}>Kullanıcı</Badge> },
    { key: "createdAt", label: "Kayıt",
      render: (v) => <span style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
        {new Date(v).toLocaleDateString("tr-TR")}</span> },
  ];

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ color: "#f1f5f9", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Kullanıcılar</h2>
        <p style={{ color: "#64748b", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
          {users.length} kullanıcı
        </p>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.03)", backdropFilter: "blur(12px) saturate(180%)",
        WebkitBackdropFilter: "blur(12px) saturate(180%)",
        border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem" }}>
        <GlassTable columns={columns} data={users} searchable />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// Project Form
// ═══════════════════════════════════════
function ProjectForm({ formData, setFormData, onSubmit, loading, error }) {
  const fields = [
    { key: "title", label: "Başlık", type: "text", required: true },
    { key: "description", label: "Açıklama", type: "textarea", required: true },
    { key: "content", label: "İçerik", type: "textarea" },
    { key: "imageUrl", label: "Görsel URL", type: "text" },
    { key: "githubUrl", label: "GitHub Link", type: "text" },
    { key: "liveUrl", label: "Canlı Demo Link", type: "text" },
    { key: "technologies", label: "Teknolojiler (virgülle ayırın)", type: "text" },
  ];

  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {error && <Alert variant="danger" style={{ fontSize: "0.85rem", borderRadius: "10px" }}>{error}</Alert>}
      {fields.map(f => (
        <Form.Group key={f.key} className="mb-3">
          <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
            {f.label}{f.required && <span style={{ color: "#ef4444" }}> *</span>}
          </Form.Label>
          {f.type === "textarea" ? (
            <Form.Control as="textarea" rows={3} value={formData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#f1f5f9" }} />
          ) : (
            <Form.Control type={f.type} value={formData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#f1f5f9" }} />
          )}
        </Form.Group>
      ))}
      <Form.Check type="switch" label="Yayında" checked={formData.published || false}
        onChange={(e) => handleChange("published", e.target.checked)}
        style={{ color: "#94a3b8", marginBottom: "1rem" }} />
      <Button type="submit" disabled={loading}
        style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)", border: "none",
          borderRadius: "10px", padding: "0.6rem 1.5rem", fontWeight: 600, width: "100%" }}>
        {loading ? "Kaydediliyor..." : (formData.id ? "Güncelle" : "Oluştur")}
      </Button>
    </Form>
  );
}

// ═══════════════════════════════════════
// Blog Form
// ═══════════════════════════════════════
function BlogForm({ formData, setFormData, onSubmit, loading, error }) {
  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {error && <Alert variant="danger" style={{ fontSize: "0.85rem", borderRadius: "10px" }}>{error}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          Başlık <span style={{ color: "#ef4444" }}>*</span>
        </Form.Label>
        <Form.Control type="text" value={formData.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9" }} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          Slug (boş bırakılırsa otomatik oluşturulur)
        </Form.Label>
        <Form.Control type="text" value={formData.slug || ""}
          onChange={(e) => handleChange("slug", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9" }} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          Özet <span style={{ color: "#ef4444" }}>*</span>
        </Form.Label>
        <Form.Control as="textarea" rows={2} value={formData.excerpt || ""}
          onChange={(e) => handleChange("excerpt", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9" }} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          İçerik (Markdown) <span style={{ color: "#ef4444" }}>*</span>
        </Form.Label>
        <Form.Control as="textarea" rows={6} value={formData.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9", fontFamily: "monospace" }} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          Kapak Görseli URL
        </Form.Label>
        <Form.Control type="text" value={formData.coverImage || ""}
          onChange={(e) => handleChange("coverImage", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9" }} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
          Etiketler (virgülle ayırın)
        </Form.Label>
        <Form.Control type="text" value={Array.isArray(formData.tags) ? formData.tags.join(", ") : formData.tags || ""}
          onChange={(e) => handleChange("tags", e.target.value)}
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px", color: "#f1f5f9" }} />
      </Form.Group>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>
              Okuma Süresi (dk)
            </Form.Label>
            <Form.Control type="number" value={formData.readTime || 5}
              onChange={(e) => handleChange("readTime", parseInt(e.target.value))}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#f1f5f9" }} />
          </Form.Group>
        </Col>
        <Col className="d-flex align-items-end">
          <Form.Check type="switch" label="Yayında" checked={formData.published || false}
            onChange={(e) => handleChange("published", e.target.checked)}
            style={{ color: "#94a3b8" }} />
        </Col>
      </Row>
      <Button type="submit" disabled={loading}
        style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)", border: "none",
          borderRadius: "10px", padding: "0.6rem 1.5rem", fontWeight: 600, width: "100%" }}>
        {loading ? "Kaydediliyor..." : (formData.id ? "Güncelle" : "Oluştur")}
      </Button>
    </Form>
  );
}

// ═══════════════════════════════════════
// Settings Form
// ═══════════════════════════════════════
function SettingsForm({ formData, setFormData, onSubmit, loading, error }) {
  const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const fields = [
    { key: "siteName", label: "Site Adı", type: "text" },
    { key: "siteDescription", label: "Site Açıklaması", type: "text" },
    { key: "heroTitle", label: "Hero Başlık", type: "text" },
    { key: "heroSubtitle", label: "Hero Alt Başlık", type: "text" },
    { key: "aboutText", label: "Hakkımda Metni", type: "textarea" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Telefon", type: "text" },
    { key: "location", label: "Konum", type: "text" },
    { key: "metaTitle", label: "Meta Başlık (SEO)", type: "text" },
    { key: "metaDescription", label: "Meta Açıklama (SEO)", type: "textarea" },
  ];

  return (
    <Form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      {error && <Alert variant="danger" style={{ fontSize: "0.85rem", borderRadius: "10px" }}>{error}</Alert>}
      {fields.map(f => (
        <Form.Group key={f.key} className="mb-3">
          <Form.Label style={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 500 }}>{f.label}</Form.Label>
          {f.type === "textarea" ? (
            <Form.Control as="textarea" rows={3} value={formData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#f1f5f9" }} />
          ) : (
            <Form.Control type={f.type} value={formData[f.key] || ""}
              onChange={(e) => handleChange(f.key, e.target.value)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#f1f5f9" }} />
          )}
        </Form.Group>
      ))}
      <Button type="submit" disabled={loading}
        style={{ background: "linear-gradient(135deg, #8b3fd9, #f472b6)", border: "none",
          borderRadius: "10px", padding: "0.6rem 1.5rem", fontWeight: 600, width: "100%" }}>
        {loading ? "Kaydediliyor..." : "Ayarları Güncelle"}
      </Button>
    </Form>
  );
}
