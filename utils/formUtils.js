// Bonus types with their specific point values
export const bonuses = [
  'Final Draw',
  'Final Discard',
  'Win on Kong',
  'Robbing a Kong',
  'Blessing of Heaven',
  'Blessing of Earth',
];

// Specific point values for each bonus type
export const bonusValues = {
  'Final Draw': 10,
  'Final Discard': 10,
  'Win on Kong': 10,
  'Robbing a Kong': 10,
  'Blessing of Heaven': 155,
  'Blessing of Earth': 155,
};

// Hand categories and their hand types
export const handCategories = {
  '1.0 Trivial Patterns': ['Chicken Hand', '1.1 All Sequences', '1.2 Concealed Hand', '1.3 No Terminals',],
  '2.0 One-Suit Patterns': ['2.1.1 Mixed One-Suit', '2.1.2 Pure One-Suit', '2.2 Nine Gates'],
  '3.0 Honor Tiles': [
    '3.1 Value Honor', '3.2.1 Small Three Dragons', '3.2.2 Big Three Dragons',
    '3.3.1 Small Three Winds', '3.3.2 Big Three Winds', '3.3.3 Small Four Winds',
    '3.3.4. Big Four Winds', '3.4 All Honors'
  ],
  '4.0 Triplets and Kong': [
    '4.1 All Triplets', '4.2.1 Two Concealed Triplets', '4.2.2 Three Concealed Triplets',
    '4.2.3 Four Concealed Triplets', '4.3.1 One Kong', '4.3.2 Two Kong', '4.3.3 Three Kong', '4.3.4 Four Kong'
  ],
  '5.0 Identical Sets': [
    '5.1.1 Two Identical Sequences', '5.1.2 Two Identical Sequences Twice',
    '5.1.3 Three Identical Sequences', '5.1.4 Four Identical Sequences'
  ],
  '6.0 Similar Sets': [
    '6.1 Three Similar Sequences', '6.2.1 Small Three Similar Triplets',
    '6.2.2 Three Similar Triplets'
  ],
  '7.0 Consecutive Sets': [
    '7.1 Nine-Tile Straight', '7.2.1 Three Consecutive Triplets',
    '7.2.2 Four Consecutive Triplets'
  ],
  '8.0 Terminals': [
    '8.1.1 Mixed Lesser Terminals', '8.1.2 Pure Lesser Terminals',
    '8.1.3 Mixed Greater Terminals', '8.1.4 Pure Greater Terminals'
  ],
  '10.0 Irregular Patterns': [
    '10.1 Thirteen Terminals', '10.2 Seven Pairs'
  ]
};

// Hand scoring values for display in the UI
export const handScores = {
  // Trivial Patterns
  'All Sequences': 5,
  'Concealed Hand': 5,
  'No Terminals': 5,
  // One-Suit Patterns
  'Mixed One-Suit': 40,
  'Pure One-Suit': 80,
  'Nine Gates': 480,
  // Honor Tiles
  'Value Honor': 10,
  'Small Three Dragons': 40,
  'Big Three Dragons': 130,
  'Small Three Winds': 30,
  'Big Three Winds': 120,
  'Small Four Winds': 320,
  'Big Four Winds': 400,
  'All Honors': 320,
  // Triplets and Kong
  'All Triplets': 30,
  'Two Concealed Triplets': 5,
  'Three Concealed Triplets': 30,
  'Four Concealed Triplets': 125,
  'One Kong': 5,
  'Two Kong': 20,
  'Three Kong': 120,
  'Four Kong': 480,
  // Identical Sets
  'Two Identical Sequences': 10,
  'Two Identical Sequences Twice': 60,
  'Three Identical Sequences': 120,
  'Four Identical Sequences': 480,
  // Similar Sets
  'Three Similar Sequences': 35,
  'Small Three Similar Triplets': 30,
  'Three Similar Triplets': 120,
  // Consecutive Sets
  'Nine-Tile Straight': 40,
  'Three Consecutive Triplets': 100,
  'Four Consecutive Triplets': 200,
  // Terminals
  'Mixed Lesser Terminals': 40,
  'Pure Lesser Terminals': 60,
  'Mixed Greater Terminals': 100,
  'Pure Greater Terminals': 400,
  // Irregular Patterns
  'Thirteen Terminals': 160,
  'Seven Pairs': 30,
  'Chicken Hand': 1
};

// Helper function to separate index and hand name
export const splitHandName = (hand) => {
  const match = hand.match(/^(\d+\.\d+(?:\.\d+)?(?:\/\d+)?)\s+(.*)/);
  return match ? { index: match[1], name: match[2] } : { index: '', name: hand };
};

// Helper function to extract base hand name without numbering (keep for score lookup)
export const getBaseHandName = (hand) => {
  const match = hand.match(/\d+\.\d+\s+(.*)/);
  return match ? match[1] : hand;
};

// Helper function to get the main category number (first digit)
export const getCategoryNumber = (hand) => {
  const match = hand.match(/^(\d+)\./);
  return match ? match[1] : null;
};

// Helper function to get the first two levels of the category (e.g., "2.1" from "2.1.1")
export const getSubCategoryNumber = (hand) => {
  // Match patterns like "2.1" from "2.1.1" or "2.1.2"
  const match = hand.match(/^(\d+\.\d+)/);
  return match ? match[1] : null;
};
