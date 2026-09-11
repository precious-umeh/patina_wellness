import Image from "next/image";
import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";

function MeetOurFounder() {
  return (
    <Section>
      <Container>
        <div className="nav-desktop:grid-cols-2 nav-desktop:gap-12 grid grid-cols-1 items-center gap-8">
          {/* <div className="border-border nav-desktop:4/3 relative aspect-4/3 w-full overflow-hidden rounded-lg border shadow-md sm:aspect-16/10">
            <Image
              src="/Founder.jpeg"
              alt="Founder"
              fill
              sizes="(max-width: 1109px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-500 hover:scale-105"
            />
          </div> */}

          {/* <div className="border-border relative w-full overflow-hidden rounded-lg border shadow-md">
            <Image
              src="/Founder.jpeg"
              alt="Ifeanyi Anthony Okey-Umeh"
              width={1046}
              height={1280}
              className="w-full rounded-2xl object-cover"
            />
          </div> */}

          {/* <div className="border-border relative aspect-square overflow-hidden rounded-2xl border shadow-md"> */}
          <div className="border-border relative aspect-5/6 overflow-hidden rounded-2xl border shadow-md">
            <Image
              src="/Founder.jpeg"
              alt="Ifeanyi Anthony Okey-Umeh"
              fill
              className="object-cover object-top"
            />
          </div>

          <div>
            <SectionTitle eyebrow="Meet our Founder" />
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default MeetOurFounder;
