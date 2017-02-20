const HowToPlayValues = {
  menu: [
      {
        id: 'introduction',
        title: 'Introduction',
        children: []
      },
      {
        id: 'setup',
        title: 'Setup',
        children: []
      },
      {
        id: 'movement',
        title: 'Movement',
        children: [
          { id: 'king', title: 'King' },
          { id: 'queen', title: 'Queen' },
          { id: 'bishop', title: 'Bishop' },
          { id: 'knight', title: 'Knight' },
          { id: 'rook', title: 'Rook' },
          { id: 'pawn', title: 'Pawn' }
        ]
      },
      {
        id: 'special-rules',
        title: 'Special rules',
        children: [
          { id: 'castling', title: 'Castling' },
          { id: 'en-passant', title: 'En passant' },
          { id: 'promotion', title: 'Promotion' }
        ]
      },
      {
        id: 'check',
        title: 'Check',
        children: []
      },
      {
        id: 'winning',
        title: 'Winning',
        children: []
      }
    ]
};

export default HowToPlayValues;
