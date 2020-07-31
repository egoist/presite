if (location.pathname === '/') {
  document.getElementById('app').innerHTML = `
  <h1>home</h1>

  <a href="/other">other page</a>
  `
} else {
  document.getElementById('app').innerHTML = 'other page'
}
