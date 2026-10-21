export type CareSection = { title: string; items: string[] };

const OYSTER: CareSection[] = [
  { title: 'Storage', items: [
    'Keep them in the fridge in a paper bag or the original packaging. A porous bag lets them breathe.',
    'Fresh clusters keep for up to about a week. Use the most delicate ones first.',
    'Store them away from strong smells such as raw onion or fish, because mushrooms absorb odours easily.',
    'Do not freeze them raw. Cook them first (a quick saute is enough), cool, then freeze for up to about a month.',
    'For long-term keeping, dry them and store them in an airtight container.',
  ] },
  { title: 'Cleaning', items: [
    'Brush off debris with your fingers or wipe with a damp paper towel.',
    'If they need more, rinse briefly under running water and pat dry straight away.',
    'Never soak them. They take up water quickly and lose flavour and texture.',
    'Check between the gills for small insects, and trim away any tough stem ends.',
  ] },
  { title: 'Cooking', items: [
    'Cook them briefly over high heat. They are done in about the time scrambled eggs take.',
    'Tear along the gills instead of slicing, so more edge browns and crisps.',
    'Saute, roast, grill or fry. Raw they have little flavour, so always cook them.',
    'Garlic, ginger, thyme, scallions and smoked paprika all go well with their mild taste.',
    'Season with salt near the end so they brown instead of steaming.',
  ] },
  { title: 'Good to know', items: [
    'Low in calories, about 33 kcal per 100 g raw, and a source of fibre, potassium and B vitamins.',
    'A few people get a mild stomach upset. Cook them thoroughly and start with a moderate portion.',
    'If a cluster feels slimy, smells sour or has gone soft, do not eat it.',
  ] },
];

const BUTTON: CareSection[] = [
  { title: 'Storage', items: [
    'Keep them in the fridge in a paper bag or the original packaging, not in a sealed plastic bag.',
    'Use them within about a week for the best texture and flavour.',
    'Keep them away from strong smells, because mushrooms absorb odours.',
    'For freezing, cook them first, let them cool, and freeze in a sealed container.',
  ] },
  { title: 'Cleaning', items: [
    'Wipe them with a damp paper towel or brush off the dirt.',
    'If needed, rinse briefly and pat dry straight away. Do not soak them.',
    'Wash them just before cooking, not before storing.',
  ] },
  { title: 'Cooking', items: [
    'Slice, quarter or leave small ones whole. Sear in a hot pan without crowding it.',
    'Let them brown before stirring, which takes a few minutes, then add butter, garlic or herbs.',
    'They work in soups, sauces, omelettes, pizza and stir-fries, and are also good raw in salads.',
    'Season with salt near the end so they brown instead of steaming.',
  ] },
  { title: 'Good to know', items: [
    'If a mushroom feels slimy, smells sour or has gone soft, do not eat it.',
    'Cook them thoroughly if you are serving anyone who is pregnant, elderly or has a weak immune system.',
  ] },
];

// Extra note shown first for each variety.
const NOTES: Record<string, string> = {
  oyster: 'Oyster mushrooms grow in soft, fan-shaped clusters. They cook very quickly, so keep the heat high and the time short.',
  button: 'Button mushrooms are the all-round mushroom. They are mild, firm and good both raw and cooked.',
  pink: 'Pink caps turn grey when cooked. Cook them quickly.',
  blue: 'The blue tone is strongest when the mushrooms are young. Cook them like other oysters.',
  grey: 'The all-round oyster. Use it in almost any dish.',
  golden: 'Golden caps are small and bright, and they lose the yellow when cooked. Keep the heat high and the time short.',
  king: 'King oysters are large and meaty with thick stems. The stems are good to eat, so slice them into rounds and sear.',
};

export function careFor(variety: string) {
  return { sections: variety === 'button' ? BUTTON : OYSTER, note: NOTES[variety] };
}
