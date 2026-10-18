export type CareSection = { title: string; items: string[] };

// Shared guidance for every oyster variety.
export const CARE: CareSection[] = [
  {
    title: 'Storage',
    items: [
      'Keep them in the fridge in a paper bag or the original packaging. A porous bag lets them breathe.',
      'Fresh clusters keep for up to about a week. Use the most delicate ones first.',
      'Store them away from strong smells such as raw onion or fish, because mushrooms absorb odours easily.',
      'Do not freeze them raw. Cook them first (a quick saute is enough), cool, then freeze for up to about a month.',
      'For long-term keeping, dry them and store them in an airtight container.',
    ],
  },
  {
    title: 'Cleaning',
    items: [
      'Brush off debris with your fingers or wipe with a damp paper towel.',
      'If they need more, rinse briefly under running water and pat dry straight away.',
      'Never soak them. They take up water quickly and lose flavour and texture.',
      'Check between the gills for small insects, and trim away any tough stem ends.',
    ],
  },
  {
    title: 'Cooking',
    items: [
      'Cook them briefly over high heat. They are done in about the time scrambled eggs take.',
      'Tear along the gills instead of slicing, so more edge browns and crisps.',
      'Saute, roast, grill or fry. Raw they have little flavour, so always cook them.',
      'Garlic, ginger, thyme, scallions and smoked paprika all go well with their mild taste.',
      'Season with salt near the end so they brown instead of steaming.',
    ],
  },
  {
    title: 'Good to know',
    items: [
      'Low in calories, about 33 kcal per 100 g raw, and a source of fibre, potassium and B vitamins.',
      'A few people get a mild stomach upset. Cook them thoroughly and start with a moderate portion.',
      'If a cluster feels slimy, smells sour or has gone soft, do not eat it.',
    ],
  },
];

// Extra notes shown first for each variety.
export const VARIETY_NOTES: Record<string, string> = {
  pink: 'Pink caps turn grey when cooked, so the colour is for looks at the market, not the plate. Cook them quickly.',
  blue: 'The blue tone is strongest when the mushrooms are young. Cook them the same way as grey oysters.',
  grey: 'The all-round oyster, and the most common type. Use it in almost any dish.',
  golden: 'Golden caps are small and bright, and they lose the yellow when cooked. Keep the heat high and the time short.',
  king: 'King oysters are large and meaty with thick stems. The stems are good to eat, so slice them into rounds and sear.',
};
