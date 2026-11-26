/**
 * Founder details — the bracketed values are placeholders.
 * Replace them with real roles, bios, skills and links before launch.
 * To add a photo, place it in /public/team/ and set `photo`.
 */
export type Founder = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  skills: string[];
  photo?: string;
  socials: { label: string; href: string }[];
};

export const founders: Founder[] = [
  {
    name: "Prajwal A Bhandagi",
    initials: "PB",
    role: "[Co-founder · Role placeholder]",
    bio: "[Short biography placeholder — add a few sentences about your background, what you focus on in projects and what you enjoy building.]",
    skills: ["[Skill / expertise]", "[Skill / expertise]", "[Skill / expertise]", "[Skill / expertise]"],
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
  {
    name: "Pratik P Gaonkar",
    initials: "PG",
    role: "[Co-founder · Role placeholder]",
    bio: "[Short biography placeholder — add a few sentences about your background, what you focus on in projects and what you enjoy building.]",
    skills: ["[Skill / expertise]", "[Skill / expertise]", "[Skill / expertise]", "[Skill / expertise]"],
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Instagram", href: "https://instagram.com/" },
    ],
  },
];
