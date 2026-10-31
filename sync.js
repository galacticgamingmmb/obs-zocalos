/* Sincronización panel -> overlay sin servidor propio.
   1) localStorage + BroadcastChannel: mismo navegador / mismo perfil (p. ej. panel como "Dock" dentro de OBS).
   2) ntfy.sh (relé público gratuito) con un código de sala: permite controlar desde otro dispositivo. */
const Sync = (() => {
  const KEY = 'zocalos_state_v1';
  const DEFAULT = { label: 'Disertante', name: 'Juan Pérez', role: 'Pastor · Orador invitado', quote: 'La fe nos permite ver más allá de lo que tenemos delante.', visible: false, t: 0 };
  const safe = (fn, d) => { try { return fn(); } catch (e) { return d; } };
  const bc = safe(() => new BroadcastChannel('zocalos'), null);
  let last = 0;

  const load = () => safe(() => Object.assign({}, DEFAULT, JSON.parse(localStorage.getItem(KEY))), { ...DEFAULT });
  const topic = room => 'zocalos-' + room;

  function publish(state, room) {
    state = { ...state, t: Date.now() };
    safe(() => localStorage.setItem(KEY, JSON.stringify(state)));
    bc && bc.postMessage(state);
    if (!room) return Promise.resolve(true);
    return fetch('https://ntfy.sh/' + topic(room), { method: 'POST', body: JSON.stringify(state) })
      .then(r => r.ok).catch(() => false);
  }

  function subscribe(cb, room, onNet) {
    const apply = s => { if (s && typeof s === 'object' && (s.t || 0) >= last) { last = s.t || 0; cb(Object.assign({}, DEFAULT, s)); } };
    apply(load());
    bc && (bc.onmessage = e => apply(e.data));
    addEventListener('storage', e => { if (e.key === KEY) apply(safe(() => JSON.parse(e.newValue))); });
    if (room) {
      const open = () => {
        const es = new EventSource('https://ntfy.sh/' + topic(room) + '/sse?since=12h');
        es.onopen = () => onNet && onNet(true);
        es.onmessage = e => { const m = safe(() => JSON.parse(JSON.parse(e.data).message)); if (m) apply(m); };
        es.onerror = () => { onNet && onNet(false); };   // EventSource reconecta solo
      };
      open();
    }
  }
  const newRoom = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
  return { DEFAULT, load, publish, subscribe, newRoom };
})();
