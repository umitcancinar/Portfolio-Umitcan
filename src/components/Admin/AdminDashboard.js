import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, Table, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import Particle from "../Particle";

import { getRawGithubUrl } from "../../utils/imageHelper";

export default function AdminDashboard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Form refs
    const titleRef = useRef();
    const descriptionRef = useRef();
    const ghLinkRef = useRef();
    const demoLinkRef = useRef();
    const imageURLRef = useRef();

    const [previewImage, setPreviewImage] = useState("");

    const handleImageChange = () => {
        const url = imageURLRef.current.value;
        setPreviewImage(getRawGithubUrl(url));
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "projects"));
            const projectsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(projectsData);
        } catch (err) {
            console.error("Error fetching projects: ", err);
            setError("Failed to fetch projects.");
        }
    };

    async function handleLogout() {
        setError("");
        try {
            await logout();
            navigate("/login");
        } catch {
            setError("Failed to log out");
        }
    }

    async function handleAddProject(e) {
        e.preventDefault();
        setError("");

        if (!titleRef.current.value || !descriptionRef.current.value || !imageURLRef.current.value) {
            return setError("Please fill in all required fields");
        }

        if (!imageURLRef.current.value.match(/^https?:\/\//)) {
            return setError("Image URL must start with http:// or https://");
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "projects"), {
                title: titleRef.current.value,
                description: descriptionRef.current.value,
                ghLink: ghLinkRef.current.value,
                demoLink: demoLinkRef.current.value,
                imgPath: imageURLRef.current.value, // Using URL directly
            });

            // Clear form
            titleRef.current.value = "";
            descriptionRef.current.value = "";
            ghLinkRef.current.value = "";
            demoLinkRef.current.value = "";
            imageURLRef.current.value = "";

            // Refresh list
            fetchProjects();
        } catch (err) {
            console.error("Error adding project: ", err);
            setError("Failed to add project.");
        }
        setLoading(false);
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await deleteDoc(doc(db, "projects", id));
                fetchProjects();
            } catch (err) {
                console.error("Error deleting project: ", err);
                setError("Failed to delete project.");
            }
        }
    }

    return (
        <Container fluid className="project-section">
            <Particle />
            <Container>
                <h1 className="project-heading">
                    Admin <strong className="purple">Dashboard </strong>
                </h1>

                {error && <Alert variant="danger">{error}</Alert>}

                <div className="d-flex justify-content-end mb-4">
                    <span className="text-white me-3">Logged in as: {currentUser?.email}</span>
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                </div>

                <Row>
                    {/* Add Project Form */}
                    <Col md={5} className="mb-5">
                        <Card className="bg-dark text-white">
                            <Card.Header as="h4">Add New Project</Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleAddProject}>
                                    <Form.Group id="title" className="mb-3">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" ref={titleRef} required />
                                    </Form.Group>
                                    <Form.Group id="description" className="mb-3">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} ref={descriptionRef} required />
                                    </Form.Group>
                                    <Form.Group id="imageURL" className="mb-3">
                                        <Form.Label>Image URL (GitHub links auto-converted)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="https://github.com/user/repo/blob/main/img.png"
                                            ref={imageURLRef}
                                            onChange={handleImageChange}
                                            required
                                        />
                                        {previewImage && (
                                            <div className="mt-2 text-center">
                                                <p className="text-muted small">Preview:</p>
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "5px" }}
                                                    onError={(e) => e.target.style.display = 'none'}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>
                                    <Form.Group id="ghLink" className="mb-3">
                                        <Form.Label>GitHub Link</Form.Label>
                                        <Form.Control type="text" ref={ghLinkRef} />
                                    </Form.Group>
                                    <Form.Group id="demoLink" className="mb-3">
                                        <Form.Label>Demo Link</Form.Label>
                                        <Form.Control type="text" ref={demoLinkRef} />
                                    </Form.Group>
                                    <Button disabled={loading} className="w-100 purple" type="submit">
                                        Add Project
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Project List */}
                    <Col md={7}>
                        <Card className="bg-dark text-white">
                            <Card.Header as="h4">Existing Projects</Card.Header>
                            <Card.Body>
                                <Table striped bordered hover variant="dark" responsive>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td>
                                                    <img src={project.imgPath} alt={project.title} style={{ width: "50px", height: "auto" }} />
                                                </td>
                                                <td>{project.title}</td>
                                                <td>
                                                    <Button variant="danger" size="sm" onClick={() => handleDelete(project.id)}>
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </Container>
    );
}
