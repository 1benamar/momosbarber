/* =========================================================
   AVISO DE VACACIONES O FESTIVOS
   Para activarlo:
     1. Pon  activo: true
     2. Pon las fechas (formato AAAA-MM-DD):
          mostrarDesde: el día que empieza a verse el aviso
          hasta:        el último día que se ve (después se oculta solo)
     3. Escribe el texto en cada idioma.
   Para quitarlo: activo: false
   ========================================================= */
window.MOMOS_AVISO = {
  activo: false,
  mostrarDesde: "2026-12-20",
  hasta: "2027-01-06",
  texto: {
    es: "Cerramos del 24 de diciembre al 6 de enero. ¡Felices fiestas!",
    en: "We're closed from 24 December to 6 January. Happy holidays!",
    fr: "Fermé du 24 décembre au 6 janvier. Bonnes fêtes !",
    ca: "Tanquem del 24 de desembre al 6 de gener. Bones festes!"
  }
};
