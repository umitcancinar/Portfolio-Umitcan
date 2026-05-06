import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Alert, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  fetchProjects as apiFetchProjects,
  addProject as apiAddProject,
  deleteProject as apiDeleteProject,
  fetchBlogPosts as apiFetchBlogPosts,
  createBlogPost as apiCreateBlogPost,
  updateBlogPost as apiUpdateBlogPost,
  deleteBlogPost as apiDeleteBlogPost,
} from "../../services/api";
import Particle from "../Particle";

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[ç]/g, "c").replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i").replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s").replace(/[ü]/g, "u")
    .replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const pTitleRef = useRef();
  const pDescRef = useRef();
  const pContentRef = useRef();
  const pGhLinkRef = useRef();
  const pDemoRef = useRef();
  const pImageRef = useRef();
  const pTechRef = useRef();

  const bTitleRef = useRef();
  const bSlugRef = useRef();
  const bExcerptRef = useRef();
  const bContentRef = useRef();
  const bCoverRef = useRef();
  const bTagsRef = useRef();
  const bCategoryRef = useRef();
  const bReadTimeRef = useRef();

  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [projData, blogData] = await Promise.all([
        apiFetchProjects(),
        apiFetchBlogPosts(),
      ]);
      setProjects(projData?.projects || projData || []);
      setBlogPosts(Array.isArray(blogData) ? blogData : []);
    } catch (err) {
      console.error("Load error:", err);
      setError("Veriler y\u00fcklenirken hata olu\u015ftu.");
    }
  };

  async function handleLogout() {
    try { await logout(); navigate("/login"); }
    catch { setError("\u00c7\u0131k\u0131\u015f yap\u0131lamad\u0131"); }
  }

  async function handleAddProject(e) {
    e.preventDefault(); setError(""); setSuccess("");
    if (!pTitleRef.current.value || !pDescRef.current.value) {
      return setError("Ba\u015fl\u0131k ve a\u00e7\u0131klama zorunludur.");
    }
    setLoading(true);
    try {
      const techs = pTechRef.current.value
        ? pTechRef.current.value.split(",").map(t => t.trim()) : [];
      await apiAddProject({
        title: pTitleRef.current.value,
        slug: slugify(pTitleRef.current.value),
        description: pDescRef.current.value,
        content: pContentRef.current?.value || pDescRef.current.value,
        imageUrl: pImageRef.current?.value || "",
        githubUrl: pGhLinkRef.current?.value || "",
        liveUrl: pDemoRef.current?.value || "",
        technologies: techs, published: true,
      });
      [pTitleRef, pDescRef, pContentRef, pGhLinkRef, pDemoRef, pImageRef, pTechRef].forEach(r => { if (r.current) r.current.value = ""; });
      setSuccess("Proje eklendi!"); loadData();
    } catch { setError("Hata olu\u015ftu."); }
    setLoading(false);
  }

  async function handleDeleteProject(id) {
    if (window.confirm("Emin misiniz?")) {
      try { await apiDeleteProject(id); setSuccess("Silindi."); loadData(); }
      catch { setError("Hata olu\u015ftu."); }
    }
  }

  async function handleAddBlog(e) {
    e.preventDefault(); setError(""); setSuccess("");
    if (!bTitleRef.current.value || !bContentRef.current.value) {
      return setError("Ba\u015fl\u0131k ve i\u00e7erik zorunludur.");
    }
    const slug = bSlugRef.current?.value || slugify(bTitleRef.current.value);
    const tags = bTagsRef.current?.value
      ? bTagsRef.current.value.split(",").map(t => t.trim()) : [];
    setLoading(true);
    try {
      const postData = {
        title: bTitleRef.current.value, slug,
        excerpt: bExcerptRef.current?.value || bTitleRef.current.value,
        content: bContentRef.current.value,
        coverImage: bCoverRef.current?.value || "",
        tags, category: bCategoryRef.current?.value || "genel",
        published: true, readTime: parseInt(bReadTimeRef.current?.value) || 5,
      };
      if (editingBlog) {
        await apiUpdateBlogPost(editingBlog.id, postData);
        setSuccess("G\u00fcncellendi!"); setEditingBlog(null);
      } else {
        await apiCreateBlogPost(postData);
        setSuccess("Eklendi!");
      }
      [bTitleRef, bSlugRef, bExcerptRef, bContentRef, bCoverRef, bTagsRef].forEach(r => { if (r.current) r.current.value = ""; });
      if (bCategoryRef.current) bCategoryRef.current.value = "genel";
      if (bReadTimeRef.current) bReadTimeRef.current.value = "5";
      loadData();
    } catch (err) { setError("Hata olu\u015ftu."); }
    setLoading(false);
  }

  function handleEditBlog(post) {
    setEditingBlog(post);
    if (bTitleRef.current) bTitleRef.current.value = post.title;
    if (bSlugRef.current) bSlugRef.current.value = post.slug;
    if (bExcerptRef.current) bExcerptRef.current.value = post.excerpt || "";
    if (bContentRef.current) bContentRef.current.value = post.content;
    if (bCoverRef.current) bCoverRef.current.value = post.coverImage || "";
    if (bTagsRef.current) bTagsRef.current.value = (post.tags || []).join(", ");
    if (bCategoryRef.current) bCategoryRef.current.value = post.category || "genel";
    if (bReadTimeRef.current) bReadTimeRef.current.value = post.readTime || 5;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingBlog(null);
    [bTitleRef, bSlugRef, bExcerptRef, bContentRef, bCoverRef, bTagsRef].forEach(r => { if (r.current) r.current.value = ""; });
    if (bCategoryRef.current) bCategoryRef.current.value = "genel";
    if (bReadTimeRef.current) bReadTimeRef.current.value = "5";
  }

  async function handleDeleteBlog(id) {
    if (window.confirm("Emin misiniz?")) {
      try { await apiDeleteBlogPost(id); setSuccess("Silindi."); loadData(); }
      catch { setError("Hata."); }
    }
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">Admin <strong className="purple">Panel</strong></h1>
        {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
        <div className="d-flex justify-content-end mb-4">
          <span className="text-white me-3">{currentUser?.email}</span>
          <Button variant="outline-danger" size="sm" onClick={handleLogout}>\u00c7\u0131k\u0131\u015f</Button>
        </div>

        <Tabs defaultActiveKey="projects" className="mb-4 admin-tabs">
          <Tab eventKey="projects" title="Projeler">
            <Row>
              <Col md={5} className="mb-4">
                <Card className="bg-dark text-white">
                  <Card.Header as="h4">Proje Ekle</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleAddProject}>
                      <Form.Group className="mb-3"><Form.Label>Ba\u015fl\u0131k *</Form.Label><Form.Control type="text" ref={pTitleRef} required /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>A\u00e7\u0131klama *</Form.Label><Form.Control as="textarea" rows={2} ref={pDescRef} required /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Teknolojiler (virg\u00fclle)</Form.Label><Form.Control type="text" ref={pTechRef} placeholder="React, Node.js" /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>G\u00f6rsel URL</Form.Label><Form.Control type="text" ref={pImageRef} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>GitHub</Form.Label><Form.Control type="text" ref={pGhLinkRef} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Demo</Form.Label><Form.Control type="text" ref={pDemoRef} /></Form.Group>
                      <Button disabled={loading} className="w-100" variant="primary" type="submit">Ekle</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={7}>
                <Card className="bg-dark text-white">
                  <Card.Header as="h4">Projeler ({projects.length})</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover variant="dark" responsive>
                      <thead><tr><th>Ba\u015fl\u0131k</th><th>Teknolojiler</th><th>\u0130\u015flem</th></tr></thead>
                      <tbody>
                        {projects.map(p => (
                          <tr key={p.id}>
                            <td>{p.title}</td>
                            <td>{(p.technologies || []).join(", ")}</td>
                            <td><Button variant="danger" size="sm" onClick={() => handleDeleteProject(p.id)}>Sil</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="blog" title="Blog">
            <Row>
              <Col md={5} className="mb-4">
                <Card className="bg-dark text-white">
                  <Card.Header as="h4">{editingBlog ? "D\u00fczenle" : "Yeni Yaz\u0131"}</Card.Header>
                  <Card.Body>
                    <Form onSubmit={handleAddBlog}>
                      <Form.Group className="mb-3"><Form.Label>Ba\u015fl\u0131k *</Form.Label><Form.Control type="text" ref={bTitleRef} required /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Slug</Form.Label><Form.Control type="text" ref={bSlugRef} placeholder="ornek-yazi" /></Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Kategori</Form.Label>
                        <Form.Select ref={bCategoryRef}>
                          <option value="genel">Genel</option>
                          <option value="teknoloji">Teknoloji</option>
                          <option value="yazilim">Yaz\u0131l\u0131m</option>
                          <option value="egitim">E\u011fitim</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3"><Form.Label>\u00d6zet</Form.Label><Form.Control as="textarea" rows={2} ref={bExcerptRef} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>\u0130\u00e7erik *</Form.Label><Form.Control as="textarea" rows={6} ref={bContentRef} required /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Kapak G\u00f6rseli</Form.Label><Form.Control type="text" ref={bCoverRef} /></Form.Group>
                      <Form.Group className="mb-3"><Form.Label>Etiketler (virg\u00fclle)</Form.Label><Form.Control type="text" ref={bTagsRef} placeholder="react, nodejs" /></Form.Group>
                      <div className="d-flex gap-2">
                        <Button disabled={loading} variant="primary" type="submit">{editingBlog ? "G\u00fcncelle" : "Yay\u0131nla"}</Button>
                        {editingBlog && <Button variant="secondary" onClick={handleCancelEdit}>\u0130ptal</Button>}
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={7}>
                <Card className="bg-dark text-white">
                  <Card.Header as="h4">Yaz\u0131lar ({blogPosts.length})</Card.Header>
                  <Card.Body>
                    <Table striped bordered hover variant="dark" responsive>
                      <thead><tr><th>Ba\u015fl\u0131k</th><th>Kategori</th><th>\u0130\u015flem</th></tr></thead>
                      <tbody>
                        {blogPosts.map(post => (
                          <tr key={post.id}>
                            <td>{post.title}</td>
                            <td>{post.category}</td>
                            <td className="d-flex gap-2">
                              <Button variant="warning" size="sm" onClick={() => handleEditBlog(post)}>D\u00fczenle</Button>
                              <Button variant="danger" size="sm" onClick={() => handleDeleteBlog(post.id)}>Sil</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
}
