import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value
    };

    setForm(updatedForm);

    let newErrors = { ...errors };

    //  Name validation
    if (name === "name") {
      if (value.length < 3) {
        newErrors.name = ["Minimum 3 characters required"];
      } else {
        delete newErrors.name;
      }
    }

    //  Email validation
    if (name === "email") {
      if (!value.includes("@")) {
        newErrors.email = ["Email must contain @"];
      } else {
        delete newErrors.email;
      }
    }

    //  Password validation
    if (name === "password") {
      if (value.length < 8) {
        newErrors.password = ["Minimum 8 characters required"];
      } else {
        delete newErrors.password;
      }
    }

    //  Confirm password validation (FIXED)
    if (name === "password" || name === "password_confirmation") {
      if (
        updatedForm.password_confirmation &&
        updatedForm.password !== updatedForm.password_confirmation
      ) {
        newErrors.password_confirmation = ["Passwords do not match"];
      } else {
        delete newErrors.password_confirmation;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register",
        form
      );

      setSuccess(res.data.message);

      setForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      });

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    }

    setLoading(false);
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
                type="text"
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

            {/*  Confirm Password (FIXED UI) */}
            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                value={form.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <small className="text-danger">
                  {errors.password_confirmation[0]}
                </small>
              )}
            </div>

            {/* Submit Button */}
            <button className="btn btn-success w-100" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}