<h1 align="center">Handwerker-Website</h1>

<p align="center">
  Eine komplette Website für einen Handwerksbetrieb —<br>
  ohne Framework, ohne Build-Schritt, ohne eine einzige externe Ressource.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Abhängigkeiten-keine-2ea44f" alt="Keine Abhängigkeiten">
  <img src="https://img.shields.io/badge/Build--Schritt-keiner-2ea44f" alt="Kein Build-Schritt">
  <img src="https://img.shields.io/badge/Cookies-keine-2ea44f" alt="Keine Cookies">
  <img src="https://img.shields.io/badge/Lizenz-MIT-0b1729" alt="MIT-Lizenz">
</p>

<p align="center">
  <a href="#schnellstart">Schnellstart</a> ·
  <a href="#warum-so-gebaut">Entwurfsentscheidungen</a> ·
  <a href="#für-ein-kundenprojekt-anpassen">Anpassen</a> ·
  <a href="#vor-dem-livegang">Vor dem Livegang</a>
</p>

---

Fünf Dateien, rund 75 KB, keine Abhängigkeiten. Hochladen und die Seite läuft.

Der gezeigte Betrieb ist erfunden. Ich habe das Projekt gebaut, um eine Vorlage zu
haben, die ich für echte Kunden nur noch umtexten und umfärben muss — und um zu
zeigen, wie ich an so eine Seite herangehe.

**➜ [Live ansehen](https://bilalmrc.github.io/handwerker-website/)**

## Schnellstart

```bash
git clone https://github.com/bilalmrc/handwerker-website.git
cd handwerker-website
```

`index.html` im Browser öffnen. Mehr braucht es nicht — kein npm, kein Server, kein
Build.

## Was drin ist

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite mit neun Abschnitten |
| `impressum.html` | Impressum, Vorlage mit markierten Platzhaltern |
| `datenschutz.html` | Datenschutzerklärung, Vorlage mit markierten Platzhaltern |
| `style.css` | Designsystem, Tokens im `:root`-Block |
| `app.js` | Scroll-Effekte und Interaktion |

**Auf der Seite:** Hero, Leistungsübersicht, Kennzahlen, Ablauf in vier Schritten,
Referenzgalerie, Kundenstimmen, FAQ, Kontaktbereich mit Formular.

**An Bewegung:** Scroll-Reveal mit Staffelung, hochzählende Kennzahlen, wachsender
Zeitstrahl, Laufband, Lichtschein auf Karten unter dem Mauszeiger, Lesefortschritt,
Header der beim Scrollen schmaler wird, animiertes FAQ. Alles in CSS und Vanilla-JS.

## Warum so gebaut

### Keine externen Ressourcen

Keine Google Fonts, kein CDN, kein Analytics, keine eingebettete Karte. Die Seite lädt
nichts von fremden Servern nach.

Das ist Risikovermeidung, keine Spielerei: Google Fonts ohne Einwilligung einzubinden
war in Deutschland Gegenstand von Abmahnwellen, weil dabei die IP-Adresse des Besuchers
an einen Drittserver geht. Ohne externe Ressourcen entfällt das Problem — und die
Seite braucht kein Cookie-Banner. Nebeneffekt: Nichts blockiert das Rendern.

### Kein Framework

Für eine Seite dieser Größe wäre React oder ein Static-Site-Generator reine
Selbstbeschäftigung. Kein Build heißt: Der Kunde kann in fünf Jahren noch eine
Telefonnummer ändern, ohne dass jemand erst eine Toolchain zum Laufen bringt. Bei
Handwerksbetrieben ist Wartbarkeit über zehn Jahre wichtiger als Entwicklungskomfort
heute.

### Telefon als Hauptziel

Bei Handwerksbetrieben kommt der Auftrag über den Anruf, nicht über ein Formular. Die
Nummer steht im Header, im Hero und ab dem Ende des Hero-Bereichs fest am unteren
Bildschirmrand, sobald jemand mit dem Handy draufgeht.

### Animationen, die nichts kaputt machen

Drei Dinge sind bewusst gelöst:

**Ohne JavaScript bleibt alles sichtbar.** Die Ausgangszustände der Einblendungen
greifen nur, wenn die Klasse `js` auf `<html>` gesetzt ist — das erledigt ein
Inline-Skript im `<head>`. Fällt JS aus, ist die Seite ganz normal lesbar.

**Es gibt ein Sicherheitsnetz.** Der `IntersectionObserver` ist der Normalfall,
zusätzlich prüft `sweep()` in `app.js` per Geometrie nach. Grund: Löst der Observer in
irgendeiner Umgebung nicht aus, bliebe der Inhalt dauerhaft auf `opacity: 0` —
unsichtbar, ohne Fehlermeldung. Das fällt beim Entwickeln nie auf, weil man selbst
immer scrollt. Lieber ohne Animation sichtbar als mit Animation unsichtbar.

**`prefers-reduced-motion` wird respektiert.** Wer im Betriebssystem Bewegung reduziert
hat — häufig wegen Migräne oder Schwindel —, bekommt die Inhalte sofort und ohne
Bewegung.

Zur Dosierung: Bei einem Handwerksbetrieb entscheidet nicht die Animation über den
Auftrag, sondern ob die Telefonnummer sofort ins Auge fällt. Die Effekte liegen
deshalb nie über den Kontaktwegen.

### Barrierefreiheit

Sichtbarer Fokusring auf allem Bedienbaren (`:focus-visible` statt `outline: none`),
Sprunglink zum Inhalt, semantisches HTML (`header`, `main`, `nav`, `ol` für den
Ablauf, `details`/`summary` für das FAQ), dekorative Grafiken mit `aria-hidden`,
Formularfelder mit echten `label`-Elementen.

## Für ein Kundenprojekt anpassen

1. Ordner kopieren und umbenennen.
2. `.demo-bar` löschen — in allen drei HTML-Dateien der Block oben.
3. `<meta name="robots" content="noindex, nofollow">` entfernen, sonst taucht die Seite
   nie bei Google auf.
4. Farben im `:root`-Block anpassen — Firmenfarbe auf `--brand-*`, kräftiger Kontrast
   auf `--accent`:

```css
:root {
  --brand-900: #060d18;
  --brand-800: #0b1729;
  --brand-700: #12243d;
  --brand-500: #1d4a7a;
  --accent:    #f0b429;
}
```

5. Texte ersetzen: Firmenname, Leistungen, Telefonnummer (auch in den `tel:`-Links),
   E-Mail, Adresse, Öffnungszeiten.
6. Rechtstexte ausfüllen — alle markierten Platzhalter in `impressum.html` und
   `datenschutz.html`.
7. Echte Fotos einbauen. Das ist der größte Unterschied zwischen „sieht nach Vorlage
   aus" und „sieht nach echtem Betrieb aus". Vorher auf max. 1600 px verkleinern und
   als WebP speichern.

## Vor dem Livegang

**Rechtstexte.** Impressum und Datenschutzerklärung sind Vorlagen, keine geprüften
Rechtstexte. Der Datenschutztext beschreibt exakt diese Seite: statisches HTML, keine
Cookies, kein Tracking, keine externen Dienste. Sobald etwas dazukommt — Google Maps,
YouTube, Analytics, Chat-Widget, Schrift von einem CDN — stimmt er nicht mehr, und es
wird eine Einwilligung *vor* dem Laden nötig. Für ein echtes Projekt lasse ich die
Texte vom Kunden prüfen; die Handwerkskammer bietet das ihren Mitgliedern oft
kostenlos an.

**Kundenstimmen.** Die Zitate auf der Seite sind als Platzhalter gekennzeichnet und
werden durch Bewertungen ersetzt, die tatsächlich abgegeben und zur Veröffentlichung
freigegeben wurden. Erfundene Bewertungen sind wettbewerbsrechtlich unzulässig.

**Kontaktformular.** Hat bewusst kein Ziel (`action="#"`). Ein Formular auf einer
statischen Seite braucht einen Empfangsweg, und das ist die eine Stelle, an der echte
Kundendaten fließen — die wähle ich bewusst, nicht per Copy-Paste. Entweder weglassen
und nur Telefon plus `mailto:` anbieten, ein PHP-Skript beim Hoster mit Spam-Schutz,
oder ein Formulardienst mit EU-Servern und AVV. Fällt das Formular weg, muss auch der
Formular-Abschnitt aus der Datenschutzerklärung raus.

**Hosting.** Ein einfaches Paket reicht, 3–10 € im Monat. Deutscher Anbieter macht die
DSGVO-Seite einfacher (AVV, Serverstandort). HTTPS aktivieren, bei allen gängigen
Anbietern per Klick über Let's Encrypt.

## Browser

Verwendet werden `grid`, `clamp()`, Custom Properties, `aspect-ratio`,
`backdrop-filter` und `IntersectionObserver` — alles in aktuellen Chrome-, Firefox-,
Safari- und Edge-Versionen verfügbar. Wo etwas fehlt, degradiert die Seite sichtbar,
aber funktional: `backdrop-filter` fällt auf eine deckende Fläche zurück, ein
fehlender `IntersectionObserver` zeigt alle Inhalte sofort ohne Animation.

## Lizenz

[MIT](LICENSE) — gerne als Grundlage für eigene Projekte verwenden.
