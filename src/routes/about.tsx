import { H1WithTitle, H2, Main, P, Section } from '~/components/Basics'

export default function About() {
  return (
    <>
      <H1WithTitle>About</H1WithTitle>
      <Section>
        <H2>Ziele des Projekts</H2>
        <P>
          Dieses Projekt möchte die Technologien erproben und einen kleinen Mehrwert schaffen. Es werden die Preise von
          diversen Shops eingetragen und damit vergleichbar gemacht.
        </P>
        <P>
          Wir wollen damit die für uns, und auch gerne andere, damit senken. Eine Anbindung an Einkaufslisten ist
          denkbar, eventuell eine direkte Bestellung bei Onlineshops.
        </P>
      </Section>
      <Section>
        <H2>Daten und Verarbeitung</H2>
        <P>
          Dieses Tool nutzt die Geoinformation in zweierlei Hinsicht. Beim Eintragen, wenn kein online Shop gewählt ist,
          werden die Daten an dem Preis gespeichert, in Hintergrund die Adresse ermittelt und damit festgestellt um
          welchen Shop es sich handelt. Mehr dazu in “Eigene Daten abrufen”.
        </P>
        <P>Die zweite Verwendung besteht darin während der Verwendung Filterung der Preise zu ermöglichen.</P>
      </Section>
      <Section>
        <H2>Technologien</H2>
        <ul>
          <li>Solid Start & SolidJS</li>

          <li>Trpc</li>

          <li>Tailwind</li>

          <li>Typescript</li>

          <li>Browser: location, vibrate</li>
        </ul>
      </Section>
      <Section>
        <H2>Eigene Daten abrufen</H2>

        <P>In Arbeit…</P>
      </Section>
    </>
  )
}
