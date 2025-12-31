import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register",
        form
      );

      setSuccess(res.data.message);
      setForm({ name: "", email: "", password: "" });

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>Register Form</h4>
        </div>

        <div className="card-body">
          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          {/* Disable browser tooltip with noValidate */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Name */}
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-danger">{errors.name[0]}</small>
              )}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label>Email</label>
              <input
                type="text"  // Use text to avoid browser tooltip
                name="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <small className="text-danger">{errors.email[0]}</small>
              )}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <small className="text-danger">{errors.password[0]}</small>
              )}
            </div>

            <button className="btn btn-success w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
