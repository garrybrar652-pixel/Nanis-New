<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>User Dashboard</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <link rel="stylesheet" href="{{ asset('adminlte/plugins/fontawesome-free/css/all.min.css') }}">
  <link rel="stylesheet" href="{{ asset('adminlte/dist/css/adminlte.min.css') }}">
</head>
<body class="hold-transition sidebar-mini">
<div class="wrapper">

  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item dropdown">
        <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
          <span>{{ Auth::user()->name }}</span>
        </a>
        <ul class="dropdown-menu">
          <li class="dropdown-item">
            <form action="{{ route('logout') }}" method="POST">
              @csrf
              <button type="submit" class="btn btn-link p-0">Logout</button>
            </form>
          </li>
        </ul>
      </li>
    </ul>
  </nav>

  <!-- Content Wrapper -->
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Dashboard</h1>
          </div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Welcome, {{ Auth::user()->name }}!</h5>
                <p class="card-text">You are logged in as a regular user.</p>
                <p class="card-text"><strong>Email:</strong> {{ Auth::user()->email }}</p>
                <p class="card-text"><strong>Role:</strong>
                  @if(Auth::user()->hasRole('admin'))
                    <span class="badge badge-danger">Admin</span>
                  @else
                    <span class="badge badge-primary">User</span>
                  @endif
                </p>
                <p class="card-text"><strong>Member since:</strong> {{ Auth::user()->created_at->format('F j, Y') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>

<script src="{{ asset('adminlte/plugins/jquery/jquery.min.js') }}"></script>
<script src="{{ asset('adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
<script src="{{ asset('adminlte/dist/js/adminlte.min.js') }}"></script>
</body>
</html>