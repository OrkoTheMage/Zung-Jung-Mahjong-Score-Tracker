// Wind symbols in order: East, South, West, North
export const winds = ['東', '南', '西', '北'];

// Bonus conditions
export const bonuses = [
  'Final Draw',
  'Final Discard',
  'Win on Kong',
  'Robbing a Kong',
  'Blessing of Heaven',
  'Blessing of Earth',
];

// Hand scoring values
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

// Helper function to extract base hand name without numbering (for score lookup)
export const getBaseHandName = (hand) => {
  const match = hand.match(/\d+\.\d+(?:\.\d+)?(?:\/\d+)?\s+(.*)/);
  return match ? match[1] : hand;
};
