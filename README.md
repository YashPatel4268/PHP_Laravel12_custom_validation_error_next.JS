# PHP_Laravel12_Custome_Validation_Error_Using_Next.JS

---

This project is a full-stack registration form with custom validation errors, using Laravel 12 as the backend (API) and Next.js with Bootstrap as the frontend.

## It demonstrates how to:

Create a Laravel API

Apply custom validation rules for name, email, and password

Handle and return validation errors as JSON

Consume the API in Next.js


---

# PART 1: BACKEND (Laravel 12 API)

---

## Navigate to the location where you want the project folder, for example D:\xampp\htdocs:

```

cd D:\xampp\htdocs

```

### Create the folder:
```
mkdir PHP_Laravel12_Custome_Validation_Error_Using_Next.JS
```

### Go inside the folder:
```
cd PHP_Laravel12_Custome_Validation_Error_Using_Next.JS
```

Now you are inside your project folder.




## Step 1: Create Laravel 12 Project

### Run this command:

```
composer create-project laravel/laravel backend "12.*"
```

### Go inside backend:

```
cd backend
```



## Step 2: Setup Database

### Open .env

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextjs_validation
DB_USERNAME=root
DB_PASSWORD=

```
### Create database:

nextjs_validation


## Step 3: Create API Controller

### Run Command:

```
php artisan make:controller Api/UserController

```


## Step 4: Add Custom Validation Logic

### backend/app/Http/Controllers/Api/UserController.php

```

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User; // Import User model
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function store(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:3',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'min:8', // minimum 8 characters

                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&]).+$/'// Regex ensures at least 1 lowercase, 1 uppercase, and 1 special character

            ]
        ], [
            'name.required' => 'Name is required',
            'name.min' => 'Name must be at least 3 characters',
            'email.required' => 'Email is required',
            'email.email' => "Please include an '@' in the email address. '{$request->email}' is missing an '@'.",
            'email.unique' => 'Email already exists',
            'password.required' => 'Password is required',
            'password.regex' => 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Save user to database
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash password
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Form submitted successfully',
            'data' => $user
        ]);
    }
}

```


### backend/app/Models/User.php

```

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];
}


```





## Step 5: Create API Route

### backend/routes/api.php

```

<?php

use App\Http\Controllers\Api\UserController;

Route::post('/register', [UserController::class, 'store']);


```


## Step 6: Start Laravel Server

### Run Command:

```

php artisan serve
```

### Backend URL:

```

http://127.0.0.1:8000
```


---



# PART 2: FRONTEND (Next.js + Bootstrap)

---

## Step 7: Create Next.js App

### Go to main project folder:

```
cd PHP_Laravel12_Custome_Validation_Error_Using_Next.JS

```


### Create frontend:

```
npx create-next-app@latest frontend

```

### Go inside:

```

cd frontend

```


### Step 8: Install Bootstrap & Axios

### Run Command:

```
npm install bootstrap axios

```

## Step 9: Import Bootstrap

### frontend/pages/_app.js

```

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

```

if you use this then \app folder remove.




## Step 10: Create Registration Form Page

### frontend/pages/index.js

```

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

```


## Step 11: Start Next.js Server

### Run Command:

```
npm run dev
```

### Frontend URL:

```
http://localhost:3000
```


## So you can see this type Output:

### From Page(Error):


<img width="1915" height="831" alt="Screenshot 2025-12-31 104853" src="https://github.com/user-attachments/assets/3d482934-9207-4b82-8909-4c6ca3d9aff6" />


### From Page(Name Error):


<img width="1919" height="808" alt="Screenshot 2025-12-31 104948" src="https://github.com/user-attachments/assets/74ec52df-947a-4b20-b13d-bcfc7a1daf95" />


### From Page(Email Error):


<img width="1918" height="893" alt="Screenshot 2025-12-31 105445" src="https://github.com/user-attachments/assets/20caf79d-6856-49d6-842e-1922af46bfa9" />


### From Page(Password Error):

If you not write 8 character password:


<img width="1919" height="832" alt="image" src="https://github.com/user-attachments/assets/55ad4116-a141-40f5-9b8a-2b9919413ea3" />


If you write simple 8 character password:


<img width="1906" height="823" alt="Screenshot 2025-12-31 112234" src="https://github.com/user-attachments/assets/e06bca87-2be2-465d-b49c-09a5e4fba4dc" />


After Submit Form:


<img width="1919" height="803" alt="Screenshot 2025-12-31 105522" src="https://github.com/user-attachments/assets/a8ae7a31-405a-4608-8375-dd8ee329264d" />




---


# Project Folder Structure:

```

PHP_Laravel12_Custome_Validation_Error_Using_Next.JS/
├── backend/                     # Laravel 12 backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Api/
│   │   │   │       └── UserController.php
│   │   ├── Models/
│   │   │   └── User.php
│   │   └── ...
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/
│   │   │   └── 2014_10_12_000000_create_users_table.php
│   │   └── seeders/
│   ├── public/
│   │   └── index.php
│   ├── resources/
│   │   ├── lang/
│   │   └── views/
│   ├── routes/
│   │   └── api.php
│   ├── storage/
│   ├── tests/
│   ├── vendor/
│   ├── artisan
│   └── .env
│
├── frontend/                    # Next.js frontend
│   ├── node_modules/
│   ├── public/
│   ├── styles/
│   │   └── globals.css
│   ├── pages/
│   │   ├── _app.js
│   │   └── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.js
│   └── ...
│
├── README.md
└── package.json (if any root scripts, optional)


```




