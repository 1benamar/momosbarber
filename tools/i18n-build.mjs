// Herramienta de desarrollo (no se sube): marca los textos de index.html con
// data-i18n y genera i18n.js con las traducciones EN / FR / CA.
// Uso: node tools/i18n-build.mjs   (después de cambiar textos o la tabla)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HTML = path.join(ROOT, "index.html");

// [clave, español exacto (innerHTML), inglés, francés, catalán]
const T = [
  ["skip", "Saltar al contenido", "Skip to content", "Aller au contenu", "Salta al contingut"],
  ["nav.hours", "Horario", "Hours", "Horaires", "Horari"],
  ["nav.services", "Servicios", "Services", "Services", "Serveis"],
  ["nav.work", "Trabajos", "Our work", "Nos coupes", "Treballs"],
  ["nav.about", "Nosotros", "About us", "Qui sommes-nous", "Nosaltres"],
  ["nav.reviews", "Opiniones", "Reviews", "Avis", "Opinions"],
  ["nav.where", "Dónde", "Find us", "Nous trouver", "On som"],
  ["cta.wa", "Reserva por WhatsApp", "Book on WhatsApp", "Réserver sur WhatsApp", "Reserva per WhatsApp"],
  ["nav.menu", "Menú", "Menu", "Menu", "Menú"],
  ["day.1", "Lunes", "Monday", "Lundi", "Dilluns"],
  ["day.2", "Martes", "Tuesday", "Mardi", "Dimarts"],
  ["day.3", "Miércoles", "Wednesday", "Mercredi", "Dimecres"],
  ["day.4", "Jueves", "Thursday", "Jeudi", "Dijous"],
  ["day.5", "Viernes", "Friday", "Vendredi", "Divendres"],
  ["day.6", "Sábado", "Saturday", "Samedi", "Dissabte"],
  ["day.0", "Domingo", "Sunday", "Dimanche", "Diumenge"],
  ["closed", "Cerrado", "Closed", "Fermé", "Tancat"],
  ["hours.note", "Para asegurar tu hora, escríbenos antes por WhatsApp.", "To make sure you get your slot, message us on WhatsApp first.", "Pour être sûr d'avoir votre créneau, écrivez-nous d'abord sur WhatsApp.", "Per assegurar la teva hora, escriu-nos abans per WhatsApp."],
  ["ribbon", "Barbería en Lloret de Mar", "Barbershop in Lloret de Mar", "Barbier à Lloret de Mar", "Barberia a Lloret de Mar"],
  ["btn.call", "Llamar", "Call", "Appeler", "Trucar"],
  ["book.title", "Reserva", "Book", "Réserver", "Reserva"],
  ["book.label", "Para tu cita, llámanos", "To book, give us a call", "Pour un rendez-vous, appelez-nous", "Per a la teva cita, truca'ns"],
  ["book.shop", "Teléfono del local:", "Shop phone:", "Téléphone du salon :", "Telèfon del local:"],
  ["where", "Dónde", "Where", "Où", "On"],
  ["directions", "Cómo llegar", "Get directions", "Itinéraire", "Com arribar-hi"],
  ["rating", "120 reseñas en Google", "120 reviews on Google", "120 avis sur Google", "120 ressenyes a Google"],
  ["cut.here", "corta por aquí", "cut here", "découpez ici", "retalla per aquí"],
  ["services.title", "Servicios", "Services", "Services", "Serveis"],
  ["services.label", "Tijera, máquina y navaja. El tiempo que haga falta.", "Scissors, clippers and razor. As long as it takes.", "Ciseaux, tondeuse et rasoir. Le temps qu'il faut.", "Tisora, màquina i navalla. El temps que calgui."],
  ["services.intro", "Hacemos todo lo que tenga que ver con el pelo. Si buscas algo que no ves aquí, pregunta: si es de peluquería, lo hacemos.", "We do everything to do with hair. Looking for something you can't see here? Ask: if it's hairdressing, we do it.", "Nous faisons tout ce qui touche aux cheveux. Vous cherchez quelque chose qui n'est pas ici ? Demandez : si c'est de la coiffure, on le fait.", "Fem tot el que tingui a veure amb el cabell. Si busques alguna cosa que no veus aquí, pregunta: si és de perruqueria, ho fem."],
  ["grp.cut", "Corte", "Haircuts", "Coupes", "Tall"],
  ["s.scissor", "Corte a tijera", "Scissor cut", "Coupe aux ciseaux", "Tall amb tisora"],
  ["s.scissor.d", "Largo, medio o clásico, trabajado a tijera de principio a fin.", "Long, medium or classic, scissors from start to finish.", "Long, mi-long ou classique, aux ciseaux du début à la fin.", "Llarg, mitjà o clàssic, treballat amb tisora de principi a fi."],
  ["s.clipper", "Corte a máquina", "Clipper cut", "Coupe à la tondeuse", "Tall amb màquina"],
  ["s.clipper.d", "Rapado o a un número, parejo y con los contornos limpios.", "Buzz cut or a single guard, even, with clean edges.", "Rasé ou à un seul sabot, régulier, avec des contours nets.", "Rapat o a un número, uniforme i amb els contorns nets."],
  ["s.fade", 'Degradados <a class="tag tag--link" href="#guia">ver guía</a>', 'Fades <a class="tag tag--link" href="#guia">see guide</a>', 'Dégradés <a class="tag tag--link" href="#guia">voir le guide</a>', 'Degradats <a class="tag tag--link" href="#guia">veure guia</a>'],
  ["s.fade.d", "Bajo, medio o alto, desde piel o desde el 0,5. El de la casa.", "Low, mid or high, from skin or from a 0.5. Our speciality.", "Bas, moyen ou haut, à blanc ou dès le 0,5. La spécialité de la maison.", "Baix, mitjà o alt, des de pell o des del 0,5. El de la casa."],
  ["s.wash", "Lavado y peinado", "Wash and style", "Shampoing et coiffage", "Rentat i pentinat"],
  ["s.wash.d", "Para salir listo, con el producto que mejor va a tu pelo.", "Walk out ready, with the product that suits your hair.", "Pour repartir prêt, avec le produit adapté à vos cheveux.", "Per sortir a punt, amb el producte que millor va al teu cabell."],
  ["grp.beard", "Barba", "Beard", "Barbe", "Barba"],
  ["s.beard", "Arreglo de barba", "Beard trim", "Taille de barbe", "Arranjament de barba"],
  ["s.beard.d", "Recorte, forma y volumen a tu medida.", "Trim, shape and volume to suit you.", "Taille, forme et volume sur mesure.", "Retall, forma i volum a la teva mida."],
  ["s.lineup", "Perfilado a navaja", "Razor line-up", "Contours au rasoir", "Perfilat amb navalla"],
  ["s.lineup.d", "Mejillas y cuello definidos, con la línea bien marcada.", "Crisp cheek and neck lines.", "Joues et cou bien dessinés, avec une ligne nette.", "Galtes i coll definits, amb la línia ben marcada."],
  ["s.shave", "Afeitado clásico", "Classic shave", "Rasage classique", "Afaitat clàssic"],
  ["s.shave.d", "A navaja y con espuma, como se ha hecho siempre.", "Razor and lather, the way it has always been done.", "Au rasoir et à la mousse, comme toujours.", "Amb navalla i escuma, com s'ha fet sempre."],
  ["s.combo", "Corte y barba", "Cut and beard", "Coupe et barbe", "Tall i barba"],
  ["s.combo.d", "El servicio completo en una sola visita.", "The full service in a single visit.", "Le service complet en une seule visite.", "El servei complet en una sola visita."],
  ["grp.kids", "Niños", "Kids", "Enfants", "Nens"],
  ["s.kids", "Corte infantil", "Kids' cut", "Coupe enfant", "Tall infantil"],
  ["s.kids.d", "Con calma y buen trato. Las familias lo repiten en las reseñas.", "Patient and friendly. Families say so in the reviews.", "Avec calme et gentillesse. Les familles le disent dans les avis.", "Amb calma i bon tracte. Les famílies ho repeteixen a les ressenyes."],
  ["s.spray", 'Color en spray <span class="tag tag--stamp">se va al lavar</span>', 'Colour spray <span class="tag tag--stamp">washes out</span>', 'Couleur en spray <span class="tag tag--stamp">part au lavage</span>', 'Color en esprai <span class="tag tag--stamp">marxa en rentar</span>'],
  ["s.spray.d", "Colores para el pelo que desaparecen con el primer lavado.", "Hair colours that disappear with the first wash.", "Des couleurs qui partent au premier shampoing.", "Colors per al cabell que desapareixen amb el primer rentat."],
  ["grp.designs", "Diseños", "Designs", "Motifs", "Dissenys"],
  ["s.lines", "Rayas y líneas", "Parts and lines", "Raies et traits", "Ratlles i línies"],
  ["s.lines.d", "Una raya limpia al lado o varias, marcadas a cuchilla.", "One clean part on the side or several, cut with a blade.", "Une raie nette sur le côté ou plusieurs, tracées à la lame.", "Una ratlla neta al costat o diverses, marcades amb fulla."],
  ["s.custom", "Dibujos a medida", "Custom designs", "Dessins sur mesure", "Dibuixos a mida"],
  ["s.custom.d", "Tráenos la idea o una foto y lo pasamos al pelo.", "Bring us the idea or a photo and we'll put it in your hair.", "Apportez l'idée ou une photo et on la dessine dans vos cheveux.", "Porta'ns la idea o una foto i la passem al cabell."],
  ["from", "desde", "from", "dès", "des de"],
  ["fade.title", "¿Bajo, medio o alto?", "Low, mid or high?", "Bas, moyen ou haut ?", "Baix, mitjà o alt?"],
  ["fade.intro", "Un degradado se define por la altura a la que empieza a subir. Toca uno y mira dónde nace.", "A fade is defined by how high it starts. Tap one and see where it begins.", "Un dégradé se définit par la hauteur où il commence. Touchez-en un et regardez où il naît.", "Un degradat es defineix per l'alçada on comença a pujar. Toca'n un i mira on neix."],
  ["fade.low", "Bajo", "Low", "Bas", "Baix"],
  ["fade.mid", "Medio", "Mid", "Moyen", "Mitjà"],
  ["fade.high", "Alto", "High", "Haut", "Alt"],
  ["fade.low.d", "Nace justo encima de la oreja y en la nuca. Discreto y fácil de llevar.", "Starts just above the ear and at the nape. Subtle and easy to wear.", "Commence juste au-dessus de l'oreille et à la nuque. Discret et facile à porter.", "Neix just damunt de l'orella i al clatell. Discret i fàcil de portar."],
  ["fade.mid.d", "Empieza a la altura de la sien. El punto medio entre limpio y marcado.", "Starts at the temple. The middle ground between clean and bold.", "Commence à hauteur de la tempe. Le juste milieu entre net et marqué.", "Comença a l'alçada del pols. El punt mitjà entre net i marcat."],
  ["fade.high.d", "Sube casi hasta la coronilla. Mucho contraste con el largo de arriba.", "Goes almost up to the crown. Strong contrast with the length on top.", "Monte presque jusqu'au sommet du crâne. Fort contraste avec la longueur du dessus.", "Puja gairebé fins a la coroneta. Molt contrast amb el llarg de dalt."],
  ["fade.note", "Cualquiera de los tres puede salir desde piel, a cuchilla, o desde el 0,5. En la silla te aconsejamos.", "Any of the three can start from skin with a blade, or from a 0.5. We'll advise you in the chair.", "Les trois peuvent partir à blanc à la lame, ou dès le 0,5. On vous conseille au fauteuil.", "Qualsevol dels tres pot sortir des de pell, amb fulla, o des del 0,5. A la cadira t'aconsellem."],
  ["scale.scissors", "Tijera", "Scissors", "Ciseaux", "Tisora"],
  ["scale.skin", "Piel", "Skin", "Peau", "Pell"],
  ["fade.starts", "aquí empieza", "starts here", "commence ici", "comença aquí"],
  ["fade.caption", "Nuca abajo, coronilla arriba", "Nape at the bottom, crown at the top", "Nuque en bas, sommet en haut", "Clatell a baix, coroneta a dalt"],
  ["menu.doubt", "¿Dudas con algún servicio?", "Questions about a service?", "Une question sur un service ?", "Dubtes amb algun servei?"],
  ["menu.ask", "Pregúntanos por WhatsApp", "Ask us on WhatsApp", "Demandez-nous sur WhatsApp", "Pregunta'ns per WhatsApp"],
  ["work.title", "Recién salidos de la silla", "Fresh out of the chair", "Tout juste sortis du fauteuil", "Acabats de sortir de la cadira"],
  ["work.intro", "Cortes hechos en Momo's. Cada semana suben más a Instagram y TikTok.", "Cuts done at Momo's. More go up on Instagram and TikTok every week.", "Des coupes faites chez Momo's. Il y en a de nouvelles chaque semaine sur Instagram et TikTok.", "Talls fets a Momo's. Cada setmana en pugen més a Instagram i TikTok."],
  ["cap.fade", "Degradado y contorno", "Fade and line-up", "Dégradé et contours", "Degradat i contorn"],
  ["cap.part", "Degradado con raya", "Fade with a part", "Dégradé avec raie", "Degradat amb ratlla"],
  ["cap.spray", "Color en spray, se va al lavar", "Colour spray, washes out", "Couleur en spray, part au lavage", "Color en esprai, marxa en rentar"],
  ["cap.design", "Color y dibujo a cuchilla", "Colour and blade design", "Couleur et dessin à la lame", "Color i dibuix amb fulla"],
  ["cap.mid", "Degradado medio", "Mid fade", "Dégradé moyen", "Degradat mitjà"],
  ["cap.little", "Los peques, con calma", "Little ones, no rush", "Les petits, en douceur", "Els petits, amb calma"],
  ["cap.nape", "Nuca limpia", "Clean nape", "Nuque nette", "Clatell net"],
  ["cap.chair", "En la silla", "In the chair", "Au fauteuil", "A la cadira"],
  ["reels.title", "Así se trabaja aquí", "How we work", "Comme ça se passe ici", "Així es treballa aquí"],
  ["reels.intro", "Vídeos de su Instagram, tal cual.", "Straight from our Instagram.", "Directement de notre Instagram.", "Vídeos del seu Instagram, tal qual."],
  ["reel.door", "De la puerta al sillón", "From the door to the chair", "De la porte au fauteuil", "De la porta a la butaca"],
  ["reel.shop", "El local por dentro", "Inside the shop", "Le salon de l'intérieur", "El local per dins"],
  ["reel.day", "Un día en Momo's", "A day at Momo's", "Une journée chez Momo's", "Un dia a Momo's"],
  ["about.title", "Dos hermanos, todo el detalle.", "Two brothers, every detail.", "Deux frères, le souci du détail.", "Dos germans, tot el detall."],
  ["about.p1", "Momo's lo llevan Moha y Wassim. Antes de coger la máquina te preguntan qué quieres y escuchan la respuesta. Después llega lo que se nota: la nuca limpia, el contorno de la barba, un degradado sin saltos.", "Momo's is run by Moha and Wassim. Before they pick up the clippers they ask what you want and listen to the answer. Then comes what shows: a clean nape, a sharp beard line, a fade with no steps.", "Momo's est tenu par Moha et Wassim. Avant de prendre la tondeuse, ils vous demandent ce que vous voulez et écoutent la réponse. Ensuite vient ce qui se voit : une nuque nette, une barbe bien dessinée, un dégradé sans marches.", "Momo's el porten en Moha i en Wassim. Abans d'agafar la màquina et pregunten què vols i escolten la resposta. Després arriba el que es nota: el clatell net, el contorn de la barba, un degradat sense salts."],
  ["about.p2", "El local lo montaron a su manera, con suelo de mármol negro, luces hexagonales en el techo y sillones de cuero. Vienen vecinos de Lloret, gente que pasa aquí sus vacaciones y muchas familias con niños.", "They fitted out the shop their own way: black marble floor, hexagonal lights on the ceiling and leather chairs. Locals from Lloret come in, so do people on holiday here and lots of families with kids.", "Ils ont aménagé le salon à leur façon : sol en marbre noir, lumières hexagonales au plafond et fauteuils en cuir. On y croise des habitants de Lloret, des vacanciers et beaucoup de familles avec enfants.", "Van muntar el local a la seva manera, amb terra de marbre negre, llums hexagonals al sostre i butaques de pell. Hi vénen veïns de Lloret, gent que hi passa les vacances i moltes famílies amb nens."],
  ["about.sign", "Pasa, siéntate. Del resto nos encargamos nosotros.", "Come in, take a seat. We'll take care of the rest.", "Entrez, asseyez-vous. On s'occupe du reste.", "Passa, seu. De la resta ens n'encarreguem nosaltres."],
  ["reviews.title", "Lo dicen ellos.", "In their words.", "Ce qu'ils en disent.", "Ho diuen ells."],
  ["reviews.all", "Leer todas en Google", "Read them all on Google", "Lire tous les avis sur Google", "Llegeix-les totes a Google"],
  ["review.src", "Reseña en Google", "Google review", "Avis Google", "Ressenya a Google"],
  ["review.leave", "Déjanos tu reseña", "Leave us a review", "Laissez-nous un avis", "Deixa'ns la teva ressenya"],
  ["review.scan", "Escanea para dejar tu reseña en Google", "Scan to review us on Google", "Scannez pour laisser un avis sur Google", "Escaneja per deixar la teva ressenya a Google"],
  ["closing.title", "Pide tu hora.", "Book your slot.", "Prenez rendez-vous.", "Demana hora."],
  ["fact.week", "Lunes a viernes 9:30 - 21:00", "Monday to Friday 9:30 - 21:00", "Du lundi au vendredi 9:30 - 21:00", "De dilluns a divendres 9:30 - 21:00"],
  ["fact.sat", "Sábado 9:00 - 21:00", "Saturday 9:00 - 21:00", "Samedi 9:00 - 21:00", "Dissabte 9:00 - 21:00"],
  ["fact.sun", "Domingo cerrado", "Closed on Sunday", "Fermé le dimanche", "Diumenge tancat"],
  ["fact.pay", "Efectivo y tarjeta", "Cash and card", "Espèces et carte", "Efectiu i targeta"],
  ["btn.callshop", "Llamar al local", "Call the shop", "Appeler le salon", "Truca al local"],
  ["map.hint", "Busca este escaparate.", "Look for this shopfront.", "Cherchez cette vitrine.", "Busca aquest aparador."],
  ["map.load", "Ver en el mapa", "Show on map", "Voir sur la carte", "Veure al mapa"],
  ["foot.tag", "<strong>Momo's Barbershop</strong><br>Barbería masculina en Lloret de Mar", "<strong>Momo's Barbershop</strong><br>Men's barbershop in Lloret de Mar", "<strong>Momo's Barbershop</strong><br>Barbier pour hommes à Lloret de Mar", "<strong>Momo's Barbershop</strong><br>Barberia masculina a Lloret de Mar"],
  ["foot.video", "Vídeo de portada: Pexels.", "Cover video: Pexels.", "Vidéo d'accueil : Pexels.", "Vídeo de portada: Pexels."],
];

// Textos que genera main.js (estado en vivo, vídeo, WhatsApp) y metadatos
const DYN = {
  es: { openNow: "Abierto ahora", lastSlots: "Últimos turnos", until: "Hasta las {t}", tOpen: "Abierto ahora, hasta las {t}", tLast: "Abierto, cerramos a las {t}", opensAt: "Abrimos a las {t}", todayDay: "Hoy, {d}", tBefore: "Hoy abrimos a las {t}", closedNow: "Cerrado ahora", opensWhen: "Abrimos {w} a las {t}", tClosed: "Cerrado. Abrimos {w} a las {t}", tomorrow: "mañana", onDay: "el {d}", today: "Hoy", pause: "Pausar vídeo", play: "Reproducir vídeo", waBook: "Hola, quería pedir hora en Momo's.", waAsk: "Hola, tenía una duda sobre un servicio.", days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"], title: "Momo's Barbershop | Barbería en Lloret de Mar", desc: "Barbería masculina en Lloret de Mar. Corte, degradados, barba y afeitado, cortes para niños y diseños. Lunes a sábado. Reserva por WhatsApp o llamando al 675 23 64 96.", lang: "Idioma" },
  en: { openNow: "Open now", lastSlots: "Last slots", until: "Until {t}", tOpen: "Open now, until {t}", tLast: "Open, closing at {t}", opensAt: "Opening at {t}", todayDay: "Today, {d}", tBefore: "Today we open at {t}", closedNow: "Closed now", opensWhen: "Open {w} at {t}", tClosed: "Closed. Open {w} at {t}", tomorrow: "tomorrow", onDay: "on {d}", today: "Today", pause: "Pause video", play: "Play video", waBook: "Hi, I'd like to book an appointment at Momo's.", waAsk: "Hi, I have a question about a service.", days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], title: "Momo's Barbershop | Barbershop in Lloret de Mar", desc: "Men's barbershop in Lloret de Mar. Haircuts, fades, beard trims and shaves, kids' cuts and designs. Monday to Saturday. Book on WhatsApp or call +34 675 23 64 96.", lang: "Language" },
  fr: { openNow: "Ouvert", lastSlots: "Dernières places", until: "Jusqu'à {t}", tOpen: "Ouvert jusqu'à {t}", tLast: "Ouvert, fermeture à {t}", opensAt: "Ouverture à {t}", todayDay: "Aujourd'hui, {d}", tBefore: "Aujourd'hui, ouverture à {t}", closedNow: "Fermé", opensWhen: "Réouverture {w} à {t}", tClosed: "Fermé. Réouverture {w} à {t}", tomorrow: "demain", onDay: "{d}", today: "Auj.", pause: "Mettre la vidéo en pause", play: "Lire la vidéo", waBook: "Bonjour, je voudrais prendre rendez-vous chez Momo's.", waAsk: "Bonjour, j'ai une question sur un service.", days: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"], title: "Momo's Barbershop | Barbier à Lloret de Mar", desc: "Barbier pour hommes à Lloret de Mar. Coupes, dégradés, barbe et rasage, coupes enfant et motifs. Du lundi au samedi. Réservez sur WhatsApp ou au +34 675 23 64 96.", lang: "Langue" },
  ca: { openNow: "Obert ara", lastSlots: "Últims torns", until: "Fins a les {t}", tOpen: "Obert ara, fins a les {t}", tLast: "Obert, tanquem a les {t}", opensAt: "Obrim a les {t}", todayDay: "Avui, {d}", tBefore: "Avui obrim a les {t}", closedNow: "Tancat ara", opensWhen: "Obrim {w} a les {t}", tClosed: "Tancat. Obrim {w} a les {t}", tomorrow: "demà", onDay: "el {d}", today: "Avui", pause: "Pausa el vídeo", play: "Reprodueix el vídeo", waBook: "Hola, voldria demanar hora a Momo's.", waAsk: "Hola, tenia un dubte sobre un servei.", days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"], title: "Momo's Barbershop | Barberia a Lloret de Mar", desc: "Barberia masculina a Lloret de Mar. Talls, degradats, barba i afaitat, talls per a nens i dissenys. De dilluns a dissabte. Reserva per WhatsApp o trucant al 675 23 64 96.", lang: "Idioma" },
};

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let html = fs.readFileSync(HTML, "utf8");
const missing = [];
for (const [key, es] of T) {
  const re = new RegExp("<([a-z0-9]+)((?:\\s(?![^>]*data-i18n=)[^>]*)?)>" + esc(es) + "</\\1>", "g");
  let n = 0;
  html = html.replace(re, (m, tag, attrs) => { n++; return `<${tag}${attrs} data-i18n="${key}">${es}</${tag}>`; });
  const already = html.includes(`data-i18n="${key}"`);
  if (!n && !already) missing.push(key);
}
fs.writeFileSync(HTML, html);

const dict = { en: {}, fr: {}, ca: {} };
for (const [key, , en, fr, ca] of T) { dict.en[key] = en; dict.fr[key] = fr; dict.ca[key] = ca; }
const out = `/* MOMO'S BARBERSHOP · traducciones (generado por tools/i18n-build.mjs, no editar a mano) */
(function () {
  "use strict";
  window.__I18N__ = ${JSON.stringify({ text: dict, dyn: DYN }, null, 1)};
})();
`;
fs.writeFileSync(path.join(ROOT, "i18n.js"), out);
console.log("keys", T.length, "missing", missing);
