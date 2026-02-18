import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Particle from "../Particle";

export default function AdminLogin() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate("/admin");
        } catch {
            setError("Failed to log in");
        }

        setLoading(false);
    }

    return (
        <Container fluid className="about-section">
            <Particle />
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card className="bg-dark text-white p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Admin Girişi</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group id="password">
                                    <Form.Label>Şifre</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} required />
                                </Form.Group>
                                <Button disabled={loading} className="w-100 mt-4 purple" type="submit">
                                    Giriş Yap
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
        </Container>
    );
}
