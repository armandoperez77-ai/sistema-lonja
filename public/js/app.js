(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { purchases: [], buyers: [], lots: [], species: [], types: [], reportRows: [] };

  const money = (value) => new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', minimumFractionDigits: 2
  }).format(Number(value) || 0);
  const number = (value, digits = 2) => new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 0, maximumFractionDigits: digits
  }).format(Number(value) || 0);
  const dateKey = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const todayKey = () => dateKey(new Date());
  const displayDate = (value, options = { day: '2-digit', month: 'short', year: 'numeric' }) => {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-MX', options).format(date);
  };
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function showToast(message, isError = false) {
    const region = $('#toast-region');
    if (!region) return;
    const toast = document.createElement('div');
    toast.className = `toast${isError ? ' is-error' : ''}`;
    const mark = document.createElement('span');
    mark.className = 'toast-mark';
    mark.textContent = isError ? '!' : '✓';
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(mark, text);
    region.append(toast);
    window.setTimeout(() => toast.remove(), 5200);
  }

  function emptyRow(columns, message) {
    return `<tr><td colspan="${columns}" class="table-empty">${escapeHtml(message)}</td></tr>`;
  }

  function renderPurchaseRows(rows, target, emptyMessage = 'No hay operaciones para mostrar.') {
    const body = $(target);
    if (!body) return;
    if (!rows.length) {
      body.innerHTML = emptyRow(6, emptyMessage);
      return;
    }
    body.innerHTML = rows.map((purchase) => `
      <tr>
        <td>#${escapeHtml(String(purchase.id_cmp).padStart(5, '0'))}</td>
        <td>${escapeHtml(displayDate(purchase.fecha))}</td>
        <td>${escapeHtml(purchase.comprador || `Comprador #${purchase.codigo_cpr}`)}</td>
        <td>Lote #${escapeHtml(purchase.id_lte)}</td>
        <td>${escapeHtml(money(purchase.precio_kilo_final))}</td>
        <td><strong>${escapeHtml(money(purchase.precio_total))}</strong></td>
      </tr>`).join('');
  }

  function sortPurchases(rows) {
    return [...rows].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }

  function renderDashboard() {
    const todayRows = state.purchases.filter((item) => dateKey(item.fecha) === todayKey());
    const total = todayRows.reduce((sum, item) => sum + (Number(item.precio_total) || 0), 0);
    if ($('#metric-today-count')) $('#metric-today-count').textContent = number(todayRows.length, 0);
    if ($('#metric-today-total')) $('#metric-today-total').textContent = money(total);
    if ($('#metric-buyers')) $('#metric-buyers').textContent = number(state.buyers.length, 0);
    if ($('#metric-lots')) $('#metric-lots').textContent = number(state.lots.length, 0);
    if ($('#sidebar-purchase-count')) $('#sidebar-purchase-count').textContent = number(state.purchases.length, 0);
    renderPurchaseRows(sortPurchases(state.purchases).slice(0, 6), '#dashboard-recent-body', 'Todavía no hay compras registradas.');
  }

  function renderPurchases() {
    const query = ($('#purchase-search')?.value || '').trim().toLocaleLowerCase('es-MX');
    const rows = sortPurchases(state.purchases).filter((item) => {
      const haystack = [item.id_cmp, item.comprador, item.codigo_cpr, item.id_lte, item.fecha]
        .join(' ').toLocaleLowerCase('es-MX');
      return haystack.includes(query);
    });
    renderPurchaseRows(rows, '#purchases-table-body');
    if ($('#purchase-results-count')) $('#purchase-results-count').textContent = `${rows.length} resultado(s)`;
    if ($('#purchase-footer-count')) $('#purchase-footer-count').textContent = `${state.purchases.length} operación(es)`;
  }

  function renderReport() {
    const selectedDate = $('#report-date')?.value || todayKey();
    const rows = sortPurchases(state.purchases).filter((item) => dateKey(item.fecha) === selectedDate);
    state.reportRows = rows;
    const total = rows.reduce((sum, item) => sum + (Number(item.precio_total) || 0), 0);
    const uniqueBuyers = new Set(rows.map((item) => String(item.codigo_cpr))).size;
    if ($('#report-heading')) $('#report-heading').textContent = `Detalle del ${displayDate(`${selectedDate}T12:00:00`)}`;
    if ($('#report-count')) $('#report-count').textContent = number(rows.length, 0);
    if ($('#report-total')) $('#report-total').textContent = money(total);
    if ($('#report-unique-buyers')) $('#report-unique-buyers').textContent = number(uniqueBuyers, 0);
    renderPurchaseRows(rows, '#report-table-body', 'No hay compras registradas en la fecha seleccionada.');
  }

  function renderCatalogs() {
    const buyersBody = $('#buyers-table-body');
    if (buyersBody) {
      buyersBody.innerHTML = state.buyers.length
        ? state.buyers.map((buyer) => `<tr><td>#${escapeHtml(buyer.codigo_cpr)}</td><td>${escapeHtml(buyer.nombre)}</td></tr>`).join('')
        : emptyRow(2, 'No hay compradores registrados.');
    }
    if ($('#buyers-count')) $('#buyers-count').textContent = `${state.buyers.length} registro(s)`;

    const lotsBody = $('#lots-table-body');
    if (lotsBody) {
      lotsBody.innerHTML = state.lots.length
        ? state.lots.map((lot) => `<tr><td>#${escapeHtml(lot.id_lte)}</td><td>${escapeHtml(number(lot.kilos))} kg</td><td>${escapeHtml(lot.numero_cajas)}</td><td>${escapeHtml(money(lot.precio_kilo_salida))}</td><td>${escapeHtml(displayDate(lot.fecha))}</td></tr>`).join('')
        : emptyRow(5, 'No hay lotes registrados.');
    }
    if ($('#lots-count')) $('#lots-count').textContent = `${state.lots.length} registro(s)`;
    if ($('#species-list')) {
      $('#species-list').innerHTML = state.species.length
        ? state.species.map((item) => `<div class="catalog-list-item"><span>${escapeHtml(item.nombre)}</span><small>Lote #${escapeHtml(item.id_lte)}</small></div>`).join('')
        : '<p class="table-empty">No hay especies registradas.</p>';
    }
    if ($('#types-list')) {
      $('#types-list').innerHTML = state.types.length
        ? state.types.map((item) => `<div class="catalog-list-item"><span>${escapeHtml(item.nombre)}</span><small>Tipo #${escapeHtml(item.id_tpo)}</small></div>`).join('')
        : '<p class="table-empty">No hay tipos registrados.</p>';
    }
  }

  function fillSelect(select, items, valueKey, labelFn, emptyLabel) {
    if (!select) return;
    const previousValue = select.value;
    select.innerHTML = `<option value="">${escapeHtml(emptyLabel)}</option>` + items.map((item) =>
      `<option value="${escapeHtml(item[valueKey])}">${escapeHtml(labelFn(item))}</option>`
    ).join('');
    if (items.some((item) => String(item[valueKey]) === previousValue)) select.value = previousValue;
    select.disabled = items.length === 0;
  }

  async function loadCatalogs() {
    try {
      const response = await fetch('/ui/catalogos', {
        method: 'GET', credentials: 'same-origin', headers: { Accept: 'application/json' }
      });
      if (response.redirected || response.status === 401 || response.status === 403) {
        window.location.assign('/');
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      state.lots = Array.isArray(data.lotes) ? data.lotes : [];
      state.buyers = Array.isArray(data.compradores) ? data.compradores : [];
      state.species = Array.isArray(data.especies) ? data.especies : [];
      state.types = Array.isArray(data.tipos) ? data.tipos : [];
      fillSelect($('#id_lte'), state.lots, 'id_lte', (lot) => `Lote #${lot.id_lte} · ${number(lot.kilos)} kg`, 'Selecciona un lote');
      fillSelect($('#codigo_cpr'), state.buyers, 'codigo_cpr', (buyer) => buyer.nombre, 'Selecciona un comprador');
      renderCatalogs();
      renderDashboard();
    } catch (error) {
      console.error('No fue posible cargar los catálogos:', error);
      showToast('No se pudieron cargar compradores y lotes. Revisa la conexión con la base de datos.', true);
      fillSelect($('#id_lte'), [], 'id_lte', () => '', 'No fue posible cargar lotes');
      fillSelect($('#codigo_cpr'), [], 'codigo_cpr', () => '', 'No fue posible cargar compradores');
    }
  }

  function activateView(name) {
    const allowed = ['dashboard', 'purchases', 'reports', 'buyers', 'lots'];
    const viewName = allowed.includes(name) ? name : 'dashboard';
    $$('[data-view]').forEach((section) => section.classList.toggle('is-visible', section.dataset.view === viewName));
    $$('[data-view-target]').forEach((button) => button.classList.toggle('is-active', button.dataset.viewTarget === viewName));
    const labels = { dashboard: 'Panel principal', purchases: 'Compras', reports: 'Reportes diarios', buyers: 'Compradores', lots: 'Lotes y especies' };
    if ($('#breadcrumb-current')) $('#breadcrumb-current').textContent = labels[viewName];
    $('#sidebar')?.classList.remove('is-open');
    if (viewName === 'purchases') renderPurchases();
    if (viewName === 'reports') renderReport();
  }

  function openPurchaseModal() {
    const modal = $('#purchase-modal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => $('#id_lte')?.focus(), 50);
  }

  function closePurchaseModal() {
    const modal = $('#purchase-modal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function exportReportCsv() {
    if (!state.reportRows.length) {
      showToast('No hay operaciones para exportar en esta fecha.', true);
      return;
    }
    const rows = [
      ['Folio', 'Fecha', 'Comprador', 'Código comprador', 'Lote', 'Precio por kilo', 'Importe total'],
      ...state.reportRows.map((item) => [
        item.id_cmp, displayDate(item.fecha), item.comprador, item.codigo_cpr,
        item.id_lte, Number(item.precio_kilo_final).toFixed(2), Number(item.precio_total).toFixed(2)
      ])
    ];
    const csv = '\uFEFF' + rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `lonja-reporte-${$('#report-date')?.value || todayKey()}.csv`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function updateCurrentDate() {
    const now = new Date();
    $$('[data-current-year]').forEach((element) => element.textContent = String(now.getFullYear()));
    $$('[data-today-label]').forEach((element) => element.textContent = displayDate(now, { weekday: 'short', day: '2-digit', month: 'long', year: 'numeric' }));
    $$('[data-welcome-date]').forEach((element) => element.textContent = displayDate(now, { day: '2-digit', month: 'long', year: 'numeric' }));
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const viewButton = event.target.closest('[data-view-target]');
      if (viewButton) activateView(viewButton.dataset.viewTarget);
      if (event.target.closest('[data-open-purchase]')) openPurchaseModal();
      if (event.target.closest('[data-close-purchase]')) closePurchaseModal();
      if (event.target === $('#purchase-modal')) closePurchaseModal();
      if (event.target.closest('[data-sidebar-toggle]')) $('#sidebar')?.classList.toggle('is-open');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePurchaseModal();
        $('#sidebar')?.classList.remove('is-open');
      }
    });
    $('#purchase-search')?.addEventListener('input', renderPurchases);
    $('#report-date')?.addEventListener('change', renderReport);
    $('#report-today')?.addEventListener('click', () => {
      if ($('#report-date')) $('#report-date').value = todayKey();
      renderReport();
    });
    $('#export-report')?.addEventListener('click', exportReportCsv);
    $('#print-report')?.addEventListener('click', () => window.print());

    $('#purchase-form')?.addEventListener('submit', (event) => {
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }
      const lotId = $('#id_lte')?.value;
      const buyerId = $('#codigo_cpr')?.value;
      if (!state.lots.some((item) => String(item.id_lte) === lotId) ||
          !state.buyers.some((item) => String(item.codigo_cpr) === buyerId)) {
        event.preventDefault();
        showToast('Selecciona un lote y un comprador válidos.', true);
        return;
      }
      const price = Number($('#precio_kilo_final')?.value);
      const total = Number($('#precio_total')?.value);
      if (!Number.isFinite(price) || !Number.isFinite(total) || price <= 0 || total <= 0) {
        event.preventDefault();
        showToast('El precio por kilo y el importe deben ser mayores que cero.', true);
        return;
      }
      const submitButton = $('#save-purchase-button');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Guardando…';
      }
    });

    $$('[data-password-toggle]').forEach((button) => button.addEventListener('click', () => {
      const input = $('#password');
      if (!input) return;
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    }));
  }

  function readInitialData() {
    const node = $('#lonja-page-data');
    if (!node) return;
    try {
      const data = JSON.parse(node.textContent || '{}');
      state.purchases = Array.isArray(data.purchases) ? data.purchases : [];
    } catch (error) {
      console.error('No fue posible interpretar las compras recibidas:', error);
      state.purchases = [];
      showToast('No se pudo interpretar la información de compras.', true);
    }
  }

  function initLoginPage() {
    const loginForm = $('.login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', () => {
        const submit = $('button[type="submit"]', loginForm);
        if (submit) {
          submit.disabled = true;
          submit.textContent = 'Validando…';
        }
      });
    }
  }

  function initAppPage() {
    readInitialData();
    bindEvents();
    if ($('#report-date')) $('#report-date').value = todayKey();
    renderDashboard();
    renderPurchases();
    renderReport();
    loadCatalogs();

    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) showToast('No se pudo registrar la compra. Verifica los datos e inténtalo nuevamente.', true);
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    initLoginPage();
    if ($('.app-page')) initAppPage();
  });
})();

// --- MEJORA DEL BACKEND: Especies, Precio Automático y Total ---
document.addEventListener("DOMContentLoaded", () => {
    let catalogos = null;

    // 1. Descargamos la información de MariaDB a través de la ruta de tu compañero
    fetch('/ui/catalogos')
        .then(res => res.json())
        .then(data => catalogos = data);

    // 2. Interceptamos el clic en el menú de lotes para agregarle la Especie
    document.body.addEventListener('click', (e) => {
        if (e.target.name === 'id_lte' && catalogos && !e.target.dataset.nombresActualizados) {
            Array.from(e.target.options).forEach(opcion => {
                if (opcion.value) {
                    const especie = catalogos.especies.find(esp => esp.id_lte == opcion.value);
                    if (especie && !opcion.text.includes(especie.nombre)) {
                        // Cambiamos "Lote #2" por "Lote #2 - Atún Aleta Amarilla"
                        opcion.text = `${opcion.text} - ${especie.nombre}`;
                    }
                }
            });
            e.target.dataset.nombresActualizados = "true"; // Marcamos para no repetirlo
        }
    });

    // 3. Autocompletamos el precio cuando selecciona un lote
    document.body.addEventListener('change', (e) => {
        if (e.target.name === 'id_lte' && catalogos) {
            const inputPrecio = document.querySelector('input[name="precio_kilo_final"]');
            const inputTotal = document.querySelector('input[name="precio_total"]');
            const lote = catalogos.lotes.find(l => l.id_lte == e.target.value);
            
            if (lote && inputPrecio) {
                // Ponemos el precio del kilo
                inputPrecio.value = lote.precio_kilo_salida;
                
                // ¡EXTRA!: Te programé que calcule el importe total automáticamente (Kilos del lote x Precio)
                if (inputTotal) {
                    inputTotal.value = (lote.precio_kilo_salida * lote.kilos).toFixed(2);
                }
            }
        }
    });
});