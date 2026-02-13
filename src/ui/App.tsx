import { useBattleStore } from '../store/battleStore';
import { BattlePage } from './BattlePage';
import { ResultPage } from './ResultPage';
import { StartPage } from './StartPage';

export default function App() {
  const result = useBattleStore((state) => state.result);
  const phase = useBattleStore((state) => state.phase);

  if (!result) {
    return <StartPage />;
  }

  if (phase === 'finished') {
    return <ResultPage />;
  }

  return <BattlePage />;
}
