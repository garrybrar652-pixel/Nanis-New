{{-- Logo and Brand Partial --}}
{{-- Usage: @include('admin.partials.logo_brand') --}}
{{-- Displays the Nanis logo and brand name --}}

<a href="{{ route('admin.dashboard') }}" class="brand-link">
  <img src="{{ asset('images/Frame.png') }}" alt="Nanis Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
  <span class="brand-text font-weight-light"><b>Nanis</b></span>
</a>