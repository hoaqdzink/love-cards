export type ThemedCollection = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  imageUrl: string;
  catalogPath: string;
};

export const THEMED_COLLECTIONS: ThemedCollection[] = [
  {
    id: 'outdoor-wedding',
    titleKey: 'home.collections.outdoorWedding.title',
    descriptionKey: 'home.collections.outdoorWedding.description',
    imageUrl:
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?event_type=wedding&q=ngoài+trời',
  },
  {
    id: 'birthday-party',
    titleKey: 'home.collections.birthday.title',
    descriptionKey: 'home.collections.birthday.description',
    imageUrl:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?event_type=birthday',
  },
  {
    id: 'minimal',
    titleKey: 'home.collections.minimal.title',
    descriptionKey: 'home.collections.minimal.description',
    imageUrl:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?q=tối+giản',
  },
  {
    id: 'luxury',
    titleKey: 'home.collections.luxury.title',
    descriptionKey: 'home.collections.luxury.description',
    imageUrl:
      'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
    catalogPath: '/mau-thiep?colors=gold&q=luxury',
  },
];
