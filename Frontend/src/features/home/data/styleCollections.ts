export type StyleCollection = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  catalogPath: string;
};

export const STYLE_COLLECTIONS: StyleCollection[] = [
  {
    id: 'elegant',
    titleKey: 'home.styles.elegant.title',
    descriptionKey: 'home.styles.elegant.description',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?q=sang+trọng&colors=gold',
  },
  {
    id: 'minimal',
    titleKey: 'home.styles.minimal.title',
    descriptionKey: 'home.styles.minimal.description',
    imageUrl:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?q=tối+giản',
  },
  {
    id: 'modern',
    titleKey: 'home.styles.modern.title',
    descriptionKey: 'home.styles.modern.description',
    imageUrl:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?q=hiện+đại',
  },
  {
    id: 'classic',
    titleKey: 'home.styles.classic.title',
    descriptionKey: 'home.styles.classic.description',
    imageUrl:
      'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?q=cổ+điển',
  },
  {
    id: 'luxury',
    titleKey: 'home.styles.luxury.title',
    descriptionKey: 'home.styles.luxury.description',
    imageUrl:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?colors=gold&q=luxury',
  },
];
