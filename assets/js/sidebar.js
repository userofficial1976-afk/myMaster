/* =========================================================
   MASTER DUTY PRO — SHARED SIDEBAR V1
   Komponen sidebar desktop + navigasi mobile untuk semua halaman.
   Tidak mengandungi logik data/Supabase halaman.
   ========================================================= */
(function () {
  'use strict';

  const MENU = [
    { type: 'label', text: 'Menu Utama' },
    { href: 'dashboard.html', id: 'menu-dashboard', icon: 'fa-house', text: 'Dashboard' },
    { href: 'pengurusan-anggota.html', id: 'menu-anggota', icon: 'fa-users', text: 'Pengurusan Anggota' },
    { href: 'kod-duty.html', id: 'menu-kod-duty', icon: 'fa-code', text: 'Kod Waktu Kerja' },
    { href: 'kod-tempat-kerja.html', id: 'menu-kod-tempat', icon: 'fa-location-dot', text: 'Kod Tempat Kerja' },
    { href: 'jadual-duty.html', id: 'menu-jadual', icon: 'fa-calendar-check', text: 'Pengisian Jadual Tugas' },
    { type: 'label', text: 'Laporan' },
    { href: 'laporan-wilayah.html', id: 'menu-laporan-wilayah', icon: 'fa-file-lines', text: 'Laporan Wilayah' },
    { href: 'anggaran-rk02.html', id: 'menu-rk02', icon: 'fa-chart-column', text: 'Anggaran RK02' },
    { href: 'anggaran-rk01.html', id: 'menu-rk01', icon: 'fa-chart-line', text: 'Anggaran RK01' },
    { type: 'label', text: 'Sistem' },
    { href: '#', id: 'menu-tetapan', icon: 'fa-gear', text: 'Tetapan' },
    { href: 'login.html', id: 'menu-logout', icon: 'fa-right-from-bracket', text: 'Log Keluar', logout: true }
  ];

  const MOBILE_MENU = [
    { href: 'dashboard.html', icon: 'fa-house', text: 'Dash' },
    { href: 'jadual-duty.html', icon: 'fa-calendar-check', text: 'Duty' },
    { href: 'kod-duty.html', icon: 'fa-code', text: 'Kod' },
    { href: 'anggaran-rk01.html', icon: 'fa-chart-line', text: 'RK01' },
    { href: 'anggaran-rk02.html', icon: 'fa-chart-column', text: 'RK02' },
    { href: 'login.html', icon: 'fa-right-from-bracket', text: 'Keluar', logout: true }
  ];

  function readUser() {
    try { return JSON.parse(localStorage.getItem('mdp_user') || 'null'); }
    catch (error) { console.warn('MDP: maklumat pengguna tidak dapat dibaca.', error); return null; }
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function currentFile() {
    const parts = window.location.pathname.split('/');
    return (parts.pop() || 'dashboard.html').toLowerCase();
  }

  function isActive(href) {
    return currentFile() === String(href).toLowerCase();
  }

  function renderDesktop() {
    const host = document.getElementById('sharedSidebar');
    if (!host) return;

    const menuHTML = MENU.map(item => {
      if (item.type === 'label') return `<div class="mdp-section-label">${escapeHTML(item.text)}</div>`;
      const active = isActive(item.href);
      const extra = item.logout ? ' mdp-logout-link' : '';
      return `<a href="${item.href}" id="${item.id}" class="mdp-sidebar-link${active ? ' active' : ''}${extra}"${item.logout ? ' data-mdp-logout="true"' : ''}>
        <i class="fas ${item.icon}" aria-hidden="true"></i><span>${escapeHTML(item.text)}</span>
      </a>`;
    }).join('');

    host.innerHTML = `
      <aside class="mdp-sidebar" aria-label="Navigasi utama Master Duty Pro">
        <div class="mdp-sidebar-inner">
          <div class="mdp-brand">
            <img src="logomdp.png" alt="Logo Master Duty Pro" onerror="this.style.display='none'">
            <div class="mdp-brand-copy">
              <div class="mdp-brand-name">MASTER DUTY PRO</div>
              <div class="mdp-brand-region">WILAYAH TERENGGANU</div>
            </div>
          </div>
          <div class="mdp-user-box">
            <div class="mdp-user-caption">Pengguna Aktif</div>
            <div id="sidebarNamaPengguna" class="mdp-user-name">-</div>
            <div id="sidebarJawatanPengguna" class="mdp-user-role">-</div>
          </div>
          <nav class="mdp-sidebar-menu">${menuHTML}</nav>
        </div>
        <div class="mdp-sidebar-footer">DISIPLIN • KOMITMEN • BERJASA</div>
      </aside>`;
  }

  function renderMobile() {
    const host = document.getElementById('sharedMobileNav');
    if (!host) return;
    host.innerHTML = `<nav class="mdp-mobile-nav" aria-label="Navigasi mudah alih">${MOBILE_MENU.map(item => `
      <a href="${item.href}" class="mdp-mobile-item${isActive(item.href) ? ' active' : ''}"${item.logout ? ' data-mdp-logout="true"' : ''}>
        <i class="fas ${item.icon}" aria-hidden="true"></i><span>${escapeHTML(item.text)}</span>
      </a>`).join('')}</nav>`;
  }

  function bindLogout() {
    document.querySelectorAll('[data-mdp-logout="true"]').forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        // Gunakan fungsi logout halaman jika disediakan; selain itu fallback standard.
        if (typeof window.logKeluar === 'function') {
          window.logKeluar();
        } else {
          localStorage.removeItem('mdp_user');
          window.location.href = 'login.html';
        }
      });
    });
  }

  function injectStyles() {
    if (document.getElementById('mdp-shared-sidebar-style')) return;
    const style = document.createElement('style');
    style.id = 'mdp-shared-sidebar-style';
    style.textContent = `
      #sharedSidebar{position:relative;z-index:40}
      .mdp-sidebar{position:fixed;left:0;top:0;bottom:0;width:256px;display:flex;flex-direction:column;overflow-y:auto;background:linear-gradient(180deg,rgba(3,18,39,.98),rgba(2,12,28,.98));border-right:1px solid rgba(0,234,255,.42);box-shadow:8px 0 35px rgba(0,180,255,.06);color:#d9f5ff;z-index:1000}
      .mdp-sidebar-inner{padding:16px;}
      .mdp-brand{display:flex;align-items:center;gap:12px;padding:16px 8px 18px;margin-bottom:10px;min-height:76px}
      .mdp-brand img{width:48px;height:48px;object-fit:contain;flex:0 0 48px}
      .mdp-brand-name{font-family:Orbitron,Inter,sans-serif;letter-spacing:.07em;font-size:13px;font-weight:800;color:#67eaff;white-space:nowrap}
      .mdp-brand-region{font-size:9px;letter-spacing:.18em;color:#7dd3fc;margin-top:5px;white-space:nowrap}
      .mdp-user-box{border:1px solid rgba(0,234,255,.25);background:rgba(8,47,73,.35);padding:12px;margin:0 0 12px}
      .mdp-user-caption{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#83b7d2}
      .mdp-user-name{font-size:13px;font-weight:700;color:#fff;margin-top:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .mdp-user-role{font-size:11px;color:#67eaff;margin-top:4px}
      .mdp-section-label{font-family:Orbitron,Inter,sans-serif;font-size:9px;letter-spacing:.18em;color:#00dff7;text-transform:uppercase;padding:20px 12px 8px}
      .mdp-sidebar-link{display:flex;align-items:center;gap:12px;padding:12px 13px;color:#9fc8dc;border:1px solid transparent;border-bottom-color:rgba(0,200,255,.12);transition:background .2s,border-color .2s,color .2s,box-shadow .2s;text-decoration:none;font-size:12px;min-height:43px}
      .mdp-sidebar-link i{width:20px;text-align:center;font-size:15px;color:#8edcf4;flex:0 0 20px}
      .mdp-sidebar-link:hover,.mdp-sidebar-link.active{color:#fff;background:linear-gradient(90deg,rgba(0,220,255,.28),rgba(0,110,180,.06));border-color:rgba(0,234,255,.55);box-shadow:inset 0 0 18px rgba(0,234,255,.10),0 0 14px rgba(0,234,255,.06)}
      .mdp-sidebar-link.active i{color:#00eaff;filter:drop-shadow(0 0 5px #00eaff)}
      .mdp-sidebar-link.mdp-logout-link,.mdp-sidebar-link.mdp-logout-link i{color:#fb923c}
      .mdp-sidebar-footer{margin-top:auto;padding:16px 20px;border-top:1px solid rgba(0,234,255,.18);font-size:8px;letter-spacing:.16em;color:#0891b2;white-space:nowrap}
      #sharedMobileNav{display:none}
      @media(max-width:1023px){.mdp-sidebar{display:none}#sharedMobileNav{display:block}.mdp-mobile-nav{position:fixed;left:0;right:0;bottom:0;height:68px;z-index:9999;display:flex;justify-content:space-around;align-items:center;background:rgba(2,12,28,.97);border-top:1px solid rgba(0,234,255,.45);backdrop-filter:blur(15px);padding-bottom:env(safe-area-inset-bottom)}.mdp-mobile-item{flex:1;height:100%;text-align:center;text-decoration:none;color:#84b6cd;font-size:9px;display:flex;flex-direction:column;gap:5px;align-items:center;justify-content:center}.mdp-mobile-item i{font-size:17px}.mdp-mobile-item.active{color:#00eaff;text-shadow:0 0 10px rgba(0,234,255,.5)}}
      @media(min-width:1024px){#sharedSidebar{display:block}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    injectStyles();
    renderDesktop();
    renderMobile();
    bindLogout();

    // Isi nama pengguna terus daripada sesi; skrip halaman boleh mengemas kini semula.
    const user = readUser();
    if (user) {
      const name = user.name || user.nama || user.noSkb || 'Pengguna';
      const nameEl = document.getElementById('sidebarNamaPengguna');
      const roleEl = document.getElementById('sidebarJawatanPengguna');
      if (nameEl) nameEl.textContent = name;
      if (roleEl) roleEl.textContent = user.jawatan || '-';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
