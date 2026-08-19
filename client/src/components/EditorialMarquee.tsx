/**
 * Style guide: Fauzi / Journal.
 * A paired signal strip keeps the archive in motion without introducing a disruptive carousel.
 */
const leftwardNotes = ["FIELD NOTES", "IMAGE STUDIES", "QUIET IMPACT", "THE WORK BENEATH", "FAUZI / JOURNAL"];
const rightwardNotes = ["RETURNING", "LISTENING", "MAKING", "LOOKING AGAIN", "STAYING WITH THE DETAIL"];

function Track({ notes, direction }: { notes: string[]; direction: "left" | "right" }) {
  const sequence = [...notes, ...notes, ...notes, ...notes];
  return (
    <div className="marquee-track" data-direction={direction} aria-hidden="true">
      {sequence.map((note, index) => <span key={`${note}-${index}`} className="marquee-item"><i />{note}</span>)}
    </div>
  );
}

export function EditorialMarquee() {
  return (
    <section className="border-y border-[#b78a58]/25 bg-[#0d0c0b] py-3 text-[#eee9e1]" aria-label="Editorial signals">
      <div className="marquee-shell">
        <Track notes={leftwardNotes} direction="left" />
      </div>
      <div className="marquee-shell mt-2 border-t border-white/5 pt-2 text-[#bda37d]">
        <Track notes={rightwardNotes} direction="right" />
      </div>
    </section>
  );
}
