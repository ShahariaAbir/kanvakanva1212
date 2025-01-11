export interface AdCard {
  id: number;
  isUnlocked: boolean;
  title: string;
  adScript: string;
}

export interface AdCardProps extends Omit<AdCard, 'adScript'> {
  onUnlock: (id: number) => void;
  adScript: string;
}

export interface FinalButtonProps {
  isUnlocked: boolean;
  onClick: () => void;
}