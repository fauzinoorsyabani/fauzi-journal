/**
 * Style guide: Editorial Noir / Premium Web3 Gallery.
 * Content is structured as gallery labels: precise, human, and image-led.
 */
export type StoryChapter = {
  type: "copy" | "image" | "quote" | "split";
  eyebrow?: string;
  heading?: string;
  body?: string[];
  quote?: string;
  attribution?: string;
  image?: string;
  alt?: string;
  caption?: string;
  side?: "left" | "right";
};

export type Story = {
  slug: string;
  index: string;
  category: string;
  title: string;
  cardTitle?: string;
  deck: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  alt: string;
  imagePosition?: string;
  accent: string;
  impact: string;
  chapters: StoryChapter[];
  richContentJson?: string | null;
};

export const stories: Story[] = [
  {
    slug: "the-quiet-shift",
    index: "01",
    category: "Impact",
    title: "The quiet shift begins before the sun arrives.",
    cardTitle: "The quiet shift",
    deck: "At the edge of the salt flats, a small group is turning local knowledge into a shared language for what comes next.",
    date: "Jun 06, 2026",
    readTime: "08 min read",
    author: "Mara Liang",
    image: "/manus-storage/lensstories-hero_12cce36a.jpg",
    alt: "A lone figure in a dark coat standing on a pale salt flat at dawn.",
    imagePosition: "center",
    accent: "Field report / 04.26",
    impact: "18 months of listening, mapping, and returning to the same horizon.",
    chapters: [
      {
        type: "copy",
        eyebrow: "A practice of return",
        heading: "The future is rarely announced. It is rehearsed.",
        body: [
          "Before the first meetings, there were long walks. Before the first plan, there were conversations that had nowhere to go except further. The work began by choosing to return—again and again—to the people who already knew the landscape.",
          "What emerged was not a program waiting to be launched. It was a shared method: listening, making, testing, and leaving enough space for the next voice to alter the frame.",
        ],
      },
      {
        type: "image",
        image: "/manus-storage/lensstories-impact_64901fa7.jpg",
        alt: "People sharing objects and papers around a workshop table.",
        caption: "A working table becomes a map when every hand is invited to mark it.",
      },
      {
        type: "quote",
        quote: "We were not there to arrive with an answer. We were there to notice what had already started moving.",
        attribution: "— Field note, early spring",
      },
      {
        type: "split",
        eyebrow: "The measure of care",
        heading: "Make the process visible, then make room for it to change.",
        body: [
          "The visible outcome carries a hidden archive of revisions: a changed route, an offered chair, a question asked after the recorder had been put away. Those details make the story credible because they make it human.",
          "LensStories follows the work at that scale. Not to make it look bigger, but to preserve the texture of how it became possible.",
        ],
        image: "/manus-storage/lensstories-bts_e0db8756.jpg",
        alt: "Night-time desk with contact sheets, camera, and warm desk lamp.",
        caption: "Contact sheets from a late review in the studio.",
        side: "right",
      },
    ],
  },
  {
    slug: "a-room-for-making",
    index: "02",
    category: "Culture",
    title: "A room for making, and the people who keep it open.",
    cardTitle: "A room for making",
    deck: "Inside the studio, material experiments become a quiet daily ritual of trust, critique, and care.",
    date: "May 14, 2026",
    readTime: "06 min read",
    author: "Amos Reid",
    image: "/manus-storage/lensstories-people_497231a3.jpg",
    alt: "Artists collaborating over materials in a warm, shadowed atelier.",
    imagePosition: "center",
    accent: "Studio journal / 03.26",
    impact: "The best culture is not announced. It is practiced at the worktable.",
    chapters: [
      {
        type: "copy",
        eyebrow: "Inside the studio",
        heading: "A shared table is a way of thinking.",
        body: [
          "There is a moment before a material finds its use when it is simply a proposition. On the worktable, that proposition passes through many hands and comes back altered.",
          "The studio keeps that exchange deliberately visible. Notes stay on the wall. Samples remain within reach. A first instinct is not mistaken for a final answer.",
        ],
      },
      {
        type: "image",
        image: "/manus-storage/lensstories-bts_e0db8756.jpg",
        alt: "A contact sheet and analog camera lit by a small desk lamp.",
        caption: "The archive is part of the practice, not a record made afterward.",
      },
      {
        type: "quote",
        quote: "We make space for the unfinished because it is where the next useful question appears.",
        attribution: "— Studio conversation",
      },
    ],
  },
  {
    slug: "the-listening-table",
    index: "03",
    category: "People",
    title: "The listening table: where a hundred small observations begin to connect.",
    cardTitle: "The listening table",
    deck: "A series of gatherings asks what happens when community expertise is treated as a material, not a metric.",
    date: "Apr 29, 2026",
    readTime: "07 min read",
    author: "Nia Wells",
    image: "/manus-storage/lensstories-impact_64901fa7.jpg",
    alt: "Community members sharing objects around a long table near an open doorway.",
    imagePosition: "center",
    accent: "People / 02.26",
    impact: "Every object on the table carries a way of seeing the work differently.",
    chapters: [
      {
        type: "copy",
        eyebrow: "People before process",
        heading: "A question becomes clearer when it changes hands.",
        body: [
          "The listening table is a recurring invitation rather than a single event. Its power is in the continuity: one person remembers where the previous conversation stopped, while another proposes an entirely new place to begin.",
          "The record is made in fragments—annotations, tools left on the table, a photograph of an idea before it is named. Together they form a more useful picture than a summary ever could.",
        ],
      },
      {
        type: "split",
        eyebrow: "Field note",
        heading: "Participation is a design material.",
        body: [
          "When people can see their contribution change the direction of the work, care becomes tangible. The point is not consensus. The point is a frame wide enough to hold contradiction without losing momentum.",
        ],
        image: "/manus-storage/lensstories-hero_12cce36a.jpg",
        alt: "A figure on a pale open landscape at dawn.",
        caption: "A pause before the gathering begins.",
        side: "left",
      },
    ],
  },
  {
    slug: "notes-from-the-edge",
    index: "04",
    category: "Field Notes",
    title: "Notes from the edge of a map still being drawn.",
    cardTitle: "Notes from the edge",
    deck: "A field journal from the spaces where research moves at the speed of weather, trust, and return visits.",
    date: "Mar 17, 2026",
    readTime: "05 min read",
    author: "Elio Chen",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85",
    alt: "Moody aerial view of a mountain valley covered in mist.",
    imagePosition: "center",
    accent: "Field notes / 01.26",
    impact: "Fieldwork asks the same thing each day: what did you notice that was easy to miss?",
    chapters: [
      {
        type: "copy",
        eyebrow: "A moving horizon",
        heading: "The map changes when you walk it slowly.",
        body: [
          "A landscape does not reveal itself all at once. Every return adjusts the scale, altering what feels near, what feels possible, and what is still left outside the frame.",
          "These notes are an argument for staying with that uncertainty long enough for a more honest story to surface.",
        ],
      },
      {
        type: "quote",
        quote: "A field note is not proof. It is a promise to look again.",
        attribution: "— From the notebook",
      },
    ],
  },
  {
    slug: "the-language-of-touch",
    index: "05",
    category: "Craft",
    title: "The language of touch lives in every deliberate surface.",
    cardTitle: "The language of touch",
    deck: "A closer look at how material decisions hold memory, labour, and a more generous definition of finish.",
    date: "Feb 08, 2026",
    readTime: "09 min read",
    author: "Iris Navarro",
    image: "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1400&q=85",
    alt: "Close-up of hands working with tactile natural materials.",
    imagePosition: "center",
    accent: "Material study / 12.25",
    impact: "Material memory is not a surface effect. It is the record of every decision made with care.",
    chapters: [
      {
        type: "copy",
        eyebrow: "Material study",
        heading: "A finish should carry evidence of the hands that made it.",
        body: [
          "The language of touch is an accumulation of tiny choices: which edge stays soft, which mark remains visible, which surface asks you to slow down. These choices are often invisible in a specification, but impossible to miss in use.",
          "Craft becomes a way of making attention transferable—from the maker, to the object, to the person who encounters it later.",
        ],
      },
    ],
  },
  {
    slug: "a-different-kind-of-signal",
    index: "06",
    category: "Future",
    title: "A different kind of signal: build slowly, share early.",
    cardTitle: "A different kind of signal",
    deck: "An experiment in making ambitious work more legible while it is still taking shape.",
    date: "Jan 19, 2026",
    readTime: "04 min read",
    author: "Sora Akin",
    image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=1400&q=85",
    alt: "An atmospheric modern creative workspace with a tactile, low-lit editorial mood.",
    imagePosition: "center",
    accent: "Signal / 11.25",
    impact: "The future becomes more useful when its draft is allowed to be seen.",
    chapters: [
      {
        type: "copy",
        eyebrow: "Signal, not spectacle",
        heading: "Make room for a future that has not finished explaining itself.",
        body: [
          "New work often arrives under the pressure to look resolved. This experiment chose a different posture: share the questions, show the tests, and leave the edges visible.",
          "The result is not a polished prediction. It is a better invitation to participate in what comes next.",
        ],
      },
    ],
  },
];

export function getStory(slug: string) {
  return stories.find((story) => story.slug === slug);
}
