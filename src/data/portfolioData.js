// Central content file — edit here to update the whole site.

export const personal = {
  name: "Nixon D",
  role: "Video Editor",
  tagline: "I cut stories that hold attention — cinematic edits, sharp pacing, clean color.",
  location: "Coimbatore, India",
  phone: "8870997770",
  email: "nixon.donbosco15@gmail.com",
  driveLink:
    "https://drive.google.com/drive/folders/1eEHF6uI5jggXAQh8GE2qu3VN0hsEmTD8",
  resumeFile: "/resume/Nixon_D_Resume.pdf",
  resumeName: "Nixon_D_Resume.pdf",
};

export const summary =
  "Video editor with hands-on experience creating client, event, promotional, devotional, and social media videos. Skilled in DaVinci Resolve and CapCut, with experience editing both short-form and long-form content based on project requirements. Comfortable with different editing styles, including transitions, visual effects, slow-motion effects, text overlays, subtitles, and basic color correction.";

// Animated counters on the Skills section
export const skills = [
  { label: "Cinematic Video Editing", value: 90 },
  { label: "Transitions & Visual Effects", value: 88 },
  { label: "Slow-Motion Effects", value: 85 },
  { label: "Basic Color Correction & Grading", value: 80 },
  { label: "Video Pacing & Storytelling", value: 92 },
  { label: "Audio & Music Synchronization", value: 85 },
];

export const tools = {
  desktop: [
    {
      name: "DaVinci Resolve",
      icon: "davinci",
      use: "Primary editor for cuts, color correction & grading, and long-form timelines.",
    },
    {
      name: "CapCut Desktop",
      icon: "capcut",
      use: "Fast turnarounds — transitions, text overlays, subtitles, and social exports.",
    },
  ],
  mobile: [
    {
      name: "Alight Motion",
      icon: "alight",
      use: "On-the-go motion graphics, text animation, and quick effect work.",
    },
    {
      name: "VN Video Editor",
      icon: "vn",
      use: "Mobile edits for Reels and short-form content when away from the desk.",
    },
  ],
};

export const experience = [
  {
    title: "Promotional Video Editing",
    points: [
      "Edited promotional videos for clients to showcase their businesses, services, and offerings.",
      "Created engaging promotional content for social media using visuals, text, music, and effects.",
    ],
  },
  {
    title: "Client & Event Video Editing",
    points: [
      "Edited private function and event videos based on client requirements and content format.",
      "Edited college event videos for social media based on event requirements and content needs.",
      "Edited both long-form and short-form videos depending on project requirements.",
    ],
  },
  {
    title: "Devotional Video Editing",
    points: [
      "Edited church feast and devotional videos for social media and event presentations.",
      "Combined devotional content with cinematic editing techniques and effects to create engaging video presentations.",
    ],
  },
  {
    title: "Social Media & Cinematic Edits",
    points: [
      "Created short-form and cinematic-style edits for Instagram and social media.",
      "Created cinematic intro videos and experimented with different editing styles, transitions, effects, and slow-motion effects.",
    ],
  },
];

export const strengths = [
  "Comfortable understanding project requirements and adapting edits accordingly.",
  "Willing to learn new editing tools, techniques, and workflows.",
  "Able to manage multiple video styles and adapt editing approaches based on the content.",
  "Comfortable working independently and taking ownership of assigned editing tasks.",
];

// Portfolio reel — plays inline, one after another as the user scrolls.
export const projects = [
  {
    id: "cinematic-intro",
    title: "Cinematic Intro Reel",
    category: "Social Media & Cinematic Edits",
    description:
      "A cinematic-style intro edit experimenting with transitions, slow-motion, and mood-driven color grading.",
    src: "https://res.cloudinary.com/cjuucln6/video/upload/v1789281111/cinematic-intro.mp4",
  },
  {
    id: "onam-celebration",
    title: "Onam Celebration — Event Edit",
    category: "Client & Event Video Editing",
    description:
      "Highlight edit of a college Onam celebration, cut for social media pacing.",
    src: "https://res.cloudinary.com/cjuucln6/video/upload/v1789281432/onam-celebration.mp4",
  },
  {
    id: "college-event",
    title: "College Event Highlights",
    category: "Client & Event Video Editing",
    description:
      "Event highlight reel edited from raw festival footage for social media distribution.",
    src: "https://res.cloudinary.com/cjuucln6/video/upload/v1789714392/Alpha_feast_v1.mp4",
  },
  {
    id: "church-feast",
    title: "Church Feast — Devotional Edit",
    category: "Devotional Video Editing",
    description:
      "Devotional feast video combining cinematic techniques with traditional content for event presentation.",
    src: "https://res.cloudinary.com/cjuucln6/video/upload/v1789281432/church-feast.mp4",
  },
  {
    id: "pre-feast-promo",
    title: "Pre-Feast Promotional Video",
    category: "Promotional Video Editing",
    description:
      "Promotional teaser edited to build anticipation ahead of a devotional feast event.",
    src: "https://res.cloudinary.com/cjuucln6/video/upload/v1789281378/pre-feast-promo.mp4",
  },
];

export const socials = [
  { name: "Email", href: `mailto:${personal.email}`, icon: "mail" },
  { name: "Phone", href: `tel:${personal.phone}`, icon: "phone" },
  { name: "Google Drive", href: personal.driveLink, icon: "drive" },
];
