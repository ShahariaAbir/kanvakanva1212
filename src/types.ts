export interface AdCard {
  id: number;
  name: string;
  isUnlocked: boolean;
  title: string;
  adScript: string;
  adUrl: string;
}

export interface AdCardProps extends AdCard {
  onUnlock: (id: number) => void;
}

export interface FinalButtonProps {
  isUnlocked: boolean;
  onClick: () => void;
}
