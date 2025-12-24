{{-- Settings Sidebar Menu Partial --}}
{{-- Usage: @include('admin.partials.settings_sidebar', ['active' => 'index', 'showFilters' => true]) --}}
{{-- Parameters:
     - active: 'dashboard' (shows General Settings & System Config) or 'index' (shows All Settings & Add Setting)
     - showFilters: boolean to show filter options
--}}

@if(isset($active) && $active === 'dashboard')
  {{-- Dashboard view: Show General Settings and System Config --}}
  <li class="nav-item {{ request()->routeIs('admin.settings.index') && request('group') ? 'menu-open' : '' }}">
    <a href="#" class="nav-link {{ request()->routeIs('admin.settings.*') ? 'active' : '' }}">
      <i class="nav-icon fas fa-cog"></i>
      <p>
        Settings
        <i class="right fas fa-angle-left"></i>
      </p>
    </a>
    <ul class="nav nav-treeview">
      <li class="nav-item">
        <a href="{{ route('admin.settings.index', ['group' => 'general']) }}" class="nav-link {{ request('group') === 'general' ? 'active' : '' }}">
          <i class="far fa-circle nav-icon"></i>
          <p>General Settings</p>
        </a>
      </li>
      <li class="nav-item">
        <a href="{{ route('admin.settings.index', ['group' => 'system']) }}" class="nav-link {{ request('group') === 'system' ? 'active' : '' }}">
          <i class="far fa-circle nav-icon"></i>
          <p>System Config</p>
        </a>
      </li>
    </ul>
  </li>
@else
  {{-- Settings index view: Show All Settings and Add Setting --}}
  <li class="nav-item menu-open">
    <a href="#" class="nav-link active">
      <i class="nav-icon fas fa-cog"></i>
      <p>
        Settings
        <i class="right fas fa-angle-left"></i>
      </p>
    </a>
    <ul class="nav nav-treeview">
      <li class="nav-item">
        <a href="{{ route('admin.settings.index') }}" class="nav-link {{ request()->routeIs('admin.settings.index') && !request('group') ? 'active' : '' }}">
          <i class="far fa-circle nav-icon"></i>
          <p>All Settings</p>
        </a>
      </li>
      <li class="nav-item">
        <a href="{{ route('admin.settings.create') }}" class="nav-link {{ request()->routeIs('admin.settings.create') ? 'active' : '' }}">
          <i class="far fa-circle nav-icon"></i>
          <p>Add Setting</p>
        </a>
      </li>
    </ul>
  </li>
@endif